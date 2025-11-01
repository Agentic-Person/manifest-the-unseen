'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface WorkbookProgress {
  phase: number
  exercise_key: string
  completed: boolean
  data: any
}

const PHASE_NAMES: Record<number, string> = {
  1: 'Self-Evaluation',
  2: 'Values & Vision',
  3: 'Goal Setting',
  4: 'Facing Fears & Limiting Beliefs',
  5: 'Self-Love & Self-Care',
  6: 'Manifestation Techniques',
  7: 'Practicing Gratitude',
  8: 'Turning Envy Into Inspiration',
  9: 'Trust & Surrender',
  10: 'Universal Laws',
}

const EXERCISES_PER_PHASE: Record<number, string[]> = {
  1: ['Wheel of Life Assessment', 'Core Values Identification', 'Emotion Tracker'],
  2: ['Digital Vision Board Creator', 'Purpose Venn Diagram', 'Vision Statement Tree'],
  3: ['SMART Goals Wizard', '60-Day Action Plan Generator', 'Habit Tracker'],
  4: ['Core Beliefs Examination', 'Fear Ladder Visualization', 'Thought Restructuring Tool'],
  5: ['Self-Love Quiz', 'Circle of Control Visualization', 'Healthy Mind Platter Assessment'],
  6: ['369 Method Tracker', 'Scripting Studio', 'Digital Vision Board (Enhanced)'],
  7: ['Daily Gratitude Journal', 'Digital Gratitude Jar', 'Gratitude Prayer Creator'],
  8: ['Envy Identification Worksheet', 'Inspiration-Based Goal Setting', 'Envy-to-Inspiration Transformation Flow'],
  9: ['Trust Assessment', 'Sign & Synchronicity Journal', 'Letting Go Worksheets'],
  10: ['11 Universal Laws Education Module', 'Law Application Exercises', 'Integration Practices'],
}

export default function WorkbookPage() {
  const params = useParams()
  const experienceId = params.experienceId as string
  const [currentPhase, setCurrentPhase] = useState(1)
  const [progress, setProgress] = useState<WorkbookProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/workbook/progress')
      const data = await response.json()
      setProgress(data.data || [])
      setCurrentPhase(data.current_phase || 1)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPhaseProgress = (phase: number) => {
    const phaseExercises = EXERCISES_PER_PHASE[phase] || []
    const phaseProgress = progress.filter((p) => p.phase === phase)
    const completed = phaseProgress.filter((p) => p.completed).length
    return { total: phaseExercises.length, completed }
  }

  const isPhaseUnlocked = (phase: number) => {
    return phase <= currentPhase
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-monk-burgundy-700 mb-2">
          Interactive Workbook
        </h1>
        <p className="text-monk-brown-600">
          Progress through 10 transformative phases with structured exercises and practices.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium text-monk-burgundy-700">
            Overall Progress
          </span>
          <span className="text-lg font-medium text-monk-gold-600">
            Phase {currentPhase} of 10
          </span>
        </div>
        <div className="w-full bg-monk-brown-200 rounded-full h-3">
          <div
            className="bg-monk-gold-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(currentPhase / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Phases Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-monk-brown-600">Loading workbook...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((phase) => {
            const phaseProgress = getPhaseProgress(phase)
            const unlocked = isPhaseUnlocked(phase)
            const isCurrentPhase = phase === currentPhase

            return (
              <div
                key={phase}
                className={`bg-white rounded-lg shadow-md border-2 p-6 transition-all duration-200 ${
                  unlocked
                    ? 'border-monk-brown-200 hover:shadow-lg'
                    : 'border-monk-brown-100 opacity-60'
                } ${isCurrentPhase ? 'ring-2 ring-monk-gold-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-serif text-monk-burgundy-600">
                      Phase {phase}: {PHASE_NAMES[phase]}
                    </h3>
                    {isCurrentPhase && (
                      <span className="inline-block mt-1 text-xs bg-monk-gold-100 text-monk-burgundy-700 px-2 py-1 rounded">
                        Current Phase
                      </span>
                    )}
                  </div>
                  {!unlocked && (
                    <span className="text-sm text-monk-brown-500">🔒 Locked</span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-monk-brown-600 mb-1">
                    <span>
                      {phaseProgress.completed} of {phaseProgress.total} exercises completed
                    </span>
                    <span>
                      {phaseProgress.total > 0
                        ? Math.round((phaseProgress.completed / phaseProgress.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-monk-brown-200 rounded-full h-2">
                    <div
                      className="bg-monk-burgundy-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${phaseProgress.total > 0 ? (phaseProgress.completed / phaseProgress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {EXERCISES_PER_PHASE[phase]?.map((exercise, idx) => {
                    const exerciseKey = `phase-${phase}-exercise-${idx + 1}`
                    const exerciseProgress = progress.find(
                      (p) => p.phase === phase && p.exercise_key === exerciseKey
                    )
                    const completed = exerciseProgress?.completed || false

                    return (
                      <div
                        key={exerciseKey}
                        className="flex items-center space-x-2 text-sm text-monk-brown-700"
                      >
                        <span>{completed ? '✅' : '○'}</span>
                        <span className={completed ? 'line-through opacity-60' : ''}>
                          {exercise}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {unlocked ? (
                  <Link
                    href={`/customer/${experienceId}/workbook/phase-${phase}`}
                    className="inline-block px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 transition-colors duration-200 text-sm"
                  >
                    {isCurrentPhase ? 'Continue Phase →' : 'View Phase →'}
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-block px-4 py-2 bg-monk-brown-300 text-monk-brown-500 rounded-lg cursor-not-allowed text-sm"
                  >
                    Complete Phase {phase - 1} to unlock
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
