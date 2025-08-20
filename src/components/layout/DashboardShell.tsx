import * as React from 'react';
import Sidebar from '../navigation/Sidebar';
import Topbar from '../navigation/Topbar';

const Shell: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ title, children }) => {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[280px_1fr]">
      <aside className="hidden md:block h-screen sticky top-0 border-r border-white/10">
        <Sidebar />
      </aside>
      <div className="flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default Shell;