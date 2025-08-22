import AdminPageClientEnhanced from '@/components/admin/AdminPageClientEnhanced';

export default function Admin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">System administration and settings</p>
      </div>
      <AdminPageClientEnhanced />
    </div>
  );
}