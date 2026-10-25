import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Shield, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  User, 
  Bot
} from 'lucide-react';
import { AIChatMessage } from '../../types/index.ts';

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content: 'Welcome to AuraVisa AI Advisory. I am grounded in verified regulatory sources for travel between India and global destinations (US, UK, Canada, Schengen Europe, Australia, UAE, and inbound Indian e-Visas). How can I assist your documentation planning today?',
      sources: [
        {
          title: 'Bureau of Immigration (India)',
          url: 'https://indianvisaonline.gov.in',
          lastVerified: '2026-02-24'
        },
        {
          title: 'U.S. Department of State Travel',
          url: 'https://travel.state.gov',
          lastVerified: '2026-02-15'
        }
      ],
      timestamp: new Date().toISOString(),
      language: 'en'
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'gu'>('en');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const samplePrompts = [
    {
      label: 'UK Visitor Visa Bank Balance',
      prompt: 'What are the bank statement and financial ties requirements for an Indian applicant applying for a UK Standard Visitor Visa?'
    },
    {
      label: 'US B1/B2 Interview Documents',
      prompt: 'What documents must I carry to the US Embassy interview in Mumbai/Delhi for a B1/B2 tourist visa?'
    },
    {
      label: 'India e-Tourist Visa Rules (English)',
      prompt: 'What are the passport validity and photo specifications for an American citizen applying for an Indian e-Tourist Visa?'
    },
    {
      label: 'કેનેડા વિઝા માટે જરૂરી દસ્તાવેજ (Gujarati)',
      prompt: 'ભારતીય નાગરિક માટે કેનેડા વિઝિટર વિઝા માટે કયા દસ્તાવેજો અને નાણાકીય પુરાવા જરૂરી છે?',
      lang: 'gu' as const
    },
    {
      label: 'शेंगेन वीज़ा बीमा आवश्यकताएँ (Hindi)',
      prompt: 'जर्मनी शेंगेन वीज़ा के लिए यात्रा चिकित्सा बीमा की न्यूनतम कवरेज राशि और शर्तें क्या हैं?',
      lang: 'hi' as const
    }
  ];

  const handleSend = async (textToSend?: string, langOverride?: 'en' | 'hi' | 'gu') => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const lang = langOverride || selectedLanguage;
    setError(null);

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      language: lang
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: lang,
          history: messages.slice(-4).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'The advisory engine encountered a temporary delay.');
        return;
      }

      const assistantMsg: AIChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        sources: data.sources || [],
        timestamp: new Date().toISOString(),
        language: data.language || lang
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setError('Unable to establish connection with verified immigration intelligence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Language Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AuraVisa AI Immigration Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multilingual advisory engine grounded in statutory consular guidelines.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedLanguage === 'en'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('hi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedLanguage === 'hi'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('gu')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedLanguage === 'gu'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ગુજરાતી
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[580px] overflow-hidden">
        
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white font-normal'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Sources Card */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1.5">
                    <div className="font-semibold text-slate-700 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Official Regulatory Citations:</span>
                    </div>
                    <div className="space-y-1">
                      {msg.sources.map((src, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded border border-slate-200">
                          <span className="font-medium text-slate-700 truncate">{src.title}</span>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 shrink-0 font-mono text-[10px]"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consulting verified consular knowledge base...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick Topics:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (p.lang) setSelectedLanguage(p.lang);
                handleSend(p.prompt, p.lang);
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-600 hover:text-slate-900 whitespace-nowrap transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedLanguage === 'hi' 
                ? 'वीज़ा और इमिग्रेशन नियमों के बारे में पूछें...'
                : selectedLanguage === 'gu'
                ? 'વિઝા અને ઇમિગ્રેશન નિયમો વિશે પૂછો...'
                : 'Ask about visa rules, DS-160, required documents, or timelines...'
            }
            maxLength={1000}
            className="flex-1 px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* Safety notice */}
      <div className="text-[11px] text-slate-400 text-center leading-relaxed">
        Privacy & Compliance Note: Do not input personal identification numbers (e.g. passport numbers, Aadhaar, PAN) into the advisory console. AuraVisa AI does not guarantee visa approval; final decisions rest with the sovereign government consulates.
      </div>

    </div>
  );
};
