"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ContactMessage } from "@/lib/types";
import { Mail, Trash2, Check, Clock, Reply } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface MessagesInboxProps {
  initialMessages: ContactMessage[];
}

export function MessagesInbox({ initialMessages }: MessagesInboxProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, is_read: true } : prev);
  };

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await supabase.from("contact_messages").delete().eq("id", deleteTarget);
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget));
    if (selected?.id === deleteTarget) setSelected(null);
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <>
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
          <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-muted">
            <Mail size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg mb-1">No messages yet</p>
            <p className="text-sm">Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Message List */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                      selected?.id === msg.id ? "bg-gray-50 border-l-2 border-accent" : ""
                    } ${!msg.is_read ? "border-l-2 border-red-400" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`font-bold text-sm truncate ${!msg.is_read ? "text-foreground" : "text-muted"}`}>
                        {msg.name}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate mb-1">{msg.email}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{msg.message}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl">
              {selected ? (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h2 className="text-xl font-bold">{selected.name}</h2>
                        <a href={`mailto:${selected.email}`} className="text-muted hover:text-accent text-sm font-medium transition-colors">{selected.email}</a>
                      </div>
                      <div className="flex gap-2">
                        {selected.is_read ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                            <Check size={12} /> Read
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-600 font-medium bg-orange-50 px-2.5 py-1 rounded-full">
                            <Clock size={12} /> Unread
                          </span>
                        )}
                      </div>
                    </div>
                    {selected.subject && (
                      <p className="text-sm font-medium"><span className="text-muted uppercase tracking-wider text-xs">Subject: </span>{selected.subject}</p>
                    )}
                    {selected.budget && (
                      <p className="text-sm font-medium mt-1"><span className="text-muted uppercase tracking-wider text-xs">Budget: </span>{selected.budget}</p>
                    )}
                    <p className="text-xs text-muted mt-2">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>

                  <div className="flex-1 p-6">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex gap-3">
                    <a
                      href={`mailto:${selected.email}?subject=Re: Your Portfolio Inquiry`}
                      className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 font-bold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Reply size={16} /> Reply
                    </a>
                    <button
                      onClick={() => setDeleteTarget(selected.id)}
                      className="flex items-center gap-2 border border-gray-200 text-muted px-5 py-2.5 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-muted text-center">
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
