import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createMockStore, mockProgram } from './helpers.js'

// Mock child components to focus on App logic
const mockComponents = {
    HorseList: { template: '<div data-testid="horse-list">HorseList</div>' },
    RaceTrack: { template: '<div data-testid="race-track">RaceTrack</div>' },
    Program: { template: '<div data-testid="program">Program</div>' },
    Results: { template: '<div data-testid="results">Results</div>' },
    RaceControls: { template: '<div data-testid="race-controls">RaceControls</div>' }
}

describe('App', () => {
    let wrapper
    let store

    describe('layout and basic structure', () => {
        beforeEach(() => {
            store = createMockStore({
                raceState: 'idle'
            })
            wrapper = mount(App, {
                global: {
                    plugins: [store],
                    components: mockComponents
                }
            })
        })

        it('renders correctly', () => {
            expect(wrapper.find('#app').exists()).toBe(false) // #app is in index.html
            expect(wrapper.find('h1').text()).toBe('🏇 Horse Racing Game')
        })

        it('always renders race controls', () => {
            expect(wrapper.find('[data-testid="race-controls"]').exists()).toBe(true)
        })

        it('renders layout structure', () => {
            expect(wrapper.find('.layout').exists()).toBe(true)
            expect(wrapper.find('.right-panel').exists()).toBe(true)
        })

        it('always renders horse list', () => {
            expect(wrapper.find('[data-testid="horse-list"]').exists()).toBe(true)
        })

        it('always renders program in right panel', () => {
            const rightPanel = wrapper.find('.right-panel')
            expect(rightPanel.find('[data-testid="program"]').exists()).toBe(true)
        })
    })

    describe('conditional component rendering based on race state', () => {
        describe('when race state is idle', () => {
            beforeEach(() => {
                store = createMockStore({
                    raceState: 'idle'
                })
                wrapper = mount(App, {
                    global: {
                        plugins: [store],
                        components: mockComponents
                    }
                })
            })

            it('shows race track', () => {
                expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(true)
            })

            it('shows results in right panel (not center)', () => {
                const rightPanel = wrapper.find('.right-panel')
                expect(rightPanel.find('[data-testid="results"]').exists()).toBe(true)
                expect(wrapper.find('.center-results').exists()).toBe(false)
            })
        })

        describe('when race state is running', () => {
            beforeEach(() => {
                store = createMockStore({
                    raceState: 'running'
                })
                wrapper = mount(App, {
                    global: {
                        plugins: [store],
                        components: mockComponents
                    }
                })
            })

            it('shows race track', () => {
                expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(true)
            })

            it('shows results in right panel', () => {
                const rightPanel = wrapper.find('.right-panel')
                expect(rightPanel.find('[data-testid="results"]').exists()).toBe(true)
            })

            it('does not show center results', () => {
                expect(wrapper.find('.center-results').exists()).toBe(false)
            })
        })

        describe('when race state is paused', () => {
            beforeEach(() => {
                store = createMockStore({
                    raceState: 'paused'
                })
                wrapper = mount(App, {
                    global: {
                        plugins: [store],
                        components: mockComponents
                    }
                })
            })

            it('shows race track', () => {
                expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(true)
            })

            it('shows results in right panel', () => {
                const rightPanel = wrapper.find('.right-panel')
                expect(rightPanel.find('[data-testid="results"]').exists()).toBe(true)
            })
        })

        describe('when race state is finished', () => {
            beforeEach(() => {
                store = createMockStore({
                    raceState: 'finished'
                })
                wrapper = mount(App, {
                    global: {
                        plugins: [store],
                        components: mockComponents
                    }
                })
            })

            it('does not show race track', () => {
                expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(false)
            })

            it('shows center results with special class', () => {
                expect(wrapper.find('.center-results').exists()).toBe(true)
                expect(wrapper.find('[data-testid="results"].center-results').exists()).toBe(true)
            })

            it('does not show results in right panel when finished', () => {
                const rightPanel = wrapper.find('.right-panel')
                expect(rightPanel.find('[data-testid="results"]').exists()).toBe(false)
            })
        })
    })

    describe('component structure validation', () => {
        beforeEach(() => {
            store = createMockStore({
                raceState: 'idle'
            })
            wrapper = mount(App, {
                global: {
                    plugins: [store],
                    components: mockComponents
                }
            })
        })

        it('renders components in correct order', () => {
            const allElements = wrapper.element.children

            // Should have h1, race-controls, and layout
            expect(allElements[0].tagName).toBe('H1')
            expect(allElements[1].getAttribute('data-testid')).toBe('race-controls')
            expect(allElements[2].classList.contains('layout')).toBe(true)
        })

        it('layout contains expected children', () => {
            const layout = wrapper.find('.layout')
            const layoutChildren = layout.element.children

            // Should have horse-list, race-track (when not finished), and right-panel
            expect(layoutChildren.length).toBeGreaterThanOrEqual(2)
            expect(layoutChildren[0].getAttribute('data-testid')).toBe('horse-list')
        })

        it('right panel contains program and results (when not finished)', () => {
            const rightPanel = wrapper.find('.right-panel')
            const panelChildren = rightPanel.element.children

            expect(panelChildren[0].getAttribute('data-testid')).toBe('program')
            // Results should be second child when race is not finished
            if (panelChildren.length > 1) {
                expect(panelChildren[1].getAttribute('data-testid')).toBe('results')
            }
        })
    })

    describe('reactive race state changes', () => {
        beforeEach(() => {
            store = createMockStore({
                raceState: 'idle'
            })
            wrapper = mount(App, {
                global: {
                    plugins: [store],
                    components: mockComponents
                }
            })
        })

        it('updates layout when race state changes to running', async () => {
            // Initially idle - should show race track
            expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(true)
            expect(wrapper.find('.center-results').exists()).toBe(false)

            // Change to running
            store.state.raceState = 'running'
            await wrapper.vm.$nextTick()

            // Should still show race track
            expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(true)
            expect(wrapper.find('.center-results').exists()).toBe(false)
        })

        it('updates layout when race state changes to finished', async () => {
            // Initially idle
            expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(true)
            expect(wrapper.find('.center-results').exists()).toBe(false)

            // Change to finished
            store.state.raceState = 'finished'
            await wrapper.vm.$nextTick()

            // Should hide race track and show center results
            expect(wrapper.find('[data-testid="race-track"]').exists()).toBe(false)
            expect(wrapper.find('.center-results').exists()).toBe(true)
        })

        it('computed raceState reflects store changes', async () => {
            const component = wrapper.vm

            expect(component.raceState).toBe('idle')

            store.state.raceState = 'running'
            await wrapper.vm.$nextTick()

            expect(component.raceState).toBe('running')

            store.state.raceState = 'finished'
            await wrapper.vm.$nextTick()

            expect(component.raceState).toBe('finished')
        })
    })

    describe('edge cases', () => {
        it('handles undefined race state gracefully', () => {
            store = createMockStore({
                raceState: undefined
            })

            expect(() => {
                wrapper = mount(App, {
                    global: {
                        plugins: [store],
                        components: mockComponents
                    }
                })
            }).not.toThrow()
        })

        it('handles null race state gracefully', () => {
            store = createMockStore({
                raceState: null
            })

            expect(() => {
                wrapper = mount(App, {
                    global: {
                        plugins: [store],
                        components: mockComponents
                    }
                })
            }).not.toThrow()
        })

        it('handles unknown race state gracefully', () => {
            store = createMockStore({
                raceState: 'unknown-state'
            })

            wrapper = mount(App, {
                global: {
                    plugins: [store],
                    components: mockComponents
                }
            })

            // Should still render without errors
            expect(wrapper.find('h1').exists()).toBe(true)
            expect(wrapper.find('[data-testid="race-controls"]').exists()).toBe(true)
        })
    })
})
