"use client"

import { useEffect, useState, useCallback } from "react"
import { Mail, Trash2, Check, ChevronDown, ChevronUp } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/contact")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setMessages(data)
    } catch {
      setMessages([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const toggleRead = useCallback(async (msg: Message) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
    )

    const res = await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id, read: !msg.read }),
    })

    if (!res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: msg.read } : m))
      )
    }
  }, [])

  const handleDelete = useCallback(async (msg: Message) => {
    if (!confirm(`Delete message from "${msg.name}"?`)) return

    setMessages((prev) => prev.filter((m) => m.id !== msg.id))

    const res = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id }),
    })

    if (!res.ok) {
      await fetchMessages()
    }
  }, [fetchMessages])

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold">Messages</h2>
          {unreadCount > 0 && (
            <p className="mt-1 font-mono text-sm text-secondary dark:text-dark-secondary">
              {unreadCount} unread
            </p>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="py-20 text-center">
          <Mail size={32} className="mx-auto mb-4 text-secondary/50 dark:text-dark-secondary/50" />
          <p className="font-mono text-base text-secondary dark:text-dark-secondary">
            No messages yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border px-5 py-4 transition-colors dark:border-dark-border ${
                !msg.read
                  ? "border-accent/30 bg-accent/[0.02] dark:border-dark-accent/30 dark:bg-dark-accent/[0.02]"
                  : "border-border dark:border-dark-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  className="flex flex-1 cursor-pointer items-start gap-3 text-left"
                >
                  {!msg.read && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-base font-semibold">
                        {msg.name}
                      </span>
                      <span className="font-mono text-xs text-secondary dark:text-dark-secondary">
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-secondary dark:text-dark-secondary">
                      {msg.email}
                    </p>
                    <p className={`mt-2 font-mono text-sm leading-relaxed text-secondary dark:text-dark-secondary ${
                      expandedId !== msg.id ? "line-clamp-2" : ""
                    }`}>
                      {msg.message}
                    </p>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-1 pt-1">
                  <button
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                    className="cursor-pointer rounded-lg p-1.5 text-secondary transition-colors hover:bg-muted dark:text-dark-secondary dark:hover:bg-dark-muted"
                    title={expandedId === msg.id ? "Collapse" : "Expand"}
                  >
                    {expandedId === msg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => toggleRead(msg)}
                    className={`cursor-pointer rounded-lg p-1.5 transition-colors ${
                      msg.read
                        ? "text-secondary hover:text-accent dark:text-dark-secondary"
                        : "text-accent"
                    } hover:bg-muted dark:hover:bg-dark-muted`}
                    title={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(msg)}
                    className="cursor-pointer rounded-lg p-1.5 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
