import dynamic from 'next/dynamic';

// Load admin page client-side only to avoid SSR issues
const AdminPageClient = dynamic(() => import('@/components/admin/AdminPageClient'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading Admin Panel...</p>
      </div>
    </div>
  )
});

export default function AdminPage() {
  return <AdminPageClient />;
}