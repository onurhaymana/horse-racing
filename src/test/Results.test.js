import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Results from '../components/Results.vue'
import { createMockStore, mockResults } from './helpers.js'

describe('Results', () => {
    let wrapper
    let store

    describe('with empty results', () => {
        beforeEach(() => {
            store = createMockStore({
                results: [],
                raceState: 'idle'
            })
            wrapper = mount(Results, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('shows empty state message', () => {
            expect(wrapper.find('.empty-state').text()).toBe('Results will appear here after races complete')
        })
    })

    describe('with race results', () => {
        beforeEach(() => {
            store = createMockStore({
                results: mockResults,
                raceState: 'running'
            })
            wrapper = mount(Results, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('renders correctly', () => {
            expect(wrapper.find('h3').text()).toBe('🏆 Race Results')
            expect(wrapper.find('.results').exists()).toBe(true)
        })

        it('displays all race results', () => {
            const rounds = wrapper.findAll('.round')
            expect(rounds).toHaveLength(mockResults.length)
        })

        it('displays round header correctly', () => {
            const roundHeader = wrapper.find('.header')
            expect(roundHeader.find('h4').text()).toBe('Round 1 Results')
            expect(roundHeader.find('.distance').text()).toBe('1200m')
        })

        it('displays all horse positions', () => {
            const positions = wrapper.findAll('.position')
            expect(positions).toHaveLength(mockResults[0].positions.length)
        })

        it('displays position numbers correctly', () => {
            const positionNumbers = wrapper.findAll('.position .number')
            expect(positionNumbers[0].text()).toBe('1')
            expect(positionNumbers[1].text()).toBe('2')
            expect(positionNumbers[2].text()).toBe('3')
        })

        it('displays horse names correctly', () => {
            const horseNames = wrapper.findAll('.position .name')
            expect(horseNames[0].text()).toBe('Storm Chaser') // Winner
            expect(horseNames[1].text()).toBe('Thunder Bolt') // Second
            expect(horseNames[2].text()).toBe('Lightning Strike') // Third
        })

        it('applies correct position classes', () => {
            const positions = wrapper.findAll('.position')
            expect(positions[0].classes()).toContain('first')
            expect(positions[1].classes()).toContain('second')
            expect(positions[2].classes()).toContain('third')
        })

        it('shows medals for top 3 positions', () => {
            const medals = wrapper.findAll('.medal')
            expect(medals).toHaveLength(3)
            expect(medals[0].text()).toBe('🥇')
            expect(medals[1].text()).toBe('🥈')
            expect(medals[2].text()).toBe('🥉')
        })

        it('displays horse condition correctly', () => {
            const conditions = wrapper.findAll('.condition')
            expect(conditions[0].text()).toBe('90') // Storm Chaser
            expect(conditions[1].text()).toBe('85') // Thunder Bolt
            expect(conditions[2].text()).toBe('70') // Lightning Strike
        })
    })

    describe('when all races completed', () => {
        beforeEach(() => {
            store = createMockStore({
                results: mockResults,
                raceState: 'finished'
            })
            wrapper = mount(Results, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('shows completion banner', () => {
            const banner = wrapper.find('.banner')
            expect(banner.exists()).toBe(true)
            expect(banner.text()).toBe('🎉 All Races Completed! 🎉')
        })
    })

    describe('position class logic', () => {
        beforeEach(() => {
            store = createMockStore({
                results: mockResults,
                raceState: 'running'
            })
            wrapper = mount(Results, {
                global: {
                    plugins: [store]
                }
            })
        })

        it('returns correct position classes', () => {
            const component = wrapper.vm
            expect(component.getPositionClass(0)).toBe('first')
            expect(component.getPositionClass(1)).toBe('second')
            expect(component.getPositionClass(2)).toBe('third')
            expect(component.getPositionClass(3)).toBe('other')
        })

        it('returns correct medals', () => {
            const component = wrapper.vm
            expect(component.getMedal(0)).toBe('🥇')
            expect(component.getMedal(1)).toBe('🥈')
            expect(component.getMedal(2)).toBe('🥉')
            expect(component.getMedal(3)).toBe('')
        })
    })
})
