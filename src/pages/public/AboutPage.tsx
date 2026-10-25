import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Award, Globe, Users, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Independent Advisory Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Ethical, Truthful Visa Documentation for Modern International Mobility.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          AuraVisa Global was founded with a singular purpose: to replace misinformation and predatory visa guarantees with transparent, rule-grounded immigration consultancy. We treat legal compliance as an exact discipline.
        </p>
      </div>

      {/* Core Principles Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <Scale className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Zero-False-Guarantee Pledge</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consular officers operate with statutory discretion. We will never promise guaranteed visa issuance, forged invitation sponsorships, or manipulated financial statements. Our work is to prepare authentic, bulletproof evidence.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <Globe className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Verified Consular Citations</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every visa requirement, statutory fee, and processing window in our platform links directly to the official immigration department of the destination country, maintained with active audit timestamps.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Bilateral Mobility Focus</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We are dedicated to both corridors: Indian professionals, students, and families venturing across the globe, and international travelers, executives, and patients arriving in India.
          </p>
        </div>

      </div>

      {/* Practice Areas Split */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 lg:p-10 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Our Advisory Practice Areas</h2>
          <p className="text-xs text-slate-500 mt-1">Specialized documentation workflows tailored to consular standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">1. Outbound Mobility (India &rarr; Global)</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>US Non-Immigrant Visas (B-1/B-2, F-1 Student, L-1 Intra-company)</li>
              <li>UK Standard Visitor & Student CAS Verification (UKVI)</li>
              <li>Canada Temporary Resident Visas & Study Permits (IRCC)</li>
              <li>Schengen Member States (Germany, France, Switzerland, Netherlands)</li>
              <li>Australia Visitor Subclass 600 & Student Subclass 500</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">2. Inbound Mobility (World &rarr; India)</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>India Electronic Travel Authorization (e-Tourist 30D / 1Y / 5Y)</li>
              <li>Commercial e-Business Visas for Trade & Vendor Inspections</li>
              <li>Specialized Medical Treatment & Medical Attendant Visas</li>
              <li>Academic Student Visas for Indian Universities</li>
              <li>FRRO Legal Compliance & Stay Extension Advisory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">Need specific guidance on your upcoming travel?</h3>
          <p className="text-xs text-slate-500 mt-0.5">Consult with an accredited advisor or try our interactive pre-screener.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/eligibility"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Check Eligibility
          </Link>
          <Link
            to="/book-consultation"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Book Consultation
          </Link>
        </div>
      </div>

    </div>
  );
};
