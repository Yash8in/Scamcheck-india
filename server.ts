import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// Listen on process.env.PORT (fallback 3000) and bind to 0.0.0.0 for external hosts (Render, Cloud Run)
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

const getApiKey = () => {
  return process.env.GEMINI_API_KEY || '';
};

const getGenAIClient = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const scamAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      description: "Verdict must be one of: 'Likely Scam', 'Suspicious', or 'Looks Safe'",
    },
    verdictCategory: {
      type: Type.STRING,
      description: "Enum identifier: 'LIKELY_SCAM', 'SUSPICIOUS', or 'LOOKS_SAFE'",
    },
    verdictTitle: {
      type: Type.STRING,
      description: "Localized verdict heading in the requested language (e.g. 'Likely Scam' / 'धोकाधड़ी की प्रबल संभावना' / 'फसवणुकीची दाट शक्यता')",
    },
    riskScore: {
      type: Type.INTEGER,
      description: "Risk score integer from 0 to 100 (0 = completely safe, 100 = definite scam)",
    },
    scamType: {
      type: Type.STRING,
      description: "Classification of scam or message type in requested language (e.g. Fake Electricity Bill / डिजिटल अरेस्ट / बनावट केवायसी अपडेट / UPI Refund Fraud / Fake Part-time Job / Genuine Bank Alert)",
    },
    summary: {
      type: Type.STRING,
      description: "A 2 to 3 sentence explanation in the chosen language. Must be plain, simple, jargon-free, and easy for an elderly grandparent to understand.",
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific things in the message that are suspicious, each explained in one simple, clear sentence. If the message looks safe, highlight why it appears genuine.",
    },
    actionSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 clear, practical action steps in the chosen language. For any scam or suspicious message, include reporting to cyber crime helpline 1930 and cybercrime.gov.in.",
    },
    senderAnalysis: {
      type: Type.STRING,
      description: "Brief 1-sentence note analyzing the sender (e.g., standard 10-digit mobile number pretending to be official utility or bank vs legitimate alphanumeric header).",
    },
    elderlyTip: {
      type: Type.STRING,
      description: "One short, comforting golden rule for seniors (e.g. 'Remember: Real bank or electricity staff will never threaten you over SMS or demand payment to a personal number.').",
    },
  },
  required: [
    "verdict",
    "verdictCategory",
    "verdictTitle",
    "riskScore",
    "scamType",
    "summary",
    "redFlags",
    "actionSteps",
    "senderAnalysis",
    "elderlyTip",
  ],
};

// In-memory sliding window rate limiter: 20 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_TEXT_LENGTH = 3000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Clean up expired rate-limit records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now > record.resetTime) {
      ipRequestMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(retryAfter, 1) };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

app.post('/api/check-scam', async (req, res) => {
  try {
    const { text, image, mimeType, language = 'en' } = req.body;

    // 1. IP Rate Limiting (max 20 requests per minute)
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      res.setHeader('Retry-After', rateCheck.retryAfterSeconds.toString());
      const errorMsg =
        language === 'hi'
          ? 'बहुत सारे अनुरोध भेजे गए हैं। कृपया अगला संदेश जांचने से पहले एक मिनट प्रतीक्षा करें।'
          : language === 'mr'
          ? 'खूप जास्त विनंत्या पाठवल्या गेल्या आहेत. कृपया पुढील मेसेज तपासण्यापूर्वी एक मिनिट थांबा.'
          : 'Too many requests. Please wait a minute before checking another message.';
      return res.status(429).json({ error: errorMsg });
    }

    // 2. Input existence check
    if (!text && !image) {
      return res.status(400).json({ error: 'Please provide either text or an image to analyze.' });
    }

    // 3. Text length limit check (max 3,000 characters)
    if (text && typeof text === 'string' && text.length > MAX_TEXT_LENGTH) {
      const errorMsg =
        language === 'hi'
          ? `संदेश बहुत लंबा है (${text.length} अक्षर)। कृपया 3,000 अक्षरों से छोटा संदेश दर्ज करें।`
          : language === 'mr'
          ? `मेसेज खूप मोठा आहे (${text.length} अक्षरे). कृपया ३,००० अक्षरांपेक्षा लहान मेसेज टाका.`
          : `Message is too long (${text.length} characters). Please limit your message to 3,000 characters.`;
      return res.status(400).json({ error: errorMsg });
    }

    // 4. Screenshot size limit check (max 4MB)
    if (image && typeof image === 'string') {
      const cleanBase64 = image.includes('base64,') ? image.split('base64,')[1] : image;
      const estimatedBytes = Math.floor((cleanBase64.length * 3) / 4);

      if (estimatedBytes > MAX_IMAGE_BYTES) {
        const errorMsg =
          language === 'hi'
            ? 'स्क्रीनशॉट फ़ाइल 4MB से अधिक बड़ी है। कृपया 4MB से कम आकार की फ़ाइल अपलोड करें।'
            : language === 'mr'
            ? 'स्क्रीनशॉट फाइल 4MB पेक्षा मोठी आहे. कृपया 4MB पेक्षा कमी आकाराची फाइल अपलोड करा.'
            : 'Screenshot image is too large. Please upload an image under 4MB.';
        return res.status(400).json({ error: errorMsg });
      }
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please ensure the API key is set in AI Studio Secrets.',
      });
    }

    const ai = getGenAIClient();

    const languageInstructions: Record<string, string> = {
      en: "Respond completely in English. Keep tone respectful, protective, crystal clear, and easy for senior citizens.",
      hi: "पूरा विश्लेषण और सभी उत्तर सरल, शुद्ध और आदरपूर्ण हिन्दी में दें। वरिष्ठ नागरिकों और बुजुर्गों के समझने लायक आसान भाषा का प्रयोग करें।",
      mr: "संपूर्ण विश्लेषण आणि सर्व उत्तरे सोप्या, आदरयुक्त आणि स्पष्ट मराठीत द्या. घरातील ज्येष्ठ व्यक्तीला सहज समजेल अशा साध्या भाषेचा वापर करा.",
    };

    const targetLang = language in languageInstructions ? language : 'en';
    const langNote = languageInstructions[targetLang];

    const systemInstruction = `You are "ScamCheck India", an expert cybersecurity consultant and digital fraud investigator tailored specifically for Indian citizens, especially senior citizens and families.
Your mission is to inspect SMS messages, WhatsApp forwards, Telegram group texts, emails, and screenshots to detect cyber fraud and protect users from financial losses.

Key Indian scam patterns to look out for:
1. Fake Electricity Bill / Power cut: Threatens power will be cut tonight at 9:30 PM due to previous month bill. Directs victim to call an officer's personal 10-digit mobile number or install a QuickSupport / APK app.
2. Digital Arrest / Law Enforcement Impersonation: Claims to be Mumbai Police, Delhi Police, CBI, Narcotics Control Bureau (NCB), ED, or FedEx / DHL customs. Claims a parcel containing illegal passports/drugs in victim's name, threatening immediate arrest unless video call or 'security clearance deposit' is done.
3. Fake KYC / SIM Block / Bank Account Suspension: Messages claiming SBI, HDFC, ICICI, PNB, or Airtel/Jio KYC has expired and SIM will be deactivated unless a malicious link (e.g., bit.ly or apk download) is opened.
4. UPI Refund / Cash Prize / KBC Lottery: 'You have won ₹25,000 lottery' or '₹4,999 refund credited to PhonePe/GooglePay. Click to accept'. In reality, tapping the link requests a UPI PIN which debits money!
5. Fake Part-Time Job / YouTube Likes / Telegram Rating task: Promises ₹3,000-₹8,000/day for liking YouTube videos or booking hotels, asking for an initial security deposit of ₹500/₹1,000 to withdraw earnings.
6. APK Installation / Loan Apps: Sending .apk files (e.g. 'GovtSubsidy.apk', 'SBIUpdate.apk') disguised as apps.
7. Genuine Messages: Real bank debit/credit transactional SMS with official sender headers (e.g., VM-HDFCBK, AX-SBIINB) that do NOT ask for passwords, OTP, or clicking suspicious shortlinks.

Evaluation Rules:
- Verdict must be categorized as:
  - "Likely Scam" (High risk, score 80-100): Clear red flags, extortion, false urgency, asking for money/OTP/PIN/APK, personal phone number for official work.
  - "Suspicious" (Medium risk, score 40-79): Unverified sender, odd link, unconfirmed lottery/job, unprovoked contact.
  - "Looks Safe" (Low risk, score 0-39): Standard legitimate transactional alert, authentic notification without suspicious call-to-action.
- Red flags: Provide a list of specific suspicious indicators in the message, each stated in one clear, concise sentence.
- What to do now (actionSteps): Exactly 3 numbered steps.
  For scams/suspicious messages:
  Step 1: Do not click links, call the number, or enter any UPI PIN/OTP.
  Step 2: Dial national cyber crime helpline 1930 immediately or report on cybercrime.gov.in (and Chakshu portal at sancharsaathi.gov.in).
  Step 3: Block sender and, if any money or bank details were shared, call the bank's official helpline (number on back of ATM card) to freeze accounts.
- Tone: Highly empathetic, protective, empowering, and elder-friendly.
${langNote}`;

    const promptText = `Please analyze this message for Indian cyber fraud and scam indicators:
Message text:
${text || '(No text provided, see attached image screenshot)'}

Target Response Language: ${targetLang} (${targetLang === 'hi' ? 'Hindi' : targetLang === 'mr' ? 'Marathi' : 'English'}).`;

    const parts: any[] = [];

    if (image && mimeType) {
      const cleanBase64 = image.includes('base64,') ? image.split('base64,')[1] : image;
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: promptText,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: scamAnalysisSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error in /api/check-scam:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'An error occurred while analyzing the message.',
    });
  }
});

app.post('/api/speak', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for speech synthesis.' });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured.' });
    }

    const ai = getGenAIClient();
    const voiceName = language === 'hi' ? 'Puck' : 'Kore';

    const cleanText = text.slice(0, 350);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, gentle, slow, warm tone for elderly listener',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ success: true, audio: base64Audio, mimeType: 'audio/wav' });
    } else {
      return res.status(500).json({ success: false, error: 'Could not generate audio stream.' });
    }
  } catch (err: any) {
    console.warn('TTS error (will fallback to browser Web Speech API):', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Standard health check for Render and external monitoring
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// JSON API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'));

  if (isProduction || hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamCheck India server running on http://0.0.0.0:${PORT} [mode: ${isProduction || hasDist ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
