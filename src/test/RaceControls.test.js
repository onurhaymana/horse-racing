import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RaceControls from '../components/RaceControls.vue'
import { createMockStore, mockProgram } from './helpers.js'

describe('RaceControls', () => {
    let wrapper
    let store

    describe('initial state', () => {
        beforeEach(() => {
            store = createMockStore({
                program: [],
                currentRound: 0,
                raceState: 'idle'
            })
            wrapper = mount(RaceControls, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('renders correctly', () => {
            expect(wrapper.find('.controls').exists()).toBe(true)
        })

        it('shows generate button', () => {
            const generateBtn = wrapper.find('.btn.primary')
            expect(generateBtn.text()).toBe('🎲 Generate New Race')
            expect(generateBtn.attributes('disabled')).toBeUndefined()
        })

        it('shows start race button when program is empty', () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            expect(raceBtn.text()).toBe('🏁 Start Race')
            expect(raceBtn.attributes('disabled')).toBeDefined()
        })

        it('does not show race info when idle', () => {
            expect(wrapper.find('.info').exists()).toBe(false)
        })
    })

    describe('with program ready', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 0,
                raceState: 'idle'
            })
            wrapper = mount(RaceControls, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('enables start race button', () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            expect(raceBtn.attributes('disabled')).toBeUndefined()
        })

        it('calls generate mutations when generate button clicked', async () => {
            const generateBtn = wrapper.find('.btn.primary')
            await generateBtn.trigger('click')

            expect(store.commit).toHaveBeenCalledWith('generateHorses')
            expect(store.commit).toHaveBeenCalledWith('generateProgram')
            expect(store.commit).toHaveBeenCalledWith('resetGame')
        })

        it('calls startRace action when start button clicked', async () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            await raceBtn.trigger('click')

            expect(store.dispatch).toHaveBeenCalledWith('startRace')
        })
    })

    describe('during race', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 0,
                raceState: 'running'
            })
            wrapper = mount(RaceControls, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('disables generate button during race', () => {
            const generateBtn = wrapper.find('.btn.primary')
            expect(generateBtn.attributes('disabled')).toBeDefined()
        })

        it('shows pause button during race', () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            expect(raceBtn.text()).toBe('⏸️ Pause Race')
            expect(raceBtn.classes()).toContain('warning')
        })

        it('shows race info during race', () => {
            const info = wrapper.find('.info')
            expect(info.exists()).toBe(true)
            expect(info.find('.status').text()).toBe('Status: Racing')
            expect(info.find('.progress').text()).toBe('Round 1 of 2')
        })

        it('calls pauseRace action when pause button clicked', async () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            await raceBtn.trigger('click')

            expect(store.dispatch).toHaveBeenCalledWith('pauseRace')
        })
    })

    describe('when paused', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 0,
                raceState: 'paused'
            })
            wrapper = mount(RaceControls, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('shows resume button when paused', () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            expect(raceBtn.text()).toBe('▶️ Resume Race')
            expect(raceBtn.classes()).toContain('success')
        })

        it('shows paused status', () => {
            const status = wrapper.find('.status')
            expect(status.text()).toBe('Status: Paused')
        })

        it('calls resumeRace action when resume button clicked', async () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            await raceBtn.trigger('click')

            expect(store.dispatch).toHaveBeenCalledWith('resumeRace')
        })
    })

    describe('when finished', () => {
        beforeEach(() => {
            store = createMockStore({
                program: mockProgram,
                currentRound: 2,
                raceState: 'finished'
            })
            wrapper = mount(RaceControls, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('shows finished button', () => {
            const raceBtn = wrapper.findAll('.btn')[1]
            expect(raceBtn.text()).toBe('🏁 Race Finished')
            expect(raceBtn.classes()).toContain('info')
            expect(raceBtn.attributes('disabled')).toBeDefined()
        })

        it('shows completed status', () => {
            const status = wrapper.find('.status')
            expect(status.text()).toBe('Status: Completed')
        })

        it('enables generate button after finish', () => {
            const generateBtn = wrapper.find('.btn.primary')
            expect(generateBtn.attributes('disabled')).toBeUndefined()
        })
    })

    describe('helper methods', () => {
        beforeEach(() => {
            store = createMockStore()
            wrapper = mount(RaceControls, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('returns correct button text for different states', () => {
            const component = wrapper.vm

            // Mock different race states
            store.state.raceState = 'running'
            expect(component.getButtonText()).toBe('⏸️ Pause Race')

            store.state.raceState = 'paused'
            expect(component.getButtonText()).toBe('▶️ Resume Race')

            store.state.raceState = 'finished'
            expect(component.getButtonText()).toBe('🏁 Race Finished')

            store.state.raceState = 'idle'
            expect(component.getButtonText()).toBe('🏁 Start Race')
        })

        it('returns correct button classes for different states', () => {
            const component = wrapper.vm

            store.state.raceState = 'running'
            expect(component.getButtonClass()).toBe('warning')

            store.state.raceState = 'paused'
            expect(component.getButtonClass()).toBe('success')

            store.state.raceState = 'finished'
            expect(component.getButtonClass()).toBe('info')

            store.state.raceState = 'idle'
            expect(component.getButtonClass()).toBe('success')
        })

        it('returns correct race status for different states', () => {
            const component = wrapper.vm

            store.state.raceState = 'running'
            expect(component.getRaceStatus()).toBe('Racing')

            store.state.raceState = 'paused'
            expect(component.getRaceStatus()).toBe('Paused')

            store.state.raceState = 'finished'
            expect(component.getRaceStatus()).toBe('Completed')

            store.state.raceState = 'idle'
            expect(component.getRaceStatus()).toBe('Ready')
        })
    })
})
