import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// APIs de navegador ausentes no jsdom.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
Element.prototype.scrollIntoView = vi.fn();
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
