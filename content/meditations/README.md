# Meditation Content Library

## Overview

This directory contains all meditation scripts, audio production files, and metadata for the Manifest the Unseen app. All meditations embody the **ancient Tibetan monk meditation aesthetic** with sound healing, frequency therapy, and contemplative guidance.

---

## Directory Structure

```
content/meditations/
├── README.md (this file)
├── scripts/                    # Meditation scripts (markdown format)
│   ├── foundation/            # 10 foundation series (Chapters 1-10)
│   ├── daily-practice/        # Morning/evening quick practices
│   └── specialized/           # Topic-specific (abundance, love, health)
├── audio-production/          # Audio mixing notes and configurations
│   ├── voice-narration/       # Voice recordings/ElevenLabs output
│   ├── soundscapes/           # Background audio (bowls, nature, frequencies)
│   └── final-mix/             # Finished MP3 files ready for CDN
└── metadata/                  # Meditation metadata for database
    └── meditations.json       # Structured data for Supabase import
```

---

## Tibetan Monk Aesthetic Guidelines

### Voice & Tone

**Characteristics:**
- **Pace:** Very slow, deliberate, with generous pauses (5-10 seconds)
- **Tone:** Deep, calm, grounded, timeless
- **Vocabulary:** Nature metaphors (mountain, river, stone, wind, water)
- **Style:** Contemplative, never rushed, never directive
- **Wisdom:** References to quantum physics, universal laws, frequency alignment

**What to Avoid:**
- Generic "relax and breathe" clichés
- Modern, rushed language
- Marketing speak or hype
- Direct commands (use gentle invitations instead)

### Sound Healing Elements

**Core Frequencies:**
- **432Hz** - Natural healing frequency, Earth's vibration
- **528Hz** - Transformation and DNA repair frequency
- **639Hz** - Connection and relationships
- **741Hz** - Intuition and expression

**Tibetan Instruments:**
- Singing bowls (tuned to healing frequencies)
- Tibetan throat singing (deep, resonant)
- Temple bells and chimes
- Tingsha cymbals

**Nature Sounds:**
- Mountain wind (subtle, distant)
- Flowing water (gentle stream, not rushing)
- Fire crackling (very soft background)
- Rain (light, not storm)

### Script Structure

Every meditation should follow this structure:

1. **Opening (30 seconds - 1 minute)**
   - Singing bowl tone (432Hz or 528Hz)
   - Gentle welcome
   - Invitation to settle

2. **Body Awareness (2-3 minutes)**
   - Ground into physical presence
   - Notice breath without controlling
   - Release tension

3. **Core Teaching (60-70% of meditation)**
   - Present the concept (signal, frequency, embodiment, etc.)
   - Use metaphors from nature
   - Ask contemplative questions
   - Allow silence for integration

4. **Embodiment Practice (20-30% of meditation)**
   - Invite felt experience
   - Cellular-level integration
   - "Living as if" the desired reality

5. **Closing (1-2 minutes)**
   - Integration time
   - Gratitude
   - Gentle return to awareness
   - Final singing bowl tone

---

## Meditation Scripts (MVP Launch)

### Foundation Series (5 meditations)

Based on core book chapters:

1. **Finding Your Signal** (12 min) - Chapter 1
   - Discover true desire beneath surface wants
   - Differentiate fear from faith
   - Body scan for signal location

2. **Frequency Over Force** (10 min) - Chapter 3
   - Release need to control outcomes
   - Align with natural frequency
   - Effortless manifestation state

3. **Embodiment Practice** (15 min) - Chapter 4
   - Full-body embodiment of desired reality
   - Cellular-level belief integration
   - Living as the future self

4. **Quantum Field Activation** (15 min) - Chapter 7
   - Enter the quantum field of possibility
   - Collapse desired reality through observation
   - Observer effect meditation

5. **Trust & Surrender** (12 min) - Chapter 9
   - Release control and attachment
   - Trust universal timing
   - Surrender into flow

### Daily Practice Series (2 meditations)

Quick practices for daily ritual:

6. **Morning Frequency Alignment** (5 min)
   - Set signal for the day
   - Morning intention
   - Energy activation

7. **Evening Gratitude Practice** (7 min)
   - Gratitude meditation
   - Day reflection
   - Release and surrender

### Specialized Series (Optional for MVP)

Topic-specific meditations:

8. **Abundance Frequency Activation** (10 min)
9. **Limiting Belief Release** (12 min)
10. **Sleep Manifestation** (20 min) - Optional

---

## Audio Production Specifications

### Voice Narration

**Recording/Generation:**
- Use ElevenLabs Professional Voice Clone OR record manually
- Deep, calm male or female voice
- Slow pace: 100-120 words per minute (normal is 150-160)
- Include 5-10 second pauses where marked in script
- Save as WAV (44.1kHz, 16-bit) for mixing

**ElevenLabs Settings (if using):**
```
Stability: 0.5-0.6 (allows natural variation)
Similarity: 0.75-0.85 (stays close to cloned voice)
Style: 0.3-0.4 (subtle emotional expression)
Speaker Boost: Enabled
```

### Background Soundscapes

**Ambient Levels:**
- Voice narration: -10dB to -12dB (primary)
- Singing bowls: -14dB to -16dB (present but not overwhelming)
- Ambient nature: -18dB to -22dB (subtle background)
- Frequency tones: -20dB to -24dB (barely perceptible)

**Mixing Guidelines:**
- Fade in: 3-5 seconds (smooth entry)
- Fade out: 5-10 seconds (gentle exit)
- No abrupt cuts or volume changes
- Low-pass filter on background (below 5kHz) so voice cuts through

### Final Export Settings

**Format:** MP3
**Bitrate:** 256kbps (VBR - variable bitrate)
**Sample Rate:** 44.1kHz
**Channels:** Stereo
**Metadata:**
- Title: [Meditation Name]
- Artist: Manifest the Unseen
- Album: Foundation Series / Daily Practice / Specialized
- Genre: Meditation / Sound Healing
- Year: 2025

**File Naming Convention:**
```
[category]-[number]-[name]-[duration].mp3

Examples:
foundation-01-finding-your-signal-12min.mp3
daily-01-morning-frequency-alignment-5min.mp3
specialized-01-abundance-activation-10min.mp3
```

---

## Audio Sources

### Free Resources

**Singing Bowls & Tibetan Instruments:**
- [Freesound.org](https://freesound.org/search/?q=singing+bowl+432hz)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- Search: "Tibetan singing bowl 432Hz", "throat singing", "temple bells"

**Nature Sounds:**
- [Freesound.org](https://freesound.org/)
- Search: "mountain wind", "gentle stream", "soft rain"

**Frequency Tones:**
- [Tone Generator Online](https://www.szynalski.com/tone-generator/)
- Generate pure sine waves at 432Hz, 528Hz, etc.
- Export as WAV and loop in DAW

### Paid Resources (Optional)

**Premium Sound Libraries:**
- [Epidemic Sound](https://www.epidemicsound.com/) - Meditation music
- [AudioJungle](https://audiojungle.net/) - Sound effects
- [Splice](https://splice.com/) - Samples and loops

**AI Music Generation:**
- [Suno.ai](https://suno.ai/) - Generate custom ambient soundscapes
- Prompt: "Tibetan singing bowls 432Hz ambient meditation, no vocals, peaceful"

---

## Production Workflow

### 1. Script Writing
- Use meditation script template
- Include [pause X seconds] markers
- Mark [singing bowl] or [ambient swell] cues
- Aim for target duration (±30 seconds)

### 2. Voice Generation/Recording
- Record or use ElevenLabs API
- Export as WAV for best quality
- Review for pacing (should feel slow, contemplative)

### 3. Audio Sourcing
- Download singing bowls, nature sounds, frequency tones
- Ensure royalty-free or purchased license
- Organize in `audio-production/soundscapes/`

### 4. Mixing (Audacity or DAW)
- Import voice narration track
- Add singing bowl at intro/outro
- Layer ambient soundscape underneath
- Add frequency tone (432Hz or 528Hz) at -20dB
- Balance levels (voice clear, ambient subtle)
- Apply fade in/out

### 5. Export
- Export as MP3 (256kbps VBR)
- Add metadata tags
- Test on mobile device (check streaming quality)
- Save to `audio-production/final-mix/`

### 6. Upload to CDN
- Upload to Cloudflare R2 or AWS S3
- Get public URL
- Add metadata to `metadata/meditations.json`

---

## Metadata Format

Each meditation needs metadata for the database:

```json
{
  "id": "uuid-generated-by-supabase",
  "title": "Finding Your Signal",
  "description": "Discover the true signal beneath your desires and differentiate fear from faith.",
  "duration_seconds": 720,
  "category": "foundation",
  "audio_url": "https://cdn.example.com/meditations/foundation-01-finding-your-signal-12min.mp3",
  "transcript": "Full transcript text...",
  "tags": ["signal", "desire", "body-scan", "chapter-1"],
  "related_phase": 1,
  "healing_frequencies": ["432Hz"],
  "created_at": "2025-10-29"
}
```

Store all metadata in `metadata/meditations.json` for bulk import to Supabase.

---

## Quality Checklist

Before finalizing any meditation:

- [ ] Script embodies Tibetan monk aesthetic (calm, contemplative, grounded)
- [ ] Pacing is slow with generous pauses (5-10 seconds)
- [ ] Nature metaphors used (mountain, river, stone, wind)
- [ ] Sound healing elements present (singing bowls, frequencies)
- [ ] No generic "relax and breathe" clichés
- [ ] No rushed or directive language
- [ ] Voice narration clear and audible
- [ ] Background ambiance subtle (not overpowering)
- [ ] Frequency tones present but barely perceptible
- [ ] Fade in/out smooth (no abrupt cuts)
- [ ] Total duration within ±30 seconds of target
- [ ] MP3 export quality good (256kbps VBR)
- [ ] Metadata complete and accurate
- [ ] Tested on mobile device

---

## Timeline & Estimates

**Per Meditation:**
- Script writing: 1-2 hours
- Voice generation/recording: 30-60 minutes
- Audio sourcing: 30-60 minutes
- Mixing: 1-2 hours
- Export & test: 30 minutes
- **Total: 4-6 hours per meditation**

**MVP Target (7 meditations):**
- Total time: 28-42 hours
- Spread over: 1-2 weeks
- Parallel work: Can be done while development happens

---

## Future Expansion

Post-MVP additions:

- Complete all 10 foundation series meditations
- Add more specialized meditations (love, health, career)
- Seasonal meditations (full moon, solstice, equinox)
- User-requested topics
- Personalized meditations based on user phase
- Multi-language support
- Extended versions (30-60 minutes)

---

## Resources & References

### Meditation Inspiration
- [Insight Timer](https://insighttimer.com/) - Study popular meditation styles
- [Calm App](https://www.calm.com/) - Production quality reference
- [Headspace](https://www.headspace.com/) - Script structure examples

### Tibetan Wisdom
- Books on Tibetan Buddhism and meditation practices
- Teachings on sound healing and frequency therapy
- Quantum physics meets ancient wisdom

### Audio Production
- [Audacity Manual](https://manual.audacityteam.org/)
- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Suno.ai Guide](https://suno.ai/help)

---

## Notes for Audio Engineers

**If hiring external help:**
- Share this README
- Provide all scripts in `scripts/` folder
- Clarify Tibetan monk aesthetic (slow, contemplative, grounded)
- Emphasize sound healing elements (432Hz, 528Hz, singing bowls)
- Request draft mix for approval before finalizing all meditations
- Ensure consistent voice, pacing, and ambiance across all tracks

**Budget Estimate (if outsourcing):**
- Professional meditation voice talent: $200-500 per meditation
- Audio mixing/mastering: $50-100 per meditation
- Total for 7 meditations: $1,750-4,200

**DIY Approach (using ElevenLabs + Audacity):**
- ElevenLabs cost: ~$0.50-1.00 per meditation
- Sound library: $0-50 (Freesound is free)
- Time investment: 28-42 hours
- Total cost: $50-100 (mostly time)

---

**Created:** 2025-10-29
**Last Updated:** 2025-10-29
**Owner:** Agent 3 - Journal/Meditation Specialist
**Status:** In Progress - Scripts being written
