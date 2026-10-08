import '@testing-library/jest-dom';
import { webcrypto } from 'node:crypto';
Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
HTMLElement.prototype.scrollIntoView = jest.fn();
