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
    <div className="w-full max-w-[420px] rounded-2xl bg-white shadow p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0B1E39] to-[#0F4C81]" />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#0B1E39]">{c.name}</h3>
          <div className="text-xs text-slate-600">{c.role}</div>
        </div>
        <BoltBadge />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">Active lanes</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {c.lanes.map((l) => (
              <span
                key={l}
                className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500">HS focus</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {c.hs.map((h) => (
              <span
                key={h}
                className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Last seen shipment: <span className="font-medium text-slate-700">{c.lastSeen}</span>
      </div>

      <div className="mt-5 flex gap-2">
        <a href="/crm/add" className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-white text-sm
           bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] shadow hover:brightness-110">Add to CRM</a>
        <a href="/company" className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-[#0F4C81] text-sm bg-white border
           border-slate-200 hover:bg-slate-50">View</a>
        <a href="/email" className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-[#0F4C81] text-sm bg-white border
           border-slate-200 hover:bg-slate-50">Email</a>
      </div>
    </div>
  );
}