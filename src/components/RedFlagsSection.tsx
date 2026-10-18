import React from 'react';
import { AlertTriangle, CheckCircle, Flag } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface RedFlagsSectionProps {
  redFlags: string[];
  isScamOrSuspicious: boolean;
  language: Language;
  isLargeFont: boolean;
}

export const RedFlagsSection: React.FC<RedFlagsSectionProps> = ({
  redFlags,
  isScamOrSuspicious,
  language,
  isLargeFont,
}) => {
  const t = TRANSLATIONS[language];

  if (!redFlags || redFlags.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isScamOrSuspicious
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isScamOrSuspicious ? (
            <Flag className="w-4 h-4 fill-current" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
        </div>
        <h3
          className={`font-bold text-slate-900 ${
            isLargeFont ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
          }`}
        >
          {t.redFlagsTitle}
        </h3>
      </div>

      <div className="space-y-3">
        {redFlags.map((flag, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
              isScamOrSuspicious
                ? 'bg-rose-50/70 border-rose-200/80 text-rose-950'
                : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${
                isScamOrSuspicious
                  ? 'bg-red-200 text-red-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}
            >
              {idx + 1}
            </div>
            <p
              className={`font-medium leading-relaxed ${
                isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}
            >
              {flag}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
