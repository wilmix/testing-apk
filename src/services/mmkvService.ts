/**
 * Inicialización de MMKV
 * Storage offline-first para la app
 */

import { MMKV } from 'react-native-mmkv'

export const mmkvStorage = new MMKV({
  id: 'orden-trabajo-storage',
  encryptionKey: 'orden-trabajo-encryption-key-v1' // En producción, usar clave segura
})

/**
 * Utilidades para trabajar con MMKV
 */
export const MMKVUtils = {
  /**
   * Guardar un objeto JSON
   */
  setJSON: (key: string, value: any) => {
    try {
      mmkvStorage.set(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error guardando ${key}:`, error)
      return false
    }
  },

  /**
   * Obtener un objeto JSON
   */
  getJSON: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const value = mmkvStorage.getString(key)
      return value ? JSON.parse(value) : defaultValue || null
    } catch (error) {
      console.error(`Error cargando ${key}:`, error)
      return defaultValue || null
    }
  },

  /**
   * Verificar si existe una clave
   */
  has: (key: string): boolean => {
    return mmkvStorage.contains(key)
  },

  /**
   * Eliminar una clave
   */
  remove: (key: string): void => {
    mmkvStorage.delete(key)
  },

  /**
   * Limpiar todo el storage
   */
  clear: (): void => {
    mmkvStorage.clearAll()
  },

  /**
   * Obtener todas las claves
   */
  getAllKeys: (): string[] => {
    return mmkvStorage.getAllKeys()
  }
}
