import React from 'react';
import {
  ListChecks,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ActionStepsSectionProps {
  actionSteps: string[];
  elderlyTip?: string;
  isScamOrSuspicious: boolean;
  language: Language;
  isLargeFont: boolean;
}

export const ActionStepsSection: React.FC<ActionStepsSectionProps> = ({
  actionSteps,
  elderlyTip,
  isScamOrSuspicious,
  language,
  isLargeFont,
}) => {
  const t = TRANSLATIONS[language];

  if (!actionSteps || actionSteps.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* 3 Action Steps Card */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`font-bold text-slate-900 ${
                isLargeFont ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
              }`}
            >
              {t.actionStepsTitle}
            </h3>
          </div>
        </div>

        <div className="space-y-3.5">
          {actionSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-sm text-sm">
                {idx + 1}
              </div>
              <div className="space-y-2 flex-1">
                <p
                  className={`font-semibold text-slate-800 leading-relaxed ${
                    isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                  }`}
                >
                  {step}
                </p>

                {/* If this is Step 2 and involves helpline 1930 / cybercrime, render quick action buttons */}
                {isScamOrSuspicious && idx === 1 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href="tel:1930"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      {t.call1930}
                    </a>
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      cybercrime.gov.in
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Elderly Golden Rule Banner */}
      {elderlyTip && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
              {t.elderlyRuleTitle}
            </span>
            <p
              className={`font-bold text-amber-950 mt-1 leading-snug ${
                isLargeFont ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}
            >
              {elderlyTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
