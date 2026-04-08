import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  { label: '查文献', icon: '🔬', prompt: '请帮我查询相关医学文献：' },
  { label: '查政策', icon: '📜', prompt: '请帮我查询相关政策法规：' },
  { label: '写报告', icon: '✍️', prompt: '请帮我撰写：' },
]

const GLASS = 'bg-white/70 backdrop-blur-xl border border-white/80'

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${
        isUser
          ? 'text-white'
          : 'bg-white/80 text-indigo-600 border border-white/90'
      }`}
        style={isUser ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
        {isUser ? '我' : '医'}
      </div>
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed break-words shadow-sm ${
          isUser
            ? 'text-white rounded-tr-sm whitespace-pre-wrap'
            : `${GLASS} text-gray-800 rounded-tl-sm`
        }`}
          style={isUser ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
          {isUser ? message.content : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-indigo-600 underline underline-offset-2 hover:text-violet-700 transition-colors font-medium">
                    {children}
                  </a>
                ),
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                h2: ({ children }) => <h2 className="font-bold text-gray-900 mt-3 mb-1.5 text-sm">{children}</h2>,
                h3: ({ children }) => <h3 className="font-semibold text-gray-800 mt-2 mb-1 text-sm">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-2 pl-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-2 pl-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-indigo-300 pl-3 my-2 text-gray-600 italic bg-indigo-50/50 rounded-r-lg py-1.5">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full text-xs border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="border border-indigo-200 bg-indigo-50 px-2 py-1 font-semibold text-left">{children}</th>,
                td: ({ children }) => <td className="border border-gray-200 px-2 py-1">{children}</td>,
                code: ({ children }) => <code className="bg-gray-100 rounded px-1 py-0.5 text-xs font-mono text-indigo-700">{children}</code>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <span className="text-xs text-gray-400 px-1">{time}</span>
      </div>
    </div>
  )
}

function StreamingBubble({ content }: { content: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-white/80 border border-white/90 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-600 shadow-sm">医</div>
      <div className="max-w-[78%]">
        <div className={`${GLASS} rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed break-words text-gray-800 shadow-sm`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="text-indigo-600 underline underline-offset-2 hover:text-violet-700 transition-colors font-medium">
                  {children}
                </a>
              ),
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              h2: ({ children }) => <h2 className="font-bold text-gray-900 mt-3 mb-1.5 text-sm">{children}</h2>,
              h3: ({ children }) => <h3 className="font-semibold text-gray-800 mt-2 mb-1 text-sm">{children}</h3>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-2 pl-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-2 pl-1">{children}</ol>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-indigo-300 pl-3 my-2 text-gray-600 italic bg-indigo-50/50 rounded-r-lg py-1.5">
                  {children}
                </blockquote>
              ),
            }}>
            {content}
          </ReactMarkdown>
          <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 animate-pulse align-middle" />
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-white/80 border border-white/90 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-600 shadow-sm">医</div>
      <div className={`${GLASS} rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm`}>
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatPage({
  conversations, activeConversationId, apiKey,
  onNewChat, onSelectChat, onDeleteChat, onSendMessage, onHome, onOpenSettings,
}: ChatPageProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      setErrorMsg('请先配置 API Key 才能开始对话')
      return
    }

    setIsLoading(true)
    setStreamingContent('')
    await onSendMessage(text)

    const history: ChatMessage[] = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ]

    let accumulated = ''
    let cancelled = false

    await streamChat(
      history, apiKey,
      chunk => { if (!cancelled) { accumulated += chunk; setStreamingContent(accumulated) } },
      () => { if (!cancelled) { setStreamingContent(null); setIsLoading(false) } },
      err => { if (!cancelled) { setStreamingContent(null); setIsLoading(false); setErrorMsg(err) } }
    )

    if (!cancelled && accumulated) {
      await onSendMessage(`__assistant__${accumulated}`)
    }
  }, [input, isLoading, apiKey, messages, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={onSelectChat}
        onNew={onNewChat}
        onDelete={onDeleteChat}
        onHome={onHome}
        onOpenSettings={onOpenSettings}
        apiKey={apiKey}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`${GLASS} px-6 py-3 flex items-center gap-3 rounded-none border-x-0 border-t-0`}>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-sm truncate">{activeConv?.title ?? '新对话'}</h2>
            {activeConv && <p className="text-xs text-gray-400">{messages.length} 条消息 · 自动保存</p>}
          </div>
          <button onClick={onOpenSettings}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              apiKey ? 'border-emerald-200 text-emerald-600 bg-emerald-50/80 hover:bg-emerald-50' : 'border-amber-200 text-amber-600 bg-amber-50/80 hover:bg-amber-50'
            }`}>
            {apiKey ? '✓ API 已配置' : '⚠ 配置 API Key'}
          </button>
          <button onClick={onHome} className="text-gray-400 hover:text-indigo-600 transition-colors p-1" title="返回首页">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.length === 0 && !isLoading && streamingContent === null ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${GLASS}`}>
                <span className="text-3xl">💬</span>
              </div>
              <p className="text-gray-600 font-medium mb-1">您好，请问有什么可以帮助您？</p>
              <p className="text-gray-400 text-sm">查询医学文献、解读政策法规、撰写医疗文书</p>
              {!apiKey && (
                <button onClick={onOpenSettings}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm text-amber-700 border border-amber-200 bg-amber-50/80 hover:bg-amber-50 transition-all">
                  ⚠️ 请先配置 API Key 才能开始对话
                </button>
              )}
              <div className="flex gap-2 mt-6 flex-wrap justify-center">
                {QUICK_PROMPTS.map(qp => (
                  <button key={qp.label}
                    className={`flex items-center gap-2 px-4 py-2 ${GLASS} rounded-full text-sm text-gray-700 hover:border-indigo-200 hover:text-indigo-700 transition-all shadow-sm`}
                    onClick={() => setInput(qp.prompt)}>
                    <span>{qp.icon}</span>{qp.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
              {isLoading && streamingContent === '' && <TypingIndicator />}
              {streamingContent !== null && streamingContent !== '' && <StreamingBubble content={streamingContent} />}
            </>
          )}

          {errorMsg && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-red-50/90 border border-red-200/80 text-red-600 text-sm rounded-xl px-4 py-3 max-w-md backdrop-blur-sm">
                <span>⚠</span>
                <span>{errorMsg}</span>
                {!apiKey && <button onClick={onOpenSettings} className="underline font-medium ml-1">去设置</button>}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`${GLASS} px-6 py-4 rounded-none border-x-0 border-b-0`}>
          {/* Template Panel */}
          {showTemplates && (
            <div className="mb-3 bg-white/80 backdrop-blur-xl border border-white/90 rounded-2xl p-3 max-h-52 overflow-y-auto shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700">选择文书模板</p>
                <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {DOCUMENT_TEMPLATES.map(tmpl => (
                  <button key={tmpl.id}
                    className="text-left px-3 py-2 rounded-xl bg-white/60 border border-white/80 hover:border-indigo-200 hover:bg-indigo-50/60 transition-all"
                    onClick={() => { setInput(`请帮我按照标准格式生成一份"${tmpl.name}"`); setShowTemplates(false) }}>
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
              <button key={qp.label}
                className="flex items-center gap-1 px-3 py-1 bg-white/60 border border-white/80 rounded-full text-xs text-gray-600 hover:bg-indigo-50/80 hover:text-indigo-700 hover:border-indigo-200 transition-all"
                onClick={() => setInput(qp.prompt)}>
                <span>{qp.icon}</span>{qp.label}
              </button>
            ))}
            <button
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all border ${
                showTemplates ? 'bg-violet-100/80 text-violet-700 border-violet-200' : 'bg-white/60 border-white/80 text-gray-600 hover:bg-violet-50/80 hover:text-violet-700 hover:border-violet-200'
              }`}
              onClick={() => setShowTemplates(v => !v)}>
              <span>📄</span>文书模板
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
              className="flex-1 resize-none rounded-xl bg-white/70 border border-white/90 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100/60 transition-all disabled:bg-gray-50/50 disabled:cursor-not-allowed backdrop-blur-sm"
              style={{ minHeight: '44px', maxHeight: '160px' }}
            />
            <button onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:opacity-90 active:scale-95 shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
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
