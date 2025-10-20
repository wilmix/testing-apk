import { useState, useCallback, useEffect } from 'react';
import { ZodSchema } from 'zod';
import { StorageUtils } from '../services/mmkvService';
import { validateData } from '../services/validationService';

interface UseFormDataOptions {
  autoSave?: boolean;
  debounceMs?: number;
}

interface UseFormDataResult<T> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  updateField: (field: keyof T, value: any) => void;
  updateMultiple: (updates: Partial<T>) => void;
  reset: () => void;
  validate: () => boolean;
  setTouched: (field: keyof T, touched: boolean) => void;
}

/**
 * Hook para gestionar datos de formulario con validación real-time
 * @template T - Tipo de los datos del formulario
 * @param storageKey - Clave para guardar en MMKV
 * @param initialValue - Valor inicial del formulario
 * @param schema - Schema Zod para validación
 * @param options - Opciones: autoSave, debounceMs
 * @returns Object con data, errors, touched, updateField, etc.
 */
export function useFormData<T extends Record<string, any>>(
  storageKey: string,
  initialValue: T,
  schema: ZodSchema,
  options: UseFormDataOptions = {}
): UseFormDataResult<T> {
  const { autoSave = true, debounceMs = 500 } = options;

  // Estado del formulario
  const [data, setData] = useState<T>(initialValue);

  // Cargar datos iniciales de AsyncStorage
  useEffect(() => {
    StorageUtils.getJSON<T>(storageKey).then((saved) => {
      if (saved) setData(saved);
    }).catch(() => {
      // Ignorar errores de carga inicial
    });
  }, [storageKey]);

  // Estado de errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado de campos tocados
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});

  // Timeout para debounce
  useEffect(() => {
    if (!autoSave) return;

    const timeout = setTimeout(() => {
      StorageUtils.setJSON(storageKey, data).catch((error) => {
        console.error(`Error saving form data to AsyncStorage:`, error);
      });
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [data, autoSave, debounceMs, storageKey]);

  // Actualizar un campo individual
  const updateField = useCallback((field: keyof T, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Marcar como tocado
    setTouchedState((prev) => ({
      ...prev,
      [String(field)]: true,
    }));
  }, []);

  // Actualizar múltiples campos
  const updateMultiple = useCallback((updates: Partial<T>) => {
    setData((prev) => ({
      ...prev,
      ...updates,
    }));
    // Marcar todos como tocados
    const touchedUpdates = Object.keys(updates).reduce(
      (acc, field) => ({
        ...acc,
        [field]: true,
      }),
      {}
    );
    setTouchedState((prev) => ({
      ...prev,
      ...touchedUpdates,
    }));
  }, []);

  // Validar todos los campos
  const validate = useCallback((): boolean => {
    const result = validateData(schema, data);

    if (result.valid) {
      setErrors({});
      return true;
    } else {
      setErrors(result.errors);
      return false;
    }
  }, [data, schema]);

  // Resetear formulario
  const reset = useCallback(() => {
    setData(initialValue);
    setErrors({});
    setTouchedState({});
    StorageUtils.remove(storageKey).catch((error) => {
      console.error(`Error removing form data from AsyncStorage:`, error);
    });
  }, [initialValue, storageKey]);

  // Marcar campo como tocado/no tocado
  const setTouched = useCallback((field: keyof T, value: boolean) => {
    setTouchedState((prev) => ({
      ...prev,
      [String(field)]: value,
    }));
  }, []);

  return {
    data,
    errors,
    touched,
    updateField,
    updateMultiple,
    reset,
    validate,
    setTouched,
  };
}
