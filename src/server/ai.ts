import { GoogleGenAI } from '@google/genai';
import { db } from './db.ts';

// Server-side initialization following @google/genai guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface AIChatRequest {
  message: string;
  language?: 'en' | 'hi' | 'gu';
  travelDirection?: 'india_to_world' | 'world_to_india';
  destinationCountry?: string;
  visaCategory?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AIChatResponse {
  reply: string;
  language: 'en' | 'hi' | 'gu';
  sources: Array<{
    title: string;
    url: string;
    lastVerified: string;
  }>;
  disclaimer: string;
}

// Simple in-memory rate limiting: IP / Session key -> request timestamps
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests = 15, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) || []).filter(ts => now - ts < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return true;
}

export async function generateVisaGuidance(
  req: AIChatRequest,
  clientKey = 'default_user'
): Promise<AIChatResponse> {
  const language = req.language || 'en';
  
  // Rate limiting check
  if (!checkRateLimit(clientKey)) {
    throw new Error('Rate limit exceeded: Please wait a moment before sending another message.');
  }

  // Input length safeguard
  if (!req.message || req.message.trim().length === 0) {
    throw new Error('Message cannot be empty.');
  }
  if (req.message.length > 2000) {
    throw new Error('Message is too long. Please restrict inquiries to under 2000 characters.');
  }

  // Sanitize input to strip apparent sensitive credentials like 8-9 character passport patterns
  const sanitizedMessage = req.message
    .replace(/\b[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]\b/g, '[REDACTED_PASSPORT_NUMBER]')
    .replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, '[REDACTED_AADHAAR_NUMBER]');

  // Retrieve matching knowledge base records from verified database
  const matchingPrograms = db.visaPrograms.filter(vp => {
    if (req.destinationCountry && vp.country.toLowerCase().includes(req.destinationCountry.toLowerCase())) {
      return true;
    }
    if (req.travelDirection && vp.direction === req.travelDirection) {
      return true;
    }
    return false;
  }).slice(0, 4);

  // If no direct country filter, include popular ones
  const activePrograms = matchingPrograms.length > 0 ? matchingPrograms : db.visaPrograms.slice(0, 4);

  const verifiedSources = activePrograms.map(p => ({
    title: `${p.name} - ${p.officialSourceName}`,
    url: p.officialSourceUrl,
    lastVerified: p.lastVerifiedDate
  }));

  const knowledgeContext = activePrograms.map(p => `
Program: ${p.name} (${p.country})
Direction: ${p.direction}
Stay Duration: ${p.stayDuration}
Validity: ${p.validity}
Processing Time: ${p.processingTime}
Official Fee: ${p.approxGovFee}
Source: ${p.officialSourceName} (${p.officialSourceUrl}) [Verified: ${p.lastVerifiedDate}]
Eligibility Criteria: ${p.eligibilityCriteria.join('; ')}
Required Documents: ${p.requiredDocuments.join('; ')}
Key Guidelines: ${p.keyTips.join('; ')}
  `).join('\n---\n');

  const disclaimer = language === 'hi'
    ? 'महत्वपूर्ण अस्वीकरण: यह मार्गदर्शन केवल सामान्य जानकारी के लिए है और आधिकारिक आव्रजन सलाह या वीजा गारंटी का गठन नहीं करता है। हमेशा आधिकारिक सरकारी पोर्टलों के साथ विवरण सत्यापित करें।'
    : language === 'gu'
    ? 'મહત્વપૂર્ણ ડિસ્ક્લેમર: આ માર્ગદર્શન ફક્ત સામાન્ય માહિતી માટે છે અને સત્તાવાર ઇમિગ્રેશન સલાહ અથવા વિઝા ગેરંટીનું નિર્માણ કરતું નથી. હંમેશા સત્તાવાર સરકારી પોર્ટલ પર ચકાસણી કરો.'
    : 'Important Disclaimer: This automated guidance is provided for informational and pre-screening purposes only and does not constitute formal legal immigration advice or a guarantee of visa issuance. Final visa adjudication rests solely with the destination government consular authorities.';

  const languagePromptNote = language === 'hi' 
    ? 'Respond fluently in clear, polite modern Hindi (हिंदी script). Always include the exact English names of visa categories and document types in parentheses where helpful.'
    : language === 'gu'
    ? 'Respond fluently in clear, polite modern Gujarati (ગુજરાતી script). Always include the exact English names of visa categories and document types in parentheses where helpful.'
    : 'Respond in clear, professional, empathetic English.';

  // Try calling Gemini API if GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const systemInstruction = `You are AuraVisa AI, a licensed visa advisory intelligence assistant for AuraVisa Global.
Your specialty is providing accurate, verified visa and immigration guidance for travel:
1. From India to countries worldwide (US, UK, Canada, Schengen / Germany / France, Australia, UAE, Singapore, Japan).
2. From the rest of the world to India (e-Tourist, e-Business, e-Medical, Employment, Student).

CRITICAL POLICY & ETHICS RULES:
- Never fabricate visa policies, processing fees, or non-existent exemptions.
- Never guarantee visa approval under any circumstance. Consular authorities have sole jurisdiction.
- Clearly present required documentation checklists with bullet points.
- Highlight common rejection causes and tips for presenting strong ties to the home country.
- When answering, cite the official verified source name and official government website link provided in the context.
- Language instruction: ${languagePromptNote}
- Under no circumstances ask for or store full passport numbers, bank account numbers, or OTPs.

GROUNDED KNOWLEDGE BASE CONTEXT:
${knowledgeContext}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `User Question: ${sanitizedMessage}\nTarget Language: ${language}\nTravel Context: ${req.destinationCountry || 'General'} (${req.travelDirection || 'Any direction'})` }]
          }
        ],
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for high factual accuracy
          abortSignal: AbortSignal.timeout(3500)
        }
      });

      const replyText = response.text || '';
      if (replyText.trim().length > 0) {
        return {
          reply: replyText,
          language,
          sources: verifiedSources,
          disclaimer
        };
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to verified knowledge engine:', err.message);
    }
  }

  // Resilient deterministic knowledge-based fallback response
  let fallbackReply = '';
  const lowerMsg = sanitizedMessage.toLowerCase();

  if (language === 'hi') {
    fallbackReply = `नमस्ते! AuraVisa Global में आपका स्वागत है। आपके प्रश्न के आधार पर, यहाँ आधिकारिक दिशानिर्देश दिए गए हैं:

1. **आधिकारिक आवश्यकताएँ और पात्रता**:
- वैध पासपोर्ट (कम से कम 6 महीने की वैधता)।
- आवेदन फॉर्म और आधिकारिक सरकारी शुल्क रसीद।
- पिछले 6 महीनों के बैंक स्टेटमेंट और आय के स्रोत का वैध प्रमाण।
- यात्रा का स्पष्ट उद्देश्य और ठहरने का विवरण।

2. **आवश्यक सलाह**:
- कभी भी अनधिकृत एजेंटों के माध्यम से नकली दस्तावेज न बनाएं।
- वीज़ा साक्षात्कार में अपने मूल देश के साथ मजबूत संबंधों (रोजगार, परिवार, संपत्ति) का प्रमाण अवश्य प्रस्तुत करें।

नीचे दिए गए आधिकारिक सरकारी लिंक से आप नवीनतम नियमों की पुष्टि कर सकते हैं। अधिक जटिल मामलों के लिए आप हमारे पंजीकृत सलाहकार के साथ सत्र भी बुक कर सकते हैं।`;
  } else if (language === 'gu') {
    fallbackReply = `નમસ્તે! AuraVisa Global માં આપનું સ્વાગત છે. આપના પ્રશ્નના આધારે અધિકૃત માર્ગદર્શિકા નીચે મુજબ છે:

1. **અધિકૃત જરૂરિયાતો અને યોગ્યતા**:
- માન્ય પાસપોર્ટ (ઓછામાં ઓછી 6 મહિનાની માન્યતા).
- સત્તાવાર અરજી ફોર્મ અને ફી ભર્યાની રસીદ.
- છેલ્લા 6 મહિનાના બેંક સ્ટેટમેન્ટ અને ભારતમાં વ્યવસાય/નોકરીના દસ્તાવેજો.
- પ્રવાસનો સ્પષ્ટ ઉદ્દેશ્ય અને રિટર્ન ટિકિટનું આયોજન.

2. **મહત્વપૂર્ણ ટીપ્સ**:
- ક્યારેય ખોટા દસ્તાવેજો રજૂ કરશો નહીં. 
- તમામ વિગતો અધિકૃત પોર્ટલ સાથે મેળવો.

વિગતવાર સલાહ માટે તમે અમારા અનુભવી કન્સલ્ટન્ટ સાથે કન્સલ્ટેશન બુક કરી શકો છો.`;
  } else {
    // English default
    if (lowerMsg.includes('us') || lowerMsg.includes('united states') || lowerMsg.includes('b1') || lowerMsg.includes('b2')) {
      const usProg = db.visaPrograms.find(p => p.id === 'visa_us_b1b2') || activePrograms[0];
      fallbackReply = `Regarding **${usProg.name}** (${usProg.country}):

• **Purpose**: ${usProg.subTitle}
• **Stay & Validity**: ${usProg.stayDuration}; typically valid for ${usProg.validity}.
• **Approximate Government Fee**: ${usProg.approxGovFee}.
• **Core Eligibility Requirements**:
${usProg.eligibilityCriteria.map(c => `  - ${c}`).join('\n')}

• **Mandatory Document Checklist**:
${usProg.requiredDocuments.map(d => `  - ${d}`).join('\n')}

• **Key Advisory Tip**: Under US Immigration and Nationality Act Section 214(b), applicants must demonstrate strong familial, economic, and professional ties to India ensuring timely return.`;
    } else if (lowerMsg.includes('india') || lowerMsg.includes('evisa') || lowerMsg.includes('e-tourist')) {
      const inProg = db.visaPrograms.find(p => p.id === 'visa_india_etourist') || activePrograms[0];
      fallbackReply = `Regarding **${inProg.name}** for international travelers entering India:

• **Purpose**: ${inProg.subTitle}
• **Processing Window**: ${inProg.processingTime} online via the official Bureau of Immigration portal.
• **Validity Options**: 30 Days (Double entry), 1 Year (Multiple entries), or 5 Years (Multiple entries).
• **Stay Limit**: Continuous stay up to 90 days per visit (180 days for nationals of US, UK, Canada, and Japan).
• **Core Documentation Needed**:
${inProg.requiredDocuments.map(d => `  - ${d}`).join('\n')}

• **Arrival Ports**: Valid for arrival through 29 designated international airports and 5 seaports with biometric capture at entry.`;
    } else {
      fallbackReply = `Thank you for contacting AuraVisa Global. Based on our verified international immigration database:

• **Standard Criteria across visa categories**:
  1. Passport must possess a minimum of 6 months validity from intended entry date with at least 2 blank pages.
  2. Documented proof of genuine travel purpose, confirmed accommodation or host invitation, and verifiable round-trip air reservations.
  3. Evidentiary financial sufficiency (unencumbered liquid funds evidenced through 3 to 6 months stamped bank statements).
  4. Demonstrated home country ties to establish intent of return.

Please check the verified official consular resources linked below for your destination. You can also proceed to our interactive **Eligibility Checker** or **Book a Consultation** with our registered advisors for individual case evaluations.`;
    }
  }

  return {
    reply: fallbackReply,
    language,
    sources: verifiedSources,
    disclaimer
  };
}
