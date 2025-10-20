import { useState, useCallback, useEffect } from 'react';
import { StorageUtils } from '../services/mmkvService';

/**
 * Hook para gestionar almacenamiento en AsyncStorage con sincronización automática
 * @template T - Tipo del valor almacenado
 * @param key - Clave de almacenamiento en AsyncStorage
 * @param defaultValue - Valor por defecto si no existe en AsyncStorage
 * @returns [valor actual, función para actualizar]
 */
export function useMMKVStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Estado local con el valor inicial del defaultValue
  const [value, setValue] = useState<T>(defaultValue);

  // Cargar valor inicial de AsyncStorage
  useEffect(() => {
    StorageUtils.getJSON<T>(key, defaultValue).then((storedValue) => {
      if (storedValue !== null) {
        setValue(storedValue);
      }
    }).catch((error) => {
      console.error(`Error reading from AsyncStorage key "${key}":`, error);
    });
  }, [key, defaultValue]);

  // Función para actualizar valor: guarda en AsyncStorage y actualiza estado local
  const setValueAndPersist = useCallback(
    (newValue: T) => {
      // Actualizar estado local inmediatamente
      setValue(newValue);
      // Persistir en AsyncStorage (async)
      StorageUtils.setJSON(key, newValue).catch((error) => {
        console.error(`Error writing to AsyncStorage key "${key}":`, error);
      });
    },
    [key]
  );

  return [value, setValueAndPersist];
}
