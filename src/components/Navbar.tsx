import React from 'react';
import { ShieldAlert, History, Type } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isLargeFont: boolean;
  onToggleLargeFont: () => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  isLargeFont,
  onToggleLargeFont,
  historyCount,
  onOpenHistory,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Tricolor safety stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-amber-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-2.5 sm:py-3 space-y-2.5">
        {/* Row 1: Logo, Brand & Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 text-white flex items-center justify-center shadow-md shadow-red-200 ring-2 ring-red-100 shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl leading-none">
                  ScamCheck
                </span>
                {/* Full badge on larger screens, simple emoji flag on small mobile */}
                <span className="hidden sm:inline-block bg-red-100 text-red-800 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase border border-red-200 shrink-0">
                  India 🇮🇳
                </span>
                <span className="sm:hidden text-xs shrink-0" title="India">
                  🇮🇳
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5 truncate max-w-[200px] sm:max-w-none">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Action Controls: Aa size toggle & History */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Senior / Large Font Toggle */}
            <button
              type="button"
              onClick={onToggleLargeFont}
              title={isLargeFont ? t.normalFont : t.largeFont}
              aria-label={isLargeFont ? t.normalFont : t.largeFont}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isLargeFont
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{isLargeFont ? 'Aa+' : 'Aa'}</span>
            </button>

            {/* History Button */}
            {historyCount > 0 && (
              <button
                type="button"
                onClick={onOpenHistory}
                title={t.historyTitle}
                className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                <History className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {historyCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Full-Width Language Switcher (EN / हिन्दी / मराठी) - Always Visible */}
        <div className="w-full">
          <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-full text-center">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('mr')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                language === 'mr'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
