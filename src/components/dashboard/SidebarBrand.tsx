const ICON_PNG = "/branding/logo-icon-white.png";
const FULL_PNG = "/branding/logo-full-white.png";

export function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center h-14 px-3 border-b border-white/10">
      {/* Icon: white by default; blue on hover/active */}
      <a
        href="/dashboard"
        className="group shrink-0 rounded-xl p-1.5 bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="LogisticIntel"
      >
        <img
          src={ICON_PNG}
          alt="LogisticIntel"
          className="h-7 w-7"
        />
      </a>

      {/* Wordmark + tagline (hidden when collapsed) */}
      {!collapsed && (
        <div className="ml-2 min-w-0">
          <img
            src={FULL_PNG}
            alt="LOGISTICINTEL — Trade Intelligence"
            className="max-w-[148px] h-auto"
          />
        </div>
      )}
    </div>
  );
}