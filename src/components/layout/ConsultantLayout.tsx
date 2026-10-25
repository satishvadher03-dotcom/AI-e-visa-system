import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Globe, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const ConsultantLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Verifying consultant credentials...</div>
      </div>
    );
  }

  // Enforce consultant role security
  if (!user || user.role !== 'consultant') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Consultant Authorization Required</h2>
          <p className="text-sm text-slate-600 mb-4">
            You must be an accredited immigration consultant to access this workflow desk.
          </p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Work Desk Overview', path: '/consultant/dashboard', icon: Briefcase },
    { label: 'Assigned Cases', path: '/consultant/cases', icon: CheckSquare },
    { label: 'Consultation Calendar', path: '/consultant/appointments', icon: Calendar },
    { label: 'Advisor Profile', path: '/consultant/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Consultant Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-900 font-bold tracking-tight text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span>AuraVisa</span>
              <span className="text-xs text-slate-400 font-normal">/ Consultant Console</span>
            </Link>

            <Link 
              to="/" 
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-900">{user.name}</div>
              <div className="text-[11px] text-slate-500">Reg. Immigration Advisor</div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <nav className="bg-white border border-slate-200 rounded-xl p-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      active 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 space-y-2">
              <div className="font-semibold text-slate-800">Review Code of Ethics</div>
              <p className="leading-relaxed">
                Consultants must verify client financial ties rigorously before certifying case readiness. Internal notes remain confidential from client view.
              </p>
            </div>
          </aside>

          {/* Consultant Content Area */}
          <main className="md:col-span-3">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};
