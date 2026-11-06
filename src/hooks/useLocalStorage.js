import { useState, useEffect } from "react";

/**
 * Custom hook: useState that is automatically synchronised with localStorage.
 *  - useState lazy initialiser  -> reads the saved value ONCE on first render.
 *  - useEffect                  -> writes the value back whenever it changes.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue; // corrupted JSON or storage blocked
    }
  });

  // Side effect: sync state -> localStorage (runs only when key/value change)
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable - fail silently */
    }
  }, [key, value]);

  return [value, setValue];
}
