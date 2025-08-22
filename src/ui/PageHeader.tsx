import { ReactNode } from 'react';

export default function PageHeader({title, actions}: {title: string; actions?: ReactNode}) {
  return (
    <div className='section-header'>
      <h1 className='section-title'>{title}</h1>
      <div className='flex gap-2'>{actions}</div>
    </div>
  );
}