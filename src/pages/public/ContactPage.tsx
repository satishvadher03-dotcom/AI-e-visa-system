import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { TravelDirection, VisaCategory } from '../../types/index.ts';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDirection, setTravelDirection] = useState<TravelDirection>('india_to_world');
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [visaCategory, setVisaCategory] = useState<VisaCategory>('tourist');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          travelDirection,
          destinationCountry,
          visaCategory,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit enquiry.');
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Advisory & Case Inquiries Office
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Our registered advisors provide regulatory guidance across our Mumbai headquarters and virtual consultation channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Office Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Headquarters & Consultation Desks
            </h2>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Mumbai Legal & Documentation Office</div>
                  <div>Tower B, Level 8, The Capital Building, G Block, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Telephone Helpline</div>
                  <div>+91 22 6988 4000 / +91 98201 12345</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Direct Case Enquiries</div>
                  <div>advisory@auravisaglobal.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Office Working Hours</div>
                  <div>Monday to Friday: 09:30 AM – 06:30 PM (IST)</div>
                  <div>Saturday: 10:00 AM – 03:00 PM (IST)</div>
                  <div className="text-[11px] text-slate-400">Sunday & Consular Holidays: Closed</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-500 space-y-2">
            <div className="font-semibold text-slate-800">Emergency Consular Escalation</div>
            <p className="leading-relaxed">
              If your biometric appointment or embassy interview is scheduled within 48 hours and you have urgent document queries, please state your reference in your enquiry message for priority review.
            </p>
          </div>
        </div>

        {/* Right: Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Submit Direct Visa Case Enquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Our case officers review inquiries and respond with verified statutory requirements.
            </p>

            {success ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Enquiry Dispatched Successfully</h3>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting AuraVisa Global. A senior immigration advisor has been notified and will review your requirements.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Patel"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priya@example.com"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98200 00000"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Corridor</label>
                    <select
                      value={travelDirection}
                      onChange={(e) => setTravelDirection(e.target.value as TravelDirection)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="india_to_world">India to World</option>
                      <option value="world_to_india">World to India</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visa Category</label>
                  <select
                    value={visaCategory}
                    onChange={(e) => setVisaCategory(e.target.value as VisaCategory)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="tourist">Tourist & Visitor Visa</option>
                    <option value="business">Business & Commercial Visa</option>
                    <option value="student">Student & Academic Visa</option>
                    <option value="medical">Medical Treatment Visa</option>
                    <option value="work">Employment Visa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Case Details or Inquiry</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Describe your current status, travel timeframe, and any specific documentation concerns..."
                    className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting Case...' : 'Submit Enquiry to Case Officer'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
