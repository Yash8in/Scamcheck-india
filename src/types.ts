export type Language = 'en' | 'hi' | 'mr';

export type VerdictCategory = 'LIKELY_SCAM' | 'SUSPICIOUS' | 'LOOKS_SAFE';

export interface ScamResult {
  verdict: 'Likely Scam' | 'Suspicious' | 'Looks Safe' | string;
  verdictCategory: VerdictCategory;
  verdictTitle: string;
  riskScore: number;
  scamType: string;
  summary: string;
  redFlags: string[];
  actionSteps: string[];
  senderAnalysis: string;
  elderlyTip: string;
}

export interface ExampleMessage {
  id: string;
  title: string;
  badge: string;
  badgeType: 'danger' | 'warning' | 'safe';
  text: string;
  hint: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  textSnippet: string;
  hasImage: boolean;
  result: ScamResult;
  language: Language;
}
