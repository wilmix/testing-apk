/**
 * Storage Service - AsyncStorage
 * Storage offline-first para la app (compatible con Expo Go)
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Utilidades para trabajar con AsyncStorage
 * API async/await para persistencia local
 */
export const StorageUtils = {
  /**
   * Guardar un objeto JSON
   */
  setJSON: async (key: string, value: any): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error guardando ${key}:`, error)
      return false
    }
  },

  /**
   * Obtener un objeto JSON
   */
  getJSON: async <T = any>(key: string, defaultValue?: T): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue || null
    } catch (error) {
      console.error(`Error cargando ${key}:`, error)
      return defaultValue || null
    }
  },

  /**
   * Verificar si existe una clave
   */
  has: async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value !== null
    } catch (error) {
      console.error(`Error verificando ${key}:`, error)
      return false
    }
  },

  /**
   * Eliminar una clave
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Error eliminando ${key}:`, error)
    }
  },

  /**
   * Limpiar todo el storage
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error('Error limpiando storage:', error)
    }
  },

  /**
   * Obtener todas las claves
   */
  getAllKeys: async (): Promise<readonly string[]> => {
    try {
      return await AsyncStorage.getAllKeys()
    } catch (error) {
      console.error('Error obteniendo claves:', error)
      return []
    }
  }
}

// Mantener compatibilidad con código existente
export const MMKVUtils = StorageUtils
