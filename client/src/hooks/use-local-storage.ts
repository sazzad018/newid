import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useAutoSave<T>(key: string, data: T, delay: number = 30000) {
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Auto-save failed for key "${key}":`, error);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [key, data, delay]);
}
