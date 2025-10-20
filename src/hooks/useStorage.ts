import { useState, useCallback, useEffect } from 'react';
import { storageUtils } from '../services/storageService';

/**
 * A hook to manage a value in AsyncStorage with automatic synchronization.
 * @template T The type of the stored value.
 * @param key The key for the value in AsyncStorage.
 * @param defaultValue The default value to use if none is found in storage.
 * @returns A stateful value and a function to update it.
 */
export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    storageUtils.getJSON<T>(key, defaultValue).then((storedValue) => {
      if (storedValue !== null) {
        setValue(storedValue);
      }
    }).catch((error) => {
      console.error(`Error reading from AsyncStorage key "${key}":`, error);
    });
  }, [key, defaultValue]);

  const setValueAndPersist = useCallback(
    (newValue: T) => {
      setValue(newValue);
      storageUtils.setJSON(key, newValue).catch((error) => {
        console.error(`Error writing to AsyncStorage key "${key}":`, error);
      });
    },
    [key]
  );

  return [value, setValueAndPersist];
}
