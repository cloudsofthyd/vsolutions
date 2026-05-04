// Decorative SVG arc connecting Troy ↔ Hyderabad, projected on a stylized globe.
// Server component — no JS dependency. Pure CSS animation.

import { SITE } from "@/lib/site";

// Equirectangular-projection helper: lon/lat (-180..180, -90..90) → x/y (0..viewWidth, 0..viewHeight)
function project(lng: number, lat: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

export function ContactGlobe() {
  const W = 720;
  const H = 360;
  const [a, b] = SITE.offices;
  const p1 = project(a.coords.lng, a.coords.lat, W, H);
  const p2 = project(b.coords.lng, b.coords.lat, W, H);

  // Mid-point control with vertical lift for a nice arc
  const mx = (p1.x + p2.x) / 2;
  const my = Math.min(p1.y, p2.y) - 80;

  return (
    <svg
      className="contact-globe"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="contactArc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--rose)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="var(--indigo)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="contactDotGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--rose)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--rose)" stopOpacity="0" />
        </radialGradient>
        <pattern id="dotGrid" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="currentColor" opacity="0.18" />
        </pattern>
      </defs>

      {/* Stylized globe — a faint dot grid that hints at continents */}
      <ellipse cx={W / 2} cy={H / 2} rx={W / 2 - 12} ry={H / 2 - 12} fill="url(#dotGrid)" color="var(--navy)" />
      <ellipse
        cx={W / 2}
        cy={H / 2}
        rx={W / 2 - 12}
        ry={H / 2 - 12}
        fill="none"
        stroke="var(--line-bright)"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.55"
      />

      {/* Connection arc */}
      <path
        d={`M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`}
        stroke="url(#contactArc)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        className="contact-arc-path"
      />

      {/* Endpoint glow + dot for each office */}
      {[p1, p2].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <circle r="22" fill="url(#contactDotGlow)" />
          <circle r="6" fill="var(--rose)" className="contact-arc-pulse" />
          <circle r="3.5" fill="white" />
        </g>
      ))}

      {/* Travelling spark along the arc */}
      <circle r="4" fill="var(--rose)" className="contact-arc-spark">
        <animateMotion
          dur="3.6s"
          repeatCount="indefinite"
          path={`M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`}
        />
      </circle>
    </svg>
  );
}
