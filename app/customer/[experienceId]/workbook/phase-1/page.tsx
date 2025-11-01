'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface WheelOfLifeData {
  [key: string]: number
}

interface CoreValuesData {
  selected: string[]
  ranked: string[]
}

interface EmotionTrackerData {
  entries: Array<{
    emotions: string[]
    timestamp: string
    note?: string
  }>
}

const LIFE_AREAS = [
  'Career',
  'Relationships',
  'Health',
  'Finances',
  'Personal Growth',
  'Fun & Recreation',
  'Spirituality',
  'Environment',
]

const CORE_VALUES = [
  'Integrity', 'Authenticity', 'Growth', 'Creativity', 'Connection',
  'Freedom', 'Security', 'Adventure', 'Excellence', 'Compassion',
  'Wisdom', 'Joy', 'Balance', 'Purpose', 'Service',
  'Innovation', 'Independence', 'Collaboration', 'Gratitude', 'Resilience',
  'Courage', 'Humility', 'Optimism', 'Discipline', 'Empathy',
  'Trust', 'Loyalty', 'Generosity', 'Curiosity', 'Harmony',
  'Passion', 'Achievement', 'Contentment', 'Exploration', 'Reflection',
  'Mindfulness', 'Spontaneity', 'Stability', 'Transformation', 'Unity',
]

const EMOTION_CATEGORIES = {
  'Joy': ['happy', 'elated', 'content', 'grateful', 'peaceful', 'excited', 'hopeful'],
  'Love': ['loved', 'caring', 'compassionate', 'connected', 'appreciated', 'nurturing'],
  'Anger': ['frustrated', 'irritated', 'resentful', 'annoyed', 'hostile', 'bitter'],
  'Fear': ['anxious', 'worried', 'scared', 'nervous', 'overwhelmed', 'stressed'],
  'Sadness': ['sad', 'disappointed', 'lonely', 'grieving', 'melancholy', 'depressed'],
  'Surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'bewildered'],
  'Disgust': ['disgusted', 'repulsed', 'disturbed', 'contemptuous'],
  'Neutral': ['calm', 'neutral', 'indifferent', 'balanced', 'centered'],
}

export default function Phase1Exercises() {
  const params = useParams()
  const experienceId = params.experienceId as string
  const phase = 1

  // Wheel of Life state
  const [wheelData, setWheelData] = useState<WheelOfLifeData>(() => {
    const initial: WheelOfLifeData = {}
    LIFE_AREAS.forEach((area) => {
      initial[area] = 5
    })
    return initial
  })
  const [wheelSaved, setWheelSaved] = useState(false)

  // Core Values state
  const [valuesData, setValuesData] = useState<CoreValuesData>({
    selected: [],
    ranked: [],
  })
  const [valuesSearch, setValuesSearch] = useState('')
  const [valuesSaved, setValuesSaved] = useState(false)
  const [draggedValue, setDraggedValue] = useState<string | null>(null)

  // Emotion Tracker state
  const [emotionData, setEmotionData] = useState<EmotionTrackerData>({
    entries: [],
  })
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [emotionNote, setEmotionNote] = useState('')
  const [emotionSaved, setEmotionSaved] = useState(false)

  // Load existing progress
  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/workbook/progress?phase=1')
      const data = await response.json()
      const progress = data.data || []

      progress.forEach((item: any) => {
        if (item.exercise_key === 'phase-1-wheel-of-life' && item.data) {
          setWheelData(item.data)
        }
        if (item.exercise_key === 'phase-1-core-values' && item.data) {
          setValuesData(item.data)
        }
        if (item.exercise_key === 'phase-1-emotion-tracker' && item.data) {
          setEmotionData(item.data)
        }
      })
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  // Wheel of Life handlers
  const handleWheelChange = (area: string, value: number) => {
    setWheelData((prev) => ({ ...prev, [area]: value }))
    setWheelSaved(false)
  }

  const handleWheelSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-1-wheel-of-life',
          data: wheelData,
          completed: true,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setWheelSaved(true)
      setTimeout(() => setWheelSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  // Core Values handlers
  const filteredValues = CORE_VALUES.filter((value) =>
    value.toLowerCase().includes(valuesSearch.toLowerCase())
  )

  const handleValueToggle = (value: string) => {
    setValuesData((prev) => {
      const isSelected = prev.selected.includes(value)
      const newSelected = isSelected
        ? prev.selected.filter((v) => v !== value)
        : [...prev.selected, value].slice(0, 10) // Max 10 values

      // Remove from ranked if deselected
      const newRanked = isSelected
        ? prev.ranked.filter((v) => v !== value)
        : prev.ranked

      return { selected: newSelected, ranked: newRanked }
    })
    setValuesSaved(false)
  }

  const handleDragStart = (value: string) => {
    setDraggedValue(value)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetIndex: number) => {
    if (!draggedValue) return

    setValuesData((prev) => {
      const ranked = [...prev.ranked]
      const draggedIndex = ranked.indexOf(draggedValue)

      if (draggedIndex === -1) {
        // Add to ranked if not already there
        ranked.splice(targetIndex, 0, draggedValue)
      } else {
        // Reorder existing
        ranked.splice(draggedIndex, 1)
        ranked.splice(targetIndex, 0, draggedValue)
      }

      return { ...prev, ranked: ranked.slice(0, 10) }
    })

    setDraggedValue(null)
    setValuesSaved(false)
  }

  const handleValuesSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-1-core-values',
          data: valuesData,
          completed: valuesData.selected.length >= 5,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setValuesSaved(true)
      setTimeout(() => setValuesSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  // Emotion Tracker handlers
  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    )
  }

  const handleEmotionSave = async () => {
    if (selectedEmotions.length === 0) {
      alert('Please select at least one emotion')
      return
    }

    try {
      const newEntry = {
        emotions: selectedEmotions,
        timestamp: new Date().toISOString(),
        note: emotionNote,
      }

      const updatedEntries = [...emotionData.entries, newEntry]

      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-1-emotion-tracker',
          data: { entries: updatedEntries },
          completed: updatedEntries.length >= 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setEmotionData({ entries: updatedEntries })
      setSelectedEmotions([])
      setEmotionNote('')
      setEmotionSaved(true)
      setTimeout(() => setEmotionSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-monk-burgundy-700 mb-2">
          Phase 1: Self-Evaluation
        </h1>
        <p className="text-monk-brown-600">
          Assess your current state across different life areas to understand where you are now.
        </p>
      </div>

      {/* Exercise 1: Wheel of Life */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 1: Wheel of Life Assessment
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Rate each area of your life from 1-10, where 10 represents complete satisfaction.
        </p>

        <div className="space-y-4">
          {LIFE_AREAS.map((area) => (
            <div key={area} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-monk-burgundy-700">
                  {area}
                </label>
                <span className="text-sm text-monk-brown-600">
                  {wheelData[area]} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={wheelData[area]}
                onChange={(e) => handleWheelChange(area, parseInt(e.target.value))}
                className="w-full h-2 bg-monk-brown-200 rounded-lg appearance-none cursor-pointer accent-monk-burgundy-600"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleWheelSave}
          className={`mt-6 px-6 py-3 rounded-lg transition-colors duration-200 ${
            wheelSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {wheelSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>

      {/* Exercise 2: Core Values */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 2: Core Values Identification
        </h2>
        <p className="text-monk-brown-700 mb-4">
          Select your top 5-10 core values from the list below. You can rank them by dragging.
        </p>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search values..."
            value={valuesSearch}
            onChange={(e) => setValuesSearch(e.target.value)}
            className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
          />
        </div>

        {/* Selected Values Count */}
        <div className="mb-4 text-sm text-monk-brown-600">
          {valuesData.selected.length} of 10 values selected
        </div>

        {/* Ranked Values (Top Priority) */}
        {valuesData.ranked.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-serif text-monk-burgundy-600 mb-3">
              Your Ranked Values (Top Priority)
            </h3>
            <div className="space-y-2">
              {valuesData.ranked.map((value, index) => (
                <div
                  key={value}
                  draggable
                  onDragStart={() => handleDragStart(value)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="flex items-center space-x-3 p-3 bg-monk-gold-50 border border-monk-gold-200 rounded-lg cursor-move hover:bg-monk-gold-100 transition-colors"
                >
                  <span className="text-monk-gold-600 font-bold w-6">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-monk-brown-800 font-medium">
                    {value}
                  </span>
                  <button
                    onClick={() => handleValueToggle(value)}
                    className="text-monk-brown-500 hover:text-monk-burgundy-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Values Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-serif text-monk-burgundy-600 mb-3">
            Select Your Values
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filteredValues.map((value) => {
              const isSelected = valuesData.selected.includes(value)
              const isRanked = valuesData.ranked.includes(value)

              return (
                <button
                  key={value}
                  onClick={() => handleValueToggle(value)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? isRanked
                        ? 'bg-monk-gold-500 text-white'
                        : 'bg-monk-burgundy-600 text-white'
                      : 'bg-monk-brown-100 text-monk-brown-700 hover:bg-monk-brown-200'
                  }`}
                  disabled={!isSelected && valuesData.selected.length >= 10}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleValuesSave}
          disabled={valuesData.selected.length < 5}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            valuesSaved
              ? 'bg-monk-gold-500 text-white'
              : valuesData.selected.length < 5
              ? 'bg-monk-brown-300 text-monk-brown-500 cursor-not-allowed'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {valuesSaved
            ? '✓ Saved'
            : valuesData.selected.length < 5
            ? `Select at least 5 values (${valuesData.selected.length}/5)`
            : 'Save Progress'}
        </button>
      </div>

      {/* Exercise 3: Emotion Tracker */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 3: Emotion Tracker
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Track your emotional patterns over time. Select emotions you're feeling right now.
        </p>

        {/* Emotion Categories */}
        <div className="mb-6 space-y-4">
          {Object.entries(EMOTION_CATEGORIES).map(([category, emotions]) => {
            const categoryColor =
              category === 'Joy' || category === 'Love'
                ? 'green'
                : category === 'Anger' || category === 'Sadness' || category === 'Fear'
                ? 'red'
                : category === 'Neutral'
                ? 'blue'
                : 'purple'

            return (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-monk-burgundy-700">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => {
                    const isSelected = selectedEmotions.includes(emotion)
                    return (
                      <button
                        key={emotion}
                        onClick={() => handleEmotionToggle(emotion)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          isSelected
                            ? categoryColor === 'green'
                              ? 'bg-green-200 text-green-800 border-2 border-green-500'
                              : categoryColor === 'red'
                              ? 'bg-red-200 text-red-800 border-2 border-red-500'
                              : categoryColor === 'blue'
                              ? 'bg-blue-200 text-blue-800 border-2 border-blue-500'
                              : 'bg-purple-200 text-purple-800 border-2 border-purple-500'
                            : 'bg-monk-brown-100 text-monk-brown-700 hover:bg-monk-brown-200 border-2 border-transparent'
                        }`}
                      >
                        {emotion}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
            Optional Note
          </label>
          <textarea
            value={emotionNote}
            onChange={(e) => setEmotionNote(e.target.value)}
            placeholder="What's happening that's influencing these emotions?"
            className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800 resize-none"
            rows={3}
          />
        </div>

        {/* Selected Emotions Summary */}
        {selectedEmotions.length > 0 && (
          <div className="mb-4 p-3 bg-monk-gold-50 border border-monk-gold-200 rounded-lg">
            <p className="text-sm text-monk-brown-700">
              <strong>Selected:</strong> {selectedEmotions.join(', ')}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleEmotionSave}
          disabled={selectedEmotions.length === 0}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            emotionSaved
              ? 'bg-monk-gold-500 text-white'
              : selectedEmotions.length === 0
              ? 'bg-monk-brown-300 text-monk-brown-500 cursor-not-allowed'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {emotionSaved ? '✓ Saved' : 'Save Emotion Entry'}
        </button>

        {/* Recent Entries */}
        {emotionData.entries.length > 0 && (
          <div className="mt-6 pt-6 border-t border-monk-brown-200">
            <h3 className="text-lg font-serif text-monk-burgundy-600 mb-3">
              Recent Entries ({emotionData.entries.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {emotionData.entries.slice(-5).reverse().map((entry, index) => (
                <div
                  key={index}
                  className="p-3 bg-monk-brown-50 rounded-lg border border-monk-brown-200"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm text-monk-brown-600">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.emotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="px-2 py-1 bg-white rounded text-xs text-monk-brown-700 border border-monk-brown-300"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                  {entry.note && (
                    <p className="text-sm text-monk-brown-700 italic">
                      {entry.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
