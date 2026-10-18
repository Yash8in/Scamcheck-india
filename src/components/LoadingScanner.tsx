import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Database, Lock, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface LoadingScannerProps {
  language: Language;
}

export const LoadingScanner: React.FC<LoadingScannerProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = t.loadingSteps;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-200/80 p-6 sm:p-8 shadow-lg shadow-amber-500/5 text-center my-6 relative overflow-hidden">
      {/* Background glowing sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-amber-200 animate-pulse">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          {t.analyzingBtn}
        </h3>

        {/* Dynamic step status */}
        <div className="h-12 flex items-center justify-center px-4">
          <p className="text-sm sm:text-base font-semibold text-amber-800 transition-all duration-300">
            {steps[currentStepIndex]}
          </p>
        </div>

        {/* Progress dots & bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 my-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Reassuring notes */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Zero Data Storage
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            1930 Cyber Cell Rules
          </span>
        </div>
      </div>
    </div>
  );
};
