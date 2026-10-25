import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  UserCheck
} from 'lucide-react';
import { TravelDirection, VisaCategory } from '../../types/index.ts';

export const BookConsultationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const initialCountry = searchParams.get('country') || 'United States';
  const initialCategory = (searchParams.get('category') as VisaCategory) || 'tourist';

  const [consultationType, setConsultationType] = useState<'virtual_video' | 'phone_call' | 'in_person'>('virtual_video');
  const [travelDirection, setTravelDirection] = useState<TravelDirection>('india_to_world');
  const [destinationCountry, setDestinationCountry] = useState<string>(initialCountry);
  const [visaCategory, setVisaCategory] = useState<VisaCategory>(initialCategory);
  
  // Slot selection
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-05');
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM - 11:45 AM');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('Asia/Kolkata (IST, UTC+5:30)');

  // Contact details
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>(user?.phone || '+91 98');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<any | null>(null);

  const availableSlots = [
    '09:30 AM - 10:15 AM',
    '10:30 AM - 11:15 AM',
    '11:30 AM - 12:15 PM',
    '02:00 PM - 02:45 PM',
    '03:30 PM - 04:15 PM',
    '05:00 PM - 05:45 PM'
  ];

  const timezones = [
    'Asia/Kolkata (IST, UTC+5:30)',
    'Europe/London (GMT/BST, UTC+0)',
    'America/New_York (EST/EDT, UTC-5)',
    'America/Los_Angeles (PST/PDT, UTC-8)',
    'Asia/Dubai (GST, UTC+4)',
    'Australia/Sydney (AEST, UTC+10)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // If customer is logged in, book through authenticated customer endpoint
      const token = localStorage.getItem('auravisa_token');
      const endpoint = token ? '/api/v1/customer/appointments' : '/api/v1/enquiries';

      if (token) {
        const res = await fetch('/api/v1/customer/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            consultationType,
            travelDirection,
            destinationCountry,
            visaCategory,
            date: selectedDate,
            timeSlot: selectedSlot,
            timezone: selectedTimezone,
            notes
          })
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to book appointment.');
          return;
        }

        setConfirmedAppointment(data.appointment);
      } else {
        // Unauthenticated guest submits appointment request via verified enquiry
        const res = await fetch('/api/v1/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email,
            phone,
            travelDirection,
            destinationCountry,
            visaCategory,
            message: `[CONSULTATION BOOKING REQUEST: ${selectedDate} at ${selectedSlot} (${selectedTimezone}) via ${consultationType}] Note: ${notes}`
          })
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to submit booking request.');
          return;
        }

        setConfirmedAppointment({
          id: data.enquiry.id,
          customerName: fullName,
          customerEmail: email,
          date: selectedDate,
          timeSlot: selectedSlot,
          timezone: selectedTimezone,
          consultationType,
          destinationCountry,
          meetingLink: 'https://meet.google.com/aur-advisory-session'
        });
      }
    } catch (err: any) {
      setError(err.message || 'Network failure while processing booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Schedule 1-on-1 Visa Consultation
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Connect with an accredited immigration advisor for an in-depth 45-minute case evaluation, documentation audit, and consular interview strategy.
        </p>
      </div>

      {!confirmedAppointment ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Consultation Channel */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Select Consultation Channel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('virtual_video')}
                  className={`p-3.5 border rounded-xl text-left transition-colors ${
                    consultationType === 'virtual_video'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-blue-600 mb-1" />
                  <div className="text-xs font-bold text-slate-900">Google Meet</div>
                  <div className="text-[11px] text-slate-500">Virtual Video Room</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('phone_call')}
                  className={`p-3.5 border rounded-xl text-left transition-colors ${
                    consultationType === 'phone_call'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Phone className="w-4 h-4 text-blue-600 mb-1" />
                  <div className="text-xs font-bold text-slate-900">Direct Phone</div>
                  <div className="text-[11px] text-slate-500">Dedicated Callback</div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('in_person')}
                  className={`p-3.5 border rounded-xl text-left transition-colors ${
                    consultationType === 'in_person'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-600 mb-1" />
                  <div className="text-xs font-bold text-slate-900">BKC Office</div>
                  <div className="text-[11px] text-slate-500">Mumbai Desk</div>
                </button>
              </div>
            </div>

            {/* Travel Scope */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Travel Pathway Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Travel Corridor
                  </label>
                  <select
                    value={travelDirection}
                    onChange={(e) => setTravelDirection(e.target.value as TravelDirection)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="india_to_world">India to Global Destination</option>
                    <option value="world_to_india">World to India (Inbound e-Visa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Country
                  </label>
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Visa Category
                </label>
                <select
                  value={visaCategory}
                  onChange={(e) => setVisaCategory(e.target.value as VisaCategory)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="tourist">Tourist & Visitor Visa</option>
                  <option value="business">Business & Commercial Visa</option>
                  <option value="student">Student & Academic Visa</option>
                  <option value="medical">Medical Treatment Visa</option>
                  <option value="work">Skilled Employment Visa</option>
                </select>
              </div>
            </div>

            {/* Date & Slot Picker */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Date & Available Time Slot
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Timezone
                  </label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select 45-Minute Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 text-xs text-center border rounded-lg transition-colors tabular-nums ${
                        selectedSlot === slot
                          ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Applicant Details (if not logged in) */}
            {!user && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Your Contact Coordinates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="As in passport"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For calendar invite"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 or country code"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Case Background or Specific Inquiries (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Mention any previous visa refusals, specific travel dates, or questions regarding financial documentation..."
                className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Right Column: Summary Card */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Booking Summary
              </h3>

              <div className="text-xs text-slate-600 space-y-3">
                <div>
                  <div className="text-slate-400">Destination:</div>
                  <div className="font-semibold text-slate-800">{destinationCountry} ({visaCategory.toUpperCase()})</div>
                </div>

                <div>
                  <div className="text-slate-400">Scheduled Date:</div>
                  <div className="font-semibold text-slate-800">{selectedDate}</div>
                </div>

                <div>
                  <div className="text-slate-400">Time Window:</div>
                  <div className="font-semibold text-slate-800 tabular-nums">{selectedSlot}</div>
                </div>

                <div>
                  <div className="text-slate-400">Channel:</div>
                  <div className="font-semibold text-slate-800 capitalize">{consultationType.replace('_', ' ')}</div>
                </div>

                <div>
                  <div className="text-slate-400">Timezone:</div>
                  <div className="font-semibold text-slate-800 text-[11px]">{selectedTimezone}</div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Confirming Availability...' : 'Confirm Appointment Booking'}
              </button>

              <div className="text-[11px] text-slate-400 leading-relaxed text-center">
                Free reschedule allowed up to 12 hours prior to scheduled consultation.
              </div>
            </div>
          </div>

        </form>
      ) : (
        /* Booking Confirmation Screen */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Consultation Successfully Scheduled!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Appointment Reference: <span className="font-mono font-bold text-slate-700">{confirmedAppointment.id}</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs text-slate-700 space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Applicant:</span>
              <span className="font-semibold">{confirmedAppointment.customerName || fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-semibold">{confirmedAppointment.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time Slot:</span>
              <span className="font-semibold tabular-nums">{confirmedAppointment.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Channel:</span>
              <span className="font-semibold capitalize">{confirmedAppointment.consultationType.replace('_', ' ')}</span>
            </div>
            {confirmedAppointment.meetingLink && (
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-400">Google Meet Link:</span>
                <a
                  href={confirmedAppointment.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-medium text-[11px]"
                >
                  Join Meeting Room
                </a>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            {user ? (
              <Link
                to="/customer/appointments"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                View in Customer Appointments
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Account to Track Appointment
              </Link>
            )}
            <Link
              to="/"
              className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
