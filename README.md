# 🏇 Horse Racing Game

An interactive horse racing simulation game built with Vue.js. Experience exciting races with 20 different horses across 6 thrilling rounds!

## 🌐 Live Demo

**[Play the Game Online](https://horse-racing-vue-project.netlify.app/)**

## ✨ Features

- **🎲 Random Horse Generation**: 20 horses with unique names, colors, and conditions each time
- **🏁 Multi-Round Racing**: 6 rounds with distances ranging from 1200m to 2200m
- **⏯️ Race Control**: Start, pause, and resume functionality
- **📊 Live Results**: Real-time race positions and historical round results
- **🎯 Interactive Interface**: Modern and user-friendly design
- **📱 Responsive**: Seamless experience across all devices

## 🎮 How to Play

1. **Generate New Race**: Click "🎲 Generate New Race" button to create 20 horses and a 6-round program
2. **Start Race**: Click "▶️ Start Race" button to begin the race
3. **Control Race**: Pause or resume the race anytime during gameplay
4. **Watch Results**: Monitor live results and historical round results from the right panel

## 🚀 Quick Start

### Requirements

- Node.js (16.0 or higher) - *Developed with Node.js v14.17.5*
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd horse-racing

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── HorseList.vue       # Horse list and information
│   ├── RaceTrack.vue       # Race track and animations
│   ├── RaceControls.vue    # Race control buttons
│   ├── Program.vue         # Race program display
│   └── Results.vue         # Race results
├── store/
│   └── index.js            # Vuex state management
├── test/                   # Test files
├── App.vue                 # Main application component
└── main.js                 # Application entry point
```

### Tech Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **State Management**: Vuex 4
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils
- **Styling**: SCSS/Sass
- **Package Manager**: npm

## 🧪 Testing

The project has comprehensive test coverage:

```bash
# Run all tests
npm run test

# View test results in UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Tested components:
- ✅ App.vue - Main application component
- ✅ HorseList.vue - Horse list
- ✅ RaceTrack.vue - Race track
- ✅ RaceControls.vue - Control panel
- ✅ Program.vue - Race program
- ✅ Results.vue - Results
- ✅ Vuex Store - State management

