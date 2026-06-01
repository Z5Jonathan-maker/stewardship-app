/** Day-group subheader for transaction lists. */
export function DateHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cream-50/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  );
}
