import { createStore } from 'vuex'
import { vi } from 'vitest'

export function createMockStore(initialState = {}) {
    const defaultState = {
        horses: [],
        program: [],
        results: [],
        currentRound: 0,
        raceState: 'idle',
        animationComplete: false,
        animationPromiseResolve: null,
        ...initialState
    }

    const mutations = {
        generateHorses: vi.fn((state) => {
            state.horses = mockHorses
        }),
        generateProgram: vi.fn((state) => {
            state.program = mockProgram
        }),
        resetGame: vi.fn((state) => {
            state.results = []
            state.currentRound = 0
            state.raceState = 'idle'
        }),
        addResult: vi.fn((state, result) => {
            state.results.push(result)
        }),
        setRaceState: vi.fn((state, val) => {
            state.raceState = val
        }),
        nextRound: vi.fn((state) => {
            state.currentRound++
        }),
        setAnimationComplete: vi.fn((state) => {
            state.animationComplete = true
        }),
        setAnimationPromiseResolve: vi.fn((state, resolve) => {
            state.animationPromiseResolve = resolve
        })
    }

    const actions = {
        startRace: vi.fn(async ({ commit, state }) => {
            commit('setRaceState', 'running')
            return Promise.resolve()
        }),
        pauseRace: vi.fn(({ commit }) => {
            commit('setRaceState', 'paused')
            return Promise.resolve()
        }),
        resumeRace: vi.fn(async ({ dispatch, state }) => {
            if (state.raceState === 'paused') {
                return await dispatch('startRace')
            }
            return Promise.resolve()
        }),
        raceAnimationComplete: vi.fn(({ commit }) => {
            commit('setAnimationComplete')
            return Promise.resolve()
        })
    }

    const store = createStore({
        state: defaultState,
        mutations,
        actions
    })

    // Create spies that wrap the original methods
    const originalCommit = store.commit.bind(store)
    const originalDispatch = store.dispatch.bind(store)

    store.commit = vi.fn(originalCommit)
    store.dispatch = vi.fn(originalDispatch)

    return store
}

export const mockHorses = [
    { id: 1, name: 'Thunder Bolt', condition: 85, color: 'Red' },
    { id: 2, name: 'Lightning Strike', condition: 70, color: 'Blue' },
    { id: 3, name: 'Storm Chaser', condition: 90, color: 'Green' }
]

export const mockProgram = [
    {
        distance: 1200,
        horses: mockHorses
    },
    {
        distance: 1400,
        horses: mockHorses.slice(0, 2)
    }
]

export const mockResults = [
    {
        distance: 1200,
        positions: [mockHorses[2], mockHorses[0], mockHorses[1]]
    }
]
