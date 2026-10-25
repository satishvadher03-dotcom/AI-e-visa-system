import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Application, Appointment, CustomerDocument } from '../../types/index.ts';
import { 
  FileText, 
  Calendar, 
  FolderLock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      setLoading(true);
      try {
        const [appRes, aptRes, docRes] = await Promise.all([
          fetch('/api/v1/customer/applications', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/customer/appointments', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/customer/documents', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (appRes.ok) {
          const appData = await appRes.json();
          setApplications(appData.applications || []);
        }
        if (aptRes.ok) {
          const aptData = await aptRes.json();
          setAppointments(aptData.appointments || []);
        }
        if (docRes.ok) {
          const docData = await docRes.json();
          setDocuments(docData.documents || []);
        }
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const activeApps = applications.filter(a => !['completed', 'cancelled', 'rejected_by_authority'].includes(a.status));
  const upcomingApts = appointments.filter(a => a.status === 'confirmed');

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Applicant Dossier ID: {user?.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your visa applications, uploaded statutory documents, and scheduled consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/visa-programs"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Visa Application</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Applications</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {activeApps.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {applications.length} total applications filed
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Appointments</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {upcomingApts.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            45-min virtual case reviews
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Vault Documents</span>
            <FolderLock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {documents.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Encrypted private files
          </div>
        </div>
      </div>

      {/* Active Application Spotlight */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Applications Status</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking and assigned case officer details.</p>
          </div>
          <Link to="/customer/applications" className="text-xs font-semibold text-blue-600 hover:underline">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs text-slate-500">You do not have any active visa applications yet.</div>
            <Link
              to="/visa-programs"
              className="inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Browse Directory & Start Application
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{app.visaProgramName}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">({app.id})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Destination: <span className="font-semibold text-slate-700">{app.destinationCountry}</span>
                      {app.consultantName && (
                        <span> · Assigned Advisor: <span className="font-semibold text-slate-700">{app.consultantName}</span></span>
                      )}
                    </div>
                  </div>

                  <div className={`px-2.5 py-1 rounded text-xs font-bold self-start sm:self-auto border ${
                    app.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    app.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    app.status === 'documents_required' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {app.status.toUpperCase().replace(/_/g, ' ')}
                  </div>
                </div>

                {app.consultantSummary && (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-800">Case Officer Note: </span>
                    {app.consultantSummary}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>Documents: <strong className="text-slate-800 tabular-nums">{app.documentsCount}</strong></span>
                    <span>Last Updated: <strong className="text-slate-800">{new Date(app.updatedAt).toLocaleDateString()}</strong></span>
                  </div>
                  <Link
                    to={`/customer/applications?id=${app.id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Dossier & Uploads</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Consultation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upcoming Advisory Sessions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your confirmed 1-on-1 consultations with case advisors.</p>
          </div>
          <Link to="/customer/appointments" className="text-xs font-semibold text-blue-600 hover:underline">
            Manage & Book &rarr;
          </Link>
        </div>

        {upcomingApts.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No upcoming consultation appointments scheduled.{' '}
            <Link to="/book-consultation" className="text-blue-600 font-semibold hover:underline">
              Schedule a Session
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingApts.map((apt) => (
              <div
                key={apt.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {apt.destinationCountry} Visa Strategy Session
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {apt.date} · {apt.timeSlot} · {apt.timezone}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {apt.meetingLink && (
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
