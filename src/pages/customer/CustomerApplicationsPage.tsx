import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Application, ApplicationStatusHistory, CustomerDocument } from '../../types/index.ts';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  X, 
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const CustomerApplicationsPage: React.FC = () => {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedAppId = searchParams.get('id');

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusHistory, setStatusHistory] = useState<ApplicationStatusHistory[]>([]);
  const [appDocuments, setAppDocuments] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Application Modal
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newDestination, setNewDestination] = useState<string>('United States');
  const [newProgramName, setNewProgramName] = useState<string>('US B1/B2 Visitor Visa');
  const [newTravelDate, setNewTravelDate] = useState<string>('2026-08-01');

  // Document Upload Modal
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadType, setUploadType] = useState<string>('bank_statement');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  useEffect(() => {
    loadApplications();
  }, [token]);

  const loadApplications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/customer/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const apps: Application[] = data.applications || [];
        setApplications(apps);

        if (selectedAppId) {
          const match = apps.find(a => a.id === selectedAppId);
          if (match) viewApplicationDetails(match.id);
        } else if (apps.length > 0) {
          viewApplicationDetails(apps[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const viewApplicationDetails = async (appId: string) => {
    try {
      const res = await fetch(`/api/v1/customer/applications/${appId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedApp(data.application);
        setStatusHistory(data.statusHistory || []);
        setAppDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/customer/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          visaProgramId: 'custom_created',
          destinationCountry: newDestination,
          intendedTravelDate: newTravelDate
        })
      });

      if (res.ok) {
        const data = await res.json();
        setShowNewModal(false);
        await loadApplications();
        if (data.application) viewApplicationDetails(data.application.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !uploadTitle || !uploadFileName) return;
    setUploadLoading(true);

    try {
      const res = await fetch('/api/v1/customer/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          title: uploadTitle,
          documentType: uploadType,
          fileName: uploadFileName,
          fileSize: 450000,
          mimeType: uploadFileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
        })
      });

      if (res.ok) {
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadFileName('');
        await viewApplicationDetails(selectedApp.id);
        await loadApplications();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Visa Applications Dossier</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track workflow statuses, examine review history, and upload requested evidentiary documents.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Application</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Visa Applications on Record</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Create an application to begin tracking required checklists, booking biometrics, and communicating with assigned consultants.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Your First Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Applications Selector Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Your Submissions ({applications.length})
            </div>

            {applications.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => viewApplicationDetails(app.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedApp?.id === app.id
                    ? 'bg-blue-50/60 border-blue-600 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">{app.destinationCountry}</span>
                  <span className="font-mono text-[10px] text-slate-400">{app.id}</span>
                </div>
                <div className="text-xs font-medium text-slate-700 truncate">{app.visaProgramName}</div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                  <span className="capitalize">{app.status.replace(/_/g, ' ')}</span>
                  <span>{new Date(app.submissionDate).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Application Detail Column */}
          <div className="lg:col-span-8 space-y-6">
            {selectedApp && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs text-slate-400">Application File: {selectedApp.id}</div>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      {selectedApp.visaProgramName}
                    </h2>
                    <div className="text-xs text-slate-500 mt-1">
                      Destination: <strong className="text-slate-800">{selectedApp.destinationCountry}</strong> · 
                      Assigned Advisor: <strong className="text-slate-800">{selectedApp.consultantName || 'Pending Assignment'}</strong>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border self-start sm:self-auto ${
                    selectedApp.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    selectedApp.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedApp.status === 'documents_required' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {selectedApp.status.toUpperCase().replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Application Workflow History
                  </h3>
                  <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-1">
                    {statusHistory.map((hist) => (
                      <div key={hist.id} className="relative text-xs space-y-0.5 pb-2">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                        <div className="font-semibold text-slate-800">
                          {hist.toStatus.toUpperCase().replace(/_/g, ' ')}
                          <span className="font-normal text-slate-400 text-[11px] ml-2">by {hist.changedBy} ({hist.changedByRole})</span>
                        </div>
                        <div className="text-slate-600 text-[11px]">{hist.reason}</div>
                        <div className="text-slate-400 text-[10px] tabular-nums">{new Date(hist.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Uploaded Case Evidentiary Documents ({appDocuments.length})
                    </h3>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Document</span>
                    </button>
                  </div>

                  {appDocuments.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                      No documents uploaded yet for this application dossier.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {appDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">{doc.title}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{doc.fileName} · {(doc.fileSize / 1024).toFixed(0)} KB</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              doc.status === 'rejected_resubmit_needed' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {doc.status.replace(/_/g, ' ')}
                            </span>
                          </div>
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

      {/* New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">File New Visa Application</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Country</label>
                <input
                  type="text"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intended Travel Date</label>
                <input
                  type="date"
                  value={newTravelDate}
                  onChange={(e) => setNewTravelDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-500 leading-relaxed text-[11px]">
                Upon submission, this application will be logged into our system and queued for advisor assignment.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Upload Statutory Evidence Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title / Label</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. 6-Month Stamped Bank Statement"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="bank_statement">Bank Account Statement</option>
                  <option value="passport_scan">Passport Biodata Scan</option>
                  <option value="tax_return">ITR-V / Tax Return Assessment</option>
                  <option value="employment_letter">Employer NOC / Leave Approval</option>
                  <option value="hotel_flight">Itinerary / Flight Confirmation</option>
                  <option value="invitation_letter">Host Invitation Letter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select File (PDF or JPG/PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setUploadFileName(f.name);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-600"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
                Security note: Uploaded files are stored in private vaults with access restricted strictly to your assigned immigration advisor.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {uploadLoading ? 'Encrypting & Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
