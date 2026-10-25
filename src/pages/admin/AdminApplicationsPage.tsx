import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Application, User } from '../../types/index.ts';
import { FileStack, UserCheck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [consultants, setConsultants] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [assignMessage, setAssignMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [appRes, userRes] = await Promise.all([
        fetch('/api/v1/admin/applications', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/v1/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData.applications || []);
      }
      if (userRes.ok) {
        const userData = await userRes.json();
        const cons = (userData.users || []).filter((u: User) => u.role === 'consultant');
        setConsultants(cons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignConsultant = async (appId: string, consultantId: string) => {
    try {
      const res = await fetch('/api/v1/admin/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId: appId, consultantId })
      });

      if (res.ok) {
        setAssignMessage(`Application successfully allocated to consultant.`);
        setTimeout(() => setAssignMessage(null), 3000);
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Application Dispatch & Case Allocation</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitor incoming visa applications from all clients and assign files to accredited advisors.
        </p>
      </div>

      {assignMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{assignMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading applications...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Application ID & Date</th>
                  <th className="py-3 px-4">Applicant Client</th>
                  <th className="py-3 px-4">Visa Program & Country</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Allocated Advisor</th>
                  <th className="py-3 px-4">Reassign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-900">{app.id}</div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        {new Date(app.submissionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{app.customerName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{app.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{app.visaProgramName}</div>
                      <div className="text-[11px] text-slate-500">{app.destinationCountry}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        app.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        app.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        app.status === 'documents_required' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {app.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {app.consultantName ? (
                        <div className="font-semibold text-slate-800">{app.consultantName}</div>
                      ) : (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
                          UNASSIGNED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.consultantId || ''}
                        onChange={(e) => handleAssignConsultant(app.id, e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-200 rounded bg-white text-slate-700 font-medium"
                      >
                        <option value="">Select Consultant</option>
                        {consultants.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
