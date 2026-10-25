import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Appointment } from '../../types/index.ts';
import { Calendar, Video, Phone, CheckCircle2, User, Clock } from 'lucide-react';

export const ConsultantAppointmentsPage: React.FC = () => {
  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAssignedApts() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch('/api/v1/consultant/appointments', {
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
    }
    fetchAssignedApts();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Consultation Calendar & Sessions</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your upcoming advisory appointments and join dedicated video meeting rooms.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading consultation schedule...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Scheduled Consultations</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upcoming client sessions assigned to your advisor calendar will appear here.
          </p>
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
                  <span className="font-bold text-sm text-slate-900">Client: {apt.customerName}</span>
                  <span className="text-slate-400 text-xs font-mono">({apt.customerEmail})</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                    {apt.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Destination: <strong className="text-slate-800">{apt.destinationCountry}</strong></span>
                  <span>·</span>
                  <span>Date: <strong className="text-slate-800">{apt.date}</strong></span>
                  <span>·</span>
                  <span>Slot: <strong className="text-slate-800 tabular-nums">{apt.timeSlot}</strong></span>
                  <span>·</span>
                  <span>Channel: <strong className="text-slate-800 capitalize">{apt.consultationType.replace('_', ' ')}</strong></span>
                </div>

                {apt.notes && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700">Client Inquiry: </span>
                    {apt.notes}
                  </div>
                )}
              </div>

              <div>
                {apt.meetingLink && (
                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Video Room</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
