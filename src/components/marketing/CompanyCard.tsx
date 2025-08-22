import { BoltBadge } from "./icons";

type Company = {
  id: string;
  name: string;
  role: "Importer" | "Exporter" | "Receiver" | "Shipper";
  lanes: string[];
  hs: string[];
  lastSeen: string;
};

export default function CompanyCard({
  companies,
  activeIndex,
}: {
  companies: Company[];
  activeIndex: number;
}) {
  const c = companies[activeIndex % companies.length];

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      {/* Header with company info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-full sidebar-gradient flex items-center justify-center text-white font-semibold">
          {c.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>
            {c.name}
          </h3>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>{c.role}</span>
            <span>•</span>
            <span>Last shipment: {c.lastSeen}</span>
          </div>
        </div>
        <BoltBadge />
      </div>

      {/* Trade lanes and HS codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Top Trade Lanes
          </div>
          <div className="flex flex-wrap gap-2">
            {c.lanes.map((lane) => (
              <span
                key={lane}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: 'var(--brand-50)',
                  color: 'var(--brand-700)'
                }}
              >
                {lane}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
            HS Code Focus
          </div>
          <div className="flex flex-wrap gap-2">
            {c.hs.map((code) => (
              <span
                key={code}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: 'var(--brand-50)',
                  color: 'var(--brand-700)'
                }}
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Total shipments with expand functionality */}
      <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--bg-muted)' }}>
        <button className="flex items-center justify-between w-full text-left">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Total Shipments: <span className="text-lg">247</span>
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Click to expand
          </span>
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <a 
          href="/login" 
          className="gradient-cta flex-1 text-center rounded-xl px-4 py-3 font-semibold shadow transition hover:brightness-110"
        >
          View Company Data
        </a>
        <a 
          href="/signup" 
          className="flex-1 text-center rounded-xl px-4 py-3 font-semibold transition"
          style={{ 
            background: 'var(--card)',
            border: '1px solid var(--line)',
            color: 'var(--brand-700)'
          }}
        >
          Add to CRM
        </a>
      </div>
    </div>
  );
}