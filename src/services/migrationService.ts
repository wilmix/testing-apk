/**
 * Migration Service - AsyncStorage Data Migration
 * Migra datos de FASE 6 (keys individuales) a FASE 7 (CRUD con IDs)
 */
import { storageUtils } from './storageService'
import type { OrdenTrabajoFormData } from '../types/ordenTrabajo'

const OLD_KEYS = {
  HEADER: 'orden_trabajo_header',
  DETALLES: 'orden_trabajo_detalles',
  FINAL: 'orden_trabajo_final',
} as const

const NEW_KEYS = {
  LIST: 'ordenes:list',
  LAST_ID: 'ordenes:lastId',
  DATA: (id: string) => `ordenes:data:${id}`,
  MIGRATION_FLAG: 'ordenes:migrated_v1',
} as const

export const migrationService = {
  /**
   * Verifica si ya se ejecutó la migración
   */
  isMigrated: async (): Promise<boolean> => {
    return await storageUtils.has(NEW_KEYS.MIGRATION_FLAG)
  },

  /**
   * Migra datos de formato antiguo (FASE 6) a formato nuevo (FASE 7)
   */
  migrateToV1: async (): Promise<boolean> => {
    try {
      // Verificar si ya se migró
      if (await migrationService.isMigrated()) {
        console.log('✅ Migración ya ejecutada previamente')
        return true
      }

      console.log('🔄 Iniciando migración de AsyncStorage...')

      // Leer datos antiguos
      const header = await storageUtils.getJSON(OLD_KEYS.HEADER)
      const detalles = await storageUtils.getJSON(OLD_KEYS.DETALLES)
      const final = await storageUtils.getJSON(OLD_KEYS.FINAL)

      // Si NO hay datos antiguos, solo marcar como migrado
      if (!header && !detalles && !final) {
        console.log('ℹ️ No hay datos antiguos para migrar')
        await storageUtils.setJSON(NEW_KEYS.MIGRATION_FLAG, {
          migratedAt: new Date().toISOString(),
          hadOldData: false
        })
        return true
      }

      // Combinar datos en una orden completa
      const ordenCompleta: Partial<OrdenTrabajoFormData> = {
        ...header,
        ...detalles,
        ...final,
        estado: 'completada', // Estado por defecto
        fechaCreacion: new Date(),
      }

      // Generar ID para la orden migrada
      const ordenId = '001'
      const ordenKey = NEW_KEYS.DATA(ordenId)

      // Guardar orden en nuevo formato
      await storageUtils.setJSON(ordenKey, ordenCompleta)

      // Guardar lista de IDs
      await storageUtils.setJSON(NEW_KEYS.LIST, [ordenId])

      // Guardar último ID usado
      await storageUtils.setJSON(NEW_KEYS.LAST_ID, 1)

      // Marcar migración como completada
      await storageUtils.setJSON(NEW_KEYS.MIGRATION_FLAG, {
        migratedAt: new Date().toISOString(),
        hadOldData: true,
        migratedOrdenId: ordenId,
      })

      console.log('✅ Migración completada exitosamente')
      console.log(`📋 Orden migrada con ID: ${ordenId}`)

      return true
    } catch (error) {
      console.error('❌ Error en migración:', error)
      return false
    }
  },

  /**
   * Rollback de migración (para testing)
   */
  rollback: async (): Promise<void> => {
    await storageUtils.remove(NEW_KEYS.MIGRATION_FLAG)
    await storageUtils.remove(NEW_KEYS.LIST)
    await storageUtils.remove(NEW_KEYS.LAST_ID)
    const keys = await storageUtils.getAllKeys()
    for (const key of keys) {
      if (key.startsWith('ordenes:data:')) {
        await storageUtils.remove(key)
      }
    }
    console.log('🔄 Rollback completado')
  },
}
