// Server-side masking helper for sensitive fields
// Use this at the API layer so Free plans never leak contact info over the wire.

type Plan = "free" | "pro" | "enterprise" | string;

export function maskContactForPlan<T extends {
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
}>(plan: Plan, contact: T | null | undefined): T | null | undefined {
  if (!contact) return contact;
  if (plan === "free") {
    return {
      ...contact,
      email: null,
      phone: null,
      linkedin: null,
    };
  }
  return contact;
}

/**
 * Utility to mask a whole object path (e.g. deal.crm_contacts)
 */
export function maskDeep(plan: Plan, obj: any, path: string[]) {
  if (!obj) return obj;
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur?.[path[i]];
    if (!cur) return obj;
  }
  const last = path[path.length - 1];
  cur[last] = maskContactForPlan(plan, cur[last]);
  return obj;
}