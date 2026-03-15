# EllaEng v2 — Space Adventure English Learning Game

**A galactic journey to learn English vocabulary** | Built with [Claude Code](https://claude.ai/claude-code)

An interactive, space-themed English learning game for Hebrew-speaking kids. Navigate a galaxy of game planets, earn XP, unlock achievements, and master English through six distinct game modes — all wrapped in a fun astronaut adventure.

## Live Demo

**[hadarsap1.github.io/ella-eng](https://hadarsap1.github.io/ella-eng/)**

## Features

### Six Game Modes
| Game | Description |
|------|-------------|
| 🪐 **Planet of Words** | Listen to a word, choose the correct Hebrew translation |
| 🌀 **Memory Nebula** | Match English words to Hebrew translations (memory game) |
| 👯 **Sound Twins** | Identify which word matches what you hear |
| 🚉 **Sentence Station** | Arrange words to form correct English sentences |
| 🌠 **Listening Asteroid** | Spell words letter-by-letter after hearing them |
| 🚀 **Word Builder Rocket** | Construct words from floating letters |

### Progression & Rewards
- **XP System** — 10 XP per correct answer + 5 XP per streak point
- **Level Progression** — Climb through levels with increasing XP thresholds
- **Streaks** — Bonus multiplier at 3+ consecutive correct answers
- **12 Achievements** — Progressive unlocks (milestones, perfect games, accuracy mastery)

### Player Profiles
- Create multiple profiles with custom names and avatars (🧑‍🚀 👩‍🚀 👨‍🚀 🤖 👽 🦊)
- Persistent progress across sessions via localStorage
- Mission Control dashboard with stats and analytics

### Galaxy Navigation
- Visual star map with game planets
- Each planet shows name, icon, color, and minimum word requirement
- Letter selection to filter vocabulary and unlock games

### Audio & Effects
- Web Audio API sound effects (correct, incorrect, streak tones)
- Text-to-speech pronunciation for English words
- Canvas confetti celebrations on achievements
- Headphone-safe audio with dynamics compression

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Routing | React Router 7 (HashRouter for GitHub Pages) |
| State | Zustand 5 (persisted to localStorage) |
| Audio | Web Audio API + Web Speech API |
| Effects | Canvas Confetti |
| Icons | Lucide React |
| Fonts | Quicksand + Rubik (Hebrew) |
| Deploy | GitHub Actions → GitHub Pages |

## Project Structure

```
src/
├── pages/
│   ├── WelcomePage.tsx              # Landing & player selection
│   ├── LettersPage.tsx              # Letter/vocabulary filtering
│   ├── GalaxyPage.tsx               # Game selection star map
│   ├── GamePage.tsx                 # Game router/dispatcher
│   └── MissionControlPage.tsx       # Stats dashboard
├── components/
│   ├── layout/                      # Shell, background, top bar
│   ├── welcome/                     # Welcome screen & player selector
│   ├── letters/                     # Letter selection UI
│   ├── galaxy-map/                  # Galaxy navigation
│   ├── games/
│   │   ├── planet-of-words/         # Listening + translation
│   │   ├── memory-nebula/           # Memory matching
│   │   ├── sound-twins/             # Audio discrimination
│   │   ├── sentence-station/        # Sentence building
│   │   ├── listening-asteroid/      # Spelling from audio
│   │   ├── word-builder/            # Letter construction
│   │   └── shared/                  # Reusable game components
│   ├── mission-control/             # Dashboard components
│   └── ui/                          # Reusable UI primitives
├── stores/
│   └── usePlayerStore.ts            # Zustand (persisted)
├── hooks/
│   ├── useSpeech.ts                 # Text-to-speech
│   ├── useSoundEffects.ts           # Web Audio tones
│   ├── useCelebration.ts            # Confetti effects
│   └── useWordFilter.ts             # Letter-based filtering
├── data/
│   ├── words.ts                     # 300+ English-Hebrew pairs
│   ├── sentences.ts                 # Sentence data
│   ├── games.ts                     # Game metadata
│   ├── levels.ts                    # Level thresholds
│   └── achievements.ts             # Achievement definitions
└── types/
    └── game.ts                      # TypeScript interfaces
```

## Getting Started

```bash
npm install
npm run dev            # Vite dev server
npm run build          # Production build
npm run preview        # Preview production build
npm run lint           # ESLint
```

## Deployment

Auto-deployed to GitHub Pages via GitHub Actions on push to `main`.

## What's New in v2

- Upgraded from React 18 → React 19, Vite 5 → Vite 7
- Space/galaxy theme replacing the original flat design
- 2 new game modes: Listening Asteroid + Word Builder Rocket
- Framer Motion page transitions and spring animations
- Zustand replacing raw localStorage state management
- 300+ words (up from 200+)
- Player avatars and enhanced profile system
- HashRouter for GitHub Pages compatibility

## Design

- Space-themed UI with gradient backgrounds and floating animations
- Hebrew interface with bilingual content
- Mobile-first responsive design with `dvh` viewport units
- Quicksand + Rubik fonts for optimal Hebrew/English rendering
- Fully client-side — no backend required
