import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  ExternalLink,
  ShieldAlert,
  PlaneTakeoff,
  PlaneLanding
} from 'lucide-react';
import { TravelDirection, VisaCategory, EligibilityResult } from '../../types/index.ts';

export const EligibilityCheckerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillCountry = searchParams.get('country') || '';

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    nationality: 'Indian',
    currentResidence: 'India',
    travelDirection: 'india_to_world' as TravelDirection,
    destination: prefillCountry || 'United States',
    purpose: 'tourist' as VisaCategory,
    durationMonths: 1,
    approxTravelDate: '2026-06-15',
    hasValidPassport: true,
    passportValidityMonths: 24,
    previousVisaRefusals: false,
    employmentStatus: 'employed' as const,
    fundingMethod: 'self' as const
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/eligibility/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Visa Eligibility Pre-Assessment
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
          Verify preliminary criteria against destination regulations before filing documents.
        </p>
      </div>

      {!result ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Direction & Origin */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-900">
                  Step 1: Travel Direction & Nationality
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Travel Corridor
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, travelDirection: 'india_to_world', nationality: 'Indian', currentResidence: 'India' })}
                      className={`p-3 text-left border rounded-xl flex items-center gap-3 transition-colors ${
                        formData.travelDirection === 'india_to_world'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <PlaneTakeoff className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">India to World</div>
                        <div className="text-[11px] text-slate-500">Outbound travel from India</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, travelDirection: 'world_to_india', destination: 'India' })}
                      className={`p-3 text-left border rounded-xl flex items-center gap-3 transition-colors ${
                        formData.travelDirection === 'world_to_india'
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <PlaneLanding className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">World to India</div>
                        <div className="text-[11px] text-slate-500">Inbound e-Visa to India</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Passport Country / Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="e.g. Indian, American, British"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Country of Legal Residence
                    </label>
                    <input
                      type="text"
                      value={formData.currentResidence}
                      onChange={(e) => setFormData({ ...formData, currentResidence: e.target.value })}
                      placeholder="e.g. India, UAE, UK"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Country
                  </label>
                  {formData.travelDirection === 'world_to_india' ? (
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-medium"
                    />
                  ) : (
                    <select
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="United States">United States (US)</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany / Schengen Area">Germany / Schengen Area</option>
                      <option value="Australia">Australia</option>
                      <option value="UAE">United Arab Emirates (UAE)</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Japan">Japan</option>
                    </select>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Purpose & Dates */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-900">
                  Step 2: Purpose of Travel & Timeline
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Primary Purpose of Travel
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'tourist', label: 'Tourism & Leisure' },
                      { id: 'family', label: 'Visiting Family / Friends' },
                      { id: 'business', label: 'Business Meetings & Trade' },
                      { id: 'student', label: 'Academic Studies' },
                      { id: 'medical', label: 'Medical Treatment' },
                      { id: 'transit', label: 'Airport Transit' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: p.id as VisaCategory })}
                        className={`p-3 text-left border rounded-lg transition-colors ${
                          formData.purpose === p.id 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' 
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Intended Stay Duration (Months)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={formData.durationMonths}
                      onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Approximate Travel Date
                    </label>
                    <input
                      type="date"
                      value={formData.approxTravelDate}
                      onChange={(e) => setFormData({ ...formData, approxTravelDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Passport & Immigration History */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-900">
                  Step 3: Passport Validity & Prior Travel History
                </h2>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Do you hold a currently valid passport?</div>
                      <div className="text-[11px] text-slate-500">With at least two blank consecutive pages.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.hasValidPassport}
                      onChange={(e) => setFormData({ ...formData, hasValidPassport: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>

                  {formData.hasValidPassport && (
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Months of remaining validity on passport:
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={formData.passportValidityMonths}
                        onChange={(e) => setFormData({ ...formData, passportValidityMonths: parseInt(e.target.value) || 6 })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white tabular-nums"
                      />
                      <div className="text-[11px] text-slate-400 mt-1">
                        Most international borders require at least 6 months validity from planned departure date.
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Any previous visa refusals or deportation orders?</div>
                      <div className="text-[11px] text-slate-500">For any country (US, UK, Canada, Schengen, Australia, etc.).</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.previousVisaRefusals}
                      onChange={(e) => setFormData({ ...formData, previousVisaRefusals: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Ties & Financial Evidence */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-slate-900">
                  Step 4: Economic Ties & Financial Capability
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Employment / Occupation Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="employed">Full-Time Salaried Professional</option>
                    <option value="self_employed">Business Owner / Self-Employed</option>
                    <option value="student">Enrolled Full-Time Student</option>
                    <option value="retired">Retired with Pension / Investments</option>
                    <option value="unemployed">Currently Seeking Employment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trip Funding Source
                  </label>
                  <select
                    value={formData.fundingMethod}
                    onChange={(e) => setFormData({ ...formData, fundingMethod: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="self">Self-Funded (Personal Bank Statements)</option>
                    <option value="sponsor">Family Member / Relative Sponsor</option>
                    <option value="company">Corporate Employer Sponsor</option>
                    <option value="scholarship">University Scholarship / Grant</option>
                  </select>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 leading-relaxed">
                  Submitting will evaluate your answers against statutory guidelines to compute recommended documentation and highlight potential refusal risk factors.
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Evaluating Rules...' : 'Generate Pre-Assessment Report'}
                </button>
              )}
            </div>

          </form>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs text-slate-400">Preliminary Assessment for {formData.destination}</div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {result.eligible === 'likely' && 'High Preliminary Eligibility Index'}
                {result.eligible === 'moderate' && 'Moderate Eligibility with Document Prerequisite Actions'}
                {result.eligible === 'needs_assessment' && 'Individual Case Officer Audit Recommended'}
              </h2>
            </div>

            <div className={`px-3 py-1 rounded text-xs font-bold border ${
              result.eligible === 'likely'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {result.eligible.toUpperCase().replace('_', ' ')}
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Actionable Recommendations:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Blockers */}
          {result.potentialBlockers.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Identified Risk Factors Requiring Mitigation:</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-800 list-disc list-inside">
                {result.potentialBlockers.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Required Documentary Evidence:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {result.requiredEvidence.map((ev, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimers & Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{result.disclaimer}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/book-consultation?country=${encodeURIComponent(formData.destination)}`}
                className="flex-1 text-center py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Detailed 1-on-1 Consultation
              </Link>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setStep(1);
                }}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Retake Assessment
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
