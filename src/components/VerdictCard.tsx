import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Shield,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { ScamResult, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface VerdictCardProps {
  result: ScamResult;
  language: Language;
  isLargeFont: boolean;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  result,
  language,
  isLargeFont,
}) => {
  const t = TRANSLATIONS[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const isScam =
    result.verdictCategory === 'LIKELY_SCAM' ||
    result.verdict.toLowerCase().includes('scam') ||
    result.riskScore >= 75;

  const isSuspicious =
    result.verdictCategory === 'SUSPICIOUS' ||
    (result.verdict.toLowerCase().includes('suspicious') && !isScam) ||
    (result.riskScore >= 40 && result.riskScore < 75);

  const isSafe = !isScam && !isSuspicious;

  // Visual theming based on verdict
  const theme = isScam
    ? {
        bgGradient: 'from-red-600 via-red-700 to-rose-800',
        badgeBg: 'bg-red-950/40 text-red-100 border-red-400/40',
        gaugeColor: 'text-red-300',
        barColor: 'bg-red-400',
        icon: <AlertOctagon className="w-12 h-12 text-white animate-bounce" />,
        shadow: 'shadow-2xl shadow-red-600/30 ring-4 ring-red-400/30',
        headlineClass: 'text-white',
        cardBorder: 'border-red-500',
      }
    : isSuspicious
    ? {
        bgGradient: 'from-amber-600 via-amber-700 to-orange-800',
        badgeBg: 'bg-amber-950/40 text-amber-100 border-amber-300/40',
        gaugeColor: 'text-amber-200',
        barColor: 'bg-amber-400',
        icon: <AlertTriangle className="w-12 h-12 text-white animate-pulse" />,
        shadow: 'shadow-xl shadow-amber-600/25 ring-4 ring-amber-400/30',
        headlineClass: 'text-white',
        cardBorder: 'border-amber-500',
      }
    : {
        bgGradient: 'from-emerald-600 via-emerald-700 to-teal-800',
        badgeBg: 'bg-emerald-950/40 text-emerald-100 border-emerald-300/40',
        gaugeColor: 'text-emerald-200',
        barColor: 'bg-emerald-400',
        icon: <CheckCircle2 className="w-12 h-12 text-white" />,
        shadow: 'shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-400/30',
        headlineClass: 'text-white',
        cardBorder: 'border-emerald-500',
      };

  // Text-to-speech handler (instant, offline-capable browser speech synthesis)
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    const speechText = `${result.verdictTitle || result.verdict}. ${result.scamType}. ${result.summary}. ${result.actionSteps.join('. ')}`;
    fallbackSpeech(speechText);
  };

  const fallbackSpeech = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9; // Slightly slower for elderly comprehension
    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const alertEmoji = isScam ? '🚨' : isSuspicious ? '⚠️' : '✅';
    const message = `${alertEmoji} *ScamCheck India Alert* ${alertEmoji}
*Verdict:* ${result.verdictTitle || result.verdict} (Risk: ${result.riskScore}/100)
*Type:* ${result.scamType}

*Summary:* ${result.summary}

*Immediate Action:*
1. ${result.actionSteps[0] || 'Do not click links or share OTP'}
2. Report immediately to Cyber Crime Helpline 1930 / cybercrime.gov.in

_Checked via ScamCheck India. Never share OTP or UPI PIN!_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Copy result text
  const handleCopy = () => {
    const textToCopy = `ScamCheck India Result:
Verdict: ${result.verdictTitle || result.verdict} (Score: ${result.riskScore}/100)
Category: ${result.scamType}
Summary: ${result.summary}
Action Steps:
${result.actionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
Cyber Helpline: Dial 1930`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl bg-gradient-to-br ${theme.bgGradient} p-4 sm:p-7 text-white ${theme.shadow} transition-all duration-300 relative overflow-hidden`}
    >
      {/* Decorative watermark */}
      <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
        <Shield className="w-64 h-64 text-white" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
        {/* Header row: Icon + Verdict Title + Scam Type */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 sm:p-3 bg-white/15 backdrop-blur-md rounded-2xl ring-2 ring-white/20 shadow-inner shrink-0">
              {theme.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${theme.badgeBg}`}
                >
                  {result.scamType}
                </span>
              </div>
              <h2
                className={`font-black tracking-tight mt-1 leading-tight ${
                  isLargeFont ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl md:text-3xl'
                }`}
              >
                {result.verdictTitle || result.verdict}
              </h2>
            </div>
          </div>

          {/* Risk Score Circle Gauge */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-3.5 py-2 sm:px-4 sm:py-3 flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-center">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider font-bold text-white/80 block">
                {t.riskScoreTitle}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                {result.riskScore}
                <span className="text-sm font-bold text-white/70">/100</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center font-extrabold text-sm relative">
              <div
                className={`absolute inset-0 rounded-full border-4 ${
                  isScam
                    ? 'border-red-300 border-t-white'
                    : isSuspicious
                    ? 'border-amber-300 border-t-white'
                    : 'border-emerald-300 border-t-white'
                }`}
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                }}
              />
              <span className="text-xs">{result.riskScore}%</span>
            </div>
          </div>
        </div>

        {/* Plain Language Summary (Elder-friendly) */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
          <p
            className={`font-medium leading-relaxed text-white/95 ${
              isLargeFont ? 'text-lg sm:text-xl font-semibold' : 'text-base sm:text-lg'
            }`}
          >
            {result.summary}
          </p>
        </div>

        {/* Sender Analysis Note */}
        {result.senderAnalysis && (
          <div className="text-xs sm:text-sm text-white/90 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10 flex items-center gap-2">
            <span className="font-bold text-white uppercase text-[11px] tracking-wider px-2 py-0.5 rounded bg-white/20">
              {t.senderAnalysisTitle}
            </span>
            <span className="font-medium">{result.senderAnalysis}</span>
          </div>
        )}

        {/* Interactive Action Bar: TTS Audio + WhatsApp Share + Copy */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {/* Audio read-aloud button */}
          <button
            type="button"
            onClick={handlePlayAudio}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
              isPlayingAudio
                ? 'bg-white text-slate-900 ring-2 ring-white animate-pulse'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-red-600" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{t.listenVerdict}</span>
              </>
            )}
          </button>

          {/* Share on WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.whatsappShareBtn}</span>
          </button>

          {/* Copy Result */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{t.copiedTooltip}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copySummaryBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
