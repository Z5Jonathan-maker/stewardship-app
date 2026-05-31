/**
 * Institution branding for account rows. Real logos are licensed assets, so
 * we use a brand-colored monogram — far more premium and trustworthy than a
 * generic gray icon, and unambiguous. Colors are chosen dark enough that
 * white text on them passes WCAG AA.
 */
const MAP: Record<string, { color: string; initials: string }> = {
  Chase: { color: "#115ea6", initials: "CH" },
  Ally: { color: "#5c1a7a", initials: "AL" },
  Fidelity: { color: "#256026", initials: "FI" },
  Vanguard: { color: "#8e1a22", initials: "VG" },
  "Capital One": { color: "#b0241c", initials: "C1" },
  Rocket: { color: "#13233b", initials: "RM" },
};

export function institutionMeta(name: string): { color: string; initials: string } {
  return (
    MAP[name] ?? {
      color: "#1b443a",
      initials: name.slice(0, 2).toUpperCase(),
    }
  );
}
