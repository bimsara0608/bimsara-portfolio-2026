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

  const { messages, sendMessage, status, error } = useChat({
    initialMessages: [
      {
        id: 'welcome-message',
        role: 'assistant',
        content:
          "Hello! I'm Bimsara Gunawardana's AI assistant. Feel free to ask me any questions about Bimsara's experience as a Design Engineer, his projects, or his technical skills.\n\nHow can I help you today?",
      },
    ],
  });
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
            className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col mb-4 overflow-hidden ring-1 ring-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md animate-pulse"></div>
                  <div className="w-9 h-9 rounded-full bg-zinc-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 relative z-10">
                    <Bot size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">AI Assistant</h3>
                  <p className="text-[10px] text-cyan-400/70 font-medium uppercase tracking-wider">
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
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Bot size={32} className="text-cyan-400" />
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
                        : 'bg-zinc-900 border border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`text-sm px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
                      m.role === 'user'
                        ? 'bg-zinc-800/80 text-white rounded-tr-sm border border-white/5'
                        : 'bg-gradient-to-br from-cyan-950/30 to-blue-950/30 text-zinc-200 rounded-tl-sm border border-cyan-500/20'
                    }`}
                  >
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                      <ReactMarkdown>{renderMessageContent(m)}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="px-5 py-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 rounded-tl-sm flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-cyan-400" />
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
                  className="w-full bg-black/50 text-sm text-white placeholder-zinc-500 border border-white/10 rounded-full pl-5 pr-14 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1.5 p-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
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
        className="w-16 h-16 rounded-full bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center relative group overflow-hidden border border-cyan-300/50"
        aria-label="Toggle AI Chat"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isOpen ? (
          <X size={26} className="relative z-10 text-black transition-colors" />
        ) : (
          <MessageCircle size={26} className="relative z-10 text-black transition-colors" />
        )}
      </motion.button>
    </div>
  );
}
