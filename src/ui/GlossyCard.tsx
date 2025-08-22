import { ReactNode } from 'react';

export default function GlossyCard({children, className = ''}: {children: ReactNode; className?: string}) {
  return <div className={`card card-gloss ${className}`}>{children}</div>;
}