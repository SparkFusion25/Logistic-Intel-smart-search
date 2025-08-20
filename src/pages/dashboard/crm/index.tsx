import * as React from 'react';
import Shell from '../../../components/layout/DashboardShell';

export default function CRMPage(){
  return (
    <Shell title="CRM">
      <div className="li-card p-4">
        <div className="mb-3 text-sm text-slate-300">Contacts</div>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr><th>Company</th><th>Name</th><th>Title</th><th>Email</th><th>Tags</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10"><td>Acme Logistics</td><td>Jane Park</td><td>Head of Logistics</td><td>jane@acme.com</td><td><span className="badge">prospect</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}