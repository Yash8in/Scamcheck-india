import { Language } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  subtitle: string;
  largeFont: string;
  normalFont: string;
  languageSelect: string;
  tabText: string;
  tabImage: string;
  textPlaceholder: string;
  imageUploadPrompt: string;
  imageUploadSub: string;
  imageUploadAction: string;
  removeImage: string;
  analyzeBtn: string;
  analyzingBtn: string;
  clearBtn: string;
  tryExampleTitle: string;
  verdictSectionTitle: string;
  riskScoreTitle: string;
  scamCategoryTitle: string;
  redFlagsTitle: string;
  actionStepsTitle: string;
  elderlyRuleTitle: string;
  senderAnalysisTitle: string;
  listenVerdict: string;
  stopAudio: string;
  audioPlaying: string;
  whatsappShareBtn: string;
  copySummaryBtn: string;
  copiedTooltip: string;
  emergencyHelplineTitle: string;
  call1930: string;
  call1930Desc: string;
  portalLinkText: string;
  chakshuLinkText: string;
  footerDisclaimer: string;
  historyTitle: string;
  historyEmpty: string;
  clearHistory: string;
  errorGeneric: string;
  elderlyModeBadge: string;
  loadingSteps: string[];
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'ScamCheck India',
    tagline: 'Instant Fraud & Scam Detector',
    subtitle: 'Protect yourself & your family from SMS, WhatsApp, and banking fraud in India.',
    largeFont: 'Larger Text (Senior Friendly)',
    normalFont: 'Normal Text',
    languageSelect: 'Response Language',
    tabText: 'Paste Message',
    tabImage: 'Upload Screenshot',
    textPlaceholder: 'Paste suspicious SMS, WhatsApp forward, bank warning, or email here...\n\nExample: "Dear customer your electricity power will be disconnected tonight at 9:30 PM..."',
    imageUploadPrompt: 'Upload or drop a screenshot of the message',
    imageUploadSub: 'Takes PNG, JPG, or mobile screenshot (Max 4MB)',
    imageUploadAction: 'Choose Screenshot File',
    removeImage: 'Remove screenshot',
    analyzeBtn: 'Check Message Now',
    analyzingBtn: 'Scanning with Gemini AI...',
    clearBtn: 'Clear',
    tryExampleTitle: 'Try a real example:',
    verdictSectionTitle: 'Verification Result',
    riskScoreTitle: 'Scam Risk Score',
    scamCategoryTitle: 'Detected Pattern',
    redFlagsTitle: 'Suspicious Red Flags Found',
    actionStepsTitle: 'What You Must Do Now (3 Clear Steps)',
    elderlyRuleTitle: 'Golden Safety Rule',
    senderAnalysisTitle: 'Sender Analysis',
    listenVerdict: 'Listen to Result (Audio)',
    stopAudio: 'Stop Audio',
    audioPlaying: 'Reading aloud...',
    whatsappShareBtn: 'Warn Family on WhatsApp',
    copySummaryBtn: 'Copy Result',
    copiedTooltip: 'Copied to clipboard!',
    emergencyHelplineTitle: 'Official Indian Cyber Crime Helplines',
    call1930: 'Dial 1930 (Toll Free)',
    call1930Desc: 'Citizen Financial Cyber Fraud Helpline (Immediate help within 24 hours)',
    portalLinkText: 'National Cyber Crime Portal (cybercrime.gov.in)',
    chakshuLinkText: 'Report Fraud Number on Chakshu (Sanchar Saathi)',
    footerDisclaimer: 'This is guidance, not a guarantee. Never share OTP, PIN, or passwords with anyone.',
    historyTitle: 'Recent Scans',
    historyEmpty: 'No previous scans found on this device.',
    clearHistory: 'Clear History',
    errorGeneric: 'Unable to analyze message. Please check internet connection or retry.',
    elderlyModeBadge: 'Senior Mode Active',
    loadingSteps: [
      'Scanning message text & sender identity...',
      'Matching against Indian fraud types (KYC, UPI, Digital Arrest, Power bill)...',
      'Evaluating suspicious keywords & malicious links...',
      'Formulating simple safety instructions in your language...',
    ],
  },
  hi: {
    appName: 'स्कैमचेक इंडिया',
    tagline: 'संदिग्ध संदेश और धोखाधड़ी जांच केंद्र',
    subtitle: 'एसएमएस, वॉट्सऐप और बैंकिंग संदेशों में धोखाधड़ी की तुरंत जांच करें। वरिष्ठ नागरिकों के लिए विशेष सुरक्षित सुविधा।',
    largeFont: 'बड़ा फ़ॉन्ट (बुजुर्गों के लिए)',
    normalFont: 'सामान्य फ़ॉन्ट',
    languageSelect: 'उत्तर की भाषा',
    tabText: 'संदेश पेस्ट करें',
    tabImage: 'स्क्रीनशॉट अपलोड करें',
    textPlaceholder: 'संदिग्ध एसएमएस, वॉट्सऐप मैसेज या ईमेल यहाँ पेस्ट करें...\n\nउदाहरण: "प्रिय ग्राहक आपके बिजली बिल का भुगतान न होने से आज रात बिजली काट दी जाएगी..."',
    imageUploadPrompt: 'मैसेज का स्क्रीनशॉट यहाँ अपलोड करें',
    imageUploadSub: 'गैलरी से फोटो या स्क्रीनशॉट चुनें (अधिकतम 4MB)',
    imageUploadAction: 'स्क्रीनशॉट चुनें',
    removeImage: 'स्क्रीनशॉट हटाएं',
    analyzeBtn: 'संदेश की जांच करें',
    analyzingBtn: 'सुरक्षा जांच जारी है...',
    clearBtn: 'साफ़ करें',
    tryExampleTitle: 'एक नमूना आज़माकर देखें:',
    verdictSectionTitle: 'जांच का परिणाम',
    riskScoreTitle: 'धोखाधड़ी का जोखिम स्कोर',
    scamCategoryTitle: 'धोखाधड़ी का प्रकार',
    redFlagsTitle: 'संदिग्ध खतरे के संकेत (Red Flags)',
    actionStepsTitle: 'अब आपको क्या करना चाहिए (3 जरूरी कदम)',
    elderlyRuleTitle: 'सुरक्षा का स्वर्णिम नियम',
    senderAnalysisTitle: 'भेजने वाले का विश्लेषण',
    listenVerdict: 'परिणाम सुनें (आवाज़ में)',
    stopAudio: 'आवाज़ बंद करें',
    audioPlaying: 'आवाज़ सुनाई दे रही है...',
    whatsappShareBtn: 'वॉट्सऐप पर परिवार को सचेत करें',
    copySummaryBtn: 'परिणाम कॉपी करें',
    copiedTooltip: 'कॉपी हो गया!',
    emergencyHelplineTitle: 'भारत सरकार की आधिकारिक साइबर अपराध हेल्पलाइन',
    call1930: '1930 पर कॉल करें (निःशुल्क)',
    call1930Desc: 'नागरिक वित्तीय साइबर अपराध हेल्पलाइन (पैसा कटने पर तुरंत 1930 मिलाएं)',
    portalLinkText: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल (cybercrime.gov.in)',
    chakshuLinkText: 'चक्षु पोर्टल पर फर्जी नंबर की रिपोर्ट करें (संचार साथी)',
    footerDisclaimer: 'यह केवल मार्गदर्शन है, कोई गारंटी नहीं। अपना ओटीपी (OTP), यूपीआई पिन या पासवर्ड किसी से भी साझा न करें।',
    historyTitle: 'हाल की जांचें',
    historyEmpty: 'इस डिवाइस पर कोई पिछली जांच मौजूद नहीं है।',
    clearHistory: 'इतिहास मिटाएं',
    errorGeneric: 'संदेश की जांच नहीं हो सकी। कृपया इंटरनेट जांचें या पुनः प्रयास करें।',
    elderlyModeBadge: 'वरिष्ठ नागरिक मोड चालू',
    loadingSteps: [
      'संदेश और भेजने वाले की पहचान पढ़ी जा रही है...',
      'भारत में प्रचलित फर्जीवाड़ों (केवायसी, यूपीआई, डिजिटल अरेस्ट) से मिलान...',
      'संदिग्ध लिंक और गलत नंबरों की पड़ताल की जा रही है...',
      'सरल और स्पष्ट सलाह तैयार की जा रही है...',
    ],
  },
  mr: {
    appName: 'स्कॅमचेक इंडिया',
    tagline: 'संशयास्पद मेसेज व फसवणूक तपासणी केंद्र',
    subtitle: 'एसएमएस, व्हॉट्सअ‍ॅप व बँकेच्या मेसेजमधील फसवणूक त्वरित तपासा. ज्येष्ठ नागरिकांसाठी अतिशय सोपे व सुरक्षित.',
    largeFont: 'मोठे अक्षरे (ज्येष्ठांसाठी)',
    normalFont: 'सामान्य अक्षरे',
    languageSelect: 'उत्तराची भाषा',
    tabText: 'मेसेज पेस्ट करा',
    tabImage: 'स्क्रीनशॉट अपलोड करा',
    textPlaceholder: 'संशयास्पद एसएमएस, व्हॉट्सअ‍ॅप मेसेज किंवा ईमेल येथे पेस्ट करा...\n\nउदा: "ग्राहक महोदय, मागील महिन्याचे वीज बिल न भरल्यामुळे आज रात्री ९:३० वाजता वीज खंडित केली जाईल..."',
    imageUploadPrompt: 'मेसेजचा स्क्रीनशॉट येथे अपलोड करा',
    imageUploadSub: 'गॅलरीतून फोटो किंवा स्क्रीनशॉट निवडा (कमाल 4MB)',
    imageUploadAction: 'स्क्रीनशॉट निवडा',
    removeImage: 'स्क्रीनशॉट काढा',
    analyzeBtn: 'मेसेजची तपासणी करा',
    analyzingBtn: 'सुरक्षा तपासणी सुरू आहे...',
    clearBtn: 'साफ करा',
    tryExampleTitle: 'एक उदाहरण तपासून पहा:',
    verdictSectionTitle: 'तपासणीचा निकाल',
    riskScoreTitle: 'फसवणुकीचा धोका स्कोअर',
    scamCategoryTitle: 'फसवणुकीचा प्रकार',
    redFlagsTitle: 'संशयास्पद बाबी व धोके (Red Flags)',
    actionStepsTitle: 'आता आपण काय करावे (३ स्पष्ट उपाय)',
    elderlyRuleTitle: 'सुरक्षेचा सुवर्ण नियम',
    senderAnalysisTitle: 'पाठवणाऱ्याचा तपशील',
    listenVerdict: 'निकाल ऐका (आवाज)',
    stopAudio: 'आवाज थांबवा',
    audioPlaying: 'वाचून दाखवत आहे...',
    whatsappShareBtn: 'व्हॉट्सअ‍ॅपवर कुटुंबाला सावध करा',
    copySummaryBtn: 'निकाल कॉपी करा',
    copiedTooltip: 'कॉपी झाले!',
    emergencyHelplineTitle: 'भारत सरकारची अधिकृत सायबर गुन्हे हेल्पलाईन',
    call1930: '१९३० वर कॉल करा (टोल फ्री)',
    call1930Desc: 'नागरिक आर्थिक सायबर फसवणूक हेल्पलाईन (पैसे कापले गेल्यास त्वरित १९३० डायल करा)',
    portalLinkText: 'राष्ट्रीय सायबर क्राईम पोर्टल (cybercrime.gov.in)',
    chakshuLinkText: 'चक्षू पोर्टलवर संशयास्पद नंबरची तक्रार करा (संचार साथी)',
    footerDisclaimer: 'हे केवळ मार्गदर्शन आहे, हमी नाही. आपला ओटीपी (OTP), यूपीआय पिन किंवा पासवर्ड कोणालाही सांगू नका.',
    historyTitle: 'मागील तपासण्या',
    historyEmpty: 'या डिव्हाइसवर आधीची कोणतीही तपासणी उपलब्ध नाही.',
    clearHistory: 'इतिहास साफ करा',
    errorGeneric: 'मेसेज तपासता आला नाही. कृपया इंटरनेट तपासा किंवा पुन्हा प्रयत्न करा.',
    elderlyModeBadge: 'ज्येष्ठ नागरिक मोड सुरू',
    loadingSteps: [
      'मेसेज व पाठवणाऱ्याचा मोबाईल नंबर तपासला जात आहे...',
      'भारतातील सायबर फसवणुकीच्या (वीज बिल, डिजिटल अरेस्ट, केवायसी) प्रकारांशी पडताळणी...',
      'संशयास्पद लिंक्स व दबावाची भाषा तपासली जात आहे...',
      'सोप्या मराठीत सुरक्षित राहण्याचे उपाय तयार केले जात आहेत...',
    ],
  },
};
