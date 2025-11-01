'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface JournalEntry {
  id: string
  type: 'freeForm' | 'guided' | 'scripting'
  content: string
  ai_analysis: any
  created_at: string
}

export default function JournalPage() {
  const params = useParams()
  const experienceId = params.experienceId as string
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedType, setSelectedType] = useState<'freeForm' | 'guided' | 'scripting'>('freeForm')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [selectedType])

  const loadEntries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/journal?type=${selectedType}`)
      const data = await response.json()
      setEntries(data.data || [])
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          content,
        }),
      })

      if (!response.ok) throw new Error('Failed to save entry')

      const data = await response.json()
      setEntries([data.data, ...entries])
      setContent('')
      alert('Entry saved successfully!')
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Failed to save entry')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-monk-burgundy-700 mb-2">
          Sacred Journal
        </h1>
        <p className="text-monk-brown-600">
          Document your journey with AI-powered insights into your patterns and progress.
        </p>
      </div>

      {/* Journal Type Selector */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-4 mb-6">
        <div className="flex space-x-2">
          {(['freeForm', 'guided', 'scripting'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedType === type
                  ? 'bg-monk-burgundy-600 text-white'
                  : 'bg-monk-brown-100 text-monk-brown-700 hover:bg-monk-brown-200'
              }`}
            >
              {type === 'freeForm' && 'Free Form'}
              {type === 'guided' && 'Guided'}
              {type === 'scripting' && 'Scripting'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6 mb-6">
        <h2 className="text-xl font-serif text-monk-burgundy-600 mb-4">
          {selectedType === 'freeForm' && 'Free Form Journal'}
          {selectedType === 'guided' && 'Guided Journal'}
          {selectedType === 'scripting' && 'Scripting Journal'}
        </h2>

        {selectedType === 'guided' && (
          <div className="mb-4 p-4 bg-monk-gold-50 rounded-lg border border-monk-gold-200">
            <p className="text-sm text-monk-brown-700">
              <strong>Prompt:</strong> What are you grateful for today? What patterns do you notice in your thoughts?
            </p>
          </div>
        )}

        {selectedType === 'scripting' && (
          <div className="mb-4 p-4 bg-monk-gold-50 rounded-lg border border-monk-gold-200">
            <p className="text-sm text-monk-brown-700">
              <strong>Prompt:</strong> Write as if your desires have already manifested. Use present tense: "I am..." "I have..." "I feel..."
            </p>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full h-64 px-4 py-3 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 focus:border-transparent text-monk-brown-800 resize-none"
        />

        <button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="mt-4 px-6 py-3 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif text-monk-burgundy-700 mb-4">Recent Entries</h2>

        {isLoading ? (
          <div className="text-center py-8 text-monk-brown-600">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-monk-brown-600">
            No entries yet. Start writing to see your journal entries here.
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-monk-brown-500">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                <span className="text-xs bg-monk-brown-100 px-2 py-1 rounded text-monk-brown-700">
                  {entry.type}
                </span>
              </div>
              <p className="text-monk-brown-800 mb-4 whitespace-pre-wrap">{entry.content}</p>
              {entry.ai_analysis && (
                <div className="mt-4 p-4 bg-monk-gold-50 rounded-lg border border-monk-gold-200">
                  <p className="text-sm font-medium text-monk-burgundy-700 mb-2">AI Insights:</p>
                  <p className="text-sm text-monk-brown-700">
                    {typeof entry.ai_analysis === 'string'
                      ? entry.ai_analysis
                      : entry.ai_analysis.insights || 'Analysis available'}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
