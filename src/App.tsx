import { useState } from 'react'
import { Page, Conversation } from './types'
import { useStorage } from './hooks/useStorage'
import HomePage from './components/HomePage'
import ChatPage from './components/ChatPage'
import SettingsModal from './components/SettingsModal'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const {
    conversations,
    createConversation,
    addMessage,
    deleteConversation,
    getApiKey,
    setApiKey,
  } = useStorage()

  const [apiKey, setApiKeyState] = useState<string>(getApiKey)

  const handleSaveApiKey = (key: string) => {
    setApiKey(key)
    setApiKeyState(key)
  }

  const handleStartChat = (prompt?: string, category?: Conversation['category']) => {
    const conv = createConversation(prompt, category)
    setActiveConversationId(conv.id)
    setPage('chat')

    if (prompt) {
      addMessage(conv.id, 'user', prompt)
      // If no API key, show hint — actual AI call happens in ChatPage
      if (!getApiKey()) {
        setTimeout(() => {
          addMessage(conv.id, 'assistant', '您好！请先点击右上角「配置 API Key」，填写智谱AI的密钥后即可开始对话。\n\n申请地址：open.bigmodel.cn（免费注册）')
        }, 300)
      }
    }
  }

  const handleNewChat = () => {
    const conv = createConversation()
    setActiveConversationId(conv.id)
    setPage('chat')
  }

  const handleSelectChat = (id: string) => {
    setActiveConversationId(id)
    setPage('chat')
  }

  const handleDeleteChat = (id: string) => {
    deleteConversation(id)
    if (activeConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id)
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id)
      } else {
        setPage('home')
        setActiveConversationId(null)
      }
    }
  }

  // Called by ChatPage when user sends a message or AI responds
  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return
    // Convention: assistant messages are prefixed with __assistant__
    if (content.startsWith('__assistant__')) {
      addMessage(activeConversationId, 'assistant', content.slice(13))
    } else {
      addMessage(activeConversationId, 'user', content)
    }
  }

  if (page === 'chat') {
    return (
      <>
        <ChatPage
          conversations={conversations}
          activeConversationId={activeConversationId}
          apiKey={apiKey}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onSendMessage={handleSendMessage}
          onHome={() => setPage('home')}
          onOpenSettings={() => setShowSettings(true)}
        />
        {showSettings && (
          <SettingsModal
            initialApiKey={apiKey}
            onSave={handleSaveApiKey}
            onClose={() => setShowSettings(false)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col h-full bg-white border-r border-gray-200 w-60 shrink-0">
          <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">医</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">医疗行政AI助理</span>
          </div>

          <div className="px-3 py-3">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新对话
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {conversations.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-8 px-4">暂无对话记录</p>
            ) : (
              conversations.slice(0, 30).map(conv => (
                <button
                  key={conv.id}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors mb-0.5 text-left"
                  onClick={() => handleSelectChat(conv.id)}
                >
                  <span className="text-base shrink-0">
                    {conv.category === 'search' ? '🔍' : conv.category === 'policy' ? '📋' : conv.category === 'document' ? '📝' : '💬'}
                  </span>
                  <span className="flex-1 truncate text-xs">{conv.title}</span>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-3 py-3 space-y-1">
            <button
              onClick={() => setShowSettings(true)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                apiKey
                  ? 'text-emerald-700 hover:bg-emerald-50'
                  : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <span>{apiKey ? '⚙️' : '⚠️'}</span>
              {apiKey ? 'API 已配置' : '请配置 API Key'}
            </button>
            <p className="text-xs text-gray-400 text-center">数据存储于本地浏览器</p>
          </div>
        </div>

        {/* Home Page */}
        <HomePage
          conversations={conversations}
          onStartChat={handleStartChat}
        />
      </div>

      {showSettings && (
        <SettingsModal
          initialApiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  )
}
