/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-[#09090b]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                  <p className="text-[10px] text-zinc-400">Ask about Bimsara&apos;s work</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
                  <Bot size={48} className="mb-4 text-cyan-500/50" />
                  <p className="text-sm text-zinc-300">
                    Hi! I'm Bimsara's AI Assistant. You can ask me about his projects, experience,
                    or skills.
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.role === 'user'
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`text-sm px-4 py-2.5 rounded-2xl max-w-[80%] ${
                      m.role === 'user'
                        ? 'bg-zinc-800 text-zinc-200 rounded-tr-sm'
                        : 'bg-white/5 text-zinc-300 rounded-tl-sm border border-white/[0.04]'
                    }`}
                  >
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
                      <ReactMarkdown>{renderMessageContent(m)}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/[0.04] rounded-tl-sm flex items-center justify-center h-[44px]">
                    <Loader2 size={16} className="animate-spin text-zinc-400" />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-red-500/30 rounded-tl-sm text-sm text-red-400">
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
            <form onSubmit={onSubmit} className="p-3 bg-white/[0.02] border-t border-white/[0.08]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-[#111114] text-sm text-white placeholder-zinc-500 border border-white/[0.08] rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1.5 p-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <Send size={14} />
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
        className="w-14 h-14 rounded-full bg-white text-black shadow-xl flex items-center justify-center border border-white/20 relative group overflow-hidden"
        aria-label="Toggle AI Chat"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isOpen ? (
          <X size={24} className="relative z-10 group-hover:text-white transition-colors" />
        ) : (
          <MessageCircle
            size={24}
            className="relative z-10 group-hover:text-white transition-colors"
          />
        )}
      </motion.button>
    </div>
  );
}
