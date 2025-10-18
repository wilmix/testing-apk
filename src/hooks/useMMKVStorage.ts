import { useState, useCallback } from 'react';
import { MMKVUtils } from '../services/mmkvService';

/**
 * Hook para gestionar almacenamiento en MMKV con sincronización automática
 * @template T - Tipo del valor almacenado
 * @param key - Clave de almacenamiento en MMKV
 * @param defaultValue - Valor por defecto si no existe en MMKV
 * @returns [valor actual, función para actualizar]
 */
export function useMMKVStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Estado local con el valor inicial del defaultValue
  const [value, setValue] = useState<T>(() => {
    try {
      // Intenta cargar del MMKV, sino usa defaultValue
      return MMKVUtils.getJSON<T>(key, defaultValue) ?? defaultValue;
    } catch (error) {
      console.error(`Error reading from MMKV key "${key}":`, error);
      return defaultValue;
    }
  });

  // Función para actualizar valor: guarda en MMKV y actualiza estado local
  const setValueAndPersist = useCallback(
    (newValue: T) => {
      try {
        // Actualizar estado local
        setValue(newValue);
        // Persistir en MMKV
        MMKVUtils.setJSON(key, newValue);
      } catch (error) {
        console.error(`Error writing to MMKV key "${key}":`, error);
      }
    },
    [key]
  );

  return [value, setValueAndPersist];
}
