import ResponsiveTable from '@/components/common/ResponsiveTable';
export default function ContactsTable(){
  const columns = [
    { key: 'company_name', label: 'Company' },
    { key: 'full_name', label: 'Name' },
    { key: 'title', label: 'Title' },
    { key: 'email', label: 'Email' },
    { key: 'source', label: 'Source' }
  ];
  const rows: any[] = [];
  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-400">Add to CRM from Search results to populate this table.</div>
      <ResponsiveTable columns={columns} rows={rows} />
    </div>
  );
}