import { createStore } from 'vuex'

function getRandomName(i) {
  const names = [
    'Thunder Bolt', 'Lightning Strike', 'Storm Chaser', 'Wind Runner', 'Fire Storm',
    'Golden Arrow', 'Silver Bullet', 'Midnight Express', 'Dawn Breaker', 'Star Gazer',
    'Wild Spirit', 'Brave Heart', 'Swift Wind', 'Noble Prince', 'Royal Crown',
    'Diamond Dust', 'Emerald Dream', 'Ruby Flash', 'Sapphire Sky', 'Crystal Clear'
  ]
  return names[i] || `Horse ${i + 1}`
}

function getRandomColor(i) {
  const colors = [
    'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Brown', 'Black', 'White', 'Gray',
    'Pink', 'Cyan', 'Magenta', 'Gold', 'Silver', 'Teal', 'Indigo', 'Maroon', 'Navy', 'Olive'
  ]
  return colors[i % colors.length]
}

export default createStore({
  state: {
    horses: [],
    program: [],
    results: [],
    currentRound: 0,
    raceState: 'idle', // idle | running | paused | finished
    animationComplete: false,
    animationPromiseResolve: null,
  },
  mutations: {
    generateHorses(state) {
      state.horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: getRandomName(i),
        condition: Math.floor(Math.random() * 100) + 1,
        color: getRandomColor(i)
      }))
    },
    generateProgram(state) {
      const roundDistances = [1200, 1400, 1600, 1800, 2000, 2200]
      state.program = roundDistances.map(distance => {
        const shuffled = [...state.horses].sort(() => 0.5 - Math.random())
        return {
          distance,
          horses: shuffled.slice(0, 10)
        }
      })
      state.results = []
      state.currentRound = 0
      state.raceState = 'idle'
    },
    addResult(state, result) {
      state.results.push(result)
    },
    setRaceState(state, val) {
      state.raceState = val
    },
    nextRound(state) {
      state.currentRound++
    },
    resetGame(state) {
      state.results = []
      state.currentRound = 0
      state.raceState = 'idle'
      state.animationComplete = false
      state.animationPromiseResolve = null
    },
    setAnimationComplete(state) {
      state.animationComplete = true
      if (state.animationPromiseResolve) {
        state.animationPromiseResolve()
        state.animationPromiseResolve = null
      }
    },
    setAnimationPromiseResolve(state, resolve) {
      state.animationPromiseResolve = resolve
      state.animationComplete = false
    }
  },
  actions: {
    async startRace({ commit, state, dispatch }) {
      if (state.program.length === 0) return

      commit('setRaceState', 'running')

      while (state.currentRound < state.program.length && state.raceState === 'running') {
        const round = state.program[state.currentRound]

        // Wait for the race animation to complete and get results
        const raceResults = await new Promise(resolve => {
          commit('setAnimationPromiseResolve', resolve)
        })

        if (state.raceState !== 'running') break

        // Use the results from the animation
        commit('addResult', {
          distance: round.distance,
          positions: raceResults
        })

        commit('nextRound')

        // Small delay before next round
        if (state.currentRound < state.program.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      if (state.raceState === 'running') {
        commit('setRaceState', 'finished')
      }
    },
    raceAnimationComplete({ commit, state }, raceResults) {
      // Return the results to the waiting promise
      if (state.animationPromiseResolve) {
        state.animationPromiseResolve(raceResults)
      }
      commit('setAnimationComplete')
    },
    pauseRace({ commit }) {
      commit('setRaceState', 'paused')
    },
    async resumeRace({ dispatch, state }) {
      if (state.raceState === 'paused') {
        await dispatch('startRace')
      }
    }
  }
})