/**
 * useQRReader Hook
 *
 * Hook para parsear y validar datos de QR codes escaneados
 * que contienen información de extintores en formato JSON
 *
 * Formato esperado del QR:
 * ```json
 * {
 *   "extintorNro": "EXT-001",
 *   "marca": "BADGER",
 *   "tipo": "ABC",
 *   "capacidadUnidad": "KILOS",
 *   "capacidadValor": "6 KILOS"
 * }
 * ```
 */

import { useState } from 'react'
import type { DetalleExtintor } from '../types/ordenTrabajo'
import { MARCAS, TIPOS, CAPACIDAD_UNIDADES, CAPACIDAD_VALORES } from '../constants/ordenTrabajoConstants'

interface QRParseResult {
  success: boolean
  data?: Partial<DetalleExtintor>
  error?: string
}

export interface UseQRReaderReturn {
  parseQRData: (qrText: string) => QRParseResult
  lastScanned: string | null
  lastResult: QRParseResult | null
}

/**
 * Hook para parsear datos de QR codes
 *
 * @returns {UseQRReaderReturn} Funciones y estado para manejar QR codes
 *
 * @example
 * ```typescript
 * const { parseQRData, lastResult } = useQRReader()
 *
 * const result = parseQRData(scannedText)
 * if (result.success) {
 *   // Usar result.data para pre-llenar el formulario
 *   updateField('extintorNro', result.data.extintorNro)
 * } else {
 *   // Mostrar result.error al usuario
 * }
 * ```
 */
export const useQRReader = (): UseQRReaderReturn => {
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<QRParseResult | null>(null)

  /**
   * Parsea el texto del QR y valida que contenga datos válidos
   */
  const parseQRData = (qrText: string): QRParseResult => {
    setLastScanned(qrText)

    try {
      // Intentar parsear JSON
      const parsed = JSON.parse(qrText)

      // Validar estructura básica
      if (!parsed || typeof parsed !== 'object') {
        const result: QRParseResult = {
          success: false,
          error: 'El QR no contiene un objeto JSON válido',
        }
        setLastResult(result)
        return result
      }

      // Validar campos requeridos
      const requiredFields = ['extintorNro', 'marca', 'tipo', 'capacidadUnidad', 'capacidadValor']
      const missingFields = requiredFields.filter(field => !parsed[field])

      if (missingFields.length > 0) {
        const result: QRParseResult = {
          success: false,
          error: `Faltan campos requeridos: ${missingFields.join(', ')}`,
        }
        setLastResult(result)
        return result
      }

      // Validar valores contra constantes
      const validationErrors: string[] = []

      // Validar marca
      if (!MARCAS.includes(parsed.marca)) {
        validationErrors.push(`Marca "${parsed.marca}" no es válida`)
      }

      // Validar tipo
      if (!TIPOS.includes(parsed.tipo)) {
        validationErrors.push(`Tipo "${parsed.tipo}" no es válido`)
      }

      // Validar capacidadUnidad
      if (!CAPACIDAD_UNIDADES.includes(parsed.capacidadUnidad)) {
        validationErrors.push(`Unidad "${parsed.capacidadUnidad}" no es válida`)
      }

      // Validar capacidadValor (debe existir en el array correspondiente)
      const validValues = CAPACIDAD_VALORES[parsed.capacidadUnidad as keyof typeof CAPACIDAD_VALORES]
      if (!validValues || !(validValues as readonly string[]).includes(parsed.capacidadValor)) {
        validationErrors.push(`Capacidad "${parsed.capacidadValor}" no es válida para la unidad "${parsed.capacidadUnidad}"`)
      }

      if (validationErrors.length > 0) {
        const result: QRParseResult = {
          success: false,
          error: validationErrors.join('. '),
        }
        setLastResult(result)
        return result
      }

      // Todo válido - construir DetalleExtintor parcial
      const data: Partial<DetalleExtintor> = {
        extintorNro: parsed.extintorNro,
        marca: parsed.marca,
        tipo: parsed.tipo,
        capacidadUnidad: parsed.capacidadUnidad,
        capacidadValor: parsed.capacidadValor,
      }

      const result: QRParseResult = {
        success: true,
        data,
      }
      setLastResult(result)
      return result

    } catch (error) {
      // Error de parsing JSON
      const result: QRParseResult = {
        success: false,
        error: error instanceof Error
          ? `Error al leer QR: ${error.message}`
          : 'El QR no contiene JSON válido',
      }
      setLastResult(result)
      return result
    }
  }

  return {
    parseQRData,
    lastScanned,
    lastResult,
  }
}
