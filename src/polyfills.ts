// Must be imported FIRST in index.tsx to ensure Node.js globals are available
// before any library code runs.
import { Buffer } from 'buffer';
import process from 'process';

// Attach to globalThis so any library that reads window.Buffer / global.Buffer works
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer;
}
if (typeof (globalThis as any).process === 'undefined') {
  (globalThis as any).process = process;
}
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}
