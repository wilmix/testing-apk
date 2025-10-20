/**
 * QRScanner Component
 *
 * Modal con escáner de QR codes usando expo-camera
 * Maneja permisos, escaneo, y cierra automáticamente al detectar un QR válido
 *
 * Uso:
 * ```typescript
 * <QRScanner
 *   visible={showScanner}
 *   onClose={() => setShowScanner(false)}
 *   onQRScanned={(data) => {
 *     // Usar data para pre-llenar formulario
 *     console.log('QR escaneado:', data)
 *   }}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import type { BarcodeScanningResult } from 'expo-camera'
import { useTheme } from '../../contexts/ThemeContext'
import { useQRReader } from '../../hooks/useQRReader'
import type { DetalleExtintor } from '../../types/ordenTrabajo'

const { width, height } = Dimensions.get('window')

export interface QRScannerProps {
  /** Si el modal está visible */
  visible: boolean
  /** Callback cuando se cierra el modal */
  onClose: () => void
  /** Callback cuando se escanea un QR válido */
  onQRScanned: (data: Partial<DetalleExtintor>) => void
}

/**
 * Modal con escáner de códigos QR
 *
 * Detecta automáticamente QR codes, valida el formato JSON,
 * y cierra el modal cuando encuentra un QR válido
 */
export const QRScanner: React.FC<QRScannerProps> = ({
  visible,
  onClose,
  onQRScanned,
}) => {
  const { theme } = useTheme()
  const { parseQRData } = useQRReader()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reset estado cuando se abre/cierra
  useEffect(() => {
    if (visible) {
      setScanning(true)
      setError(null)
    }
  }, [visible])

  /**
   * Handler cuando la cámara detecta un código de barras
   */
  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    // Ignorar si ya estamos procesando
    if (!scanning) return

    // Pausar escaneo mientras procesamos
    setScanning(false)

    // Parsear datos del QR
    const parseResult = parseQRData(result.data)

    if (parseResult.success && parseResult.data) {
      // QR válido - llamar callback y cerrar
      onQRScanned(parseResult.data)
      onClose()
    } else {
      // QR inválido - mostrar error y permitir reintentar
      setError(parseResult.error || 'Error al leer QR')
      // Permitir escanear de nuevo después de 2 segundos
      setTimeout(() => {
        setScanning(true)
        setError(null)
      }, 2000)
    }
  }

  // Si no tenemos permisos todavía
  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.info} />
          <Text style={[styles.text, { color: theme.text }]}>
            Verificando permisos de cámara...
          </Text>
        </View>
      </Modal>
    )
  }

  // Si no tenemos permiso para usar la cámara
  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.permissionContainer, { backgroundColor: theme.surface }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              Permiso de Cámara
            </Text>
            <Text style={[styles.permissionText, { color: theme.textSecondary }]}>
              Esta app necesita acceso a la cámara para escanear códigos QR
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.buttonPrimary }]}
              onPress={requestPermission}
            >
              <Text style={[styles.buttonText, { color: theme.buttonPrimaryText }]}>
                Permitir Acceso
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSecondary, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonSecondaryText, { color: theme.textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  // Escáner activo
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Cámara */}
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
        >
          {/* Overlay con instrucciones */}
          <View style={styles.overlay}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
              <Text style={[styles.headerText, { color: theme.text }]}>
                Escanear QR del Extintor
              </Text>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.error }]}
                onPress={onClose}
              >
                <Text style={[styles.closeButtonText, { color: '#ffffff' }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Frame de escaneo */}
            <View style={styles.frameContainer}>
              <View style={[styles.frame, { borderColor: theme.info }]} />
              <Text style={[styles.instruction, { color: '#ffffff' }]}>
                Centra el código QR en el marco
              </Text>
            </View>

            {/* Error message */}
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: theme.errorBg }]}>
                <Text style={[styles.errorText, { color: theme.error }]}>
                  {error}
                </Text>
                <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
                  Intenta escanear nuevamente
                </Text>
              </View>
            )}

            {/* Footer con instrucciones */}
            <View style={[styles.footer, { backgroundColor: theme.surface }]}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                El QR debe contener información del extintor en formato JSON
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  // Modal container
  modalContainer: {
    flex: 1,
  },

  // Camera
  camera: {
    flex: 1,
  },

  // Overlay sobre cámara
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48, // Status bar spacing
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Frame de escaneo
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 3,
    borderRadius: 12,
  },
  instruction: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Error
  errorContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 14,
  },

  // Footer
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Permission screen
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  permissionContainer: {
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    marginTop: 16,
  },
})
