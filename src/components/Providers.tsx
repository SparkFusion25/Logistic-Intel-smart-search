"use client";
import React, { createContext, useContext } from "react";

type Plan = "free" | "pro" | "enterprise" | "unknown";
const PlanCtx = createContext<Plan>("unknown");

export const usePlan = () => useContext(PlanCtx);

export default function Providers({ 
  plan, 
  children 
}: { 
  plan: Plan; 
  children: React.ReactNode; 
}) {
  return <PlanCtx.Provider value={plan}>{children}</PlanCtx.Provider>;
}