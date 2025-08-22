import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlaneIcon, ShipIcon, ContainerIcon } from "./icons";

export default function HeroMap({ activeIndex }: { activeIndex: number }) {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="relative h-[280px] sm:h-[320px] rounded-xl overflow-hidden" 
         style={{ background: 'var(--bg-muted)' }}>
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* World map background */}
        <image
          href="/assets/world-map-light.svg"
          x="0"
          y="0"
          width="800"
          height="400"
          opacity="0.3"
          preserveAspectRatio="xMidYMid slice"
        />
        
        {/* Trade routes */}
        <defs>
          <path id="route1" d="M120,200 C300,120 500,120 680,180" />
          <path id="route2" d="M100,160 C400,140 600,100 750,160" />
          <path id="route3" d="M80,240 C250,300 550,280 720,220" />
        </defs>

        {/* Animated route lines */}
        {["route1", "route2", "route3"].map((id, idx) => (
          <use
            key={id}
            href={`#${id}`}
            strokeDasharray="4 6"
            stroke="var(--brand-400)"
            strokeWidth="2"
            fill="none"
            opacity={0.7}
            className={activeIndex % 3 === idx ? "opacity-100" : "opacity-40"}
          />
        ))}

        {/* Moving icons */}
        <g>
          <IconOnPath pathId="route1" begin="0s" dur={reduce ? "0s" : "15s"}>
            <ContainerIcon />
          </IconOnPath>
          <IconOnPath pathId="route2" begin="5s" dur={reduce ? "0s" : "12s"}>
            <PlaneIcon />
          </IconOnPath>
          <IconOnPath pathId="route3" begin="8s" dur={reduce ? "0s" : "18s"}>
            <ShipIcon />
          </IconOnPath>
        </g>
      </svg>
    </div>
  );
}

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
      <animateMotion
        dur={dur}
        begin={begin}
        repeatCount="indefinite"
        rotate="auto"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
      {children}
    </g>
  );
}