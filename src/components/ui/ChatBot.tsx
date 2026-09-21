/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    (sendMessage as any)({
      role: 'user',
      content: inputValue,
      parts: [{ type: 'text', text: inputValue }],
    });
    setInputValue('');
  };

  const renderMessageContent = (m: any) => {
    // Safely extract text whether it's in content, text, or parts array
    let text = m.content || m.text || '';
    if (!text && m.parts && m.parts.length > 0) {
      text = m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('\n');
    }
    return text;
  };

  // Check if a message contains a successful lead submission tool result
  const hasLeadSuccess = (m: any): boolean => {
    if (!m.parts) return false;
    return m.parts.some(
      (p: any) =>
        p.type === 'tool-invocation' &&
        p.toolName === 'submit_lead' &&
        p.state === 'result' &&
        p.result?.success === true
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col mb-4 overflow-hidden ring-1 ring-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/30 flex items-center justify-center text-white relative z-10">
                    <Bot size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">AI Assistant</h3>
                  <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-70">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Bot size={32} className="text-white" />
                  </div>
                  <p className="text-sm text-zinc-300 max-w-[200px]">
                    Ask me anything about Bimsara's engineering projects, CAD experience, or
                    technical skills.
                  </p>
                </div>
              )}

              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${
                    m.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                        : 'bg-zinc-900 border border-white/30 text-white'
                    }`}
                  >
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    {renderMessageContent(m) && (
                      <div
                        className={`text-sm px-4 py-3 rounded-2xl shadow-sm ${
                          m.role === 'user'
                            ? 'bg-zinc-800/80 text-white rounded-tr-sm border border-white/5'
                            : 'bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 text-zinc-200 rounded-tl-sm border border-white/20'
                        }`}
                      >
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                          <ReactMarkdown>{renderMessageContent(m)}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {/* Lead success badge — shown when AI submits a client lead */}
                    {hasLeadSuccess(m) && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium"
                      >
                        <CheckCircle2 size={13} />
                        Project brief sent to Bimsara!
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/30 text-white flex items-center justify-center mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="px-5 py-3.5 rounded-2xl bg-zinc-900/50 border border-white/20 rounded-tl-sm flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-white" />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-red-950/20 border border-red-500/30 rounded-tl-sm text-sm text-red-400">
                    {(() => {
                      try {
                        const parsed = JSON.parse(error.message);
                        return parsed.error || error.message;
                      } catch {
                        return error.message || 'An error occurred connecting to the AI.';
                      }
                    })()}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={onSubmit}
              className="p-4 bg-zinc-950/50 border-t border-white/10 backdrop-blur-md"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-black/50 text-sm text-white placeholder-zinc-500 border border-white/10 rounded-full pl-5 pr-14 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1.5 p-2 bg-white hover:bg-zinc-200 text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  aria-label="Send message"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center relative group overflow-hidden border border-white/50"
        aria-label="Toggle AI Chat"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white to-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isOpen ? (
          <X size={26} className="relative z-10 text-black transition-colors" />
        ) : (
          <MessageCircle size={26} className="relative z-10 text-black transition-colors" />
        )}
      </motion.button>
    </div>
  );
}
