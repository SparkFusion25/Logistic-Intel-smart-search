import React from "react";

export const PlaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--brand-500)" />
    <path d="M2 12l9 1 7 7 2-2-7-7 1-9-2 0-3 7-7 3z" fill="white" />
  </svg>
);

export const ShipIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--brand-500)" />
    <path d="M6 12h12l-2 4H8l-2-4zM10 7h4v3h-4z" fill="white" />
  </svg>
);

export const ContainerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--brand-500)" />
    <rect x="6" y="8" width="12" height="8" fill="white" rx="1" />
    <path d="M9 8v8M12 8v8M15 8v8" stroke="var(--brand-500)" strokeWidth="1.5"/>
  </svg>
);

export const FactoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="var(--brand-500)" />
    <path d="M6 16h12v2H6zM8 10h2v6H8zM12 8h2v8h-2zM16 12h2v4h-2z" fill="white" />
  </svg>
);

export const BoltBadge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="var(--brand-500)" />
    <path d="M13 2l-8 12h5l-1 8 8-12h-5l1-8z" fill="white" />
    <circle cx="18" cy="6" r="2.3" fill="#22c55e" stroke="white" strokeWidth="1.5" />
  </svg>
);