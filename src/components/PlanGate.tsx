"use client";

import { ReactNode } from "react";

/**
 * Minimal client-side plan gate.
 * Pass the current plan from your layout (or fetch once and store in context).
 */
type Plan = "free" | "pro" | "enterprise";
export function PlanGate({
  plan,
  allow = ["pro", "enterprise"],
  children,
  fallback,
}: {
  plan: Plan | undefined;
  allow?: Plan[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (!plan || !allow.includes(plan)) return <>{fallback ?? null}</>;
  return <>{children}</>;
}