'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface SMARTGoal {
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
}

interface ActionPlanData {
  goals: Array<{
    id: string
    title: string
    dueDate: string
    completed: boolean
  }>
}

interface HabitData {
  habits: Array<{
    id: string
    name: string
    frequency: 'daily' | 'weekly' | 'monthly'
    streak: number
    lastCompleted?: string
  }>
}

export default function Phase3Exercises() {
  const params = useParams()
  const experienceId = params.experienceId as string
  const phase = 3

  // SMART Goals state
  const [smartGoal, setSmartGoal] = useState<SMARTGoal>({
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
  })
  const [smartGoals, setSmartGoals] = useState<SMARTGoal[]>([])
  const [smartSaved, setSmartSaved] = useState(false)

  // Action Plan state
  const [actionPlan, setActionPlan] = useState<ActionPlanData>({ goals: [] })
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDate, setNewGoalDate] = useState('')
  const [actionPlanSaved, setActionPlanSaved] = useState(false)

  // Habit Tracker state
  const [habitData, setHabitData] = useState<HabitData>({ habits: [] })
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitFreq, setNewHabitFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [habitSaved, setHabitSaved] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/workbook/progress?phase=3')
      const data = await response.json()
      const progress = data.data || []

      progress.forEach((item: any) => {
        if (item.exercise_key === 'phase-3-smart-goals' && item.data) {
          setSmartGoals(item.data.goals || [])
        }
        if (item.exercise_key === 'phase-3-action-plan' && item.data) {
          setActionPlan(item.data)
        }
        if (item.exercise_key === 'phase-3-habit-tracker' && item.data) {
          setHabitData(item.data)
        }
      })
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  // SMART Goals handlers
  const handleAddSMARTGoal = () => {
    if (!smartGoal.specific || !smartGoal.measurable || !smartGoal.achievable || !smartGoal.relevant || !smartGoal.timeBound) {
      alert('Please fill all SMART criteria')
      return
    }

    setSmartGoals((prev) => [...prev, { ...smartGoal }])
    setSmartGoal({
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: '',
    })
    setSmartSaved(false)
  }

  const handleSMARTSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-3-smart-goals',
          data: { goals: smartGoals },
          completed: smartGoals.length >= 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setSmartSaved(true)
      setTimeout(() => setSmartSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  // Action Plan handlers
  const handleAddActionGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDate) return

    const newGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      dueDate: newGoalDate,
      completed: false,
    }

    setActionPlan((prev) => ({
      goals: [...prev.goals, newGoal],
    }))
    setNewGoalTitle('')
    setNewGoalDate('')
    setActionPlanSaved(false)
  }

  const handleToggleGoal = (id: string) => {
    setActionPlan((prev) => ({
      goals: prev.goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    }))
    setActionPlanSaved(false)
  }

  const handleActionPlanSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-3-action-plan',
          data: actionPlan,
          completed: actionPlan.goals.length >= 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setActionPlanSaved(true)
      setTimeout(() => setActionPlanSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  // Habit Tracker handlers
  const handleAddHabit = () => {
    if (!newHabitName.trim()) return

    const newHabit = {
      id: Date.now().toString(),
      name: newHabitName,
      frequency: newHabitFreq,
      streak: 0,
    }

    setHabitData((prev) => ({
      habits: [...prev.habits, newHabit],
    }))
    setNewHabitName('')
    setHabitSaved(false)
  }

  const handleCompleteHabit = (id: string) => {
    setHabitData((prev) => ({
      habits: prev.habits.map((habit) => {
        if (habit.id === id) {
          const today = new Date().toISOString().split('T')[0]
          const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toISOString().split('T')[0] : null
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

          let newStreak = habit.streak
          if (!lastCompleted || lastCompleted === yesterday || lastCompleted === today) {
            newStreak = lastCompleted === today ? habit.streak : habit.streak + 1
          } else {
            newStreak = 1
          }

          return {
            ...habit,
            streak: newStreak,
            lastCompleted: new Date().toISOString(),
          }
        }
        return habit
      }),
    }))
    setHabitSaved(false)
  }

  const handleHabitSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-3-habit-tracker',
          data: habitData,
          completed: habitData.habits.length >= 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setHabitSaved(true)
      setTimeout(() => setHabitSaved(false), 3000)
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
          Phase 3: Goal Setting
        </h1>
        <p className="text-monk-brown-600">
          Set clear, actionable goals and build habits to achieve them.
        </p>
      </div>

      {/* Exercise 1: SMART Goals */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 1: SMART Goals Wizard
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Create goals using the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound.
        </p>

        {/* SMART Form */}
        <div className="mb-6 space-y-4 p-4 bg-monk-brown-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
              S - Specific (What exactly do you want?)
            </label>
            <input
              type="text"
              value={smartGoal.specific}
              onChange={(e) => setSmartGoal((prev) => ({ ...prev, specific: e.target.value }))}
              placeholder="Be specific about your goal"
              className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
              M - Measurable (How will you measure success?)
            </label>
            <input
              type="text"
              value={smartGoal.measurable}
              onChange={(e) => setSmartGoal((prev) => ({ ...prev, measurable: e.target.value }))}
              placeholder="How will you track progress?"
              className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
              A - Achievable (Is this realistic?)
            </label>
            <input
              type="text"
              value={smartGoal.achievable}
              onChange={(e) => setSmartGoal((prev) => ({ ...prev, achievable: e.target.value }))}
              placeholder="Why is this achievable?"
              className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
              R - Relevant (Why does this matter?)
            </label>
            <input
              type="text"
              value={smartGoal.relevant}
              onChange={(e) => setSmartGoal((prev) => ({ ...prev, relevant: e.target.value }))}
              placeholder="Why is this important to you?"
              className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
              T - Time-bound (When will you achieve this?)
            </label>
            <input
              type="text"
              value={smartGoal.timeBound}
              onChange={(e) => setSmartGoal((prev) => ({ ...prev, timeBound: e.target.value }))}
              placeholder="Deadline or timeline"
              className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
          </div>
          <button
            onClick={handleAddSMARTGoal}
            className="w-full px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 transition-colors"
          >
            Add SMART Goal
          </button>
        </div>

        {/* Goals List */}
        {smartGoals.length > 0 && (
          <div className="mb-6 space-y-4">
            {smartGoals.map((goal, index) => (
              <div key={index} className="p-4 border border-monk-brown-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>S:</strong> {goal.specific}</div>
                  <div><strong>M:</strong> {goal.measurable}</div>
                  <div><strong>A:</strong> {goal.achievable}</div>
                  <div><strong>R:</strong> {goal.relevant}</div>
                  <div className="col-span-2"><strong>T:</strong> {goal.timeBound}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSMARTSave}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            smartSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {smartSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>

      {/* Exercise 2: 60-Day Action Plan */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 2: 60-Day Action Plan Generator
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Create actionable goals with deadlines. Track your progress over the next 60 days.
        </p>

        {/* Add Goal Form */}
        <div className="mb-6 p-4 bg-monk-brown-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={newGoalDate}
                onChange={(e) => setNewGoalDate(e.target.value)}
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              />
            </div>
          </div>
          <button
            onClick={handleAddActionGoal}
            disabled={!newGoalTitle.trim() || !newGoalDate}
            className="w-full px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Goal
          </button>
        </div>

        {/* Goals Timeline */}
        {actionPlan.goals.length > 0 && (
          <div className="mb-6 space-y-2">
            {actionPlan.goals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  goal.completed
                    ? 'bg-monk-gold-50 border-monk-gold-200'
                    : 'bg-white border-monk-brown-200'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-medium ${goal.completed ? 'line-through text-monk-brown-500' : 'text-monk-burgundy-700'}`}>
                    {goal.title}
                  </div>
                  <div className="text-sm text-monk-brown-600">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    goal.completed
                      ? 'bg-monk-gold-500 text-white'
                      : 'bg-monk-brown-200 text-monk-brown-700 hover:bg-monk-brown-300'
                  }`}
                >
                  {goal.completed ? '✓ Done' : 'Mark Complete'}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleActionPlanSave}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            actionPlanSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {actionPlanSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>

      {/* Exercise 3: Habit Tracker */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 3: Habit Tracker
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Track daily habits and build streaks. Consistency is key to transformation.
        </p>

        {/* Add Habit Form */}
        <div className="mb-6 p-4 bg-monk-brown-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Morning meditation"
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Frequency
              </label>
              <select
                value={newHabitFreq}
                onChange={(e) => setNewHabitFreq(e.target.value as any)}
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddHabit}
            disabled={!newHabitName.trim()}
            className="w-full px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Habit
          </button>
        </div>

        {/* Habits List */}
        {habitData.habits.length > 0 && (
          <div className="mb-6 space-y-3">
            {habitData.habits.map((habit) => {
              const today = new Date().toISOString().split('T')[0]
              const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toISOString().split('T')[0] : null
              const isCompletedToday = lastCompleted === today

              return (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-4 border border-monk-brown-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-monk-burgundy-700">{habit.name}</div>
                    <div className="text-sm text-monk-brown-600">
                      {habit.frequency} • 🔥 {habit.streak} day streak
                      {habit.lastCompleted && (
                        <span className="ml-2">
                          Last: {new Date(habit.lastCompleted).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={isCompletedToday}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isCompletedToday
                        ? 'bg-monk-gold-500 text-white cursor-not-allowed'
                        : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
                    }`}
                  >
                    {isCompletedToday ? '✓ Done Today' : 'Complete'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={handleHabitSave}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            habitSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {habitSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>
    </div>
  )
}

