# Manifest the Unseen: Core App Architecture

## Overview
This document outlines the comprehensive architecture for the Manifest the Unseen app on the Whop platform. The app is structured around four core pillars that work together to provide a complete manifestation experience.

---

## App Foundation

### Platform: Whop Integration
- **Consumer experience app** embedded in Whop's ecosystem
- OAuth authentication handled by Whop (no custom login needed)
- Multi-tenant architecture supporting multiple communities
- Payment processing managed by Whop
- Sidebar navigation integration

### Tech Stack
- **Frontend**: React with Next.js
- **Styling**: Tailwind CSS + Frosted UI (Whop's UI kit)
- **Backend**: Node.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI/LLM**: Claude Haiku 4.5 API (cost-efficient at $1/1M input, $5/1M output tokens)
- **Voice**: ElevenLabs API for text-to-speech
- **Workflow Automation**: n8n (optional for backend workflow orchestration)

---

## Four Pillars Architecture

## Pillar 1: AI Monk Mentor

### Purpose
The heart of the app - a conversational AI guide with a calming monk-like voice personality that provides 24/7 manifestation coaching.

### Core Features

#### 1. Conversational Interface
- Text-based chat interface with streaming responses
- Voice playback option using ElevenLabs-generated monk voice
- Context-aware conversations remembering user's journey
- Progressive teaching introducing concepts from all 10 book chapters

#### 2. Voice Personality
**System Prompt Template:**
```
You are Luna, a wise and peaceful manifestation mentor with deep knowledge of quantum manifestation, identity architecture, and frequency alignment. 

Your purpose is to guide users through the "Manifest the Unseen" methodology.

Communication style:
- Speak in short, contemplative sentences
- Ask thoughtful, probing questions
- Help users recognize their "signal beneath desire"
- Reference identity architecture, frequency vs force, embodiment concepts
- Never judgmental, always encouraging and calm
- Use metaphors from nature and quantum physics

Current context:
- User is in Phase {phaseNumber} of the workbook
- Their primary manifestation goal: {userGoal}
- Recent journal themes: {recentThemes}

Remember: You help users shift reality by becoming the version of themselves that their desires already belong to.
```

#### 3. Intelligent Features
- **Daily Check-ins**: "How are you feeling today? What's your signal telling you?"
- **Pattern Recognition**: Analyzes journal entries to identify limiting beliefs
- **Frequency Analysis**: Detects when user's language reveals fear vs. faith
- **Signal Contradictions**: Points out misalignment between stated desires and underlying beliefs
- **Progress Celebration**: Acknowledges growth and milestones
- **Concept Teaching**: Explains chapters 1-10 concepts when relevant

#### 4. Technical Implementation
```javascript
// API Structure
POST /api/chat
{
  userId: string,
  message: string,
  context: {
    currentPhase: number,
    recentJournals: string[],
    userGoals: string[],
    completedExercises: string[]
  }
}

Response:
{
  reply: string,
  audioUrl?: string,  // ElevenLabs generated audio
  insights: string[],  // Detected patterns or suggestions
  nextSuggestion: string
}
```

#### 5. Voice Generation
- **ElevenLabs Professional Voice Clone**
- Record 10-15 minutes of calm, meditative speech
- Clone voice with professional tier for high-quality output
- Generate audio responses in real-time for key messages
- Cache common responses to reduce API costs

---

## Pillar 2: Interactive Digital Workbook (10 Phases)

### Purpose
Transform the 200+ page physical workbook into an engaging digital experience with progress tracking and gamification.

### Phase Structure

#### **Phase 1: Self-Evaluation** (Pages 1-54)

**Exercises to Digitize:**

1. **Wheel of Life Assessment**
   - Interactive circular chart with 8-10 life areas
   - Tap or drag to rate each area (1-10)
   - Visual representation shows imbalances
   - Save snapshots for progress comparison
   
2. **Emotion Tracker**
   - Digital feelings wheel with color-coded emotions
   - Tap to select current emotions
   - Track emotional patterns over time
   - AI identifies recurring emotional states

3. **ABC Model Worksheets**
   - Form-based input: Activating Event → Beliefs → Consequences
   - Save multiple ABC entries
   - AI helps reframe beliefs

4. **SWAT Analysis**
   - Four-quadrant form: Strengths, Weaknesses, Opportunities, Threats
   - Tag system for categorization
   
5. **Comfort Zone Mapping**
   - Concentric circles: Comfort → Stretch → Panic zones
   - Drag activities into appropriate zones
   - Set goals to expand comfort zone

6. **Values Identification**
   - Values bingo: Select from 50+ core values
   - Rank top 5-10 values by importance
   - Values ranking exercise

**Data Model:**
```javascript
phase1: {
  wheelOfLife: {
    career: 7,
    relationships: 8,
    health: 6,
    // ... other areas
    completedDate: timestamp
  },
  emotionTracker: [{
    emotions: ['hopeful', 'anxious'],
    timestamp: timestamp,
    context: string
  }],
  abcModels: [{
    event: string,
    belief: string,
    consequence: string,
    reframe: string
  }],
  swatAnalysis: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
  comfortZone: { comfort: [], stretch: [], panic: [] },
  coreValues: ['integrity', 'growth', 'creativity']
}
```

---

#### **Phase 2: Values & Vision** (Pages 55-69)

**Exercises to Digitize:**

1. **Purpose Venn Diagram Builder**
   - Four overlapping circles: Passion + Profession + Vocation + Mission
   - Add items to each circle
   - Center shows overlap = purpose sweet spot

2. **Digital Vision Board Creator**
   - Upload images or select from library
   - Organized by categories: Health, Wealth, Love, Travel, Career, Spirituality
   - Drag and drop interface
   - Set as lock screen/wallpaper option

3. **Vision Statement Tree**
   - Hierarchical visualization of life vision
   - Branches for each major life area
   - Editable text nodes

4. **Core Values Flower**
   - Petal-based visualization
   - Each petal = one core value
   - Tap to see value definition and how it shows up in life

**Data Model:**
```javascript
phase2: {
  purposeVenn: {
    passion: [],
    profession: [],
    vocation: [],
    mission: [],
    purpose: string
  },
  visionBoard: {
    images: [{url: string, category: string}],
    lastUpdated: timestamp
  },
  visionStatement: string,
  valuesFlower: [{value: string, description: string, examples: []}]
}
```

---

#### **Phase 3: Goal Setting** (Pages 70-82)

**Exercises to Digitize:**

1. **SMART Goals Wizard**
   - Step-by-step form guiding through:
     - Specific: What exactly do you want?
     - Measurable: How will you track progress?
     - Achievable: Is this realistic?
     - Relevant: Does this align with values?
     - Time-bound: When will you achieve this?
   - AI validates each component

2. **60-Day Action Plan Generator**
   - Break goals into weekly milestones
   - Daily action tracker
   - Visual timeline with completion markers

3. **Habit Tracker**
   - Daily, weekly, monthly habits
   - Streak counter
   - Habit stacking suggestions

4. **Short-Term vs Long-Term Dashboard**
   - Dual-column view
   - Progress bars for each goal
   - Celebration animations on completion

**Data Model:**
```javascript
phase3: {
  smartGoals: [{
    specific: string,
    measurable: string,
    achievable: string,
    relevant: string,
    timeBound: date,
    progress: number,
    milestones: []
  }],
  actionPlan: {
    startDate: date,
    weeks: [{weekNumber: number, actions: [], completed: boolean}]
  },
  habits: [{
    name: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    streak: number,
    completedDates: []
  }]
}
```

---

#### **Phase 4: Facing Fears & Limiting Beliefs** (Pages 83-95)

**Exercises to Digitize:**

1. **Core Beliefs Examination**
   - List limiting beliefs
   - Provide "evidence" for each belief
   - AI helps challenge evidence
   - Reframe into empowering beliefs

2. **Thought Restructuring Tool**
   - "Putting Thoughts on Trial" exercise
   - Input: Negative thought
   - Process: Evidence for/against, alternative perspectives
   - Output: Restructured thought

3. **Fear Ladder Visualization**
   - List fears from least to most intense
   - Visual ladder representation
   - Track which fears have been faced
   - Celebration for climbing rungs

4. **Forgiveness Letter Writing**
   - Guided prompts for writing forgiveness letters
   - Private (not sent) or option to send
   - Store letters in vault

**Data Model:**
```javascript
phase4: {
  limitingBeliefs: [{
    belief: string,
    evidence: [],
    challenges: [],
    reframe: string,
    reframedDate: timestamp
  }],
  thoughtRestructuring: [{
    originalThought: string,
    evidenceFor: [],
    evidenceAgainst: [],
    alternativePerspectives: [],
    restructuredThought: string
  }],
  fearLadder: [{
    fear: string,
    intensity: number,
    faced: boolean,
    facedDate: timestamp
  }],
  forgivenessLetters: [{
    recipient: string,
    letter: string,
    date: timestamp
  }]
}
```

---

#### **Phase 5: Self-Love & Self-Care** (Pages 96-117)

**Exercises to Digitize:**

1. **Self-Love Quiz**
   - 20-30 question assessment
   - Generates self-love score
   - Identifies areas needing attention
   - Personalized recommendations

2. **12-Day Self-Care Challenge**
   - Daily challenge cards
   - Progress tracker
   - Completion badges
   - Share progress option

3. **Healthy Mind Platter Assessment**
   - 7 areas of mental wellness:
     - Focus time
     - Play time
     - Connecting time
     - Physical time
     - Time in
     - Down time
     - Sleep time
   - Rate current balance
   - AI suggests improvements

4. **Self-Care Routine Builder**
   - Morning, afternoon, evening, night routines
   - Drag and drop activities
   - Set reminders
   - Track consistency

5. **Circle of Control Visualization**
   - Three concentric circles:
     - Control (inner)
     - Influence (middle)
     - Concern (outer)
   - Drag worries/situations into appropriate circle
   - Focus attention on control circle

**Data Model:**
```javascript
phase5: {
  selfLoveQuiz: {
    score: number,
    weakAreas: [],
    completedDate: timestamp
  },
  selfCareChallenge: {
    currentDay: number,
    completedDays: [],
    badges: []
  },
  healthyMindPlatter: {
    focusTime: number,
    playTime: number,
    connectingTime: number,
    physicalTime: number,
    timeIn: number,
    downTime: number,
    sleepTime: number
  },
  routines: {
    morning: [],
    afternoon: [],
    evening: [],
    night: []
  },
  circleOfControl: {
    control: [],
    influence: [],
    concern: []
  }
}
```

---

#### **Phase 6: Manifestation Techniques** (Pages 118-169)

**This is the core manifestation toolbox - most feature-rich phase**

**Exercises to Digitize:**

1. **369 Method Tracker**
   - 3x morning (6am-12pm)
   - 6x afternoon (12pm-6pm)
   - 9x evening (6pm-12am)
   - Input: Desire statement
   - Checkboxes for each writing session
   - Streak tracker
   - Daily reminders

2. **Scripting Studio**
   - Future-self journaling templates
   - AI prompts: "You're writing from the version of you who already has ___"
   - Voice-to-text option
   - Save and revisit scripts
   - "Mental movie method" - convert script to slideshow with images

3. **Digital Vision Board (Enhanced)**
   - 6 life categories: Health, Money, Love, Travel, Spirituality, Lifestyle
   - Upload photos or use AI-generated images
   - Add affirmations to images
   - Daily view reminder
   - Set as device wallpaper

4. **Water Method Guide**
   - Two glass visualization
   - Step-by-step instructions
   - Intention writing prompt
   - Completion tracker

5. **Mirror Method Timer**
   - Choose affirmation or create custom
   - Set duration (3-5 minutes recommended)
   - Timer with soft background music
   - Track daily practice

6. **Pillar Method Builder**
   - Create 3-5 manifestation pillars
   - Each pillar = belief supporting your desire
   - Daily reinforcement prompts

7. **Two-Cup Method Guide**
   - Quantum jumping visualization
   - Current state → Desired state
   - Guided meditation accompaniment

8. **Knot Method Tracker**
   - Intention setting
   - Visual knot representation
   - Daily reinforcement

**Additional Techniques:**
- Gratitude prayers
- Act as if journal prompts
- Living in the end visualization
- Revision technique exercises
- State akin to sleep (SATS) meditation
- Time-lapse method

**Data Model:**
```javascript
phase6: {
  method369: {
    desire: string,
    startDate: date,
    sessions: [{
      date: date,
      morning: boolean,
      afternoon: boolean,
      evening: boolean
    }],
    streak: number
  },
  scripts: [{
    title: string,
    content: string,
    date: timestamp,
    favorite: boolean
  }],
  visionBoards: [{
    category: string,
    images: [],
    affirmations: []
  }],
  methodsCompleted: {
    waterMethod: boolean,
    mirrorMethod: {practiced: boolean, streak: number},
    pillarMethod: [{pillar: string}],
    twoCupMethod: boolean,
    knotMethod: boolean
  }
}
```

---

#### **Phase 7: Practicing Gratitude** (Pages 170-177)

**Exercises to Digitize:**

1. **Daily Gratitude Journal**
   - Morning gratitude prompt
   - Evening gratitude prompt
   - "Three things" quick entry
   - AI suggests gratitude prompts when stuck

2. **Digital Gratitude Jar**
   - Write gratitude notes
   - Visual jar fills up
   - Random note drawer for tough days

3. **Gratitude Prayer Creator**
   - Template-based or free-form
   - Save favorite prayers
   - Daily prayer reminder

4. **Gratitude Blitz Timer**
   - 60-second rapid-fire gratitude listing
   - Voice or text input
   - See how many items in 60 seconds

**Data Model:**
```javascript
phase7: {
  dailyGratitude: [{
    date: date,
    morning: [],
    evening: [],
    threeThings: []
  }],
  gratitudeJar: [{
    note: string,
    date: timestamp
  }],
  gratitudePrayers: [{
    prayer: string,
    favorite: boolean
  }],
  blitzSessions: [{
    date: timestamp,
    items: [],
    count: number
  }]
}
```

---

#### **Phase 8: Turning Envy Into Inspiration** (Pages 178-183)

**Exercises to Digitize:**

1. **Envy Identification Worksheet**
   - Who/what triggers envy?
   - What specifically triggers it?
   - What does this reveal about your desires?

2. **Inspiration-Based Goal Setting**
   - Transform envy into inspired action
   - Create goals based on envy insights
   - Action plan generator

**Data Model:**
```javascript
phase8: {
  envyTriggers: [{
    person: string,
    situation: string,
    feeling: string,
    insight: string,
    inspiredGoal: string
  }]
}
```

---

#### **Phase 9: Trust & Surrender** (Pages 184-192)

**Exercises to Digitize:**

1. **Trust Assessment**
   - Rate trust in universe/process
   - Identify trust blockers
   - Exercises to build trust

2. **Letting Go Worksheets**
   - What are you trying to control?
   - What would happen if you let go?
   - Surrender affirmations

3. **Sign & Synchronicity Journal**
   - Record signs from universe
   - Pattern recognition
   - Meaning interpretation

**Data Model:**
```javascript
phase9: {
  trustAssessment: {
    score: number,
    blockers: [],
    date: timestamp
  },
  lettingGo: [{
    controlledThing: string,
    fear: string,
    surrenderAffirmation: string
  }],
  synchronicities: [{
    sign: string,
    date: timestamp,
    meaning: string
  }]
}
```

---

#### **Phase 10: Universal Laws** (Pages 197-201, 209-211)

**Exercises to Digitize:**

1. **11 Universal Laws Education Module**
   - Interactive learning cards for each law:
     1. Law of Divine Oneness
     2. Law of Vibration
     3. Law of Correspondence
     4. Law of Attraction
     5. Law of Inspired Action
     6. Law of Perpetual Transmutation of Energy
     7. Law of Cause and Effect
     8. Law of Compensation
     9. Law of Relativity
     10. Law of Polarity
     11. Law of Rhythm
   - Swipeable cards with explanations
   - Real-life examples
   - Quiz to test understanding

2. **Law Application Exercises**
   - Daily prompts applying each law
   - Reflection journal for each law

3. **Integration Practices**
   - How all 10 phases come together
   - Personalized manifestation protocol
   - Ongoing maintenance plan

**Data Model:**
```javascript
phase10: {
  lawsLearned: {
    divineOneness: {completed: boolean, score: number},
    vibration: {completed: boolean, score: number},
    // ... all 11 laws
  },
  applicationExercises: [{
    law: string,
    exercise: string,
    reflection: string,
    date: timestamp
  }],
  manifestationProtocol: {
    daily: [],
    weekly: [],
    monthly: []
  }
}
```

---

### Gamification System

**Progress Tracking:**
- Overall completion percentage (0-100%)
- Phase-by-phase progress bars
- Exercise completion checkmarks

**Badges & Achievements:**
- "Self-Evaluator" - Complete Phase 1
- "Visionary" - Complete Phase 2
- "Goal Getter" - Complete Phase 3
- "Fearless" - Complete Phase 4
- "Self-Love Champion" - Complete Phase 5
- "Manifestation Master" - Complete Phase 6
- "Gratitude Guru" - Complete Phase 7
- "Inspired Creator" - Complete Phase 8
- "Trusting Soul" - Complete Phase 9
- "Universal Knower" - Complete Phase 10
- "369 Streak" - 21 days of 369 method
- "Daily Devotee" - 30 days of daily practice
- "Meditation Master" - 100 meditations completed

**Level System:**
1. Seeker (0-20% complete)
2. Practitioner (21-50% complete)
3. Advanced (51-80% complete)
4. Master Manifestor (81-100% complete)

**Signal Strength Score:**
- Algorithm calculating manifestation alignment (0-100)
- Factors: consistency, journal sentiment, exercise completion
- Visual representation (color-coded energy field)

---

## Pillar 3: Journaling Suite

### Purpose
Comprehensive journaling system with AI analysis to identify patterns, limiting beliefs, and manifestation progress.

### Journal Types

#### 1. Free-Form Daily Journal
- Blank canvas for thoughts, feelings, dreams
- Rich text editor with formatting options
- Voice-to-text option
- Date/time stamped
- Searchable archive
- Export capability

**AI Analysis:**
- Sentiment analysis (positive/negative/neutral)
- Emotion detection (joy, fear, anger, sadness, excitement)
- Keyword extraction (recurring themes)
- Pattern recognition over time
- Automatic insights: "I notice you mentioned 'not enough' five times this week"

#### 2. Guided Journal Prompts
Pre-written prompts pulled from workbook:
- "What emotions are you constantly feeling?"
- "Who do you want to become?"
- "What does your ideal life look like?"
- "What beliefs are holding you back?"
- "What would you do if you knew you couldn't fail?"
- 500+ total prompts organized by theme

**Categories:**
- Self-discovery
- Desire clarification
- Fear exploration
- Gratitude practice
- Future-self connection
- Past healing

#### 3. Manifestation Scripting Journal
- Template: "It is [date]. I am so grateful that..."
- Future-tense writing exercises
- "Write as if it's already happened"
- AI ensures present/past tense (not future)
- Suggest improvements for more feeling/specificity

#### 4. Signal Tracker Journal
- Quick daily entry: "What's my signal today?"
- High vibe vs. low vibe emotion selection
- Feelings wheel integration
- Frequency rating (1-10)
- Pattern visualization over weeks/months

#### 5. Worry Jar Journal
- Write worries, anxieties, fears
- Store them in digital jar
- AI categorizes worries
- Suggest coping strategies
- Periodic review: "Has this worry materialized?"

#### 6. Dream Journal
- Record dreams upon waking
- AI identifies recurring symbols
- Track manifestation signs in dreams

### AI Mentor Integration

**Pattern Detection:**
- "You've mentioned 'money is scarce' 7 times this month - let's explore this limiting belief"
- "Your journal entries show increasing confidence since starting Phase 5"
- "I notice fear comes up when discussing your career goal"

**Frequency Analysis:**
- Emotional trajectory chart (weekly/monthly)
- High vibe days vs. low vibe days ratio
- Correlation between journaling and mood improvement

**Signal Contradictions:**
- "You say you're ready for love, but your language suggests fear of vulnerability"
- "Your desire is abundance, but your journal reveals scarcity mindset"

**Progress Celebrations:**
- "Your first journal entry was full of doubt. Look at your confidence now!"
- "You've shifted your language from 'I want' to 'I am' - powerful transformation"

### Technical Implementation

**Data Model:**
```javascript
journalEntry: {
  id: uuid,
  userId: string,
  type: 'freeForm' | 'guided' | 'scripting' | 'signalTracker' | 'worryJar' | 'dream',
  content: string,
  audioUrl?: string, // if voice recorded
  date: timestamp,
  aiAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral',
    emotions: [],
    keywords: [],
    limitingBeliefs: [],
    insights: []
  },
  linkedPhase?: number,
  linkedExercise?: string
}
```

**API Routes:**
```javascript
POST /api/journal/create
GET /api/journal/list?userId&startDate&endDate&type
GET /api/journal/{id}
PUT /api/journal/{id}
DELETE /api/journal/{id}
POST /api/journal/analyze // Trigger AI analysis
GET /api/journal/insights // Get pattern insights
```

---

## Pillar 4: Meditation & Audio Library

### Purpose
Comprehensive sound healing and guided meditation section for daily practice and frequency alignment.

### Ambient Soundscapes (15-minute loops)

**Nature Sounds:**
- Ocean waves
- Rain and thunder
- Forest ambiance (birds, wind)
- Flowing river/stream
- Gentle rainfall

**Instrument-Based:**
- Tibetan singing bowls (various frequencies)
- Steel drum rhythms
- Crystal bowls
- Wind chimes
- Native American flute

**Binaural Beats:**
- 432 Hz (healing frequency)
- 528 Hz (transformation/miracles)
- 639 Hz (connection/relationships)
- 741 Hz (intuition/expression)
- 963 Hz (spiritual connection)

**Combined Soundscapes:**
- Bowls + water
- Rain + forest
- Bowls + binaural beats

### Guided Meditation Library

**Foundation Series (Based on Book Chapters):**

1. **"Finding Your Signal"** (12 min) - Chapter 1
   - Understanding desire vs. signal
   - Body scan to locate your true signal
   - Differentiating fear from faith

2. **"Building Identity Architecture"** (15 min) - Chapter 2
   - Meditation on who you're becoming
   - Shedding old identity
   - Embodying new identity

3. **"Frequency Over Force"** (10 min) - Chapter 3
   - Releasing need to force outcomes
   - Aligning with natural frequency
   - Effortless manifestation state

4. **"The Power of Embodiment"** (15 min) - Chapter 4
   - Full-body embodiment practice
   - Living AS the desired reality
   - Cellular-level belief integration

5. **"Energetic Clarity"** (12 min) - Chapter 5
   - Clearing energetic static
   - Sharp, clear signal transmission
   - Removing contradictions

6. **"Emotional Authority"** (10 min) - Chapter 6
   - Feeling emotions without being controlled
   - Following your emotional signal
   - Emotional mastery

7. **"Quantum Field Activation"** (15 min) - Chapter 7
   - Entering the quantum field
   - Collapsing desired reality
   - Observer effect meditation

8. **"Rewriting Your Past"** (12 min) - Chapter 8
   - Healing past wounds
   - Revision technique
   - Changing past emotional charge

9. **"Future Self Connection"** (15 min) - Chapter 9
   - Meeting your future self
   - Receiving guidance from future you
   - Bridging present and future

10. **"Living as the Field"** (20 min) - Chapter 10
    - Ultimate embodiment
    - You ARE the field
    - Non-dual awareness

**Daily Practice Series:**

- **Morning Frequency Alignment** (5 min)
  - Set signal for the day
  - Morning intention
  - Energy activation

- **Midday Signal Check** (3 min)
  - Quick recalibration
  - Frequency assessment
  - Course correction

- **Evening Gratitude Practice** (7 min)
  - Gratitude meditation
  - Day reflection
  - Release and surrender

- **Sleep Manifestation** (20 min)
  - State akin to sleep (SATS)
  - Sleeping as your desire fulfilled
  - Subconscious programming

**Specialized Manifestation Series:**

- **Body Scan for Blocks** (15 min)
  - Identify where resistance lives in body
  - Release somatic blocks
  - Energy clearing

- **Limiting Belief Release** (12 min)
  - Identify limiting belief
  - Challenge and release
  - Install empowering belief

- **Abundance Frequency Activation** (10 min)
  - Tune into abundance frequency
  - Feel wealthy now
  - Money magnetism

- **Love & Relationship Manifestation** (15 min)
  - Heart opening
  - Love frequency embodiment
  - Attracting ideal partner

- **Career & Purpose Clarity** (12 min)
  - Connect with soul purpose
  - Career vision
  - Aligned action

- **Health & Vitality** (10 min)
  - Perfect health embodiment
  - Cellular healing
  - Body trust

- **Quantum Jumping** (15 min)
  - Shift timelines
  - Jump to desired reality
  - Parallel universe meditation

### Meditation Features

**Player Interface:**
- Play/pause, skip forward/back 15 seconds
- Speed control (0.75x, 1x, 1.25x)
- Background soundscape selector
- Sleep timer (10, 15, 20, 30 minutes, until end)
- Repeat/loop option
- Add to favorites
- Download for offline (premium)

**Tracking & Stats:**
- Total meditation time
- Meditation streak (consecutive days)
- Favorite meditations
- Recently played
- Completion rate
- Badges: 10 meditations, 50, 100, 500

**Background Selection:**
- None (just voice)
- Soft music
- Nature sounds
- Bowls
- Binaural beats
- Custom volume mixing

### AI Voice Generation Process

**ElevenLabs Integration:**

1. **Voice Creation:**
   - Record 10-15 minutes of calm, meditative narration
   - Use Professional Voice Clone tier
   - Test and refine voice settings (stability, clarity, style)

2. **Script Writing:**
   - Write meditation scripts based on book concepts
   - Include pauses (indicated by "...")
   - Keep language simple, contemplative, present-focused

3. **Generation:**
   - Use ElevenLabs API to generate audio
   - Apply voice settings for consistency
   - Post-process if needed (volume normalization)

4. **Mixing:**
   - Layer voice over background soundscapes
   - Use Audacity or similar for final mix
   - Export as MP3 (256kbps) for quality/size balance

5. **Storage:**
   - Upload to CDN (Cloudflare, AWS S3)
   - Organize by category/series
   - Implement streaming for mobile

**API Integration:**
```javascript
// ElevenLabs text-to-speech
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
{
  text: string,
  model_id: "eleven_monolingual_v1",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.3,
    use_speaker_boost: true
  }
}
```

### Content Update Strategy

**Monthly Additions:**
- 1-2 new guided meditations
- Seasonal/themed meditations
- User-requested topics
- Current events/moon phases

**User-Generated Content (Future):**
- Community shares favorite affirmations
- User testimonial meditations
- Group meditation sessions

### Meditation Data Model

```javascript
meditation: {
  id: uuid,
  title: string,
  description: string,
  duration: number, // seconds
  category: 'foundation' | 'daily' | 'specialized' | 'ambient',
  audioUrl: string,
  transcript?: string,
  backgroundOptions: [],
  tags: [],
  relatedPhase?: number,
  relatedConcept?: string,
  plays: number,
  favorites: number,
  averageRating: number
}

userMeditationHistory: {
  userId: string,
  meditationId: uuid,
  playedAt: timestamp,
  completed: boolean,
  duration: number,
  backgroundUsed?: string,
  rating?: number
}
```

---

## Cross-Pillar Integrations

### 1. AI Mentor ↔ Workbook
- Mentor suggests next workbook exercise based on conversation
- Mentor explains workbook concepts when user is confused
- Mentor celebrates workbook phase completions

### 2. AI Mentor ↔ Journal
- Mentor prompts: "I see you haven't journaled in 3 days - would you like to write?"
- Mentor analyzes journal patterns and provides insights
- Mentor suggests journal prompts based on current struggles

### 3. AI Mentor ↔ Meditation
- Mentor recommends specific meditations based on user's state
- "You seem anxious today - try the 'Releasing Control' meditation"
- Mentor asks about meditation experience

### 4. Workbook ↔ Journal
- Workbook exercises auto-populate journal entries
- Journal prompts link to relevant workbook phases
- Completed exercises tagged in journal

### 5. Workbook ↔ Meditation
- Each phase has associated meditations
- Meditation player accessible within workbook
- Complete meditation as part of phase progress

### 6. Journal ↔ Meditation
- Pre-meditation intention journaling
- Post-meditation reflection journaling
- Meditation insights auto-saved to journal

---

## User Data Flow

```
User Login (Whop OAuth)
  ↓
Create/Load User Profile
  ↓
Dashboard View
  ├─→ Chat with AI Mentor
  │     ↓
  │   Context: Phase, Goals, Recent Journals
  │     ↓
  │   AI Response + Voice
  │     ↓
  │   Suggestions: Exercises, Meditations, Journal Prompts
  │
  ├─→ Progress through Workbook Phases
  │     ↓
  │   Complete Exercises
  │     ↓
  │   Data Saved to Supabase
  │     ↓
  │   Unlock Next Phase / Earn Badges
  │
  ├─→ Write in Journal
  │     ↓
  │   Auto-save Entries
  │     ↓
  │   AI Analysis (background job)
  │     ↓
  │   Insights Displayed
  │
  └─→ Listen to Meditations
        ↓
      Stream Audio
        ↓
      Track Progress
        ↓
      Update Stats & Streaks
```

---

## Supabase Schema Overview

```sql
-- Users (managed by Whop OAuth)
users
  - id (uuid, primary key)
  - whop_user_id (string, unique)
  - email (string)
  - created_at (timestamp)
  - last_active (timestamp)

-- User Profile
user_profiles
  - user_id (uuid, foreign key)
  - current_phase (integer, 1-10)
  - signal_strength_score (integer, 0-100)
  - level (string)
  - total_meditation_minutes (integer)
  - meditation_streak (integer)
  - journal_streak (integer)
  - badges (jsonb)

-- Workbook Progress
workbook_progress
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - phase (integer)
  - exercise_key (string)
  - data (jsonb)
  - completed (boolean)
  - completed_at (timestamp)

-- Journal Entries
journal_entries
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - type (string)
  - content (text)
  - audio_url (string, nullable)
  - ai_analysis (jsonb)
  - created_at (timestamp)
  - linked_phase (integer, nullable)

-- AI Conversations
ai_conversations
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - messages (jsonb array)
  - created_at (timestamp)
  - updated_at (timestamp)

-- Meditation History
meditation_history
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - meditation_id (uuid)
  - played_at (timestamp)
  - completed (boolean)
  - duration_seconds (integer)
  - rating (integer, nullable)

-- Meditations (content library)
meditations
  - id (uuid, primary key)
  - title (string)
  - description (text)
  - duration_seconds (integer)
  - category (string)
  - audio_url (string)
  - transcript (text, nullable)
  - tags (string array)
```

---

## API Cost Estimates

### Monthly Costs (for 100-500 active users):

**Claude Haiku 4.5:**
- Average 50 messages per user per month
- ~500 input tokens per message
- ~300 output tokens per response
- Cost per user: ~$0.10-0.15/month
- Total: **$10-75/month**

**ElevenLabs:**
- Pre-generate meditation audio (one-time costs)
- Dynamic voice responses: ~1000 characters per response = ~$0.002
- 50 responses per user per month
- Cost per user: ~$0.10/month
- Total: **$10-50/month**

**Supabase:**
- Database + Auth + Storage
- Free tier covers up to ~50k active users
- Paid tier if needed: **$25/month**

**Total Estimated: $45-150/month** for 100-500 users

---

## Success Metrics

### Engagement Metrics:
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Session duration
- Sessions per user per week

### Feature Usage:
- AI Mentor conversations per user
- Workbook phases completed
- Journal entries per user per week
- Meditations per user per week
- Meditation completion rate

### Retention:
- Day 1, Day 7, Day 30 retention
- Monthly subscription retention rate
- Churn rate

### Progression:
- Average time to complete each phase
- Phase completion rates
- Badge unlock rates
- Signal strength score improvements

### Satisfaction:
- In-app rating prompts
- Meditation ratings
- Feature request volume
- Support ticket volume

---

## Technical Considerations

### Performance:
- Lazy load workbook phases (don't load all at once)
- Stream AI responses for perceived speed
- Cache common AI responses
- Optimize image loading (lazy load, WebP format)
- Audio streaming (not download entire file)

### Security:
- All API routes require authentication
- Row-level security in Supabase
- Encrypted storage for sensitive journal entries
- GDPR compliance (data export/deletion)

### Scalability:
- Stateless API design
- Queue system for AI analysis jobs
- CDN for audio files
- Database indexing on frequently queried fields
- Monitoring and alerting (Sentry, LogRocket)

---

## MCP Server Integration Strategy

The development process leverages 4 MCP (Model Context Protocol) servers to accelerate development, testing, and integration across all agents.

### Available MCP Servers

1. **Whop MCP Server** - Direct Whop platform integration
2. **Supabase MCP Server** - Database operations and management
3. **Pipedream MCP Server** - Workflow automation and API orchestration
4. **Puppeteer MCP Server** - Browser automation and testing

### Agent-to-MCP Server Mapping

#### Agent 1: Frontend Lead (AI Mentor UI + Workbook Interfaces)

**Primary MCP Server: Puppeteer**

**Use Cases:**
- **UI Component Testing**
  - Automated testing of all workbook form inputs
  - Validate form submissions and error states
  - Test AI Mentor chat interface (streaming responses, message history)
  - Verify progress tracking visualizations

- **Visual Regression Testing**
  - Capture screenshots of each workbook phase
  - Compare UI changes across iterations
  - Ensure consistent Tibetan monk aesthetic (earthy tones, minimal design)

- **User Flow Automation**
  - Test complete phase progression (Phase 1 → Phase 10)
  - Validate navigation between pillars
  - Test dashboard interactions

- **Accessibility Testing**
  - Generate accessibility reports
  - Test keyboard navigation
  - Verify screen reader compatibility

**Secondary MCP Server: Supabase** (for testing frontend data fetching)

---

#### Agent 2: Backend Lead (APIs, Integrations, Database)

**Primary MCP Servers: Whop, Supabase, Pipedream**

**Whop MCP Server Use Cases:**
- **OAuth Integration**
  - Configure Whop OAuth flow
  - Test authentication and session management
  - Manage user scopes and permissions

- **Product & Membership Management**
  - Set up tiered pricing (Free, Monthly $19.99, Annual $149)
  - Configure membership access levels
  - Test checkout flows

- **Webhook Configuration**
  - Set up Whop webhooks (user.created, subscription.updated, etc.)
  - Test webhook handlers
  - Validate payload processing

- **User Data Queries**
  - Fetch Whop user profiles
  - Query subscription status
  - Test multi-tenant data isolation

**Supabase MCP Server Use Cases:**
- **Database Schema Management**
  - Create all tables (user_profiles, workbook_progress, journal_entries, ai_conversations, meditation_history, meditations)
  - Set up foreign key relationships
  - Create indexes for performance

- **Row-Level Security (RLS)**
  - Configure RLS policies for user data isolation
  - Test policy enforcement
  - Ensure multi-tenant security

- **Real-time Subscriptions**
  - Set up real-time listeners for AI chat
  - Configure presence tracking
  - Test subscription performance

- **Query Optimization**
  - Test complex queries
  - Optimize slow queries with indexes
  - Monitor database performance

**Pipedream MCP Server Use Cases:**
- **API Orchestration**
  - Build workflows connecting Claude API, ElevenLabs, Supabase
  - Automate meditation content generation pipeline
  - Create webhook processing workflows

- **ElevenLabs Integration**
  - Set up voice generation workflows
  - Batch generate meditation narrations
  - Cache common AI voice responses

- **Claude API Workflows**
  - Implement AI prompt chain workflows
  - Set up context injection pipelines
  - Automate journal sentiment analysis

- **Background Jobs**
  - Schedule daily check-in prompts
  - Process AI analysis in background
  - Generate weekly progress reports

---

#### Agent 3: Journal/Meditation Specialist (Pillar 3 & 4)

**Primary MCP Servers: Supabase, Pipedream**

**Supabase MCP Server Use Cases:**
- **Journal Storage**
  - Create/read/update/delete journal entries
  - Store AI analysis results (sentiment, keywords, patterns)
  - Link journals to workbook phases
  - Query journal history with filters

- **Meditation Tracking**
  - Log meditation play events
  - Track completion stats
  - Calculate streaks
  - Store user ratings

**Pipedream MCP Server Use Cases:**
- **Meditation Content Pipeline**
  - Automate meditation script → ElevenLabs → mixing → CDN upload
  - Generate meditation audio in batches
  - Process and normalize audio files
  - Create soundscape combinations

- **Journal AI Analysis**
  - Trigger Claude API for sentiment analysis
  - Extract keywords and themes
  - Detect limiting beliefs patterns
  - Generate insights and suggestions

- **Audio Processing Automation**
  - Mix voice narration with background soundscapes
  - Normalize audio levels
  - Convert to streaming-optimized formats
  - Upload to CDN (Cloudflare/AWS S3)

**Puppeteer MCP Server Use Cases:**
- **Audio Player Testing**
  - Test play/pause/seek functionality
  - Verify streaming performance
  - Test background soundscape selection
  - Validate sleep timer feature

---

#### Agent 4: Integration & Polish Lead (Cross-Pillar, Testing, Deployment)

**Primary MCP Server: Puppeteer (E2E Testing)**

**Puppeteer MCP Server Use Cases:**
- **End-to-End Testing**
  - Test complete user journeys (signup → workbook → journal → meditation)
  - Validate cross-pillar integrations
  - Test AI Mentor suggestions triggering workbook/journal/meditation

- **Integration Testing**
  - Test AI Mentor ↔ Workbook (context-aware suggestions)
  - Test Workbook ↔ Journal (exercise auto-population)
  - Test Journal ↔ AI Mentor (pattern detection insights)
  - Test Meditation ↔ Workbook (phase-specific meditations)

- **Performance Testing**
  - Measure page load times
  - Test audio streaming latency
  - Validate AI response streaming speed
  - Check lazy loading effectiveness

- **Cross-Browser Testing**
  - Test on Chrome, Firefox, Safari, Edge
  - Verify mobile responsiveness
  - Test iOS/Android WebView compatibility

**All MCP Servers (Integration Testing):**
- **Whop + Supabase Integration**
  - Test user creation flow (Whop OAuth → Supabase profile creation)
  - Validate subscription status updates
  - Test data isolation across Whop communities

- **Pipedream + Supabase Integration**
  - Test automated workflows writing to database
  - Validate webhook → database updates
  - Test background job completions

- **Multi-Service Workflows**
  - User signs up → Whop creates user → Supabase creates profile → Pipedream sends welcome email
  - User completes phase → Supabase updates progress → Pipedream triggers badge notification
  - User journals → Supabase saves entry → Pipedream triggers AI analysis → Supabase stores insights

---

### MCP Server Development Workflow

**Week 1-2 (Foundation):**
- Agent 2 uses **Whop MCP** to set up OAuth
- Agent 2 uses **Supabase MCP** to create database schema
- Agent 2 uses **Pipedream MCP** to set up basic workflows

**Week 3-6 (Parallel Development):**
- Agent 1 uses **Puppeteer MCP** to test UI components as they're built
- Agent 2 uses all 3 MCP servers for backend development
- Agent 3 uses **Supabase + Pipedream MCP** for journal/meditation features
- Agent 4 sets up testing framework with **Puppeteer MCP**

**Week 7-8 (Integration):**
- Agent 4 uses **Puppeteer MCP** for comprehensive E2E testing
- All agents use **Pipedream MCP** to create cross-pillar workflows
- Agent 1 uses **Puppeteer MCP** to validate visual consistency

**Week 9 (Polish & Launch):**
- Agent 4 uses **Puppeteer MCP** for final regression testing
- Agent 2 uses **Whop MCP** to finalize product configuration
- Agent 2 uses **Supabase MCP** to optimize database performance

---

### MCP Server Benefits

**Development Speed:**
- Direct API access eliminates manual configuration
- Automated testing catches bugs early
- Workflow automation reduces repetitive tasks

**Quality Assurance:**
- Comprehensive E2E testing with Puppeteer
- Database integrity validation with Supabase MCP
- Integration testing across all services

**Deployment Confidence:**
- All integrations tested before launch
- Performance validated under load
- Cross-browser compatibility verified

---

## Development Priority

**Phase 1 (Weeks 1-4): MVP Core**
- Whop authentication integration
- Basic dashboard
- AI Mentor (text only)
- Phase 1 workbook exercises
- Basic journaling

**Phase 2 (Weeks 5-8): Workbook Expansion**
- Phases 2-5 workbook exercises
- Gamification system
- Progress tracking
- Meditation player + 5 meditations

**Phase 3 (Weeks 9-12): Full Feature Set**
- Phases 6-10 workbook exercises
- AI voice responses
- Full meditation library (20+ meditations)
- Advanced journal analysis
- Polish and optimization

**Phase 4 (Post-Launch): Enhancements**
- Community features
- Advanced analytics
- Personalization improvements
- Content expansion

---

This comprehensive architecture document provides the complete blueprint for developing the Manifest the Unseen app with all four pillars fully fleshed out and ready for implementation.