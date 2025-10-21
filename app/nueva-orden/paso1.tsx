/**
 * app/nueva-orden/paso1.tsx
 * Paso 1 del formulario: Información del Cliente
 * FASE 7.4 - Formulario 2 Pasos
 * FASE 8.1 - Soporta modo edición
 */

import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router'
import { useState, useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { HeaderForm } from '../../src/components/OrdenTrabajo/HeaderForm'
import { storageUtils } from '../../src/services/storageService'
import { ordenService } from '../../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

const TEMP_STORAGE_KEY = 'temp_nueva_orden'
const TEMP_EDIT_KEY = 'temp_edit_orden'

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
  const navigation = useNavigation()
  const { theme } = useTheme()
  const params = useLocalSearchParams<{ id?: string; mode?: string }>()

  // Detectar si estamos en modo edición
  const isEditMode = params.mode === 'edit' && params.id
  const editId = params.id

  const [formData, setFormData] = useState<OrdenTrabajoFormData>(getInitialData())
  const [loading, setLoading] = useState(true)

  // Actualizar título según modo
  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? `Editar Orden #${editId}` : 'Nueva Orden - Paso 1'
    })
  }, [isEditMode, editId])

  // Cargar datos (temporales o desde orden existente)
  useEffect(() => {
    loadData()
  }, [isEditMode, editId])

  const loadData = async () => {
    try {
      setLoading(true)

      if (isEditMode && editId) {
        // MODO EDICIÓN: Cargar orden existente
        console.log(`📝 Modo edición: cargando orden #${editId}`)

        // Primero intentar cargar datos temporales de edición
        const tempEditData = await storageUtils.getJSON<OrdenTrabajoFormData>(TEMP_EDIT_KEY, undefined)
        if (tempEditData && tempEditData.id === editId) {
          // Hay datos temporales de edición para esta orden
          const dataWithDates = {
            ...tempEditData,
            fechaEntrega: tempEditData.fechaEntrega ? new Date(tempEditData.fechaEntrega) : new Date(),
          }
          setFormData(dataWithDates)
        } else {
          // Cargar desde ordenService
          const orden = await ordenService.getOrdenById(editId)
          if (orden) {
            const dataWithDates = {
              ...orden,
              fechaEntrega: orden.fechaEntrega ? new Date(orden.fechaEntrega) : new Date(),
            }
            setFormData(dataWithDates)
          } else {
            console.error('Orden no encontrada')
            router.back()
          }
        }
      } else {
        // MODO CREACIÓN: Cargar datos temporales
        const tempData = await storageUtils.getJSON<OrdenTrabajoFormData>(TEMP_STORAGE_KEY, undefined)
        if (tempData) {
          const dataWithDates = {
            ...tempData,
            fechaEntrega: tempData.fechaEntrega ? new Date(tempData.fechaEntrega) : new Date(),
          }
          setFormData(dataWithDates)
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Guardar datos temporales
  const saveTempData = async (data: OrdenTrabajoFormData) => {
    try {
      const key = isEditMode ? TEMP_EDIT_KEY : TEMP_STORAGE_KEY
      await storageUtils.setJSON(key, data)
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

    // Navegar a paso 2 con parámetros de edición si aplica
    if (isEditMode && editId) {
      router.push(`/nueva-orden/paso2?id=${editId}&mode=edit`)
    } else {
      router.push('/nueva-orden/paso2')
    }
  }

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
        <View style={styles.centerContainer}>
          {/* Podrías agregar un ActivityIndicator aquí */}
        </View>
      </SafeAreaView>
    )
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
