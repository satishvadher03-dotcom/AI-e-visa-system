import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Application, CaseNote, CustomerDocument, ApplicationStatusHistory, ApplicationStatus } from '../../types/index.ts';
import { 
  Briefcase, 
  Lock, 
  FileCheck, 
  Clock, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  FileQuestion,
  X
} from 'lucide-react';

export const ConsultantCasesPage: React.FC = () => {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');

  const [cases, setCases] = useState<Application[]>([]);
  const [selectedCase, setSelectedCase] = useState<Application | null>(null);
  const [statusHistory, setStatusHistory] = useState<ApplicationStatusHistory[]>([]);
  const [caseDocs, setCaseDocs] = useState<CustomerDocument[]>([]);
  const [internalNotes, setInternalNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status update modal / form
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  const [statusReason, setStatusReason] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Note form
  const [newNote, setNewNote] = useState<string>('');
  const [savingNote, setSavingNote] = useState<boolean>(false);

  useEffect(() => {
    loadCases();
  }, [token]);

  const loadCases = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/consultant/cases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const caseList: Application[] = data.cases || [];
        setCases(caseList);

        if (targetId) {
          const matched = caseList.find(c => c.id === targetId);
          if (matched) loadCaseDetails(matched.id);
        } else if (caseList.length > 0) {
          loadCaseDetails(caseList[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCaseDetails = async (caseId: string) => {
    try {
      const res = await fetch(`/api/v1/consultant/cases/${caseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCase(data.case);
        setStatusHistory(data.statusHistory || []);
        setCaseDocs(data.documents || []);
        setInternalNotes(data.internalNotes || []);
        setNewStatus(data.case.status);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/v1/consultant/cases/${selectedCase.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newStatus,
          reason: statusReason || `Status transitioned to ${newStatus}`
        })
      });

      if (res.ok) {
        setStatusReason('');
        await loadCaseDetails(selectedCase.id);
        await loadCases();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/v1/consultant/cases/${selectedCase.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: newNote.trim() })
      });

      if (res.ok) {
        setNewNote('');
        await loadCaseDetails(selectedCase.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Assigned Case Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Perform documentation completeness audits, manage internal case notes, and update workflow progressions.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading assigned cases...</div>
      ) : cases.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Cases Currently Assigned</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When administrators allocate client applications to your advisor account, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Assigned Case Roster */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Assigned to You ({cases.length})
            </div>

            {cases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => loadCaseDetails(c.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedCase?.id === c.id
                    ? 'bg-blue-50/60 border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">{c.customerName}</span>
                  <span className="font-mono text-[10px] text-slate-400">{c.id}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium truncate">{c.destinationCountry} · {c.visaProgramName}</div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                  <span className="capitalize">{c.status.replace(/_/g, ' ')}</span>
                  <span>{new Date(c.updatedAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Case File Details */}
          <div className="lg:col-span-8 space-y-6">
            {selectedCase && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                {/* Case Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs text-slate-400">Dossier: {selectedCase.id}</div>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      Client: {selectedCase.customerName}
                    </h2>
                    <div className="text-xs text-slate-500 mt-1">
                      Email: <strong className="text-slate-800">{selectedCase.customerEmail}</strong> · 
                      Program: <strong className="text-slate-800">{selectedCase.visaProgramName}</strong>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border self-start sm:self-auto ${
                    selectedCase.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    selectedCase.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedCase.status === 'documents_required' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {selectedCase.status.toUpperCase().replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Workflow Status Updater */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Update Workflow Status
                  </h3>
                  <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-5">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium"
                      >
                        <option value="under_review">Under Review (Document Audit)</option>
                        <option value="documents_required">Documents Required (Missing Records)</option>
                        <option value="ready_for_consultant_review">Ready for Consultant Review</option>
                        <option value="completed">Completed (Dossier Finalized)</option>
                        <option value="rejected_by_authority">Rejected by Consular Authority</option>
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        placeholder="Reason for status update..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={updatingStatus}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                      >
                        {updatingStatus ? 'Updating...' : 'Update'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Internal Case Notes (Confidential) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Confidential Case Notes (Advisor & Admin Only)
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {internalNotes.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span className="font-semibold text-slate-800">{n.consultantName}</span>
                          <span className="tabular-nums">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-slate-700">{n.note}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      placeholder="Add internal assessment notes (financial ties audit, bank seal notes, interview advice)..."
                      className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={savingNote}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg disabled:opacity-50"
                      >
                        {savingNote ? 'Recording...' : 'Add Confidential Note'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Client Submitted Documents */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Client Submitted Evidence ({caseDocs.length})
                  </h3>

                  {caseDocs.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                      No documents uploaded by client yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {caseDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">{doc.title}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{doc.fileName} · {(doc.fileSize / 1024).toFixed(0)} KB</div>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            doc.status === 'rejected_resubmit_needed' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
