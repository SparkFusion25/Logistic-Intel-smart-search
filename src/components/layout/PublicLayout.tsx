import { Outlet } from 'react-router-dom';
import PublicNavBar from './PublicNavBar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}