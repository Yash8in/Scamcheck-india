import React from 'react';
import { X, Trash2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { ScanHistoryItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectHistoryItem: (item: ScanHistoryItem) => void;
  onClearHistory: () => void;
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  language,
}) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {t.historyTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">{t.historyEmpty}</p>
            </div>
          ) : (
            history.map((item) => {
              const isScam = item.result.riskScore >= 75;
              const isSuspicious = item.result.riskScore >= 40 && item.result.riskScore < 75;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all bg-slate-50/50 hover:bg-white flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isScam
                            ? 'bg-red-100 text-red-800'
                            : isSuspicious
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.result.verdictTitle || item.result.verdict} ({item.result.riskScore}%)
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {item.result.scamType}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.textSnippet}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              {history.length} scans saved locally
            </span>
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.clearHistory}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
