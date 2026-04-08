import { useState } from 'react'
import { Page, Conversation } from './types'
import { useStorage } from './hooks/useStorage'
import HomePage from './components/HomePage'
import ChatPage from './components/ChatPage'
import SettingsModal from './components/SettingsModal'
import Sidebar from './components/Sidebar'

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

  // Decorative background blobs
  const Blobs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #c7d2fe, #a5b4fc)', filter: 'blur(60px)' }} />
      <div className="absolute top-1/2 -left-48 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #ddd6fe, #c4b5fd)', filter: 'blur(80px)' }} />
      <div className="absolute -bottom-32 right-1/3 w-80 h-80 rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #fbcfe8, #f9a8d4)', filter: 'blur(60px)' }} />
    </div>
  )

  if (page === 'chat') {
    return (
      <div className="relative h-screen overflow-hidden">
        <Blobs />
        <div className="relative h-full" style={{ zIndex: 1 }}>
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
        </div>
        {showSettings && (
          <SettingsModal
            initialApiKey={apiKey}
            onSave={handleSaveApiKey}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <Blobs />
      <div className="relative flex h-screen" style={{ zIndex: 1 }}>
        <Sidebar
          conversations={conversations}
          activeId={null}
          onSelect={handleSelectChat}
          onNew={handleNewChat}
          onDelete={(id: string) => deleteConversation(id)}
          onHome={() => setPage('home')}
          onOpenSettings={() => setShowSettings(true)}
          apiKey={apiKey}
        />
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
    </div>
  )
}
