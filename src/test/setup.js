import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'

// Global test setup
config.global.stubs = {
    // Stub any global components if needed
}

// Mock any global properties if needed
config.global.mocks = {
    // Add global mocks here
}

// Global test configuration
global.ResizeObserver = class ResizeObserver {
    constructor(cb) {
        this.cb = cb;
    }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock window.requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock Date.now for consistent testing
const originalDateNow = Date.now;
Date.now = () => 1482363367071;
