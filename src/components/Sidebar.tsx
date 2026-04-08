import { useState } from 'react'
import { Conversation } from '../types'

interface SidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onHome: () => void
  onOpenSettings?: () => void
  apiKey?: string
}

const NAV_ITEMS = [
  { icon: '🏠', label: '首页', id: 'home' },
  { icon: '📁', label: '历史记录', id: 'history' },
]

const CATEGORY_ICONS: Record<string, string> = {
  search: '🔍',
  policy: '📋',
  document: '📝',
  general: '💬',
}

function groupByDate(conversations: Conversation[]): Record<string, Conversation[]> {
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now.getTime() - 86400000).toDateString()
  const groups: Record<string, Conversation[]> = {}
  for (const conv of conversations) {
    const d = new Date(conv.updatedAt).toDateString()
    const label =
      d === today ? '今天' :
      d === yesterday ? '昨天' :
      new Date(conv.updatedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    if (!groups[label]) groups[label] = []
    groups[label].push(conv)
  }
  return groups
}

export default function Sidebar({
  conversations, activeId, onSelect, onNew, onDelete, onHome, onOpenSettings, apiKey
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState<string>('home')
  const groups = groupByDate(conversations)

  return (
    <div className="flex flex-col h-full w-56 shrink-0"
      style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.6)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 cursor-pointer" onClick={onHome}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
          <span className="text-white text-sm font-bold">医</span>
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm leading-tight">医疗行政</p>
          <p className="text-xs text-gray-400 leading-tight">AI 助理</p>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-4 mb-3">
        <button onClick={onNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新对话
        </button>
      </div>

      {/* Nav */}
      <div className="px-3 mb-2">
        {NAV_ITEMS.map(item => (
          <button key={item.id}
            onClick={() => { setActiveNav(item.id); if (item.id === 'home') onHome() }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all mb-0.5 text-left ${
              activeNav === item.id
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-white/60'
            }`}>
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mx-4 mb-3" style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-6 px-2">暂无对话记录</p>
        ) : (
          Object.entries(groups).map(([label, convs]) => (
            <div key={label} className="mb-2">
              <p className="text-xs text-gray-400 px-2 py-1">{label}</p>
              {convs.map(conv => (
                <div key={conv.id}
                  className={`group flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer text-sm transition-all mb-0.5 ${
                    activeId === conv.id ? 'bg-indigo-50/80 text-indigo-700' : 'text-gray-600 hover:bg-white/60'
                  }`}
                  onClick={() => { onSelect(conv.id); setActiveNav('history') }}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}>
                  <span className="text-sm shrink-0">{CATEGORY_ICONS[conv.category ?? 'general']}</span>
                  <span className="flex-1 truncate text-xs">{conv.title}</span>
                  {hoveredId === conv.id && (
                    <button className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                      onClick={e => { e.stopPropagation(); onDelete(conv.id) }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        {onOpenSettings && (
          <button onClick={onOpenSettings}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
              apiKey ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 bg-amber-50/60 hover:bg-amber-50'
            }`}>
            <span>{apiKey ? '✓' : '⚠️'}</span>
            {apiKey ? 'API 已配置' : '配置 API Key'}
          </button>
        )}
        <p className="text-xs text-gray-400 text-center py-1">数据存储于本地浏览器</p>
      </div>
    </div>
  )
}
