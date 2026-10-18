import React from 'react';
import { PhoneCall, ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface EmergencyBarProps {
  language: Language;
}

export const EmergencyBar: React.FC<EmergencyBarProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: 1930 Headline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-900/40 animate-pulse">
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white">
                Dial 1930
              </span>
              <span className="bg-red-500/20 text-red-300 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded border border-red-500/30">
                24x7 Citizen Cyber Helpline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 max-w-xl">
              {t.call1930Desc}
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <a
            href="tel:1930"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1930</span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-sm transition-all"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>cybercrime.gov.in</span>
          </a>

          <a
            href="https://sancharsaathi.gov.in/sfc/"
            target="_blank"
            rel="noopener noreferrer"
            title="Chakshu: Report fraudulent communications"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-xs transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Chakshu Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};
