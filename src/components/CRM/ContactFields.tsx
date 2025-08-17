"use client";
import { usePlan } from "@/components/Providers";
import { PlanGate } from "@/components/PlanGate";
import { Badge } from "@/components/ui/badge";

export function ContactFields({ contact }: { contact: any }) {
  const plan = usePlan();

  return (
    <div className="space-y-2">
      <div className="text-sm"><span className="font-medium">Name:</span> {contact?.full_name ?? "—"}</div>
      <div className="text-sm"><span className="font-medium">Company:</span> {contact?.company_name ?? "—"}</div>

      <PlanGate
        plan={plan as any}
        allow={["pro","enterprise"]}
        fallback={
          <div className="rounded-xl border p-3 text-sm">
            <div className="font-medium">🔒 Contact details protected</div>
            <div className="text-muted-foreground">Upgrade to Pro to view email, phone, and LinkedIn.</div>
          </div>
        }
      >
        <div className="text-sm"><span className="font-medium">Email:</span> {contact?.email ?? "—"}</div>
        <div className="text-sm"><span className="font-medium">Phone:</span> {contact?.phone ?? "—"}</div>
        {contact?.linkedin ? (
          <a className="text-sm underline" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn Profile</a>
        ) : null}
        <Badge variant="secondary">✅ Premium Contact Intelligence Unlocked</Badge>
      </PlanGate>
    </div>
  );
}