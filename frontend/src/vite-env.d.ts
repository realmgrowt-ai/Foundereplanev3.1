/// <reference types="vite/client" />

interface Window {
  Intercom?: (...args: unknown[]) => void;
}