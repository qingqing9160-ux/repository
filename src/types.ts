export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
  category?: 'search' | 'policy' | 'document' | 'general'
}

export interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
  content: string
}

export type Page = 'home' | 'chat'
