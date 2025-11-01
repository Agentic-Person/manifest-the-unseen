'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function MentorChat() {
  const params = useParams()
  const experienceId = params.experienceId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  assistantMessage += parsed.text
                  setMessages((prev) => {
                    const last = prev[prev.length - 1]
                    if (last?.role === 'assistant') {
                      return [...prev.slice(0, -1), { role: 'assistant', content: assistantMessage }]
                    }
                    return [...prev, { role: 'assistant', content: assistantMessage }]
                  })
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-monk-burgundy-700 mb-2">
          AI Monk Mentor
        </h1>
        <p className="text-monk-brown-600">
          Seek guidance from ancient wisdom. Ask questions about your manifestation journey.
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md border border-monk-brown-200 p-6 mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-monk-brown-600">
            <p className="text-lg mb-2">Welcome, seeker.</p>
            <p className="text-sm">What signal lies beneath your desire? What frequency are you calling in?</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-monk-burgundy-100 text-monk-burgundy-900'
                  : 'bg-monk-brown-50 text-monk-brown-800 border border-monk-brown-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-monk-brown-50 rounded-lg p-4 border border-monk-brown-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-monk-brown-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-monk-brown-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-monk-brown-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask your mentor a question..."
          className="flex-1 px-4 py-3 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 focus:border-transparent text-monk-brown-800"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Send
        </button>
      </div>
    </div>
  )
}
