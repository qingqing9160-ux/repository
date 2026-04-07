import { useState, useRef, useEffect } from 'react'
import { Conversation, Message } from '../types'
import { DOCUMENT_TEMPLATES } from '../data/templates'
import Sidebar from './Sidebar'

interface ChatPageProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onSendMessage: (content: string) => void
  onHome: () => void
}

const QUICK_PROMPTS = [
  { label: '查文献', icon: '🔍', prompt: '请帮我搜索相关医学文献：' },
  { label: '查政策', icon: '📋', prompt: '请帮我查询相关政策法规：' },
  { label: '写报告', icon: '📝', prompt: '请帮我撰写：' },
]

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? '我' : '医'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
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
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSendMessage,
  onHome,
}: ChatPageProps) {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConv = conversations.find(c => c.id === activeConversationId)
  const messages: Message[] = activeConv?.messages ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
    }
  }, [input])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setIsTyping(true)
    onSendMessage(text)
    // Simulate AI response delay (real AI integration comes later)
    setTimeout(() => setIsTyping(false), 1500)
  }

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

  const handleTemplateSelect = (content: string, name: string) => {
    setInput(`请帮我按照标准格式生成一份"${name}"，模板参考如下：\n\n${content}`)
    setShowTemplates(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={onSelectChat}
        onNew={onNewChat}
        onDelete={onDeleteChat}
        onHome={onHome}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-sm truncate">
              {activeConv?.title ?? '新对话'}
            </h2>
            {activeConv && (
              <p className="text-xs text-gray-400">
                {messages.length} 条消息 · 数据已自动保存
              </p>
            )}
          </div>
          <button
            onClick={onHome}
            className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            首页
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">您好，请问有什么可以帮助您？</p>
              <p className="text-gray-400 text-xs">可查询医学文献、政策法规，或协助撰写医疗文书</p>
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
              {isTyping && <TypingIndicator />}
            </>
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
                    onClick={() => handleTemplateSelect(tmpl.content, tmpl.name)}
                  >
                    <p className="text-xs font-medium text-gray-800">{tmpl.name}</p>
                    <p className="text-xs text-gray-400">{tmpl.category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Prompts Row */}
          <div className="flex gap-2 mb-3">
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

          {/* Input Box */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入问题，按 Enter 发送，Shift+Enter 换行…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors overflow-hidden"
              style={{ minHeight: '44px', maxHeight: '160px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">AI回答仅供参考，重要决策请以官方文件为准</p>
        </div>
      </div>
    </div>
  )
}
