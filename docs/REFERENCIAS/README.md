# 📚 REFERENCIAS TÉCNICAS

## Librerías Utilizadas

### @react-native-async-storage/async-storage
- **Versión**: 2.2.0
- **Propósito**: Persistencia de datos offline (incluido en Expo Go)
- **Documentación**: [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- **Uso en proyecto**: `src/services/storageUtils.ts`
- **Ventajas**: ✅ Funciona en Expo Go con QR scan, API async/await

### react-native-element-dropdown
- **Versión**: 2.12.4
- **Propósito**: Dropdowns con search y touch-friendly
- **Documentación**: [Element Dropdown GitHub](https://github.com/treetechnologic/react-native-element-dropdown)
- **Uso en proyecto**: FASE 3 - Componentes

### zod
- **Versión**: 3.25.76
- **Propósito**: Validación schema-based con TypeScript
- **Documentación**: [Zod Docs](https://zod.dev)
- **Uso en proyecto**: `src/services/validationService.ts`

### @react-native-community/datetimepicker
- **Versión**: 8.4.4
- **Propósito**: Date picker nativo iOS/Android
- **Documentación**: [DateTimePicker Docs](https://github.com/react-native-camera/react-native-date-time-picker)
- **Uso en proyecto**: FASE 3 - Componentes

### expo-camera (FASE 5.5)
- **Versión**: ~14.1.0 (incluida en Expo Go)
- **Propósito**: Acceso a cámara para QR scanning
- **Documentación**: [Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)
- **Uso en proyecto**: FASE 5.5 - QRScanner component
- **Ventajas**: ✅ Nativo, incluido en Expo Go, permisos automáticos

### expo-barcode-scanner (FASE 5.5)
- **Versión**: ~12.0.0 (incluida en Expo Go)
- **Propósito**: Detección de QR/barcodes
- **Documentación**: [Expo Barcode Scanner Docs](https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/)
- **Uso en proyecto**: FASE 5.5 - QRScanner component
- **Ventajas**: ✅ Funciona sin TurboModules, QR detection en tiempo real

## Expo SDK
- **Versión**: 54.0.13
- **React Native**: 0.81.4
- **React**: 19.1.0
- **TypeScript**: 5.9.2

## Arquitectura & Patrones

### Progressive Disclosure
Mostrar solo los campos relevantes según el estado del formulario.

### Real-time Validation
Validar mientras el usuario escribe con visual feedback (🟢 valid, 🔴 error).

### Offline-First
Guardar datos automáticamente en AsyncStorage local, luego sincronizar.

### Touch-Friendly
- Botones: 48x48px mínimo
- Inputs: 44px alto mínimo
- Spacing: 16px entre elementos

## Instrucciones para GitHub Copilot

**Ubicación**: `copilot-instructions.md` (en la raíz del proyecto)

Este archivo contiene las instrucciones específicas para GitHub Copilot sobre:
- Environment setup (Windows, VSCode, PowerShell)
- Comandos PowerShell válidos para el proyecto
- Rutas y convenciones Windows
- Checkpoints para evitar errores

**GitHub Copilot lo lee automáticamente como contexto.**

## Documentos de Análisis

Revisar en `docs/00-ANALISIS/` para entender:
- Requisitos del negocio
- Análisis de la orden de trabajo original
- Decisiones técnicas tomadas
- Matriz de justificación

## Orden de Lectura Recomendada

1. **Nuevo en proyecto?**
   - Lee `README.md` (setup + overview)
   - Lee `docs/00-ANALISIS/RESUMEN_EJECUTIVO.md` (qué hace)
   - Lee `docs/01-FASE1-SETUP/README.md` (estructura)

2. **Continuando desarrollo?**
   - Lee FASE correspondiente en `docs/0X-FASEXX/`
   - Ejecuta tests en `App.tsx`
   - Verifica console logs

3. **Troubleshooting?**
   - Lee `README.md` sección Troubleshooting
   - Revisa console.log() en servicios
   - Verifica AsyncStorage con getter `getAllKeys()`

---

**Última actualización**: 2024
