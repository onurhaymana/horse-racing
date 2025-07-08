import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseList from '../components/HorseList.vue'
import { createMockStore, mockHorses } from './helpers.js'

describe('HorseList', () => {
    let wrapper
    let store

    beforeEach(() => {
        store = createMockStore({
            horses: mockHorses
        })
        wrapper = mount(HorseList, {
            global: {
                plugins: [store]
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.find('h3').text()).toBe('🐎 Horse Roster (1-20)')
        expect(wrapper.find('.horse-list').exists()).toBe(true)
    })

    it('displays all horses from store', () => {
        const horseRows = wrapper.findAll('.horse-row')
        expect(horseRows).toHaveLength(mockHorses.length)
    })

    it('displays horse information correctly', () => {
        const firstHorse = wrapper.find('.horse-row')
        expect(firstHorse.find('.horse-name').text()).toBe('Thunder Bolt')
        expect(firstHorse.find('.condition-text').text()).toBe('85')
    })

    it('displays condition bar with correct width', () => {
        const conditionFill = wrapper.find('.condition-fill')
        expect(conditionFill.attributes('style')).toContain('width: 85%')
    })

    it('displays horse color dot correctly', () => {
        const colorDot = wrapper.find('.dot')
        expect(colorDot.attributes('style')).toContain('background-color: red')
    })

    it('shows correct condition colors', () => {
        const component = wrapper.vm

        expect(component.getConditionColor(85)).toBe('#4CAF50') // Green for high condition
        expect(component.getConditionColor(65)).toBe('#FFC107') // Yellow for medium condition
        expect(component.getConditionColor(45)).toBe('#FF9800') // Orange for low condition
        expect(component.getConditionColor(25)).toBe('#F44336') // Red for very low condition
    })

    it('displays headers correctly', () => {
        expect(wrapper.find('.name-header').text()).toBe('Name')
        expect(wrapper.find('.condition-header').text()).toBe('Condition')
        expect(wrapper.find('.color-header').text()).toBe('Color')
    })
})
