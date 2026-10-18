/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Upload,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { VerdictCard } from './components/VerdictCard';
import { RedFlagsSection } from './components/RedFlagsSection';
import { ActionStepsSection } from './components/ActionStepsSection';
import { LoadingScanner } from './components/LoadingScanner';
import { EmergencyBar } from './components/EmergencyBar';
import { HistoryModal } from './components/HistoryModal';
import { Language, ScamResult, ScanHistoryItem } from './types';
import { TRANSLATIONS } from './translations';
import { EXAMPLE_MESSAGES } from './examples';
import { analyzeScamMessage } from './services/gemini';

const STORAGE_KEY = 'scamcheck_india_history';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  // Input states
  const [inputText, setInputText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Analysis states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScamResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // History states
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = TRANSLATIONS[language];

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 15)));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Support pasting images directly from clipboard (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFileProcess(file);
          setActiveTab('image');
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // 4MB limit check
    if (file.size > 4 * 1024 * 1024) {
      const errorMsg =
        language === 'hi'
          ? 'स्क्रीनशॉट फ़ाइल 4MB से अधिक बड़ी है। कृपया 4MB से कम आकार की फ़ाइल अपलोड करें।'
          : language === 'mr'
          ? 'स्क्रीनशॉट फाइल 4MB पेक्षा मोठी आहे. कृपया 4MB पेक्षा कमी आकाराची फाइल अपलोड करा.'
          : 'Screenshot image is too large. Please upload an image under 4MB.';
      setError(errorMsg);
      return;
    }

    setError(null);
    setImageFileName(file.name);
    setSelectedMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedMimeType(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    setInputText('');
    handleClearImage();
    setResult(null);
    setError(null);
  };

  const handleSelectExample = (exampleText: string) => {
    setInputText(exampleText);
    setActiveTab('text');
    handleClearImage();
    setError(null);
    // Focus textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 50);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !selectedImage) {
      setError('Please paste a message or upload a screenshot to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const scanResult = await analyzeScamMessage({
        text: inputText.trim() || undefined,
        image: selectedImage || undefined,
        mimeType: selectedMimeType || undefined,
        language,
      });

      setResult(scanResult);

      // Save to history
      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        textSnippet:
          inputText.slice(0, 80) ||
          (imageFileName ? `Screenshot: ${imageFileName}` : 'Screenshot analysis'),
        hasImage: !!selectedImage,
        result: scanResult,
        language,
      };

      setHistory((prev) => [historyItem, ...prev.filter((i) => i.id !== historyItem.id)].slice(0, 15));

      // Scroll smoothly to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Scam analysis error:', err);
      // If the error message is specific (from server rate limiting, text length, or image size), show it
      const isSpecific =
        err.message &&
        !err.message.includes('fetch') &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError');

      const friendlyMessage = isSpecific
        ? err.message
        : language === 'hi'
        ? 'अभी संदेश की जांच नहीं हो सकी, कृपया पुनः प्रयास करें।'
        : language === 'mr'
        ? 'सध्या तपासणी करता आली नाही, कृपया पुन्हा प्रयत्न करा.'
        : "Couldn't analyze right now, please try again.";
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setResult(item.result);
    setLanguage(item.language);
    setError(null);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const isScamOrSuspicious =
    result?.verdictCategory === 'LIKELY_SCAM' ||
    result?.verdictCategory === 'SUSPICIOUS' ||
    (result ? result.riskScore >= 40 : false);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isLargeFont ? 'text-lg' : 'text-base'}`}>
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        isLargeFont={isLargeFont}
        onToggleLargeFont={() => setIsLargeFont((prev) => !prev)}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-5 sm:space-y-6 overflow-x-hidden">
        {/* Hero Section */}
        <div className="text-center space-y-1.5 pt-1 pb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
            <Lock className="w-3 h-3 text-amber-700 shrink-0" />
            <span>100% Free & Confidential Citizen Service</span>
          </div>
          <h1
            className={`font-black tracking-tight text-slate-900 leading-tight ${
              isLargeFont ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-3xl md:text-4xl'
            }`}
          >
            {t.appName}
          </h1>
          <p
            className={`text-slate-600 max-w-2xl mx-auto font-medium ${
              isLargeFont ? 'text-sm sm:text-lg' : 'text-xs sm:text-base'
            }`}
          >
            {t.subtitle}
          </p>
        </div>

        {/* Input Card Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-3.5 sm:p-6 md:p-7 space-y-4 sm:space-y-5 overflow-hidden">
          {/* Input Method Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl flex-1 max-w-xs sm:max-w-sm">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'text'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{t.tabText}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all relative ${
                  activeTab === 'image'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{t.tabImage}</span>
                {selectedImage && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-white" />
                )}
              </button>
            </div>

            {/* Clear Button if input exists */}
            {(inputText || selectedImage) && (
              <button
                type="button"
                onClick={handleClearAll}
                className="shrink-0 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title={t.clearBtn}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.clearBtn}</span>
              </button>
            )}
          </div>

          {/* Active Tab: Text Area */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label
                htmlFor="message-text"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                {t.tabText}
              </label>
              <textarea
                id="message-text"
                ref={textareaRef}
                rows={5}
                maxLength={3000}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.textPlaceholder}
                className={`w-full rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 p-4 font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-y ${
                  isLargeFont ? 'text-lg leading-relaxed' : 'text-base'
                }`}
              />
              <div className="flex justify-between items-center text-xs text-slate-400 px-1">
                <span>Supports SMS, WhatsApp forwards, Telegram texts, Emails</span>
                <span
                  className={
                    inputText.length >= 2900
                      ? 'text-red-600 font-bold'
                      : inputText.length >= 2500
                      ? 'text-amber-600 font-semibold'
                      : ''
                  }
                >
                  {inputText.length} / 3,000 characters
                </span>
              </div>
            </div>
          )}

          {/* Active Tab: Image Screenshot Upload */}
          {activeTab === 'image' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="screenshot-input"
              />

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileProcess(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base sm:text-lg mb-1">
                    {t.imageUploadPrompt}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-4 font-medium">
                    {t.imageUploadSub}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.imageUploadAction}</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-3">
                    Tip: You can also press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Ctrl + V</kbd> to paste a screenshot directly!
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-slate-200 p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-xs">
                      <img
                        src={selectedImage}
                        alt="Uploaded screenshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {imageFileName || 'Screenshot selected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Screenshot ready for Gemini visual scan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
                    >
                      Change File
                    </button>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t.removeImage}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Examples Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t.tryExampleTitle}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_MESSAGES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExample(ex.text)}
                  className="text-left p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all group flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                        {ex.title}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          ex.badgeType === 'danger'
                            ? 'bg-red-100 text-red-800'
                            : ex.badgeType === 'safe'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ex.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {ex.hint}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold leading-relaxed flex-1">
                {error}
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            onClick={handleAnalyze}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-white flex items-center justify-center gap-3 transition-all duration-200 shadow-lg active:scale-[0.99] ${
              isLoading || (!inputText.trim() && !selectedImage)
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 shadow-orange-500/25 ring-2 ring-orange-500/20'
            } ${isLargeFont ? 'text-xl' : 'text-lg'}`}
          >
            <ShieldAlert className="w-6 h-6" />
            <span>{isLoading ? t.analyzingBtn : t.analyzeBtn}</span>
          </button>
        </div>

        {/* Loading State Section */}
        {isLoading && <LoadingScanner language={language} />}

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="space-y-6 pt-2 scroll-mt-20">
            {/* 1. Large Color-Coded Verdict Card */}
            <VerdictCard
              result={result}
              language={language}
              isLargeFont={isLargeFont}
            />

            {/* 2. Red Flags Section */}
            <RedFlagsSection
              redFlags={result.redFlags}
              isScamOrSuspicious={isScamOrSuspicious}
              language={language}
              isLargeFont={isLargeFont}
            />

            {/* 3. Action Steps Section */}
            <ActionStepsSection
              actionSteps={result.actionSteps}
              elderlyTip={result.elderlyTip}
              isScamOrSuspicious={isScamOrSuspicious}
              language={language}
              isLargeFont={isLargeFont}
            />
          </div>
        )}

        {/* Official Indian Cyber Crime Helpline Bar */}
        <EmergencyBar language={language} />
      </main>

      {/* Footer Note */}
      <footer className="border-t border-slate-200 bg-white/80 py-6 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          {/* Exact required footer note */}
          <p className="text-sm font-bold text-slate-800">
            {t.footerDisclaimer}
          </p>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            ScamCheck India is an open public safety initiative powered by Gemini AI and aligned with national cybersecurity guidelines (CERT-In, Ministry of Home Affairs Cyber Crime Portal 1930).
          </p>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        language={language}
      />
    </div>
  );
}
