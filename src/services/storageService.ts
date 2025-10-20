/**
 * Storage Service - AsyncStorage
 * Offline-first storage for the app (Expo Go compatible)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utilities for working with AsyncStorage.
 * Provides an async/await API for local persistence.
 */
export const storageUtils = {
  /**
   * Saves a JSON object to storage.
   */
  setJSON: async (key: string, value: any): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  },

  /**
   * Retrieves a JSON object from storage.
   */
  getJSON: async <T = any>(key: string, defaultValue?: T): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue || null;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue || null;
    }
  },

  /**
   * Checks if a key exists in storage.
   */
  has: async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking ${key}:`, error);
      return false;
    }
  },

  /**
   * Removes a key from storage.
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  /**
   * Clears the entire storage.
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  /**
   * Retrieves all keys from storage.
   */
  getAllKeys: async (): Promise<readonly string[]> => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },
};
