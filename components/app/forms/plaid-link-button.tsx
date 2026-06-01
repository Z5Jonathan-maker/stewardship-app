"use client";

import { useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Account } from "@/lib/mock-data";

/**
 * Opens Plaid Link with a server-issued link token, exchanges the resulting
 * public token, and returns the fetched accounts. Only mounted when a link
 * token exists (i.e. Plaid credentials are configured), so react-plaid-link's
 * hosted script never loads in the keyless demo.
 */
export function PlaidLinkButton({
  token,
  onAccounts,
}: {
  token: string;
  onAccounts: (accounts: Account[]) => void;
}) {
  const onSuccess = useCallback(
    async (publicToken: string) => {
      try {
        const res = await fetch("/api/plaid/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token: publicToken }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.accounts)) onAccounts(data.accounts);
      } catch {
        /* swallow — caller keeps the dialog usable */
      }
    },
    [onAccounts]
  );

  const { open, ready } = usePlaidLink({ token, onSuccess });

  return (
    <Button onClick={() => open()} disabled={!ready} className="w-full">
      <Landmark className="h-4 w-4" /> Connect with Plaid
    </Button>
  );
}
