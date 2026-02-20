/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, ExternalLink, Mic, MicOff, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from './services/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "سڵاو! من یاریدەدەری زیرەکی ئەمینم. دەتوانیت پرسیارم لێ بکەیت دەربارەی کارەکانی، شارەزاییەکانی، یان هەر پرسیارێکی کۆدینگ. چۆن دەتوانم یارمەتیت بدەم؟",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const STARTER_PROMPTS = [
    "ئەمین کێیە؟",
    "شارەزاییەکانی ئەمین چین؟",
    "چۆن پەیوەندی بە ئەمینەوە بکەم؟",
    "نموونەی کۆدێکی React بنووسە"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "سڵاو! من یاریدەدەری زیرەکی ئەمینم. دەتوانیت پرسیارم لێ بکەیت دەربارەی کارەکانی، شارەزاییەکانی، یان هەر پرسیارێکی کۆدینگ. چۆن دەتوانم یارمەتیت بدەم؟",
        timestamp: new Date(),
      },
    ]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight">یاریدەدەری ئەمین</h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-zinc-400 font-medium">لەسەر هێڵە</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="پاککردنەوەی گفتوگۆ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <a 
            href="https://amin-portfolio-iota.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors"
          >
            <span>پۆرتفۆلیۆ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-400' 
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              }`}>
                {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] space-y-1 ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  message.role === 'user'
                    ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm'
                    : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-sm'
                }`}>
                  <ReactMarkdown 
                    components={{
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !String(children).includes('\n');
                        const codeString = String(children).replace(/\n$/, '');
                        return isInline ? (
                          <code className="bg-zinc-950/50 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs" {...props}>
                            {children}
                          </code>
                        ) : (
                          <div className="my-3 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 group">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
                              <span className="text-xs text-zinc-500 font-mono">{match?.[1] || 'code'}</span>
                              <button
                                onClick={() => handleCopyCode(codeString)}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                title="Copy code"
                              >
                                {copiedCode === codeString ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="p-3 overflow-x-auto">
                              <code className="font-mono text-xs text-zinc-300 block" {...props}>
                                {children}
                              </code>
                            </div>
                          </div>
                        )
                      },
                      p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="pl-1">{children}</li>,
                      a: ({href, children}) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <span className="text-[10px] text-zinc-600 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-zinc-900 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
        
        {messages.length === 1 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 px-2">
            {STARTER_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(prompt);
                  // Optional: auto-send
                  // handleSend(); 
                }}
                className="text-right text-xs p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 hover:border-indigo-500/30 transition-all text-zinc-400 hover:text-zinc-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-zinc-950/80 backdrop-blur-md border-t border-white/10">
        <div className="relative flex items-end gap-2 bg-zinc-900/50 border border-white/10 rounded-2xl p-2 focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="پرسیار بکە دەربارەی ئەمین یان کۆدینگ..."
            className="w-full bg-transparent border-none text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:ring-0 py-3 px-3 min-h-[48px] max-h-[120px] scrollbar-hide"
            rows={1}
            style={{ height: 'auto', minHeight: '48px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-all shadow-lg mb-0.5 ${
              isListening 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-red-500/10 animate-pulse' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 shadow-black/20'
            }`}
            title={isListening ? "ڕاگرتنی تۆمارکردن" : "دەستپێکردنی تۆمارکردن"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 mb-0.5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-3 relative">
          هۆشیاربە، زیرەکی دەستکرد دەکرێت هەڵە بکات.
        </p>
      </footer>
    </div>
  );
}
