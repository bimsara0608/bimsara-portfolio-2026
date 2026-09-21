'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { ContactMessage } from '@/lib/types';
import { Mail, Trash2, Check, Clock, Reply, Send, X } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface MessagesInboxProps {
  initialMessages: ContactMessage[];
}

export function MessagesInbox({ initialMessages }: MessagesInboxProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reply Modal State
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendReply = async () => {
    if (!selected || !replyMessage.trim()) return;

    setIsSending(true);
    setSendSuccess(false);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selected.email,
          subject: `Re: ${selected.subject || 'Your Portfolio Inquiry'}`,
          message: replyMessage,
          replyToMessageId: selected.id,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSendSuccess(true);
      setTimeout(() => {
        setIsReplying(false);
        setSendSuccess(false);
        setReplyMessage('');
      }, 2000);

      // Optionally update the UI to show read state
      if (!selected.is_read) markRead(selected.id);
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send email. Check console for details.');
    } finally {
      setIsSending(false);
    }
  };

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, is_read: true } : prev));
  };

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await supabase.from('contact_messages').delete().eq('id', deleteTarget);
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget));
    if (selected?.id === deleteTarget) setSelected(null);
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <>
      {/* Reply Modal */}
      {isReplying && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
              <h3 className="font-bold">Reply to {selected.name}</h3>
              <button
                onClick={() => {
                  setIsReplying(false);
                  setSendSuccess(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1">
              <div className="mb-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  To:
                </label>
                <div className="bg-muted px-3 py-2 rounded-lg text-sm">{selected.email}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                  Message:
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full min-h-[200px] bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-y"
                />
              </div>
            </div>
            <div className="p-4 border-t border-border/50 bg-muted/30 flex justify-end gap-3">
              <button
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={isSending || !replyMessage.trim() || sendSuccess}
                className="flex items-center gap-2 bg-foreground text-background px-5 py-2 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="animate-spin" /> Sending...
                  </span>
                ) : sendSuccess ? (
                  <span className="flex items-center gap-2 text-green-500">
                    <Check size={16} /> Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={16} /> Send Reply
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Message?"
        description="This message will be permanently deleted and cannot be recovered."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <div>
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-16 text-center text-muted-foreground">
            <Mail size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg mb-1">No messages yet</p>
            <p className="text-sm">Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Message List */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border/50">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left px-4 py-4 hover:bg-muted transition-colors ${
                      selected?.id === msg.id ? 'bg-muted border-l-2 border-foreground' : ''
                    } ${!msg.is_read ? 'border-l-2 border-red-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className={`font-bold text-sm truncate ${!msg.is_read ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {msg.name}
                      </p>
                      <span className="text-xs text-muted-foreground/50 flex-shrink-0">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">{msg.email}</p>
                    <p className="text-xs text-muted-foreground/80 line-clamp-2">{msg.message}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl">
              {selected ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h2 className="text-xl font-bold">{selected.name}</h2>
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors magnetic"
                        >
                          {selected.email}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        {selected.is_read ? (
                          <span className="flex items-center gap-1 text-xs text-green-500 font-medium bg-green-500/10 px-2.5 py-1 rounded-full">
                            <Check size={12} /> Read
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-500 font-medium bg-orange-500/10 px-2.5 py-1 rounded-full">
                            <Clock size={12} /> Unread
                          </span>
                        )}
                      </div>
                    </div>
                    {selected.subject && (
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground uppercase tracking-wider text-xs">
                          Subject:{' '}
                        </span>
                        {selected.subject}
                      </p>
                    )}
                    {selected.budget && (
                      <p className="text-sm font-medium mt-1">
                        <span className="text-muted-foreground uppercase tracking-wider text-xs">
                          Budget:{' '}
                        </span>
                        {selected.budget}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex-1 p-6">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>

                  <div className="p-6 border-t border-border/50 flex gap-3">
                    <button
                      onClick={() => setIsReplying(true)}
                      className="magnetic flex items-center gap-2 bg-foreground text-background px-5 py-2.5 font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Reply size={16} /> Reply
                    </button>
                    <button
                      onClick={() => setDeleteTarget(selected.id)}
                      className="magnetic flex items-center gap-2 border border-border text-muted-foreground px-5 py-2.5 font-medium rounded-lg hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-muted-foreground text-center">
                  <div>
                    <Mail size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium">Select a message to read it</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
