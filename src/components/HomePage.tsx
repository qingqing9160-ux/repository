import { useState } from 'react'
import { Conversation } from '../types'

interface HomePageProps {
  conversations: Conversation[]
  onStartChat: (prompt?: string, category?: Conversation['category']) => void
}

const DOC_TYPES = [
  { id: 'work-summary',       icon: '📊', label: '工作总结',   gradient: 'from-blue-400 to-blue-600' },
  { id: 'incident-report',    icon: '⚠️',  label: '不良事件',   gradient: 'from-rose-400 to-rose-500' },
  { id: 'application-report', icon: '📋', label: '采购申请',   gradient: 'from-violet-400 to-violet-600' },
  { id: 'annual-plan',        icon: '📅', label: '年度计划',   gradient: 'from-indigo-400 to-indigo-600' },
  { id: 'handover-report',    icon: '🔄', label: '交接班报告', gradient: 'from-amber-400 to-amber-500' },
  { id: 'ethics-review',      icon: '⚖️',  label: '伦理审查',   gradient: 'from-purple-400 to-purple-600' },
  { id: 'complaint-response', icon: '💬', label: '投诉回复',   gradient: 'from-pink-400 to-pink-500' },
  { id: 'transfer-record',    icon: '🏥', label: '转科记录',   gradient: 'from-cyan-400 to-cyan-600' },
]

const QUICK_TOOLS = [
  { icon: '🔬', label: '查文献', desc: '搜索医学期刊与临床指南', category: 'search' as Conversation['category'], prompt: '请帮我查询相关医学文献：' },
  { icon: '📜', label: '查政策', desc: '解读卫健委政策法规通知', category: 'policy' as Conversation['category'], prompt: '请帮我查询相关政策法规：' },
  { icon: '✍️',  label: '写文书', desc: '一句话生成专业医疗文书', category: 'document' as Conversation['category'], prompt: '请帮我撰写：' },
]

const GLASS = 'bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.08)]'

export default function HomePage({ conversations, onStartChat }: HomePageProps) {
  const [quickInput, setQuickInput] = useState('')

  const handleQuickSend = () => {
    const text = quickInput.trim()
    if (!text) return
    setQuickInput('')
    onStartChat(text, 'general')
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">智慧医疗，轻松办公</h1>
        <p className="text-gray-400 text-sm">查文献 · 查政策 · 写文书，一站式医疗行政AI助理</p>
      </div>

      {/* Upper Row: Doc Creation + Quick Question */}
      <div className="flex gap-4 mb-4">

        {/* Left: Document Creation Panel */}
        <div className={`${GLASS} flex-1 p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-semibold text-gray-800 text-sm">文书创作</span>
              <span className="ml-2 text-xs text-gray-400">选择模板，快速生成专业文书</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-400">
              <button className="hover:text-indigo-600 transition-colors">通用文书</button>
              <button className="hover:text-indigo-600 transition-colors">护理文书</button>
              <button className="hover:text-indigo-600 transition-colors">科研文书</button>
            </div>
          </div>

          {/* 4×2 Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {DOC_TYPES.map(doc => (
              <button key={doc.id}
                onClick={() => onStartChat(`请帮我按照标准格式生成一份"${doc.label}"`, 'document')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 hover:border-indigo-100 hover:shadow-md transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${doc.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <span className="text-lg">{doc.icon}</span>
                </div>
                <span className="text-xs text-gray-700 font-medium">{doc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Question Panel */}
        <div className={`${GLASS} w-64 shrink-0 p-5 flex flex-col`}
          style={{ background: 'linear-gradient(135deg, rgba(238,242,255,0.85) 0%, rgba(245,240,255,0.85) 100%)', backdropFilter: 'blur(20px)' }}>
          <p className="font-semibold text-gray-800 text-sm mb-0.5">自由提问</p>
          <p className="text-xs text-gray-400 mb-4">一句话，即可快速获取解答</p>

          {/* Suggestion chips */}
          <div className="space-y-2 mb-4 flex-1">
            {[
              '2024年医院感染管理新规有哪些？',
              '帮我写科室季度工作总结',
              '三级公立医院绩效考核指标',
            ].map(q => (
              <button key={q}
                onClick={() => onStartChat(q, 'general')}
                className="w-full text-left text-xs text-gray-600 bg-white/60 hover:bg-white/90 rounded-xl px-3 py-2.5 border border-white/80 hover:border-indigo-200 transition-all leading-relaxed">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="relative">
            <input
              value={quickInput}
              onChange={e => setQuickInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuickSend()}
              placeholder="输入您的问题…"
              className="w-full text-sm bg-white/80 border border-white/90 rounded-xl px-3 py-2.5 pr-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <button onClick={handleQuickSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tools Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {QUICK_TOOLS.map(tool => (
          <button key={tool.label}
            onClick={() => onStartChat(tool.prompt, tool.category)}
            className={`${GLASS} flex items-center gap-4 p-4 hover:shadow-lg transition-all group text-left`}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <span className="text-xl">{tool.icon}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{tool.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Conversations */}
      {conversations.length > 0 && (
        <div className={`${GLASS} p-5`}>
          <div className="flex items-center gap-4 mb-4">
            <button className="text-sm font-semibold text-gray-800 border-b-2 border-indigo-500 pb-1">最近对话</button>
          </div>

          <div className="space-y-0">
            {/* Table header */}
            <div className="flex items-center px-3 pb-2 text-xs text-gray-400">
              <span className="flex-1">名称</span>
              <span className="w-36 text-right">最近对话时间</span>
            </div>

            {conversations.slice(0, 8).map((conv, i) => (
              <button key={conv.id}
                onClick={() => onStartChat(undefined, conv.category)}
                className={`w-full flex items-center px-3 py-3 rounded-xl hover:bg-white/60 transition-all text-left group ${
                  i % 2 === 0 ? 'bg-white/30' : ''
                }`}>
                <span className="text-sm mr-3">
                  {conv.category === 'search' ? '🔍' : conv.category === 'policy' ? '📋' : conv.category === 'document' ? '📝' : '💬'}
                </span>
                <span className="flex-1 text-sm text-gray-700 truncate group-hover:text-indigo-700 transition-colors">{conv.title}</span>
                <span className="w-36 text-xs text-gray-400 text-right shrink-0">
                  {new Date(conv.updatedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
