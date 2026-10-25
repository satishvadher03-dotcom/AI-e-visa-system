import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Users, 
  FileStack, 
  BookOpen, 
  ShieldAlert, 
  BarChart3, 
  CheckCircle2, 
  UserPlus, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReports() {
      if (!token) return;
      try {
        const res = await fetch('/api/v1/admin/reports', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [token]);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Administration & Compliance Control</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee user roles, consultant case distribution, knowledge base verification, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/applications"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span>Assign Cases</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Users</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {loading ? '...' : metrics?.totalUsers || 4}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {metrics?.totalCustomers || 2} clients · {metrics?.totalConsultants || 1} advisor
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Active Applications</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {loading ? '...' : metrics?.activeApplications || 2}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across global destinations
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Verified Programs</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {loading ? '...' : metrics?.verifiedVisaProgramsCount || 8}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Grounded official rules
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Consultations</div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {loading ? '...' : metrics?.totalAppointments || 2}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1-on-1 strategy sessions
          </div>
        </div>
      </div>

      {/* Operations Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-sm hover:border-blue-300 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">User Directory & Roles</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review registered applicant accounts, assign accredited consultant credentials, and manage account statuses.
          </p>
          <Link to="/admin/users" className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 pt-1">
            <span>Manage Users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-sm hover:border-blue-300 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileStack className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Case Allocation Engine</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Assign incoming client applications to registered case officers and audit full workflow status changes.
          </p>
          <Link to="/admin/applications" className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 pt-1">
            <span>View All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-sm hover:border-blue-300 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">System Audit Trail</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect immutable security logs tracking all logins, case assignments, status changes, and administrative actions.
          </p>
          <Link to="/admin/audit-logs" className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 pt-1">
            <span>Inspect Audit Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
