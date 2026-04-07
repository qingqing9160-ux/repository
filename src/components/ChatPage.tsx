import { useState, useRef, useEffect, useCallback } from 'react'
import { Conversation, Message } from '../types'
import { DOCUMENT_TEMPLATES } from '../data/templates'
import { streamChat, ChatMessage } from '../services/ai'
import Sidebar from './Sidebar'

interface ChatPageProps {
  conversations: Conversation[]
  activeConversationId: string | null
  apiKey: string
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onSendMessage: (content: string) => Promise<void>
  onHome: () => void
  onOpenSettings: () => void
}

const QUICK_PROMPTS = [
  { label: '查文献', icon: '🔍', prompt: '请帮我查询相关医学文献：' },
  { label: '查政策', icon: '📋', prompt: '请帮我查询相关政策法规：' },
  { label: '写报告', icon: '📝', prompt: '请帮我撰写：' },
]

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? '我' : '医'}
      </div>
      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
        }`}>
          {message.content}
        </div>
        <span className="text-xs text-gray-400 px-1">{time}</span>
      </div>
    </div>
  )
}

function StreamingBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-600">医</div>
      <div className="max-w-[75%]">
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-800 shadow-sm">
          {content}
          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-600">医</div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatPage({
  conversations,
  activeConversationId,
  apiKey,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSendMessage,
  onHome,
  onOpenSettings,
}: ChatPageProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<(() => void) | null>(null)

  const activeConv = conversations.find(c => c.id === activeConversationId)
  const messages: Message[] = activeConv?.messages ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent, isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    setErrorMsg(null)

    if (!apiKey) {
      setErrorMsg('请先在设置中填写 API Key，才能开始对话。')
      return
    }

    setIsLoading(true)
    setStreamingContent('')

    // Save user message and get updated history via callback
    await onSendMessage(text)

    // Build chat history from current messages + new user message
    const history: ChatMessage[] = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ]

    let cancelled = false
    let accumulated = ''

    abortRef.current = () => { cancelled = true }

    await streamChat(
      history,
      apiKey,
      (chunk) => {
        if (cancelled) return
        accumulated += chunk
        setStreamingContent(accumulated)
      },
      () => {
        if (cancelled) return
        setStreamingContent(null)
        setIsLoading(false)
        // The final message is saved via a callback in App.tsx triggered by streamDone
      },
      (err) => {
        if (cancelled) return
        setStreamingContent(null)
        setIsLoading(false)
        setErrorMsg(err)
      }
    )

    if (!cancelled && accumulated) {
      // Signal App to save the assistant message
      await onSendMessage(`__assistant__${accumulated}`)
    }

    abortRef.current = null
  }, [input, isLoading, apiKey, messages, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleTemplateSelect = (name: string) => {
    setInput(`请帮我按照标准格式生成一份"${name}"`)
    setShowTemplates(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={onSelectChat}
        onNew={onNewChat}
        onDelete={onDeleteChat}
        onHome={onHome}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-sm truncate">
              {activeConv?.title ?? '新对话'}
            </h2>
            {activeConv && (
              <p className="text-xs text-gray-400">
                {messages.length} 条消息 · 自动保存
              </p>
            )}
          </div>

          {/* API key status */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              apiKey
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                : 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span>{apiKey ? '✓' : '!'}</span>
            {apiKey ? 'API 已配置' : '配置 API Key'}
          </button>

          <button
            onClick={onHome}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
            title="返回首页"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.length === 0 && !isLoading && !streamingContent ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">您好，请问有什么可以帮助您？</p>
              <p className="text-gray-400 text-xs">可查询医学文献、政策法规，或协助撰写医疗文书</p>
              {!apiKey && (
                <button
                  onClick={onOpenSettings}
                  className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  ⚠️ 请先配置 API Key 才能开始对话
                </button>
              )}
              <div className="flex gap-2 mt-6 flex-wrap justify-center">
                {QUICK_PROMPTS.map(qp => (
                  <button
                    key={qp.label}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
                    onClick={() => handleQuickPrompt(qp.prompt)}
                  >
                    <span>{qp.icon}</span>
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && streamingContent === '' && <TypingIndicator />}
              {streamingContent !== null && streamingContent !== '' && (
                <StreamingBubble content={streamingContent} />
              )}
            </>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 max-w-md">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMsg}</span>
                {!apiKey && (
                  <button onClick={onOpenSettings} className="underline font-medium whitespace-nowrap">
                    去设置
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          {/* Template Panel */}
          {showTemplates && (
            <div className="mb-3 bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600">选择文书模板</p>
                <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {DOCUMENT_TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    className="text-left px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    onClick={() => handleTemplateSelect(tmpl.name)}
                  >
                    <p className="text-xs font-medium text-gray-800">{tmpl.name}</p>
                    <p className="text-xs text-gray-400">{tmpl.category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {QUICK_PROMPTS.map(qp => (
              <button
                key={qp.label}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                onClick={() => handleQuickPrompt(qp.prompt)}
              >
                <span>{qp.icon}</span>
                {qp.label}
              </button>
            ))}
            <button
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-colors ${
                showTemplates
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700'
              }`}
              onClick={() => setShowTemplates(v => !v)}
            >
              <span>📄</span>
              文书模板
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isLoading ? 'AI 正在回答中…' : '输入问题，Enter 发送，Shift+Enter 换行…'}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              style={{ minHeight: '44px', maxHeight: '160px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">AI 回答仅供参考，重要决策请以官方文件为准</p>
        </div>
      </div>
    </div>
  )
}
