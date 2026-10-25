import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { VisaProgram, TravelDirection, VisaCategory } from '../../types/index.ts';
import { BookOpen, Plus, ExternalLink, ShieldCheck, X, CheckCircle2 } from 'lucide-react';

export const AdminVisaProgramsPage: React.FC = () => {
  const { token } = useAuth();
  const [programs, setPrograms] = useState<VisaProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // New program state
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<TravelDirection>('india_to_world');
  const [category, setCategory] = useState<VisaCategory>('tourist');
  const [description, setDescription] = useState('');
  const [officialSourceUrl, setOfficialSourceUrl] = useState('');
  const [officialSourceName, setOfficialSourceName] = useState('');

  useEffect(() => {
    loadPrograms();
  }, [token]);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/visa-programs');
      if (res.ok) {
        const data = await res.json();
        setPrograms(data.programs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/v1/admin/visa-programs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setMessage(`Program status set to ${nextStatus}`);
        setTimeout(() => setMessage(null), 3000);
        await loadPrograms();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/visa-programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          country,
          name,
          direction,
          category,
          description,
          officialSourceUrl,
          officialSourceName,
          eligibilityCriteria: ['Valid passport with 6 months validity', 'Documented travel itinerary'],
          requiredDocuments: ['Passport scan', 'Recent 6 months bank statement']
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setCountry('');
        setName('');
        setDescription('');
        setOfficialSourceUrl('');
        setOfficialSourceName('');
        setMessage('New visa program added to knowledge base.');
        setTimeout(() => setMessage(null), 3000);
        await loadPrograms();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Visa Knowledge Base & Official Sources</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer statutory guidelines, official government embassy sources, and publication statuses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Visa Program</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading knowledge base...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Program Name & Country</th>
                  <th className="py-3 px-4">Corridor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Official Regulatory Source</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.country} ({p.countryCode})</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.direction === 'india_to_world' ? 'India to World' : 'World to India'}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-600">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={p.officialSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                      >
                        <span className="truncate max-w-[140px]">{p.officialSourceName}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-500">
                      {p.lastVerifiedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {p.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Visa Knowledge Base Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. New Zealand"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. NZ Visitor Visa"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Travel Corridor</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as TravelDirection)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="india_to_world">India to World</option>
                    <option value="world_to_india">World to India</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VisaCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="tourist">Tourist & Visitor</option>
                    <option value="business">Business & Commercial</option>
                    <option value="student">Student & Academic</option>
                    <option value="medical">Medical Treatment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of permitted activities, length of stay, and processing..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Regulatory Agency Name</label>
                <input
                  type="text"
                  value={officialSourceName}
                  onChange={(e) => setOfficialSourceName(e.target.value)}
                  placeholder="e.g. Immigration New Zealand"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Government Source URL</label>
                <input
                  type="url"
                  value={officialSourceUrl}
                  onChange={(e) => setOfficialSourceUrl(e.target.value)}
                  placeholder="https://www.immigration.govt.nz"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
