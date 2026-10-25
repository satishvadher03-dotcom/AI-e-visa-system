import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Appointment } from '../../types/index.ts';
import { Calendar, Video, Phone, Building, CheckCircle2, XCircle, Plus, AlertCircle } from 'lucide-react';

export const CustomerAppointmentsPage: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [token]);

  const loadAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/customer/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) return;
    try {
      const res = await fetch(`/api/v1/customer/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setActionMessage('Appointment cancelled.');
        await loadAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Consultation Appointments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View scheduled advisory reviews, connect via video room, or manage booking times.
          </p>
        </div>

        <Link
          to="/book-consultation"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book New Session</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          {actionMessage}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Appointments Booked</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Schedule a 45-minute 1-on-1 strategy session with our registered consultants.
          </p>
          <Link
            to="/book-consultation"
            className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Schedule Consultation Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{apt.destinationCountry} Advisory Session</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {apt.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Date: <strong className="text-slate-800">{apt.date}</strong></span>
                  <span>·</span>
                  <span>Time: <strong className="text-slate-800 tabular-nums">{apt.timeSlot}</strong></span>
                  <span>·</span>
                  <span>Advisor: <strong className="text-slate-800">{apt.consultantName || 'Assigned Officer'}</strong></span>
                </div>

                {apt.notes && (
                  <div className="text-xs text-slate-600 italic">
                    &ldquo;{apt.notes}&rdquo;
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {apt.status === 'confirmed' && apt.meetingLink && (
                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Join Video Room
                  </a>
                )}

                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelAppointment(apt.id)}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
