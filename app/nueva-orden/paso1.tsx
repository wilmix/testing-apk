/**
 * app/nueva-orden/paso1.tsx
 * Paso 1 del formulario: Información del Cliente
 * FASE 7.4 - Formulario 2 Pasos
 */

import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { HeaderForm } from '../../src/components/OrdenTrabajo/HeaderForm'
import { storageUtils } from '../../src/services/storageService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

const TEMP_STORAGE_KEY = 'temp_nueva_orden'

// Datos iniciales para nueva orden
const getInitialData = (): OrdenTrabajoFormData => ({
  fechaEntrega: new Date(),
  cliente: '',
  agencia: '',
  direccion: '',
  telefono: '',
  observaciones: '',
  prestamoExtintores: false,
  cantidadPrestamo: '',
  detalles: [],
})

export default function NuevaOrdenPaso1Screen() {
  const router = useRouter()
  const { theme } = useTheme()

  const [formData, setFormData] = useState<OrdenTrabajoFormData>(getInitialData())

  // Cargar datos temporales si existen (usuario volvió de paso 2)
  useEffect(() => {
    loadTempData()
  }, [])

  const loadTempData = async () => {
    try {
      const tempData = await storageUtils.getJSON<OrdenTrabajoFormData>(TEMP_STORAGE_KEY, undefined)
      if (tempData) {
        // Convertir fechas de string a Date
        const dataWithDates = {
          ...tempData,
          fechaEntrega: tempData.fechaEntrega ? new Date(tempData.fechaEntrega) : new Date(),
        }
        setFormData(dataWithDates)
      }
    } catch (error) {
      console.error('Error cargando datos temporales:', error)
    }
  }

  // Guardar datos temporales
  const saveTempData = async (data: OrdenTrabajoFormData) => {
    try {
      await storageUtils.setJSON(TEMP_STORAGE_KEY, data)
    } catch (error) {
      console.error('Error guardando datos temporales:', error)
    }
  }

  const handleDataChange = (data: OrdenTrabajoFormData) => {
    setFormData(data)
    saveTempData(data) // Auto-save
  }

  const handleContinue = async () => {
    // HeaderForm ya validó, guardar y continuar a paso 2
    await saveTempData(formData)
    router.push('/nueva-orden/paso2')
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={styles.content}>
        <HeaderForm
          data={formData}
          onDataChange={handleDataChange}
          onContinue={handleContinue}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})
