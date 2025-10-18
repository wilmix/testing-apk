/**
 * Schemas de validación con Zod
 * Mensajes en español
 */

import { z } from 'zod'
import { MARCAS, TIPOS } from '../constants/ordenTrabajoConstants'
import type { ValidationResult } from '../types/ordenTrabajo'

/**
 * Schema para un detalle de extintor
 */
export const DetalleExtintorSchema = z.object({
  id: z.string().min(1, 'ID requerido'),
  extintorNro: z
    .string()
    .min(1, 'Número de extintor requerido')
    .regex(/^\d{1,3}$/, 'Debe ser un número entre 1 y 999'),
  capacidadUnidad: z.string().min(1, 'Unidad de capacidad requerida'),
  capacidadValor: z.string().min(1, 'Capacidad requerida'),
  marca: z.string().min(1, 'Marca requerida'),
  tipo: z.string().min(1, 'Tipo requerido')
})

/**
 * Schema para el form principal de Orden de Trabajo
 */
export const OrdenTrabajoSchema = z.object({
  fechaEntrega: z
    .date({
      errorMap: () => ({ message: 'Fecha de entrega inválida' })
    })
    .min(new Date(Date.now() - 86400000), 'La fecha debe ser hoy o en el futuro'),
  cliente: z.string().min(1, 'Cliente requerido'),
  agencia: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().min(1, 'Teléfono requerido').regex(/^\d+$/, 'Teléfono debe ser numérico'),
  observaciones: z.string().max(500, 'Máximo 500 caracteres').optional(),
  prestamoExtintores: z.boolean().default(false),
  cantidadPrestamo: z.string().optional(),
  detalles: z
    .array(DetalleExtintorSchema)
    .min(1, 'Al menos 1 extintor requerido')
    .refine(
      (detalles) =>
        detalles.every(
          (d) => d.extintorNro && d.capacidadUnidad && d.capacidadValor && d.marca && d.tipo
        ),
      {
        message: 'Todos los campos del extintor son requeridos'
      }
    )
})

/**
 * Refinar validación: si hay préstamo, cantidad es requerida
 */
export const OrdenTrabajoSchemaRefined = OrdenTrabajoSchema.refine(
  (data) => {
    if (data.prestamoExtintores) {
      return data.cantidadPrestamo && /^\d+$/.test(data.cantidadPrestamo)
    }
    return true
  },
  {
    message: 'Cantidad de préstamo requerida si se activa préstamo',
    path: ['cantidadPrestamo']
  }
)

/**
 * Refinar validación: si cliente es BANCO SOLIDARIO, agencia es requerida
 */
export const OrdenTrabajoSchemaComplete = OrdenTrabajoSchemaRefined.refine(
  (data) => {
    if (data.cliente === 'BANCO SOLIDARIO S.A.') {
      return !!data.agencia
    }
    return !!data.direccion
  },
  {
    message: 'Ubicación requerida',
    path: ['agencia']
  }
)

/**
 * Función reutilizable para validar datos
 * @param schema - Schema Zod a usar
 * @param data - Datos a validar
 * @returns Resultado de validación con errores en español
 */
export function validateData<T>(
  schema: z.ZodSchema,
  data: T
): ValidationResult {
  try {
    schema.parse(data)
    return {
      valid: true,
      errors: {}
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        valid: false,
        errors
      }
    }
    return {
      valid: false,
      errors: { form: 'Error de validación desconocido' }
    }
  }
}

/**
 * Validar un campo individual
 */
export function validateField(field: string, value: any, schema: z.ZodSchema): string | undefined {
  try {
    const result = validateData(schema, { [field]: value })
    return result.errors[field]
  } catch {
    return undefined
  }
}

/**
 * Schema para validación de header (cliente + fecha)
 */
export const HeaderSchema = z.object({
  cliente: z.string().min(1, 'Cliente requerido'),
  fechaEntrega: z.date({ errorMap: () => ({ message: 'Fecha inválida' }) })
})

/**
 * Schema para validación de detalles
 */
export const DetallesSchema = z.object({
  detalles: z.array(DetalleExtintorSchema).min(1, 'Al menos 1 extintor requerido')
})
