/**
 * app/nueva-orden/paso2.tsx
 * Paso 2 del formulario: Detalles + Información Final + Submit
 * FASE 7.4 - Formulario 2 Pasos
 */

import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { useTheme } from '../../src/contexts/ThemeContext'
import { DetallesForm } from '../../src/components/OrdenTrabajo/DetallesForm'
import { FinalForm } from '../../src/components/OrdenTrabajo/FinalForm'
import { storageUtils } from '../../src/services/storageService'
import { ordenService } from '../../src/services/ordenService'
import type { OrdenTrabajoFormData } from '../../src/types/ordenTrabajo'

const TEMP_STORAGE_KEY = 'temp_nueva_orden'

export default function NuevaOrdenPaso2Screen() {
  const router = useRouter()
  const { theme, isDark } = useTheme()

  const [formData, setFormData] = useState<OrdenTrabajoFormData | null>(null)
  const [currentStep, setCurrentStep] = useState<'detalles' | 'final'>('detalles')

  // Cargar datos del paso 1
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
          fechaCreacion: tempData.fechaCreacion ? new Date(tempData.fechaCreacion) : undefined,
          fechaModificacion: tempData.fechaModificacion ? new Date(tempData.fechaModificacion) : undefined,
        }
        setFormData(dataWithDates)
      } else {
        // No hay datos, regresar a paso 1
        Alert.alert(
          'Error',
          'No se encontraron datos del paso anterior',
          [{ text: 'OK', onPress: () => router.replace('/nueva-orden/paso1') }]
        )
      }
    } catch (error) {
      console.error('Error cargando datos temporales:', error)
      Alert.alert('Error', 'No se pudieron cargar los datos')
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

  // DetallesForm completado → mostrar FinalForm
  const handleDetallesContinue = () => {
    setCurrentStep('final')
  }

  // FinalForm submit → crear orden y navegar a lista
  const handleSubmit = async (data: OrdenTrabajoFormData) => {
    try {
      // Crear orden en AsyncStorage
      const newId = await ordenService.createOrden(data)

      // Limpiar datos temporales
      await storageUtils.remove(TEMP_STORAGE_KEY)

      // Mostrar éxito
      Alert.alert(
        '✅ Orden Creada',
        `Orden #${newId} creada exitosamente`,
        [
          {
            text: 'Ver Orden',
            onPress: () => {
              router.replace('/')
              setTimeout(() => {
                router.push(`/orden/${newId}`)
              }, 100)
            }
          },
          {
            text: 'Ver Lista',
            onPress: () => router.replace('/'),
            style: 'cancel'
          }
        ]
      )
    } catch (error) {
      console.error('Error creando orden:', error)
      Alert.alert('Error', 'No se pudo crear la orden. Intenta de nuevo.')
    }
  }

  // Volver a DetallesForm desde FinalForm
  const handleBackToDetalles = () => {
    setCurrentStep('detalles')
  }

  // Loading state mientras carga datos
  if (!formData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.text }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      {/* Indicador de paso */}
      <View style={[styles.stepIndicator, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCompleted]}>
            <Text style={styles.stepCircleText}>✓</Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.text }]}>Cliente</Text>
        </View>

        <View style={[styles.stepLine, styles.stepCompleted]} />

        <View style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep === 'detalles' ? styles.stepActive : styles.stepCompleted
          ]}>
            <Text style={styles.stepCircleText}>
              {currentStep === 'final' ? '✓' : '2'}
            </Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.text }]}>Extintores</Text>
        </View>

        <View style={[
          styles.stepLine,
          currentStep === 'final' ? styles.stepCompleted : styles.stepInactive
        ]} />

        <View style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep === 'final' ? styles.stepActive : styles.stepInactive
          ]}>
            <Text style={[
              styles.stepCircleText,
              currentStep !== 'final' && { color: isDark ? '#666' : '#999' }
            ]}>
              3
            </Text>
          </View>
          <Text style={[styles.stepLabel, { color: theme.text }]}>Final</Text>
        </View>
      </View>

      {/* Contenido del paso actual */}
      <View style={styles.content}>
        {currentStep === 'detalles' ? (
          <DetallesForm
            data={formData}
            onDataChange={handleDataChange}
            onContinue={handleDetallesContinue}
          />
        ) : (
          <FinalForm
            data={formData}
            onDataChange={handleDataChange}
            onSubmit={handleSubmit}
            onBack={handleBackToDetalles}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepActive: {
    backgroundColor: '#007AFF',
  },
  stepInactive: {
    backgroundColor: '#ccc',
  },
  stepCircleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
})
