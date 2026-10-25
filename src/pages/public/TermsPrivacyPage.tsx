import React, { useState } from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPrivacyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Legal Governance & Compliance Policies
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review our data retention framework, privacy guarantees, and terms of advisory representation.
        </p>

        {/* Tab switcher */}
        <div className="mt-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy Policy & Document Security
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms of Service & Consular Disclaimers
          </button>
        </div>
      </div>

      {activeTab === 'privacy' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-600 leading-relaxed shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Lock className="w-5 h-5 text-blue-600" />
            <span>Document Confidentiality & Data Protection Protocol</span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">1. Private Document Storage</h3>
              <p>
                All identification documentation (including passport biodata scans, bank statements, tax returns, and employment proofs) uploaded to AuraVisa Global are stored in encrypted private vaults with randomized object identifiers. We do not generate public or search-engine indexable URLs for sensitive user records.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">2. Access Controls & Role Segmentation</h3>
              <p>
                Access to user documents is restricted through server-side ownership authorization. Only the authenticated customer who uploaded the document, the explicitly assigned licensed immigration consultant, and authorized system administrators have access to view or audit files.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">3. Minimization of AI Data Transfer</h3>
              <p>
                Our AI Assistant interface strictly enforces sensitive-data sanitization. Passport numbers and national identification identifiers are stripped before transmission to AI models, and chat history is not used to train global third-party language models.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">4. Document Retention & Purging</h3>
              <p>
                Clients may request complete deletion of their uploaded application dossiers upon conclusion or withdrawal of consular representation. Audit logs are preserved in accordance with regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-600 leading-relaxed shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Terms of Advisory Representation & Statuary Disclaimers</span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">1. Independent Advisory Nature</h3>
              <p>
                AuraVisa Global is an independent visa documentation consultancy. We are not an official arm, embassy, or consulate of any government. We provide advisory and pre-screening assistance based upon published immigration statutory guidelines.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">2. No Guarantee of Visa Grant</h3>
              <p>
                Final visa issuance is at the sole statutory discretion of the consular officer or visa adjudicator representing the sovereign destination government. AuraVisa Global does not guarantee or represent that any application will result in the issuance of a visa or travel permit.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">3. Accuracy of Applicant Evidence</h3>
              <p>
                The applicant certifies that all information, financial documentation, and background disclosures provided to AuraVisa Global are truthful, authentic, and complete. AuraVisa Global strictly prohibits and terminates representation upon detection of forged or fraudulent submissions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">4. Consultation Scheduling & Rescheduling</h3>
              <p>
                Appointments may be rescheduled or cancelled free of charge up to 12 hours prior to the scheduled consultation window through the customer portal.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
