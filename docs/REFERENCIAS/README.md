# 📚 REFERENCIAS TÉCNICAS

## Librerías Utilizadas

### react-native-mmkv
- **Versión**: 3.3.3
- **Propósito**: Persistencia de datos offline
- **Documentación**: [MMKV GitHub](https://github.com/mrousavy/react-native-mmkv)
- **Uso en proyecto**: `src/services/mmkvService.ts`

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
Guardar datos automáticamente en MMKV local, luego sincronizar.

### Touch-Friendly
- Botones: 48x48px mínimo
- Inputs: 44px alto mínimo
- Spacing: 16px entre elementos

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
   - Verifica MMKV con getter `getAllKeys()`

---

**Última actualización**: 2024
