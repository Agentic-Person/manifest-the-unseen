'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface VisionBoardData {
  images: Array<{
    id: string
    url: string
    category: string
    caption?: string
  }>
}

interface VennDiagramData {
  passion: string[]
  profession: string[]
  vocation: string[]
  mission: string[]
}

interface VisionTreeData {
  root: string
  branches: Array<{
    area: string
    goals: string[]
  }>
}

export default function Phase2Exercises() {
  const params = useParams()
  const experienceId = params.experienceId as string
  const phase = 2

  // Vision Board state
  const [visionBoardData, setVisionBoardData] = useState<VisionBoardData>({ images: [] })
  const [selectedCategory, setSelectedCategory] = useState('Health')
  const [imageUrl, setImageUrl] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [visionBoardSaved, setVisionBoardSaved] = useState(false)

  // Venn Diagram state
  const [vennData, setVennData] = useState<VennDiagramData>({
    passion: [],
    profession: [],
    vocation: [],
    mission: [],
  })
  const [vennInput, setVennInput] = useState('')
  const [vennCategory, setVennCategory] = useState<'passion' | 'profession' | 'vocation' | 'mission'>('passion')
  const [vennSaved, setVennSaved] = useState(false)

  // Vision Tree state
  const [treeData, setTreeData] = useState<VisionTreeData>({
    root: '',
    branches: [],
  })
  const [newBranchArea, setNewBranchArea] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [treeSaved, setTreeSaved] = useState(false)

  const categories = ['Health', 'Wealth', 'Love', 'Travel', 'Career', 'Spirituality']

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/workbook/progress?phase=2')
      const data = await response.json()
      const progress = data.data || []

      progress.forEach((item: any) => {
        if (item.exercise_key === 'phase-2-vision-board' && item.data) {
          setVisionBoardData(item.data)
        }
        if (item.exercise_key === 'phase-2-venn-diagram' && item.data) {
          setVennData(item.data)
        }
        if (item.exercise_key === 'phase-2-vision-tree' && item.data) {
          setTreeData(item.data)
        }
      })
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  // Vision Board handlers
  const handleAddImage = () => {
    if (!imageUrl.trim()) return

    const newImage = {
      id: Date.now().toString(),
      url: imageUrl,
      category: selectedCategory,
      caption: imageCaption,
    }

    setVisionBoardData((prev) => ({
      images: [...prev.images, newImage],
    }))
    setImageUrl('')
    setImageCaption('')
    setVisionBoardSaved(false)
  }

  const handleRemoveImage = (id: string) => {
    setVisionBoardData((prev) => ({
      images: prev.images.filter((img) => img.id !== id),
    }))
    setVisionBoardSaved(false)
  }

  const handleVisionBoardSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-2-vision-board',
          data: visionBoardData,
          completed: visionBoardData.images.length >= 3,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setVisionBoardSaved(true)
      setTimeout(() => setVisionBoardSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  // Venn Diagram handlers
  const handleAddVennItem = () => {
    if (!vennInput.trim()) return

    setVennData((prev) => ({
      ...prev,
      [vennCategory]: [...prev[vennCategory], vennInput],
    }))
    setVennInput('')
    setVennSaved(false)
  }

  const handleRemoveVennItem = (category: keyof VennDiagramData, index: number) => {
    setVennData((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }))
    setVennSaved(false)
  }

  const handleVennSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-2-venn-diagram',
          data: vennData,
          completed: Object.values(vennData).some((arr) => arr.length > 0),
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setVennSaved(true)
      setTimeout(() => setVennSaved(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save progress')
    }
  }

  // Vision Tree handlers
  const handleAddBranch = () => {
    if (!newBranchArea.trim()) return

    setTreeData((prev) => ({
      ...prev,
      branches: [...prev.branches, { area: newBranchArea, goals: [] }],
    }))
    setNewBranchArea('')
    setTreeSaved(false)
  }

  const handleAddGoal = () => {
    if (!newGoal.trim() || selectedBranch === null) return

    setTreeData((prev) => ({
      ...prev,
      branches: prev.branches.map((branch, idx) =>
        idx === selectedBranch ? { ...branch, goals: [...branch.goals, newGoal] } : branch
      ),
    }))
    setNewGoal('')
    setTreeSaved(false)
  }

  const handleTreeSave = async () => {
    try {
      const response = await fetch('/api/workbook/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          exercise_key: 'phase-2-vision-tree',
          data: treeData,
          completed: treeData.root.trim().length > 0 && treeData.branches.length > 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      setTreeSaved(true)
      setTimeout(() => setTreeSaved(false), 3000)
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
          Phase 2: Values & Vision
        </h1>
        <p className="text-monk-brown-600">
          Define your vision and discover your purpose through visual exercises.
        </p>
      </div>

      {/* Exercise 1: Digital Vision Board */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 1: Digital Vision Board Creator
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Add images that represent your goals and desires. Organize them by category.
        </p>

        {/* Add Image Form */}
        <div className="mb-6 space-y-4 p-4 bg-monk-brown-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="What does this represent?"
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              />
            </div>
          </div>
          <button
            onClick={handleAddImage}
            disabled={!imageUrl.trim()}
            className="px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Image
          </button>
        </div>

        {/* Image Grid */}
        {visionBoardData.images.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {visionBoardData.images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={img.caption || img.category}
                    className="w-full h-32 object-cover rounded-lg border border-monk-brown-200"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23ddd" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em">Image</text></svg>'
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-monk-burgundy-600 text-white text-xs px-2 py-1 rounded">
                    {img.category}
                  </div>
                  <button
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleVisionBoardSave}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            visionBoardSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {visionBoardSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>

      {/* Exercise 2: Purpose Venn Diagram */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 2: Purpose Venn Diagram
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Add items to each circle. The center overlap represents your purpose sweet spot.
        </p>

        {/* Add Item Form */}
        <div className="mb-6 p-4 bg-monk-brown-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Category
              </label>
              <select
                value={vennCategory}
                onChange={(e) => setVennCategory(e.target.value as any)}
                className="w-full px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
              >
                <option value="passion">Passion (What you love)</option>
                <option value="profession">Profession (What you're good at)</option>
                <option value="vocation">Vocation (What the world needs)</option>
                <option value="mission">Mission (What you can be paid for)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
                Item
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={vennInput}
                  onChange={(e) => setVennInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVennItem()}
                  placeholder="Enter item..."
                  className="flex-1 px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
                />
                <button
                  onClick={handleAddVennItem}
                  disabled={!vennInput.trim()}
                  className="px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Venn Diagram Circles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {(['passion', 'profession', 'vocation', 'mission'] as const).map((category) => {
            const labels = {
              passion: 'Passion',
              profession: 'Profession',
              vocation: 'Vocation',
              mission: 'Mission',
            }
            return (
              <div key={category} className="p-4 border-2 border-monk-brown-300 rounded-lg">
                <h3 className="font-serif text-monk-burgundy-600 mb-3">{labels[category]}</h3>
                <div className="space-y-2 min-h-[100px]">
                  {vennData[category].length === 0 ? (
                    <p className="text-sm text-monk-brown-500 italic">Add items above</p>
                  ) : (
                    vennData[category].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-monk-brown-50 rounded"
                      >
                        <span className="text-sm text-monk-brown-800">{item}</span>
                        <button
                          onClick={() => handleRemoveVennItem(category, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleVennSave}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            vennSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {vennSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>

      {/* Exercise 3: Vision Statement Tree */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6">
        <h2 className="text-2xl font-serif text-monk-burgundy-600 mb-4">
          Exercise 3: Vision Statement Tree
        </h2>
        <p className="text-monk-brown-700 mb-6">
          Build your life vision hierarchically. Root = overall vision, branches = life areas, leaves = specific goals.
        </p>

        {/* Root Vision */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-monk-burgundy-700 mb-2">
            Your Overall Vision (Root)
          </label>
          <textarea
            value={treeData.root}
            onChange={(e) => setTreeData((prev) => ({ ...prev, root: e.target.value }))}
            placeholder="What is your overall vision for your life?"
            className="w-full px-4 py-3 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800 resize-none"
            rows={3}
          />
        </div>

        {/* Add Branch */}
        <div className="mb-6 p-4 bg-monk-brown-50 rounded-lg">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newBranchArea}
              onChange={(e) => setNewBranchArea(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddBranch()}
              placeholder="Life area (e.g., Career, Health, Relationships)"
              className="flex-1 px-4 py-2 border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
            />
            <button
              onClick={handleAddBranch}
              disabled={!newBranchArea.trim()}
              className="px-4 py-2 bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 transition-colors"
            >
              Add Branch
            </button>
          </div>
        </div>

        {/* Branches and Goals */}
        {treeData.branches.length > 0 && (
          <div className="mb-6 space-y-4">
            {treeData.branches.map((branch, branchIndex) => (
              <div key={branchIndex} className="p-4 border border-monk-brown-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-monk-burgundy-600">{branch.area}</h3>
                  <button
                    onClick={() =>
                      setTreeData((prev) => ({
                        ...prev,
                        branches: prev.branches.filter((_, i) => i !== branchIndex),
                      }))
                    }
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  {branch.goals.length === 0 ? (
                    <p className="text-sm text-monk-brown-500 italic">No goals yet</p>
                  ) : (
                    branch.goals.map((goal, goalIndex) => (
                      <div
                        key={goalIndex}
                        className="flex items-center justify-between p-2 bg-monk-gold-50 rounded"
                      >
                        <span className="text-sm text-monk-brown-800">• {goal}</span>
                        <button
                          onClick={() =>
                            setTreeData((prev) => ({
                              ...prev,
                              branches: prev.branches.map((b, i) =>
                                i === branchIndex
                                  ? { ...b, goals: b.goals.filter((_, gi) => gi !== goalIndex) }
                                  : b
                              ),
                            }))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedBranch === branchIndex ? newGoal : ''}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setSelectedBranch(branchIndex)
                        handleAddGoal()
                      }
                    }}
                    onFocus={() => setSelectedBranch(branchIndex)}
                    placeholder="Add goal..."
                    className="flex-1 px-3 py-1 text-sm border border-monk-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-monk-gold-500 text-monk-brown-800"
                  />
                  <button
                    onClick={() => {
                      setSelectedBranch(branchIndex)
                      handleAddGoal()
                    }}
                    disabled={selectedBranch !== branchIndex || !newGoal.trim()}
                    className="px-3 py-1 text-sm bg-monk-burgundy-600 text-white rounded-lg hover:bg-monk-burgundy-700 disabled:opacity-50 transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleTreeSave}
          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
            treeSaved
              ? 'bg-monk-gold-500 text-white'
              : 'bg-monk-burgundy-600 text-white hover:bg-monk-burgundy-700'
          }`}
        >
          {treeSaved ? '✓ Saved' : 'Save Progress'}
        </button>
      </div>
    </div>
  )
}

