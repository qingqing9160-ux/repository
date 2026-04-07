import { useState } from 'react'
import { Conversation } from '../types'

interface SidebarProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onHome: () => void
}

function groupByDate(conversations: Conversation[]): Record<string, Conversation[]> {
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now.getTime() - 86400000).toDateString()

  const groups: Record<string, Conversation[]> = {}
  for (const conv of conversations) {
    const d = new Date(conv.updatedAt).toDateString()
    const label = d === today ? '今天' : d === yesterday ? '昨天' : new Date(conv.updatedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    if (!groups[label]) groups[label] = []
    groups[label].push(conv)
  }
  return groups
}

const CATEGORY_ICONS: Record<string, string> = {
  search: '🔍',
  policy: '📋',
  document: '📝',
  general: '💬',
}

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, onHome }: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const groups = groupByDate(conversations)

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-60 shrink-0">
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
        onClick={onHome}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">医</span>
        </div>
        <span className="font-semibold text-gray-800 text-sm leading-tight">医疗行政AI助理</span>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新对话
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-8 px-4">暂无对话记录</p>
        ) : (
          Object.entries(groups).map(([label, convs]) => (
            <div key={label} className="mb-2">
              <p className="text-xs text-gray-400 font-medium px-2 py-1.5">{label}</p>
              {convs.map(conv => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm transition-colors mb-0.5 ${
                    activeId === conv.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => onSelect(conv.id)}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <span className="text-base shrink-0">{CATEGORY_ICONS[conv.category ?? 'general']}</span>
                  <span className="flex-1 truncate text-xs">{conv.title}</span>
                  {hoveredId === conv.id && (
                    <button
                      className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      onClick={e => { e.stopPropagation(); onDelete(conv.id) }}
                      title="删除"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-xs text-gray-400 text-center">数据存储于本地浏览器</p>
      </div>
    </div>
  )
}
