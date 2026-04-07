import { Conversation } from '../types'
import { DOCUMENT_TEMPLATES } from '../data/templates'

interface HomePageProps {
  conversations: Conversation[]
  onStartChat: (prompt?: string, category?: Conversation['category']) => void
}

const QUICK_ACTIONS = [
  {
    icon: '🔍',
    title: '文献查询',
    description: '搜索医学期刊、研究报告',
    examples: ['查询2024年脓毒症治疗指南', '最新抗生素耐药性研究'],
    category: 'search' as Conversation['category'],
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    icon: '📋',
    title: '政策法规',
    description: '查询卫健委、医院相关政策',
    examples: ['医院感染管理规范', '医师执业注册管理办法'],
    category: 'policy' as Conversation['category'],
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    iconBg: 'bg-emerald-100',
    textColor: 'text-emerald-700',
  },
  {
    icon: '📝',
    title: '撰写文书',
    description: '生成报告、申请、总结等文书',
    examples: ['帮我写科室年度工作总结', '起草物资采购申请报告'],
    category: 'document' as Conversation['category'],
    color: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
    iconBg: 'bg-violet-100',
    textColor: 'text-violet-700',
  },
]

const SUGGESTED_QUESTIONS = [
  '2024年国家卫健委医院感染管理最新规定有哪些？',
  '帮我写一份ICU科室季度工作总结',
  '查询三级公立医院绩效考核最新指标',
  '医疗不良事件报告制度的规范流程是什么？',
  '帮我起草一份医疗设备采购申请报告',
  '急诊科护理质量评价标准有哪些？',
]

export default function HomePage({ conversations, onStartChat }: HomePageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-700 mb-4 shadow-md">
            <span className="text-white text-2xl font-bold">医</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">医疗行政AI助理</h1>
          <p className="text-gray-500 text-sm">查询文献政策 · 撰写医疗文书 · 专业准确可靠</p>
        </div>

        {/* Search / Input Bar */}
        <div
          className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm mb-8 cursor-text hover:border-blue-300 transition-colors"
          onClick={() => onStartChat(undefined, 'general')}
        >
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-gray-400 text-sm">请输入您的问题，例如：查询最新医院感染管理规范……</span>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {QUICK_ACTIONS.map(action => (
            <div
              key={action.title}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${action.color}`}
              onClick={() => onStartChat(undefined, action.category)}
            >
              <div className={`w-9 h-9 rounded-lg ${action.iconBg} flex items-center justify-center mb-3`}>
                <span className="text-lg">{action.icon}</span>
              </div>
              <h3 className={`font-semibold text-sm mb-1 ${action.textColor}`}>{action.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{action.description}</p>
              <div className="space-y-1">
                {action.examples.map(ex => (
                  <button
                    key={ex}
                    className="block w-full text-left text-xs text-gray-600 bg-white bg-opacity-60 hover:bg-opacity-100 rounded-md px-2 py-1 transition-colors truncate"
                    onClick={e => { e.stopPropagation(); onStartChat(ex, action.category) }}
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">常见问题</h2>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                className="text-left text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:text-blue-700 transition-colors"
                onClick={() => onStartChat(q, 'general')}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Document Templates */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">文书模板快速生成</h2>
          <div className="grid grid-cols-4 gap-2">
            {DOCUMENT_TEMPLATES.slice(0, 8).map(tmpl => (
              <button
                key={tmpl.id}
                className="text-left bg-white border border-gray-200 rounded-xl p-3 hover:border-violet-300 hover:bg-violet-50 transition-colors"
                onClick={() => onStartChat(`请帮我按照标准格式生成一份"${tmpl.name}"`, 'document')}
              >
                <p className="text-xs font-medium text-gray-800 mb-0.5">{tmpl.name}</p>
                <p className="text-xs text-gray-400">{tmpl.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">最近对话</h2>
            <div className="space-y-1.5">
              {conversations.slice(0, 5).map(conv => (
                <button
                  key={conv.id}
                  className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 transition-colors text-left"
                  onClick={() => onStartChat(undefined, undefined)}
                >
                  <span className="text-gray-400 text-sm">
                    {conv.category === 'search' ? '🔍' : conv.category === 'policy' ? '📋' : conv.category === 'document' ? '📝' : '💬'}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{conv.title}</span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(conv.updatedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
