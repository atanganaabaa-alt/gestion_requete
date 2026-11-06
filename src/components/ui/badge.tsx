const map: Record<string, string> = {
  BROUILLON: "bg-slate-100 text-slate-700",
  SOUMISE: "bg-sky-50 text-sky-800",
  AFFECTEE: "bg-indigo-50 text-indigo-800",
  EN_COURS: "bg-amber-50 text-amber-900",
  EN_ATTENTE: "bg-orange-50 text-orange-900",
  RESOLUE: "bg-emerald-50 text-emerald-800",
  CLOTUREE: "bg-slate-100 text-slate-600",
  REJETEE: "bg-rose-50 text-rose-800",
  ANNULEE: "bg-stone-100 text-stone-600",
  DEMANDEUR: "bg-navy/10 text-navy",
  AGENT: "bg-emerald-50 text-emerald-800",
  RESPONSABLE: "bg-violet-50 text-violet-800",
  ADMIN: "bg-accent/15 text-accent",
};

export function Badge({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
        map[value] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {label ?? value}
    </span>
  );
}
