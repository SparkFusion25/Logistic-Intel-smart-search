import * as React from 'react';

/**
 * Logistic Intel wordmark + icon (SVG, transparent background)
 * Usage: <Logo variant="mark" /> or <Logo variant="full" />
 */
export type LogoProps = React.SVGProps<SVGSVGElement> & {
  variant?: 'full' | 'mark';
  className?: string;
};

const Mark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
    <defs>
      <linearGradient id="li_g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="currentColor" stopOpacity="0.15" />
        <stop offset="1" stopColor="currentColor" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="12" stroke="currentColor" strokeOpacity="0.2" />
    {/* L-shape lane */}
    <path d="M18 42V22a4 4 0 0 1 4-4h20" stroke="url(#li_g)" strokeWidth="4" strokeLinecap="round" />
    {/* I-shape pin */}
    <path d="M42 46V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* waypoint dots */}
    <circle cx="28" cy="18" r="2" fill="currentColor" />
    <circle cx="42" cy="26" r="2" fill="currentColor" />
  </svg>
);

const Word = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 380 64" fill="none" aria-hidden="true" {...props}>
    <g fill="currentColor">
      <path d="M0 48V16h8v24h18v8H0zM38 48V16h8v32h-8zM54 48V16h13.5c3.7 0 6.6.9 8.6 2.8 2 1.8 3 4.4 3 7.6 0 3.1-1 5.6-3 7.4-2 1.9-4.9 2.8-8.6 2.8H62V48h-8zm8-17h5.8c3 0 4.5-1.4 4.5-4.1 0-2.8-1.5-4.1-4.5-4.1H62V31zM97 49c-5.1 0-9.1-1.6-12.1-4.7-3-3.1-4.4-7.4-4.4-12.8s1.5-9.7 4.4-12.8C88 15.6 92 14 97 14s9.1 1.6 12.1 4.7c3 3.1 4.4 7.4 4.4 12.8s-1.5 9.7-4.4 12.8C106.1 47.4 102.1 49 97 49zm0-7.4c2.8 0 5-1 6.6-3 1.6-2 2.4-4.9 2.4-8.5 0-3.7-.8-6.5-2.4-8.5-1.6-2-3.8-3-6.6-3s-5 1-6.6 3c-1.6 2-2.4 4.8-2.4 8.5 0 3.6.8 6.5 2.4 8.5 1.6 2 3.8 3 6.6 3zM131 48V16h8v12.3L151.7 16H162l-14 14.2L162.7 48H152l-13-13.4V48h-8zM189.8 49c-3.8 0-6.9-.8-9.4-2.4-2.4-1.6-3.6-3.9-3.6-6.7h8c0 2.1 1.6 3.1 4.9 3.1 3 0 4.4-.8 4.4-2.3 0-1-.7-1.7-2.2-2.1l-7.4-2c-2.5-.7-4.3-1.6-5.4-2.8-1.1-1.2-1.7-2.7-1.7-4.7 0-2.6 1.1-4.7 3.4-6.2 2.3-1.6 5.3-2.3 9.1-2.3 3.7 0 6.7.8 9 2.4 2.3 1.6 3.4 3.8 3.4 6.5h-7.7c0-2-1.6-3-4.7-3-1.3 0-2.3.2-3 .7-.7.5-1.1 1.1-1.1 1.9 0 .9.7 1.6 2 2l7.5 2.1c2.8.8 4.6 1.7 5.6 2.7 1 1.1 1.6 2.6 1.6 4.6 0 2.9-1.2 5.1-3.6 6.7-2.3 1.6-5.6 2.4-9.8 2.4zM218 48V16h28v7.3h-20V27h17.6v7.2H226V41h20v7H218z"/>
      <path d="M268.5 48c-3.2 0-5.9-1-8.1-3.1-2.2-2.1-3.3-4.8-3.3-8.1 0-3.3 1.1-6 3.3-8.1 2.2-2.1 4.9-3.1 8.1-3.1 3.1 0 5.7 1 7.7 2.9V16h8V48h-8v-2.5c-2 1.8-4.6 2.7-7.7 2.7zm2.1-7.3c2.2 0 4.1-.7 5.6-2.2 1.5-1.5 2.2-3.4 2.2-5.8 0-2.4-.7-4.3-2.2-5.8-1.5-1.5-3.4-2.2-5.6-2.2-2.3 0-4.2.7-5.6 2.2-1.5 1.5-2.2 3.4-2.2 5.8s.7 4.3 2.2 5.8c1.4 1.5 3.3 2.2 5.6 2.2z"/>
    </g>
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className, ...rest }) => {
  if (variant === 'mark') return <Mark className={className} {...rest} />;
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Mark width={28} height={28} />
      <Word height={20} />
    </div>
  );
};

export default Logo;