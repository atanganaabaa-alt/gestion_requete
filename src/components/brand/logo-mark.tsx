import Image from "next/image";

export function LogoMark({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : ""}`}>
      <Image
        src="/brand/logo_estlc.png"
        alt="ESTLC"
        width={compact ? 44 : 56}
        height={compact ? 31 : 40}
        className="object-contain"
        priority
      />
      <div className="leading-tight">
        <div className="font-display text-base font-semibold tracking-tight text-navy md:text-lg">
          ESTLC Requêtes
        </div>
        {!compact && (
          <div className="text-xs text-muted">
            Université d’Ebolowa · Ambam
          </div>
        )}
      </div>
    </div>
  );
}
