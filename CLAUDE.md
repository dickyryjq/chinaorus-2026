# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript single-page application built with Vite that helps users decide if they're ready to move to China. The app features an interactive landing page with animated counters, confetti effects, modal overlays, and a city matchmaker quiz.

**AI Studio App**: https://ai.studio/apps/drive/1XERgygYSxsx_6EUugWz-UyljOK0J2-e3

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

1. Set `GEMINI_API_KEY` in `.env.local` (currently configured but not actively used in the app)
2. The API key is exposed to the client via Vite's `define` config as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

## Architecture

### Monolithic Structure

The entire application is contained in [index.tsx](index.tsx) (424 lines). This includes:
- All component definitions (Counter, DecisionCard, InfoModal, CityMatchmakerModal, MainApp)
- Static data (CARDS_DATA, DETAILED_CONTENT, QUESTIONS)
- Type definitions
- Rendering logic

The [components/](components/) directory contains empty placeholder files (Counter.tsx, DecisionCard.tsx, InfoModal.tsx, CityMatchmakerModal.tsx) - the actual implementations are in index.tsx.

### Key Components

1. **MainApp** (index.tsx:297-417): Root component managing global state
   - Vote tracking via localStorage (`china_voted`)
   - People counter state (starts at 1248, increments to 1249 on vote)
   - Modal visibility states
   - Confetti canvas reference for celebration effects

2. **Counter** (index.tsx:23-41): Animated number display
   - Uses framer-motion springs for smooth transitions
   - Formats numbers with localeString for thousand separators

3. **DecisionCardComponent** (index.tsx:44-71): Interactive comparison cards
   - 8 cards comparing China vs. US across different topics
   - Opens InfoModal on click to show detailed comparisons

4. **InfoModal** (index.tsx:124-169): Full-screen comparison overlay
   - Side-by-side China vs. US comparisons
   - Content pulled from DETAILED_CONTENT object (index.tsx:74-115)
   - Purple-to-red gradient background

5. **CityMatchmakerModal** (index.tsx:171-283): Multi-step quiz
   - 3-question flow stored in QUESTIONS array (index.tsx:117-121)
   - Generates city recommendation based on answer combinations
   - Calculates "readiness score" (84-98% range)
   - Opens automatically after user clicks "I'm Becoming Chinese" button

### Data Flow

1. User clicks "I'm Becoming Chinese" button → triggers confetti → increments counter → opens CityMatchmakerModal
2. User answers 3 quiz questions → algorithm determines recommended city from answer pattern
3. User clicks comparison cards → opens InfoModal with detailed China vs US comparison
4. Vote state persists in localStorage to prevent double-counting

### Styling

- **Tailwind CSS**: Loaded via CDN in [index.html](index.html)
- **Custom Fonts**:
  - Inter (body text)
  - Tomorrow (headings, bold statements)
- **Color Scheme**:
  - Primary red: `#E60000` (Chinese flag red)
  - Gradient: `#3b3a6e → #443c68 → #b21e35 → #d90429`

### Build Configuration

- **Path Alias**: `@/*` maps to repository root (vite.config.ts:19)
- **Server**: Runs on port 3000, binds to 0.0.0.0 for network access
- **Environment Variables**: Injected via Vite's define feature, not import.meta.env

### Dependencies

- **framer-motion**: All animations (counter springs, card hover, modal transitions)
- **canvas-confetti**: Celebration effect when user votes
- **React 19**: Latest features including createRoot API

### Development Notes

- The app is purely client-side with no backend API calls (despite Gemini API key configuration)
- LocalStorage key `china_voted` tracks if user has already voted
- Confetti uses a custom canvas element (index.tsx:353) to avoid z-index conflicts
- All images are loaded from Unsplash CDN
- The quiz always opens after voting (800ms delay for confetti to play)
