/**
 * Institution branding for account rows. Real marks are self-hosted under
 * `public/logos/` (fetched once, committed — never fetched at runtime, so we
 * don't leak which banks a household uses to a third party). When we have a
 * logo we show it on a clean white tile; otherwise we fall back to a
 * brand-colored monogram — still premium and unambiguous. Monogram colors are
 * chosen dark enough that white text on them passes WCAG AA.
 */
type InstitutionMeta = { color: string; initials: string; logo?: string };

const MAP: Record<string, InstitutionMeta> = {
  Chase: { color: "#115ea6", initials: "CH", logo: "/logos/chase.png" },
  Ally: { color: "#5c1a7a", initials: "AL", logo: "/logos/ally.png" },
  Fidelity: { color: "#256026", initials: "FI", logo: "/logos/fidelity.png" },
  Vanguard: { color: "#8e1a22", initials: "VG", logo: "/logos/vanguard.png" },
  "Capital One": { color: "#b0241c", initials: "C1", logo: "/logos/capital-one.png" },
  Rocket: { color: "#13233b", initials: "RM", logo: "/logos/rocket.png" },
  "Wells Fargo": { color: "#9c1420", initials: "WF", logo: "/logos/wells-fargo.png" },
  "Bank of America": { color: "#0a3f6e", initials: "BA", logo: "/logos/bank-of-america.png" },
  Schwab: { color: "#0b5cab", initials: "SC", logo: "/logos/schwab.png" },
  Citi: { color: "#0a5293", initials: "CI", logo: "/logos/citi.png" },
  "American Express": { color: "#1d5fa8", initials: "AX", logo: "/logos/american-express.png" },
  SoFi: { color: "#0a2540", initials: "SF", logo: "/logos/sofi.png" },
};

export function institutionMeta(name: string): InstitutionMeta {
  return (
    MAP[name] ?? {
      color: "#1b443a",
      initials: name.slice(0, 2).toUpperCase(),
    }
  );
}
