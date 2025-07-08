import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceTrack from '../components/RaceTrack.vue'
import { createMockStore, mockHorses } from './helpers.js'

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16))
global.cancelAnimationFrame = vi.fn()

describe('RaceTrack', () => {
    let wrapper
    let store

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('with no program', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [],
                currentRound: 0,
                raceState: 'idle'
            })
            wrapper = mount(RaceTrack, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('renders without horses when no program exists', () => {
            expect(wrapper.find('.lanes').exists()).toBe(true)
            expect(wrapper.findAll('.lane')).toHaveLength(0)
        })
    })

    describe('with program and horses', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [
                    { distance: 1200, horses: mockHorses }
                ],
                currentRound: 0,
                raceState: 'idle'
            })
            wrapper = mount(RaceTrack, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('renders correctly', () => {
            expect(wrapper.find('.track').exists()).toBe(true)
            expect(wrapper.find('.header').exists()).toBe(true)
            expect(wrapper.find('.lanes').exists()).toBe(true)
        })

        it('displays round information', () => {
            const header = wrapper.find('.header h3')
            expect(header.text()).toBe('Round 1 - 1200m')
        })

        it('shows correct number of lanes for horses', () => {
            const lanes = wrapper.findAll('.lane')
            expect(lanes).toHaveLength(mockHorses.length)
        })

        it('displays horse information correctly', () => {
            const firstLane = wrapper.find('.lane')
            expect(firstLane.find('.number').text()).toBe('1')
            expect(firstLane.find('.info span').text()).toBe('Thunder Bolt')
            expect(firstLane.find('.condition').text()).toBe('(85)')
        })

        it('shows horse emoji in each lane', () => {
            const horses = wrapper.findAll('.horse')
            expect(horses).toHaveLength(mockHorses.length)
            horses.forEach(horse => {
                expect(horse.text()).toBe('🐎')
            })
        })

        it('displays finish line in each lane', () => {
            const finishLines = wrapper.findAll('.finish')
            expect(finishLines).toHaveLength(mockHorses.length)
        })
    })

    describe('during race', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [
                    { distance: 1200, horses: mockHorses }
                ],
                currentRound: 0,
                raceState: 'running'
            })
            wrapper = mount(RaceTrack, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('shows race in progress status', () => {
            const status = wrapper.find('.status')
            expect(status.exists()).toBe(true)
            expect(status.text()).toBe('🏁 Race in Progress...')
        })

        it('applies dynamic styles to horses during animation', () => {
            const horses = wrapper.findAll('.horse')
            horses.forEach(horse => {
                expect(horse.attributes('style')).toBeDefined()
            })
        })
    })

    describe('with multiple rounds', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [
                    { distance: 1200, horses: mockHorses },
                    { distance: 1600, horses: mockHorses }
                ],
                currentRound: 1,
                raceState: 'idle'
            })
            wrapper = mount(RaceTrack, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('displays correct round information', () => {
            const header = wrapper.find('.header h3')
            expect(header.text()).toBe('Round 2 - 1600m')
        })
    })

    describe('when race is finished', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [
                    { distance: 1200, horses: mockHorses }
                ],
                currentRound: 1, // Beyond program length
                raceState: 'finished'
            })
            wrapper = mount(RaceTrack, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('does not show round header when race is finished', () => {
            const header = wrapper.find('.header h3')
            expect(header.exists()).toBe(false)
        })

        it('does not show racing status', () => {
            const status = wrapper.find('.status')
            expect(status.exists()).toBe(false)
        })
    })
})