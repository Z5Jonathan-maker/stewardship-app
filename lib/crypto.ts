import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "node:crypto";

/**
 * Envelope encryption for secrets at rest — specifically the Plaid
 * `access_token` (a bank credential). The pattern:
 *
 *   1. Generate a random 256-bit Data Encryption Key (DEK) per secret.
 *   2. Encrypt the secret with the DEK (AES-256-GCM).
 *   3. Encrypt ("wrap") the DEK with a Key Encryption Key (KEK).
 *   4. Store {ciphertext, wrappedDek} — never the plaintext, never the DEK.
 *
 * In production the KEK lives in a cloud KMS (AWS KMS / GCP KMS): wrapping and
 * unwrapping the DEK are KMS API calls, so the KEK never leaves the HSM. Here
 * we keep a clean seam — `wrapDek`/`unwrapDek` are the only KMS-touching
 * functions; swap their bodies for KMS calls when KMS_KEY_ID is wired.
 *
 * Without a configured KEK, a deterministic dev KEK is derived from
 * APP_ENCRYPTION_KEY (or a build-time default) so the flow is exercisable
 * locally. That dev path is NOT for production secrets — see ARCHITECTURE.md.
 */

const ALGO = "aes-256-gcm";

export interface Envelope {
  /** Base64: iv(12) || authTag(16) || ciphertext */
  ciphertext: string;
  /** Base64 wrapped DEK (KMS ciphertext in prod). */
  wrappedDek: string;
}

/** The local KEK (dev only). In prod, wrap/unwrap go through KMS instead. */
function devKek(): Buffer {
  const secret =
    process.env.APP_ENCRYPTION_KEY ?? "unifi-dev-kek-not-for-production";
  return createHash("sha256").update(secret).digest(); // 32 bytes
}

function gcmEncrypt(plaintext: Buffer, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

function gcmDecrypt(b64: string, key: Buffer): Buffer {
  const raw = Buffer.from(b64, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const enc = raw.subarray(28);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]);
}

/**
 * Wrap a DEK with the KEK. Replace the body with a KMS Encrypt call
 * (kms.encrypt({ KeyId: KMS_KEY_ID, Plaintext: dek })) in production.
 */
function wrapDek(dek: Buffer): string {
  return gcmEncrypt(dek, devKek());
}

/** Unwrap a DEK. Replace with a KMS Decrypt call in production. */
function unwrapDek(wrapped: string): Buffer {
  return gcmDecrypt(wrapped, devKek());
}

/** Encrypt a secret string → envelope. */
export function encryptSecret(plaintext: string): Envelope {
  const dek = randomBytes(32);
  const ciphertext = gcmEncrypt(Buffer.from(plaintext, "utf8"), dek);
  const wrappedDek = wrapDek(dek);
  return { ciphertext, wrappedDek };
}

/** Decrypt an envelope → secret string. */
export function decryptSecret(env: Envelope): string {
  const dek = unwrapDek(env.wrappedDek);
  return gcmDecrypt(env.ciphertext, dek).toString("utf8");
}
