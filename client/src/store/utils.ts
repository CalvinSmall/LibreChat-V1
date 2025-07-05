import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Helper function to create atoms with localStorage
export function atomWithLocalStorage<T>(key: string, defaultValue: T) {
  return atomWithStorage<T>(key, defaultValue, {
    getItem: (key) => {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        try {
          return JSON.parse(savedValue);
        } catch (e) {
          console.error(
            `Error parsing localStorage key "${key}", \`savedValue\`: defaultValue, error:`,
            e,
          );
          localStorage.setItem(key, JSON.stringify(defaultValue));
          return defaultValue;
        }
      }
      return defaultValue;
    },
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
    },
  });
}
