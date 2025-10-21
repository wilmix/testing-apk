/**
 * ordenService.ts
 * Servicio CRUD para gestión de Órdenes de Trabajo
 * FASE 7.2 - Lista de Órdenes + CRUD
 */

import { storageUtils } from './storageService'
import type { OrdenTrabajoFormData, EstadoOrden } from '../types/ordenTrabajo'

const KEYS = {
  LIST: 'ordenes:list',
  LAST_ID: 'ordenes:lastId',
  DATA: (id: string) => `ordenes:data:${id}`,
} as const

/**
 * Genera el siguiente ID de orden
 * Formato: "001", "002", "003", etc.
 */
async function getNextId(): Promise<string> {
  const lastId = await storageUtils.getJSON<number>(KEYS.LAST_ID, 0) || 0
  const nextId = lastId + 1
  await storageUtils.setJSON(KEYS.LAST_ID, nextId)
  return String(nextId).padStart(3, '0')
}

export const ordenService = {
  /**
   * Obtiene todas las órdenes
   * @returns Array de órdenes ordenadas por fecha de creación (más reciente primero)
   */
  getOrdenes: async (): Promise<OrdenTrabajoFormData[]> => {
    try {
      const ids = await storageUtils.getJSON<string[]>(KEYS.LIST, []) || []
      const ordenes: OrdenTrabajoFormData[] = []

      for (const id of ids) {
        const orden = await storageUtils.getJSON<OrdenTrabajoFormData>(KEYS.DATA(id))
        if (orden) {
          ordenes.push({ ...orden, id })
        }
      }

      // Ordenar por fecha de creación (más reciente primero)
      return ordenes.sort((a, b) => {
        if (!a.fechaCreacion || !b.fechaCreacion) return 0
        return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      })
    } catch (error) {
      console.error('Error al obtener órdenes:', error)
      return []
    }
  },

  /**
   * Obtiene una orden por ID
   * @param id - ID de la orden (ej: "001")
   * @returns Orden encontrada o null
   */
  getOrdenById: async (id: string): Promise<OrdenTrabajoFormData | null> => {
    try {
      const orden = await storageUtils.getJSON<OrdenTrabajoFormData>(KEYS.DATA(id))
      return orden ? { ...orden, id } : null
    } catch (error) {
      console.error(`Error al obtener orden ${id}:`, error)
      return null
    }
  },

  /**
   * Crea una nueva orden
   * @param data - Datos de la orden (sin ID)
   * @returns ID de la orden creada
   */
  createOrden: async (data: Omit<OrdenTrabajoFormData, 'id'>): Promise<string> => {
    try {
      const id = await getNextId()
      const orden: OrdenTrabajoFormData = {
        ...data,
        id,
        estado: data.estado || 'completada',
        fechaCreacion: new Date(),
      }

      // Guardar orden
      await storageUtils.setJSON(KEYS.DATA(id), orden)

      // Actualizar lista de IDs
      const ids = await storageUtils.getJSON<string[]>(KEYS.LIST, []) || []
      await storageUtils.setJSON(KEYS.LIST, [...ids, id])

      return id
    } catch (error) {
      console.error('Error al crear orden:', error)
      throw error
    }
  },

  /**
   * Actualiza una orden existente
   * @param id - ID de la orden
   * @param data - Datos a actualizar (parcial)
   */
  updateOrden: async (id: string, data: Partial<OrdenTrabajoFormData>): Promise<void> => {
    try {
      const orden = await ordenService.getOrdenById(id)
      if (!orden) {
        throw new Error(`Orden ${id} no encontrada`)
      }

      const updatedOrden: OrdenTrabajoFormData = {
        ...orden,
        ...data,
        id,
        fechaModificacion: new Date(),
      }

      await storageUtils.setJSON(KEYS.DATA(id), updatedOrden)
    } catch (error) {
      console.error(`Error al actualizar orden ${id}:`, error)
      throw error
    }
  },

  /**
   * Elimina una orden (soft delete - cambia estado a anulada)
   * @param id - ID de la orden
   */
  deleteOrden: async (id: string): Promise<void> => {
    try {
      await ordenService.updateOrden(id, {
        estado: 'anulada',
        fechaModificacion: new Date()
      })
    } catch (error) {
      console.error(`Error al anular orden ${id}:`, error)
      throw error
    }
  },

  /**
   * Anula una orden (alias de deleteOrden)
   * @param id - ID de la orden
   */
  anularOrden: async (id: string): Promise<void> => {
    await ordenService.deleteOrden(id)
  },

  /**
   * Completa una orden
   * @param id - ID de la orden
   */
  completarOrden: async (id: string): Promise<void> => {
    try {
      await ordenService.updateOrden(id, {
        estado: 'completada',
        fechaModificacion: new Date()
      })
    } catch (error) {
      console.error(`Error al completar orden ${id}:`, error)
      throw error
    }
  },

  /**
   * Busca órdenes por cliente
   * @param cliente - Nombre del cliente (búsqueda parcial, case-insensitive)
   * @returns Array de órdenes que coinciden
   */
  searchByCliente: async (cliente: string): Promise<OrdenTrabajoFormData[]> => {
    try {
      const ordenes = await ordenService.getOrdenes()
      const searchTerm = cliente.toLowerCase().trim()

      return ordenes.filter(orden =>
        orden.cliente.toLowerCase().includes(searchTerm)
      )
    } catch (error) {
      console.error('Error al buscar por cliente:', error)
      return []
    }
  },

  /**
   * Busca órdenes por número
   * @param numero - Número de orden (búsqueda parcial)
   * @returns Array de órdenes que coinciden
   */
  searchByNumero: async (numero: string): Promise<OrdenTrabajoFormData[]> => {
    try {
      const ordenes = await ordenService.getOrdenes()
      const searchTerm = numero.trim()

      return ordenes.filter(orden =>
        orden.id?.includes(searchTerm)
      )
    } catch (error) {
      console.error('Error al buscar por número:', error)
      return []
    }
  },

  /**
   * Filtra órdenes por estado
   * @param estado - Estado de la orden
   * @returns Array de órdenes con ese estado
   */
  filterByEstado: async (estado: EstadoOrden): Promise<OrdenTrabajoFormData[]> => {
    try {
      const ordenes = await ordenService.getOrdenes()
      return ordenes.filter(orden => orden.estado === estado)
    } catch (error) {
      console.error('Error al filtrar por estado:', error)
      return []
    }
  },

  /**
   * Obtiene el conteo total de órdenes
   * @returns Número total de órdenes
   */
  getOrdenesCount: async (): Promise<number> => {
    try {
      const ids = await storageUtils.getJSON<string[]>(KEYS.LIST, []) || []
      return ids.length
    } catch (error) {
      console.error('Error al obtener conteo de órdenes:', error)
      return 0
    }
  },

  /**
   * Limpia todas las órdenes (SOLO PARA TESTING)
   * ⚠️ CUIDADO: Esta función elimina todos los datos
   */
  clearAllOrdenes: async (): Promise<void> => {
    try {
      const ids = await storageUtils.getJSON<string[]>(KEYS.LIST, []) || []

      // Eliminar cada orden
      for (const id of ids) {
        await storageUtils.remove(KEYS.DATA(id))
      }

      // Limpiar lista y contador
      await storageUtils.remove(KEYS.LIST)
      await storageUtils.remove(KEYS.LAST_ID)
    } catch (error) {
      console.error('Error al limpiar órdenes:', error)
      throw error
    }
  },
}
