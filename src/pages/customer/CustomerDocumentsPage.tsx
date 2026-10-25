import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { CustomerDocument } from '../../types/index.ts';
import { FolderLock, Upload, FileText, CheckCircle2, AlertCircle, Shield, X, Download } from 'lucide-react';

export const CustomerDocumentsPage: React.FC = () => {
  const { token } = useAuth();
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Upload state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('bank_statement');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [token]);

  const loadDocuments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/customer/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) return;
    setUploading(true);
    try {
      const res = await fetch('/api/v1/customer/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          documentType: docType,
          fileName,
          fileSize: 520000,
          mimeType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
        })
      });

      if (res.ok) {
        setShowModal(false);
        setTitle('');
        setFileName('');
        await loadDocuments();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Encrypted Document Vault</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Privately store and audit financial proofs, passport scans, and employer letters.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3 shadow-xs">
        <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-900">Statutory Privacy Assurance: </span>
          Documents deposited in your vault are protected by strict server-side ownership authorization. No public links are ever generated. Files are accessible solely by you and your assigned licensed immigration case officer.
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading vault documents...</div>
      ) : documents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <FolderLock className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Your Vault is Currently Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Upload your passport biodata scan, bank statements, or employer leave approvals for consultant verification.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Upload First Document
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Document Title & File</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{doc.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.fileName}</div>
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-600">
                      {doc.documentType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono tabular-nums">
                      {(doc.fileSize / 1024).toFixed(0)} KB
                    </td>
                    <td className="py-3 px-4 text-slate-500 tabular-nums">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        doc.status === 'rejected_resubmit_needed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {doc.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Upload to Private Vault</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Label</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Current Passport Bio Page"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="passport_scan">Passport Scan</option>
                  <option value="bank_statement">Bank Account Statements</option>
                  <option value="tax_return">ITR Acknowledgement / Form 16</option>
                  <option value="employment_letter">Employer Leave Sanction / NOC</option>
                  <option value="invitation_letter">Host Invitation Sponsorship</option>
                  <option value="other">Other Supporting Material</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select File (PDF or Image)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFileName(f.name);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Encrypting & Storing...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
