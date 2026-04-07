import { useState, useCallback } from 'react'
import { Conversation, Message } from '../types'

const STORAGE_KEY = 'medical_ai_conversations'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveConversations(conversations: Conversation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

export function useStorage() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations)

  const createConversation = useCallback((
    firstMessage?: string,
    category?: Conversation['category']
  ): Conversation => {
    const now = new Date().toISOString()
    const title = firstMessage
      ? firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '…' : '')
      : '新对话'

    const newConv: Conversation = {
      id: generateId(),
      title,
      createdAt: now,
      updatedAt: now,
      messages: [],
      category: category ?? 'general',
    }

    setConversations(prev => {
      const updated = [newConv, ...prev]
      saveConversations(updated)
      return updated
    })

    return newConv
  }, [])

  const addMessage = useCallback((
    conversationId: string,
    role: Message['role'],
    content: string
  ): Message => {
    const msg: Message = {
      id: generateId(),
      role,
      content,
      timestamp: new Date().toISOString(),
    }

    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id !== conversationId) return conv
        const messages = [...conv.messages, msg]
        // Auto-update title from first user message
        const title = conv.messages.length === 0 && role === 'user'
          ? content.slice(0, 20) + (content.length > 20 ? '…' : '')
          : conv.title
        return { ...conv, messages, title, updatedAt: new Date().toISOString() }
      })
      saveConversations(updated)
      return updated
    })

    return msg
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id)
      saveConversations(updated)
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setConversations([])
  }, [])

  const getConversation = useCallback((id: string): Conversation | undefined => {
    return conversations.find(c => c.id === id)
  }, [conversations])

  return {
    conversations,
    createConversation,
    addMessage,
    deleteConversation,
    clearAll,
    getConversation,
  }
}
