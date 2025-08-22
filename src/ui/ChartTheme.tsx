import { PropsWithChildren } from 'react';

export function ChartContainer({children}: {children: React.ReactNode}) {
  return <div className='w-full h-[220px] md:h-[260px] xl:h-[300px]'>{children}</div>;
}

export const chartPalette = ['#2563EB', '#6D28D9', '#10B981', '#F59E0B', '#EF4444'];