export function Swoosh({ variant = 1, className = "" }: { variant?: 1 | 2 | 3; className?: string }) {
  const paths: Record<number, string> = {
    1: "M2 18 C 60 4, 140 32, 220 14 C 300 -2, 380 26, 478 12",
    2: "M2 16 C 80 30, 180 4, 260 20 C 340 34, 420 8, 478 22",
    3: "M2 12 Q 100 32 200 14 T 478 18",
  };
  const d = paths[variant];
  return (
    <svg
      viewBox="0 0 480 36"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
        transform="translate(0,3)"
      />
      <circle cx="478" cy={variant === 2 ? 22 : variant === 3 ? 18 : 12} r="1.6" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function CircleRune({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45">
        <circle cx="100" cy="100" r="92" />
        <circle cx="100" cy="100" r="74" strokeDasharray="3 4" />
        <circle cx="100" cy="100" r="56" />
        <polygon points="100,18 170,140 30,140" />
        <polygon points="100,182 30,60 170,60" />
        <circle cx="100" cy="100" r="6" />
      </g>
      <g fill="currentColor" opacity="0.35" fontFamily="serif" fontSize="9">
        <text x="100" y="14" textAnchor="middle">✦</text>
        <text x="186" y="104" textAnchor="middle">✦</text>
        <text x="100" y="196" textAnchor="middle">✦</text>
        <text x="14" y="104" textAnchor="middle">✦</text>
      </g>
    </svg>
  );
}

export function MascotPeek({ className = "" }: { className?: string }) {
  return (
    <img
      src="/majorica-frog-sm.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}
