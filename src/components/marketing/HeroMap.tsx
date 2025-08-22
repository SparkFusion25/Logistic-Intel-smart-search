import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlaneIcon, ShipIcon, FactoryIcon, ContainerIcon } from "./icons";

export default function HeroMap({ activeIndex }: { activeIndex: number }) {
  const reduce = usePrefersReducedMotion();

  // Base height for the hero
  return (
    <div className="relative h-[520px] sm:h-[560px] bg-white">
      <svg
        viewBox="0 0 1200 600"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Optional pale world map image (replace with your own asset) */}
        <image
          href="/assets/world-map-light.svg"
          x="0"
          y="0"
          width="1200"
          height="600"
          opacity="0.25"
          preserveAspectRatio="xMidYMid slice"
        />
        {/* Soft rounded border */}
        <rect x="1" y="1" width="1198" height="598" rx="18" ry="18" fill="none" stroke="#e2e8f0" />

        {/* Define dashed routes (approx coords for continents) */}
        <defs>
          {/* Americas -> Europe */}
          <path id="r1" d="M180,320 C420,180 720,180 900,200" />
          {/* South America -> North America (air) */}
          <path id="r2" d="M360,480 C420,420 520,360 600,300 680,260 760,260 820,280" />
          {/* US West -> East Asia */}
          <path id="r3" d="M120,260 C360,240 760,160 1040,260" />
          {/* North Africa -> Turkey */}
          <path id="r4" d="M700,360 C760,340 820,320 900,320" />
          {/* Europe -> Nordics */}
          <path id="r5" d="M820,220 C860,180 900,160 940,150" />
        </defs>

        {/* Render dashed lines */}
        {[ "r1","r2","r3","r4","r5" ].map((id, idx) => (
          <use
            key={id}
            href={`#${id}`}
            strokeDasharray="6 8"
            stroke="#94a3b8"
            strokeWidth="3"
            fill="none"
            opacity={0.9}
            className={activeIndex % 5 === idx ? "drop-shadow-[0_0_6px_rgba(15,76,129,0.35)]" : ""}
          />
        ))}

        {/* Moving icons — staggered durations and start times */}
        <g>
          {/* r1: container icon */}
          <IconOnPath pathId="r1" begin="0s" dur={reduce ? "0s" : "19s"}>
            <g filter="url(#shadow1)">
              <circle cx="0" cy="0" r="20" fill="#0F4C81" />
              <ContainerIcon />
            </g>
          </IconOnPath>

          {/* r2: plane */}
          <IconOnPath pathId="r2" begin={reduce ? "0s" : "5s"} dur={reduce ? "0s" : "16s"}>
            <g>
              <circle cx="0" cy="0" r="20" fill="#0F4C81" />
              <PlaneIcon />
            </g>
          </IconOnPath>

          {/* r3: ship */}
          <IconOnPath pathId="r3" begin={reduce ? "0s" : "9s"} dur={reduce ? "0s" : "24s"}>
            <g>
              <circle cx="0" cy="0" r="20" fill="#0F4C81" />
              <ShipIcon />
            </g>
          </IconOnPath>

          {/* r4: container */}
          <IconOnPath pathId="r4" begin={reduce ? "0s" : "3s"} dur={reduce ? "0s" : "14s"}>
            <g>
              <circle cx="0" cy="0" r="20" fill="#0F4C81" />
              <ContainerIcon />
            </g>
          </IconOnPath>

          {/* r5: factory badge */}
          <IconOnPath pathId="r5" begin={reduce ? "0s" : "11s"} dur={reduce ? "0s" : "12s"}>
            <g>
              <circle cx="0" cy="0" r="20" fill="#0F4C81" />
              <FactoryIcon />
            </g>
          </IconOnPath>
        </g>

        {/* basic drop shadow filter */}
        <defs>
          <filter id="shadow1" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0B1E39" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Zoom controls (non-functional placeholders, match your design) */}
        <g transform="translate(1140,480)">
          <rect x="0" y="0" width="44" height="100" rx="10" fill="white" stroke="#e2e8f0"/>
          <text x="22" y="32" textAnchor="middle" fontSize="22" fill="#0B1E39">+</text>
          <line x1="8" y1="50" x2="36" y2="50" stroke="#e2e8f0"/>
          <text x="22" y="80" textAnchor="middle" fontSize="22" fill="#0B1E39">−</text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Moves its children along a path using SVG <animateMotion>.
 * rotate="auto" keeps the icon orientation natural along the curve.
 * RepeatCount is infinite; begin times are staggered for non-repetitiveness.
 */
function IconOnPath({
  pathId,
  begin,
  dur,
  children,
}: {
  pathId: string;
  begin: string;
  dur: string;
  children: React.ReactNode;
}) {
  return (
    <g>
      <g>
        <g>
          {/* The group position is driven by animateMotion */}
          <animateMotion
            dur={dur}
            begin={begin}
            repeatCount="indefinite"
            rotate="auto"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
            calcMode="spline"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
          {children}
        </g>
      </g>
    </g>
  );
}