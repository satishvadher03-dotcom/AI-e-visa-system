import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">AuraVisa Global</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Empowering seamless international mobility between India and premier global destinations with verified regulatory guidance, ethical consultancy, and intelligent document preparation.
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>BKC Financial District, Bandra East, Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>advisory@auravisaglobal.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 22 6988 4000 (Mon - Sat, 09:30 - 18:30 IST)</span>
              </div>
            </div>
          </div>

          {/* Travel Directions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              India to World
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link to="/visa-programs?direction=india_to_world&category=tourist" className="hover:text-blue-600 transition-colors">US B1/B2 Visitor Visa</Link></li>
              <li><Link to="/visa-programs?direction=india_to_world&category=tourist" className="hover:text-blue-600 transition-colors">UK Standard Visitor Visa</Link></li>
              <li><Link to="/visa-programs?direction=india_to_world&category=tourist" className="hover:text-blue-600 transition-colors">Canada TRV Visitor Visa</Link></li>
              <li><Link to="/visa-programs?direction=india_to_world&category=tourist" className="hover:text-blue-600 transition-colors">Schengen Europe Uniform Visa</Link></li>
              <li><Link to="/visa-programs?direction=india_to_world&category=tourist" className="hover:text-blue-600 transition-colors">Australia Subclass 600 Visa</Link></li>
              <li><Link to="/visa-programs?direction=india_to_world" className="hover:text-blue-600 transition-colors">View All International Pathways &rarr;</Link></li>
            </ul>
          </div>

          {/* World to India */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              World to India
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link to="/visa-programs?direction=world_to_india&category=tourist" className="hover:text-blue-600 transition-colors">India e-Tourist Visa (30D / 1Y / 5Y)</Link></li>
              <li><Link to="/visa-programs?direction=world_to_india&category=business" className="hover:text-blue-600 transition-colors">India e-Business Visa (Commercial)</Link></li>
              <li><Link to="/visa-programs?direction=world_to_india&category=medical" className="hover:text-blue-600 transition-colors">India e-Medical Treatment Visa</Link></li>
              <li><Link to="/visa-programs?direction=world_to_india&category=student" className="hover:text-blue-600 transition-colors">India Academic Student Visa</Link></li>
              <li><Link to="/visa-programs?direction=world_to_india" className="hover:text-blue-600 transition-colors">Inbound Entry Guidelines &rarr;</Link></li>
            </ul>
          </div>

          {/* Quick Links & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Advisory & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link to="/eligibility" className="hover:text-blue-600 transition-colors">Eligibility Assessment</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-blue-600 transition-colors">AI Visa Assistant</Link></li>
              <li><Link to="/book-consultation" className="hover:text-blue-600 transition-colors">Book 1-on-1 Consultation</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Enquiry & Case Office</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy & Data Governance</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Advisory Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-500 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-700">Official Immigration & Consular Disclaimer:</p>
                <p>
                  AuraVisa Global is a private, independent legal and visa documentation consultancy. We are not a government agency, embassy, or consulate, nor are we affiliated with the U.S. Department of State, UK Visas and Immigration (UKVI), IRCC Canada, or the Bureau of Immigration (Government of India). We provide advisory assistance and document compilation support. No consultancy can guarantee visa approval. Final visa issuance or entry denial is subject to the exclusive statutory discretion of consular officers at the port of entry.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} AuraVisa Global Advisory Private Limited. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-slate-600">Terms of Use</Link>
              <span>·</span>
              <span className="tabular-nums">ISO 27001 Data Certified Standards</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
