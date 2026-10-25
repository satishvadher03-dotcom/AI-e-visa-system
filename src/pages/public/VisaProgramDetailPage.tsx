import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { VisaProgram } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Clock, 
  CreditCard, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const VisaProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [program, setProgram] = useState<VisaProgram | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingApp, setCreatingApp] = useState<boolean>(false);
  const [appSuccess, setAppSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgram() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/visa-programs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProgram(data.program);
        }
      } catch (err) {
        console.error('Failed to load program:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgram();
  }, [id]);

  const handleStartApplication = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user.role !== 'customer') {
      navigate('/customer/dashboard');
      return;
    }

    setCreatingApp(true);
    try {
      const res = await fetch('/api/v1/customer/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auravisa_token')}`
        },
        body: JSON.stringify({
          visaProgramId: program?.id,
          destinationCountry: program?.country,
          intendedTravelDate: '2026-07-01'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAppSuccess('Application created! Directing to your customer vault...');
        setTimeout(() => {
          navigate('/customer/applications');
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
        Retrieving official visa criteria...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Program Record Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested visa program may have been updated or unpublished.</p>
        <Link to="/visa-programs" className="text-xs font-semibold text-blue-600 hover:underline">
          &larr; Return to Visa Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb */}
      <div>
        <Link
          to="/visa-programs"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{program.country}</span>
            <span aria-hidden="true">·</span>
            <span>{program.direction === 'india_to_world' ? 'India to Worldwide' : 'World to India'}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{program.category} Stream</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-[11px] font-medium border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified: {program.lastVerifiedDate}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {program.name}
        </h1>

        <p className="text-sm font-medium text-blue-600">
          {program.subTitle}
        </p>

        <p className="text-sm text-slate-600 leading-relaxed">
          {program.description}
        </p>

        {/* Source link */}
        <div className="pt-2 text-xs text-slate-500 flex items-center gap-1">
          <span>Official Regulatory Authority:</span>
          <a
            href={program.officialSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>{program.officialSourceName}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Max Stay Duration</div>
          <div className="text-sm font-bold text-slate-900">{program.stayDuration}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Visa Validity</div>
          <div className="text-sm font-bold text-slate-900">{program.validity}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Processing Window</div>
          <div className="text-sm font-bold text-slate-900">{program.processingTime}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Approximate Govt. Fee</div>
          <div className="text-sm font-bold text-slate-900 tabular-nums">{program.approxGovFee}</div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Requirements & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Eligibility Criteria */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Core Eligibility & Admissibility Criteria</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {program.eligibilityCriteria.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Mandatory Documentation Checklist</span>
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {program.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Tips */}
          {program.keyTips.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-600" />
                <span>Consular Advisory Notes & Practice Tips</span>
              </h2>
              <ul className="space-y-2 text-xs text-slate-600">
                {program.keyTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    &bull; {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Column: Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Initiate Application</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create an application dossier to track required documents, schedule biometrics preparation, and assign a case officer.
            </p>

            {appSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                {appSuccess}
              </div>
            ) : (
              <button
                onClick={handleStartApplication}
                disabled={creatingApp}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {creatingApp ? 'Creating Application...' : 'Start Application Online'}
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={`/book-consultation?country=${encodeURIComponent(program.country)}&category=${program.category}`}
                className="w-full block text-center py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                Book 1-on-1 Consultation
              </Link>
              <Link
                to={`/eligibility?country=${encodeURIComponent(program.country)}`}
                className="w-full block text-center py-2 px-4 text-xs font-medium text-blue-600 hover:underline"
              >
                Run Quick Eligibility Check &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-500 space-y-2">
            <div className="font-semibold text-slate-700">Official Portal Direct Access</div>
            <p className="leading-relaxed">
              Prefer to apply directly through official government portals? You can access the verified source link anytime:
            </p>
            <a
              href={program.officialSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>{program.officialSourceName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
