import { describe, it, expect, beforeEach, vi } from 'vitest'
import store from '../store/index.js'
import { mockHorses } from './helpers.js'

// Mock Date.now for consistent testing
const mockDateNow = vi.fn(() => 1000)
global.Date.now = mockDateNow

describe('Vuex Store', () => {
    beforeEach(() => {
        // Reset store state before each test
        store.commit('resetGame')
        store.state.horses = []
        store.state.program = []
    })

    describe('mutations', () => {
        describe('generateHorses', () => {
            it('generates 20 horses with correct properties', () => {
                store.commit('generateHorses')

                expect(store.state.horses).toHaveLength(20)

                store.state.horses.forEach((horse, index) => {
                    expect(horse).toHaveProperty('id', index + 1)
                    expect(horse).toHaveProperty('name')
                    expect(horse).toHaveProperty('condition')
                    expect(horse).toHaveProperty('color')
                    expect(horse.condition).toBeGreaterThanOrEqual(1)
                    expect(horse.condition).toBeLessThanOrEqual(100)
                })
            })

            it('generates horses with unique IDs', () => {
                store.commit('generateHorses')

                const ids = store.state.horses.map(horse => horse.id)
                const uniqueIds = [...new Set(ids)]
                expect(uniqueIds).toHaveLength(20)
            })
        })

        describe('generateProgram', () => {
            beforeEach(() => {
                store.commit('generateHorses')
            })

            it('generates program with 6 rounds', () => {
                store.commit('generateProgram')

                expect(store.state.program).toHaveLength(6)
            })

            it('generates rounds with correct distances', () => {
                store.commit('generateProgram')

                const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]
                store.state.program.forEach((round, index) => {
                    expect(round.distance).toBe(expectedDistances[index])
                })
            })

            it('assigns 10 horses to each round', () => {
                store.commit('generateProgram')

                store.state.program.forEach(round => {
                    expect(round.horses).toHaveLength(10)
                })
            })

            it('resets game state when generating new program', () => {
                store.state.results = [{ test: 'data' }]
                store.state.currentRound = 3
                store.state.raceState = 'running'

                store.commit('generateProgram')

                expect(store.state.results).toEqual([])
                expect(store.state.currentRound).toBe(0)
                expect(store.state.raceState).toBe('idle')
            })
        })

        describe('addResult', () => {
            it('adds result to results array', () => {
                const testResult = { distance: 1200, positions: [] }

                store.commit('addResult', testResult)

                expect(store.state.results).toContain(testResult)
                expect(store.state.results).toHaveLength(1)
            })
        })

        describe('setRaceState', () => {
            it('updates race state', () => {
                store.commit('setRaceState', 'running')
                expect(store.state.raceState).toBe('running')

                store.commit('setRaceState', 'paused')
                expect(store.state.raceState).toBe('paused')
            })
        })

        describe('nextRound', () => {
            it('increments current round', () => {
                expect(store.state.currentRound).toBe(0)

                store.commit('nextRound')
                expect(store.state.currentRound).toBe(1)

                store.commit('nextRound')
                expect(store.state.currentRound).toBe(2)
            })
        })

        describe('resetGame', () => {
            it('resets all game state', () => {
                store.state.results = [{ test: 'data' }]
                store.state.currentRound = 3
                store.state.raceState = 'finished'
                store.state.animationComplete = true

                store.commit('resetGame')

                expect(store.state.results).toEqual([])
                expect(store.state.currentRound).toBe(0)
                expect(store.state.raceState).toBe('idle')
                expect(store.state.animationComplete).toBe(false)
                expect(store.state.animationPromiseResolve).toBe(null)
            })
        })

        describe('animation state mutations', () => {
            it('setAnimationComplete sets flag and resolves promise', () => {
                const mockResolve = vi.fn()
                store.state.animationPromiseResolve = mockResolve

                store.commit('setAnimationComplete')

                expect(store.state.animationComplete).toBe(true)
                expect(mockResolve).toHaveBeenCalled()
                expect(store.state.animationPromiseResolve).toBe(null)
            })

            it('setAnimationPromiseResolve stores resolve function', () => {
                const mockResolve = vi.fn()

                store.commit('setAnimationPromiseResolve', mockResolve)

                expect(store.state.animationPromiseResolve).toBe(mockResolve)
                expect(store.state.animationComplete).toBe(false)
            })
        })
    })

    describe('actions', () => {
        describe('pauseRace', () => {
            it('sets race state to paused', async () => {
                await store.dispatch('pauseRace')
                expect(store.state.raceState).toBe('paused')
            })
        })

        describe('raceAnimationComplete', () => {
            it('calls setAnimationComplete and resolves promise with results', async () => {
                const mockResolve = vi.fn()
                const testResults = [{ id: 1, name: 'Test Horse' }]

                store.state.animationPromiseResolve = mockResolve

                await store.dispatch('raceAnimationComplete', testResults)

                expect(store.state.animationComplete).toBe(true)
                expect(mockResolve).toHaveBeenCalledWith(testResults)
            })
        })

        describe('resumeRace', () => {
            it('calls startRace when state is paused', async () => {
                store.state.raceState = 'paused'
                store.state.program = [{ distance: 1200, horses: mockHorses }]

                // Start the resumeRace action
                const resumePromise = store.dispatch('resumeRace')

                // Immediately check that state changed to running
                expect(store.state.raceState).toBe('running')

                // Simulate animation completion to prevent hanging
                setTimeout(() => {
                    store.dispatch('raceAnimationComplete', [
                        { horse: { lane: 1, name: 'Thunder Bolt' }, time: 72.5, position: 1 }
                    ])
                }, 10)

                // Wait for the action to complete
                await resumePromise
            })

            it('does nothing when state is not paused', async () => {
                store.state.raceState = 'idle'

                // Should not throw or change state
                await store.dispatch('resumeRace')
                expect(store.state.raceState).toBe('idle')
            })
        })

        describe('startRace', () => {
            beforeEach(() => {
                store.commit('generateHorses')
                store.commit('generateProgram')
            })

            it('does nothing when no program exists', async () => {
                store.state.program = []

                await store.dispatch('startRace')

                expect(store.state.raceState).toBe('idle')
            })

            it('sets race state to running when program exists', async () => {
                store.state.program = [{ distance: 1200, horses: mockHorses }]

                // Start the race
                const startPromise = store.dispatch('startRace')

                // Check that state immediately changes to running
                expect(store.state.raceState).toBe('running')

                // Simulate animation completion to prevent hanging
                setTimeout(() => {
                    store.dispatch('raceAnimationComplete', [
                        { horse: { lane: 1, name: 'Thunder Bolt' }, time: 72.5, position: 1 }
                    ])
                }, 10)

                // Wait for the action to complete
                await startPromise

                // Race should be finished after completion
                expect(store.state.raceState).toBe('finished')
            })
        })
    })

    describe('integration scenarios', () => {
        it('complete race flow', async () => {
            // Generate horses and program
            store.commit('generateHorses')
            store.commit('generateProgram')

            expect(store.state.horses).toHaveLength(20)
            expect(store.state.program).toHaveLength(6)
            expect(store.state.raceState).toBe('idle')
            expect(store.state.currentRound).toBe(0)

            // Start race
            store.commit('setRaceState', 'running')
            expect(store.state.raceState).toBe('running')

            // Simulate round completion
            const mockResult = {
                distance: 1200,
                positions: store.state.program[0].horses.slice(0, 3)
            }

            store.commit('addResult', mockResult)
            store.commit('nextRound')

            expect(store.state.results).toHaveLength(1)
            expect(store.state.currentRound).toBe(1)

            // Finish race
            store.commit('setRaceState', 'finished')
            expect(store.state.raceState).toBe('finished')
        })

        it('handles pause and resume flow', () => {
            store.commit('setRaceState', 'running')
            expect(store.state.raceState).toBe('running')

            store.dispatch('pauseRace')
            expect(store.state.raceState).toBe('paused')

            // Resume would call startRace, but we just test the state change
            store.commit('setRaceState', 'running')
            expect(store.state.raceState).toBe('running')
        })

        it('handles reset after completion', () => {
            // Setup completed race state
            store.state.results = [{ distance: 1200, positions: [] }]
            store.state.currentRound = 6
            store.state.raceState = 'finished'

            // Reset for new race
            store.commit('resetGame')

            expect(store.state.results).toEqual([])
            expect(store.state.currentRound).toBe(0)
            expect(store.state.raceState).toBe('idle')
        })
    })
})
