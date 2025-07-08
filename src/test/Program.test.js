import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Program from '../components/Program.vue'
import { createMockStore, mockProgram } from './helpers.js'

describe('Program', () => {
    let wrapper
    let store

    describe('with empty program', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [],
                currentRound: 0,
                raceState: 'idle'
            })
            wrapper = mount(Program, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('shows empty state message', () => {
            expect(wrapper.find('.empty-state').text()).toBe('Click "Generate New Race" to create a program')
        })
    })

    describe('with program data', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 0,
                raceState: 'idle'
            })
            wrapper = mount(Program, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('renders correctly', () => {
            expect(wrapper.find('h3').text()).toBe('📋 Race Program')
            expect(wrapper.find('.program').exists()).toBe(true)
        })

        it('displays all rounds', () => {
            const rounds = wrapper.findAll('.round')
            expect(rounds).toHaveLength(mockProgram.length)
        })

        it('displays round information correctly', () => {
            const firstRound = wrapper.find('.round')
            expect(firstRound.find('h4').text()).toBe('Round 1')
            expect(firstRound.find('.distance').text()).toBe('1200m')
        })

        it('shows correct status for different round states', () => {
            // Current round should show pending status
            const firstRound = wrapper.find('.round')
            expect(firstRound.find('.pending').exists()).toBe(true)
        })

        it('displays horse cards for each round', () => {
            const firstRound = wrapper.find('.round')
            const horseCards = firstRound.findAll('.card')
            expect(horseCards).toHaveLength(mockProgram[0].horses.length)
        })

        it('displays horse information in cards', () => {
            const firstCard = wrapper.find('.card')
            expect(firstCard.find('.lane').text()).toBe('1')
            expect(firstCard.find('.name').text()).toBe('Thunder Bolt')
        })
    })

    describe('with active round', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 0,
                raceState: 'running'
            })
            wrapper = mount(Program, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('highlights active round', () => {
            const activeRound = wrapper.find('.round.active')
            expect(activeRound.exists()).toBe(true)
        })

        it('shows running status for active round', () => {
            const activeRound = wrapper.find('.round.active')
            expect(activeRound.find('.running').exists()).toBe(true)
        })
    })

    describe('with completed rounds', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 1,
                raceState: 'running'
            })
            wrapper = mount(Program, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('marks completed rounds', () => {
            const completedRound = wrapper.find('.round.completed')
            expect(completedRound.exists()).toBe(true)
        })

        it('shows completed status', () => {
            const completedRound = wrapper.find('.round.completed')
            expect(completedRound.find('.completed').exists()).toBe(true)
        })
    })
})
