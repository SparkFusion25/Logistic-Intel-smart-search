export function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  const ICON_URL = "https://zupuxlrtixhfnbuhxhum.supabase.co/storage/v1/object/public/branding/logo-icon-white.png";
  const FULL_URL = "https://zupuxlrtixhfnbuhxhum.supabase.co/storage/v1/object/public/branding/logo-full-white.png";

  return (
    <div className="flex items-center h-14 px-3 border-b border-white/10">
      {/* Icon: white by default; blue on hover/active */}
      <a
        href="/dashboard"
        className="group shrink-0 rounded-xl p-1.5 bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="LogisticIntel"
      >
        <img
          src={ICON_URL}
          alt="LogisticIntel"
          className="h-7 w-7"
        />
      </a>

      {/* LIT text (hidden when collapsed) */}
      {!collapsed && (
        <div className="ml-2">
          <span className="text-white font-semibold text-xl">LIT</span>
        </div>
      )}
    </div>
  );
}