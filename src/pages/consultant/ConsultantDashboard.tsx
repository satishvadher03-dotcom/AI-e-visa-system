import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Application, Appointment } from '../../types/index.ts';
import { Briefcase, CheckSquare, Calendar, Clock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export const ConsultantDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [cases, setCases] = useState<Application[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      setLoading(true);
      try {
        const [caseRes, aptRes] = await Promise.all([
          fetch('/api/v1/consultant/cases', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/consultant/appointments', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (caseRes.ok) {
          const caseData = await caseRes.json();
          setCases(caseData.cases || []);
        }
        if (aptRes.ok) {
          const aptData = await aptRes.json();
          setAppointments(aptData.appointments || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const pendingReviewCases = cases.filter(c => c.status === 'under_review' || c.status === 'assigned');
  const docsRequiredCases = cases.filter(c => c.status === 'documents_required');

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Reg. Immigration Consultant Workstation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Advisor Console: {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review assigned client applications, document sufficiency, and scheduled consultations.
          </p>
        </div>

        <Link
          to="/consultant/cases"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Open Case Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned Active Cases</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {cases.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {pendingReviewCases.length} pending audit
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Document Deficiencies</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {docsRequiredCases.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting applicant uploads
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned Consultations</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {appointments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Video & phone sessions
          </div>
        </div>
      </div>

      {/* Assigned Cases Table Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Assigned Case Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">Strictly segregated to cases allocated to your advisor credential.</p>
          </div>
          <Link to="/consultant/cases" className="text-xs font-semibold text-blue-600 hover:underline">
            Manage Cases &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading case roster...</div>
        ) : cases.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active client cases assigned to your queue at present.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cases.map((c) => (
              <div key={c.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.customerName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({c.customerEmail})</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {c.visaProgramName} · Destination: <strong className="text-slate-700">{c.destinationCountry}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    c.status === 'under_review' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    c.status === 'documents_required' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status.toUpperCase().replace(/_/g, ' ')}
                  </span>
                  <Link
                    to={`/consultant/cases?id=${c.id}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
                  >
                    Open Case File
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
