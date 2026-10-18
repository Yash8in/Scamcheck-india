import { Language, ScamResult } from '../types';

export async function analyzeScamMessage(params: {
  text?: string;
  image?: string;
  mimeType?: string;
  language: Language;
}): Promise<ScamResult> {
  const { text, image, mimeType, language = 'en' } = params;

  if (!text?.trim() && !image) {
    throw new Error('Please provide message text or upload a screenshot.');
  }

  const response = await fetch('/api/check-scam', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text?.trim(),
      image,
      mimeType,
      language,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Server error occurred during analysis');
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to receive analysis data from server');
  }

  return json.data as ScamResult;
}
