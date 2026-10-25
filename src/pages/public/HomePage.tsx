import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  ChevronRight,
  PlaneTakeoff,
  PlaneLanding,
  FileCheck,
  UserCheck
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDirection, setActiveDirection] = useState<'india_to_world' | 'world_to_india'>('india_to_world');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeDirection) params.set('direction', activeDirection);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    navigate(`/visa-programs?${params.toString()}`);
  };

  const popularPrograms = activeDirection === 'india_to_world' ? [
    {
      id: 'visa_us_b1b2',
      country: 'United States',
      code: 'US',
      title: 'US B1/B2 Visitor Visa',
      validity: '10 Years (Multiple)',
      stay: 'Up to 6 Months',
      fee: '$185 USD',
      source: 'travel.state.gov'
    },
    {
      id: 'visa_uk_standard_visitor',
      country: 'United Kingdom',
      code: 'GB',
      title: 'UK Standard Visitor Visa',
      validity: '6 Months - 10 Years',
      stay: 'Up to 180 Days',
      fee: '£115 GBP',
      source: 'gov.uk'
    },
    {
      id: 'visa_schengen_germany',
      country: 'Schengen / Germany',
      code: 'DE',
      title: 'Schengen Europe Uniform Visa',
      validity: 'Multiple / Single',
      stay: '90 Days / 180 Days',
      fee: '€90 EUR',
      source: 'india.diplo.de'
    },
    {
      id: 'visa_canada_visitor',
      country: 'Canada',
      code: 'CA',
      title: 'Canada Temporary Resident (TRV)',
      validity: 'Up to 10 Years',
      stay: 'Up to 6 Months',
      fee: '$100 CAD',
      source: 'canada.ca'
    }
  ] : [
    {
      id: 'visa_india_etourist',
      country: 'India',
      code: 'IN',
      title: 'India e-Tourist Visa (eTV)',
      validity: '30 Days / 1 Year / 5 Years',
      stay: '90 - 180 Days',
      fee: '$25 - $80 USD',
      source: 'indianvisaonline.gov.in'
    },
    {
      id: 'visa_india_ebusiness',
      country: 'India',
      code: 'IN',
      title: 'India e-Business Visa',
      validity: '1 Year (Multiple)',
      stay: 'Up to 180 Days / Year',
      fee: '$100 USD',
      source: 'indianvisaonline.gov.in'
    },
    {
      id: 'visa_india_emedical',
      country: 'India',
      code: 'IN',
      title: 'India e-Medical Visa',
      validity: '60 Days (Triple Entry)',
      stay: '60 Days',
      fee: '$80 USD',
      source: 'indianvisaonline.gov.in'
    }
  ];

  const faqs = [
    {
      q: 'Does AuraVisa Global guarantee visa approval?',
      a: 'No consultancy can or should guarantee visa issuance. Final visa adjudication is the exclusive statutory prerogative of the respective sovereign government\'s consular officers. AuraVisa focuses on thorough regulatory compliance, document consistency audits, and accurate application preparation.'
    },
    {
      q: 'Can international citizens apply for Indian e-Visas through this platform?',
      a: 'Yes. We assist foreign passport holders entering India for tourism, commercial conferences, business exploration, and medical treatments with documentation review against Bureau of Immigration rules.'
    },
    {
      q: 'What is the role of the AI Visa Assistant?',
      a: 'Our AI Assistant is grounded directly in verified government databases and official immigration portals. It helps applicants cross-reference criteria, check document checklists, and understand application stages in English, Hindi, and Gujarati.'
    },
    {
      q: 'How does 1-on-1 consultation booking work?',
      a: 'You can schedule a dedicated 45-minute virtual video or telephone consultation with our certified immigration case officers to review complex histories, previous refusals, or intricate travel ties.'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Immigration Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              AI-Powered Visa Guidance for Travelers Between India & the World.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Navigate visa requirements with confidence. We combine certified immigration expertise with verified official government data to guide applicants traveling from India worldwide, and welcoming the world to India.
            </p>

            {/* Travel Direction Switcher */}
            <div className="pt-2">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveDirection('india_to_world')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeDirection === 'india_to_world'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PlaneTakeoff className="w-4 h-4 text-blue-600" />
                  <span>Traveling from India to World</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDirection('world_to_india')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeDirection === 'world_to_india'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PlaneLanding className="w-4 h-4 text-blue-600" />
                  <span>Traveling from World to India</span>
                </button>
              </div>
            </div>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeDirection === 'india_to_world' ? 'Search country (e.g., United States, UK, Canada)' : 'Search Indian visa (e.g., Tourist, Business, Medical)'}
                  className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Visa Types</option>
                <option value="tourist">Tourist & Visitor</option>
                <option value="business">Business & Commercial</option>
                <option value="student">Student & Academic</option>
                <option value="medical">Medical Treatment</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Search Pathways
              </button>
            </form>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Official Sources Only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No Fake Approval Claims</span>
              </div>
            </div>

          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-16/9 lg:aspect-auto lg:h-[460px]">
              <img
                src="/src/assets/images/hero_immigration_office_1792940222891.jpg"
                alt="AuraVisa Global contemporary consultation office"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">Advisory Standards</div>
                  <div className="text-sm font-medium">Global Mobility Practice with Registered Immigration Advisors</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Programs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {activeDirection === 'india_to_world' ? 'Popular Outbound Destinations from India' : 'Popular Inbound e-Visa Programs for India'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Grounded in current official immigration rules and bilateral agreements.
            </p>
          </div>
          <Link
            to={`/visa-programs?direction=${activeDirection}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Explore All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-700">{prog.country}</span>
                  <span className="font-mono">{prog.code}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {prog.title}
                </h3>
                <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Stay Duration:</span>
                    <span className="font-medium text-slate-700">{prog.stay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Validity:</span>
                    <span className="font-medium text-slate-700">{prog.validity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Govt. Fee:</span>
                    <span className="font-medium text-slate-700 tabular-nums">{prog.fee}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[130px]">{prog.source}</span>
                <Link
                  to={`/visa-programs/${prog.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How Consultancy Works */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The AuraVisa Four-Step Verification Protocol
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Structured, methodical preparation designed to identify documentation gaps before submission to official consulates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-slate-200 rounded-xl p-6 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">01. PRE-SCREENING</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Automated Eligibility Audit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete our rule-grounded questionnaire to analyze passport validity, ties to home country, and preliminary criteria.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">02. DOCUMENTATION</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Evidence Vault & Checklists</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload bank statements, tax records, and employer NOC letters to your secure private document vault.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">03. ADVISOR REVIEW</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Consultant Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                An accredited case advisor performs a line-by-line review, verifies tie strength, and flags discrepancies.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 relative">
              <div className="text-xs font-mono font-bold text-blue-600 mb-2">04. INTERVIEW PREP</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Consular Alignment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive mock interview guidelines and instructions on biometrics appointments at official VFS or VAC centers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-full text-xs font-semibold text-blue-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Multilingual AI Intelligence</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ask Complex Visa Questions in English, Hindi, or Gujarati.
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Trained on verified immigration regulations from official government portals. Get grounded answers regarding DS-160, UK CAS documents, Schengen insurance thresholds, and Indian e-Visa eligibility.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                <span className="bg-white border border-slate-200 px-3 py-1 rounded text-slate-700 font-medium">English</span>
                <span className="bg-white border border-slate-200 px-3 py-1 rounded text-slate-700 font-medium">हिंदी (Hindi)</span>
                <span className="bg-white border border-slate-200 px-3 py-1 rounded text-slate-700 font-medium">ગુજરાતી (Gujarati)</span>
              </div>

              <div className="pt-4">
                <Link
                  to="/ai-assistant"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch AI Visa Assistant</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sample Queries</div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">
                &ldquo;What bank balance is needed for a 6-month UK Visitor Visa from India?&rdquo;
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">
                &ldquo;ભારતીય નાગરિક માટે યુએસ B1/B2 ઇન્ટરવ્યુ માટે કયા દસ્તાવેજો જરૂરી છે?&rdquo;
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">
                &ldquo;विदेशी नागरिकों के लिए भारत ई-टूरिस्ट वीजा की फीस और समय क्या है?&rdquo;
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Clear answers regarding our advisory practice and official regulations.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-2 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Begin Your International Journey Today
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Whether you are preparing an outbound application from India or planning your inbound visit to India, start with our preliminary eligibility evaluation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/eligibility"
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Check My Eligibility Free
            </Link>
            <Link
              to="/book-consultation"
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Book 1-on-1 Consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
