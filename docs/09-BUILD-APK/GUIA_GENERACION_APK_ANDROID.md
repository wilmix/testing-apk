# 📦 GUÍA COMPLETA: GENERAR APK ANDROID PARA REX/MOBILE

**Plataforma**: Windows 11
**Android Studio**: Nerwhal 4
**Proyecto**: REX/Mobile (React Native + Expo)
**Fecha**: 2025-10-21

---

## 📋 Índice

1. [Contexto del Proyecto](#contexto-del-proyecto)
2. [Opciones Disponibles](#opciones-disponibles)
3. [Comparación de Opciones](#comparación-de-opciones)
4. [Opción Recomendada: EAS Build](#opción-recomendada-eas-build)
5. [Guía Paso a Paso](#guía-paso-a-paso)
6. [APK vs AAB](#apk-vs-aab)
7. [Gestión de Keystore](#gestión-de-keystore)
8. [Troubleshooting](#troubleshooting)
9. [Checklist Final](#checklist-final)
10. [Recursos](#recursos)

---

## 🎯 Contexto del Proyecto

**Versiones Actuales**:
- **React Native**: 0.81.4
- **Expo SDK**: ~54.0.13
- **TypeScript**: ~5.9.2
- **Package ID**: `com.anonymous.testingapp`
- **Todas las dependencias**: Expo Go compatible

**Objetivo**: Generar APK instalable en dispositivos Android para distribución directa (sin Google Play Store).

---

## 🛠️ Opciones Disponibles

### 1. EAS Build (Cloud) - ⭐ RECOMENDADO
Servicio oficial de Expo para compilar apps en la nube.

### 2. EAS Build --local
Mismo proceso pero ejecutado localmente (requiere WSL en Windows).

### 3. expo run:android
Build local de desarrollo (solo para testing).

### 4. Android Studio Build Manual
Build manual después de `expo prebuild` (avanzado).

---

## 📊 Comparación de Opciones

| Característica | EAS Cloud | EAS Local | expo run:android | Manual |
|----------------|-----------|-----------|------------------|--------|
| **Dificultad** | ⭐ Fácil | ⭐⭐⭐⭐ Difícil | ⭐⭐ Media | ⭐⭐⭐⭐⭐ Muy Difícil |
| **Windows 11** | ✅ Sí | ⚠️ Requiere WSL | ✅ Sí | ✅ Sí |
| **Setup Inicial** | 5 min | 2-3 horas | 30 min | 1-2 horas |
| **Tiempo Build** | 10-60 min | 5-15 min | 2-5 min | 5-15 min |
| **Costo** | FREE (30/mes) | FREE ∞ | FREE ∞ | FREE ∞ |
| **Cuenta Expo** | ✅ Requerida | ✅ Requerida | ❌ No | ❌ No |
| **Production Ready** | ✅ Sí | ✅ Sí | ❌ No (debug) | ✅ Sí |
| **Config Entorno** | ❌ No | ✅ Sí (complejo) | ✅ Sí | ✅ Sí |
| **Expo Managed** | ✅ Sí | ✅ Sí | ⚠️ Parcial | ❌ No (eject) |

**Recomendación**: **EAS Build (Cloud)** para tu proyecto por:
- ✅ Primera vez generando APK
- ✅ Expo managed workflow
- ✅ Setup mínimo en Windows 11
- ✅ 30 builds/mes suficiente para MVP

---

## 🏆 Opción Recomendada: EAS Build

### ¿Qué es EAS Build?

**Expo Application Services (EAS)** es el servicio oficial de Expo para compilar apps:
- Compila en servidores cloud de Expo
- No requiere configurar Android SDK localmente
- Genera APK o AAB según configuración
- Manejo automático de firma digital (keystore)

### Ventajas

✅ **Setup Simple**: No necesitas configurar Android SDK, Java, Gradle, etc.
✅ **Windows 11 Compatible**: Funciona perfectamente sin WSL
✅ **Free Tier Generoso**: 30 builds Android/mes gratis
✅ **Proceso Confiable**: Builds reproducibles y consistentes
✅ **Keystore Automático**: EAS puede generar y guardar tu keystore
✅ **SDK 54 Compatible**: Totalmente actualizado

### Desventajas

❌ **Requiere Cuenta**: Necesitas cuenta Expo (gratis)
❌ **Cola de Espera**: Builds en free tier pueden tardar 10-60 min
❌ **Límite Mensual**: 30 builds/mes (suficiente para MVP)
❌ **Requiere Internet**: No funciona offline

---

## 📝 Guía Paso a Paso

### FASE 1: Preparación (5 minutos)

#### 1.1 Crear Cuenta Expo

```bash
# Visitar: https://expo.dev/signup
# Crear cuenta gratuita con email
```

#### 1.2 Instalar EAS CLI

```powershell
# En PowerShell
npm install -g eas-cli
```

Verificar instalación:
```powershell
eas --version
# Debe mostrar: eas-cli/X.X.X win32-x64 node-vX.X.X
```

#### 1.3 Login en EAS

```powershell
eas login
```

Ingresar:
- Email de cuenta Expo
- Password

Verificar login:
```powershell
eas whoami
# Debe mostrar tu username
```

---

### FASE 2: Configurar Proyecto (10 minutos)

#### 2.1 Inicializar EAS en el Proyecto

```powershell
# En la raíz del proyecto (c:\dev\react-native\testing-app)
cd c:\dev\react-native\testing-app

# Configurar EAS
eas build:configure
```

**Preguntas que hará**:
1. ¿Generar eas.json? → **Sí (Y)**

Esto creará `eas.json` con configuración default.

#### 2.2 Revisar app.json

Verificar que `app.json` tenga:

```json
{
  "expo": {
    "name": "testing-app",
    "slug": "testing-app",
    "version": "1.0.0",
    "android": {
      "package": "com.anonymous.testingapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

**Importante**:
- `android.package`: ID único de tu app (debe ser único en Google Play)
- `version`: Versión visible para usuarios (1.0.0)
- `android.versionCode`: Número interno (incrementar en cada build)

#### 2.3 Configurar eas.json para APK

**Por defecto, EAS genera AAB** (Android App Bundle para Google Play Store).
Para instalar directamente en dispositivos, necesitas **APK**.

Editar `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Perfiles explicados**:
- `development`: Development client (requiere expo-dev-client)
- `preview`: APK de preview para testing interno
- `production`: APK de producción optimizado

---

### FASE 3: Keystore (Firma Digital)

#### ¿Qué es un Keystore?

El **keystore** es un archivo que contiene:
- **Private Key**: Tu clave privada (secreta, única)
- **Public Certificate**: Certificado público
- **Alias + Passwords**: Identificadores y contraseñas

Google **requiere** que todos los APKs estén firmados digitalmente.

#### Opciones de Keystore

##### OPCIÓN A: Dejar que EAS genere el Keystore (RECOMENDADO)

**Ventajas**:
- ✅ Automático, sin configuración
- ✅ EAS lo guarda de forma segura
- ✅ Puedes descargarlo después
- ✅ Ideal para primera vez

**Proceso**:
1. Durante el primer build, EAS preguntará si quieres que genere keystore
2. Responder **Sí (Y)**
3. EAS generará y guardará el keystore
4. Puedes descargarlo con: `eas credentials`

##### OPCIÓN B: Generar tu Propio Keystore

**Solo si**:
- Ya tienes app en Google Play y necesitas usar mismo keystore
- Quieres control total del keystore desde el inicio

**Comando**:
```powershell
# Usando keytool (viene con Java JDK)
keytool -genkeypair -v -storetype PKCS12 -keystore rex-mobile-release.keystore -alias rex-mobile-key -keyalg RSA -keysize 2048 -validity 10000
```

**Datos requeridos**:
- Keystore password (ej: `MiPassword123!`)
- Key password (puede ser igual)
- Nombre: REX Mobile
- Unidad organizativa: Development
- Organización: Tu Nombre/Empresa
- Ciudad: Tu Ciudad
- Estado: Tu Estado/Provincia
- Código país: BO (Bolivia)

**Guardar passwords**: Anótalos en lugar seguro (1Password, LastPass, etc.)

**Configurar en proyecto**:

Crear `credentials.json` en raíz:
```json
{
  "android": {
    "keystore": {
      "keystorePath": "./rex-mobile-release.keystore",
      "keystorePassword": "TU_PASSWORD_KEYSTORE",
      "keyAlias": "rex-mobile-key",
      "keyPassword": "TU_PASSWORD_KEY"
    }
  }
}
```

**Agregar a .gitignore**:
```
# Credentials
credentials.json
*.keystore
```

---

### FASE 4: Primer Build (20-60 minutos)

#### 4.1 Ejecutar Build

```powershell
# Build de preview (APK para testing)
eas build --platform android --profile preview
```

**Qué sucederá**:

1. **EAS CLI empaqueta tu código**
   - Verifica configuración
   - Sube código a servidores Expo

2. **Pregunta sobre Keystore** (si es primera vez)
   ```
   ? Would you like to generate a Keystore or provide your own?
   > Generate new Keystore
     Provide Keystore from credentials.json
   ```
   Selecciona: **Generate new Keystore** (primera vez)

3. **Build en la nube**
   - Asigna servidor
   - Instala dependencias
   - Compila código JavaScript
   - Genera APK firmado

4. **Link de progreso**
   ```
   🔗 Build URL: https://expo.dev/accounts/[username]/projects/testing-app/builds/[build-id]
   ```

#### 4.2 Monitorear Build

El navegador se abrirá automáticamente mostrando:
- Estado del build (queued → in progress → finished)
- Logs en tiempo real
- Tiempo estimado

También puedes ver builds en:
```powershell
eas build:list
```

#### 4.3 Esperar Compilación

**Tiempo estimado** (free tier):
- **Low Priority Queue**: 10-60 minutos (horarios peak)
- **Off-peak hours**: 5-15 minutos (madrugada)

**Estados**:
- ⏳ **Queued**: Esperando en cola
- 🔄 **In Progress**: Compilando
- ✅ **Finished**: Completado (success)
- ❌ **Errored**: Error (revisar logs)

#### 4.4 Descargar APK

Una vez completado:

**Opción 1: Comando CLI**
```powershell
eas build:download --platform android --profile preview
```

**Opción 2: Navegador**
- Ir al link del build
- Click en "Download" botón
- Guardar APK en tu carpeta

**Archivo descargado**: `testing-app-[build-id].apk` (~50-100 MB)

---

### FASE 5: Instalar y Probar (10 minutos)

#### 5.1 Transferir APK a Dispositivo Android

**Opción A: USB**
```powershell
# Conectar teléfono por USB
# Copiar APK a Downloads del teléfono
```

**Opción B: Email/Drive**
- Enviar APK por email a ti mismo
- Abrir email en dispositivo Android
- Descargar APK

**Opción C: ADB (Android Debug Bridge)**
```powershell
# Si tienes ADB instalado
adb install path\to\testing-app.apk
```

#### 5.2 Instalar en Dispositivo

1. **Abrir APK** en dispositivo Android
2. Android puede mostrar: **"Por seguridad, tu teléfono no permite instalar apps desconocidas de esta fuente"**
3. Click en **"Configuración"**
4. Activar **"Permitir de esta fuente"** (temporal)
5. Volver atrás
6. Click **"Instalar"**
7. Esperar instalación (~10 segundos)
8. Click **"Abrir"**

#### 5.3 Probar Funcionalidad Completa

**Checklist de Testing**:

```
NAVEGACIÓN
□ Pantalla principal (lista de órdenes) carga
□ Botones ℹ️ (About) y ⚙️ (Config) funcionan
□ Navegación a detalles de orden
□ Navegación a nueva orden (paso 1 → paso 2)
□ Back button funciona en todas las pantallas

CRUD ÓRDENES
□ Crear nueva orden (2 pasos)
□ Ver detalles de orden
□ Editar orden existente
□ Anular orden (con confirmación)

BÚSQUEDA
□ Búsqueda por cliente funciona
□ Búsqueda por número funciona
□ Limpiar búsqueda restaura lista completa
□ Pull-to-refresh recarga lista

FORMULARIO
□ Validación funciona (campos requeridos)
□ Campos condicionales (agencia, dirección)
□ Dropdown de clientes, marcas, tipos
□ Date picker funciona
□ Agregar/eliminar extintores

QR SCANNER
□ Permisos de cámara solicitados
□ Escaneo QR funciona
□ Auto-fill de datos extintor
□ Validación de QR JSON

DARK MODE
□ Toggle en Configuración funciona
□ Cambio instantáneo de tema
□ Persistencia (cierra y reabre app)
□ Modo automático detecta sistema

PERSISTENCIA
□ Crear orden, cerrar app, reabrir → orden sigue ahí
□ AsyncStorage funcionando
□ Preferencias se guardan

GENERAL
□ Sin crashes
□ Navegación fluida
□ Permisos funcionan (cámara)
□ Haptic feedback funciona
```

#### 5.4 Debugging si hay Problemas

**App no abre:**
- Revisar logs build en expo.dev
- Verificar que device cumpla requisitos (Android 5.0+)

**Permisos no funcionan:**
- Ir a Configuración → Apps → REX Mobile → Permisos
- Activar manualmente Cámara, Storage

**AsyncStorage no persiste:**
- Verificar que buildType sea "apk" (no "aab")
- Reinstalar app (Clear data primero)

---

### FASE 6: Production Build (Opcional)

Una vez probado en preview, generar APK de producción optimizado:

```powershell
eas build --platform android --profile production
```

**Diferencias con Preview**:
- ✅ Optimizaciones máximas de ProGuard/R8
- ✅ Minificación de código JavaScript
- ✅ APK más pequeño (~20-30% reducción)
- ✅ Performance optimizado
- ✅ Listo para distribución

**Cuándo usar Production**:
- Para distribución a usuarios finales
- Para subir a Google Play Store
- Después de testing exhaustivo en preview

---

## 📦 APK vs AAB

### APK (Android Package)

**Qué es**: Archivo único `.apk` instalable directamente.

**Características**:
- 📦 Tamaño: 50-150 MB (incluye recursos para todos los dispositivos)
- 📲 Instalación: Directa en dispositivos (USB, email, web)
- 🎯 Uso: Testing, distribución directa, sideloading
- 🏪 Google Play: Acepta pero NO recomendado

**Ventajas**:
- ✅ Instalación directa
- ✅ No requiere Google Play
- ✅ Ideal para testing

**Desventajas**:
- ❌ Más grande que APKs generados desde AAB
- ❌ Include recursos no usados por el dispositivo

### AAB (Android App Bundle)

**Qué es**: Bundle de recursos que Google Play usa para generar APKs optimizados.

**Características**:
- 📦 Tamaño: Variable (Google Play genera APKs por dispositivo)
- 📲 Instalación: Solo vía Google Play Store
- 🎯 Uso: Distribución en Play Store (REQUERIDO desde Agosto 2021)
- 🏪 Google Play: Formato obligatorio

**Ventajas**:
- ✅ APKs 15-30% más pequeños por dispositivo
- ✅ Downloads más rápidos
- ✅ Google Play optimiza por configuración device

**Desventajas**:
- ❌ No instalable directamente
- ❌ Solo para Google Play Store

### ¿Cuál Usar?

| Escenario | Formato Recomendado |
|-----------|---------------------|
| Testing en dispositivos propios | **APK** |
| Distribución directa (email, web, USB) | **APK** |
| Enviar a beta testers | **APK** |
| Google Play Store (producción) | **AAB** (requerido) |
| Emuladores | **APK** |
| Usuarios sin Google Play | **APK** |

**Para REX/Mobile**:
- **Fase Testing**: APK (preview profile)
- **Distribución Interna**: APK (production profile)
- **Google Play Store**: AAB (cambiar `buildType` en eas.json)

---

## 🔐 Gestión de Keystore

### ⚠️ IMPORTANTE: Keystore es CRÍTICO

**El keystore es la "llave" de tu app**:
- ✅ Con keystore: Puedes actualizar app en Google Play
- ❌ Sin keystore: NO puedes actualizar app (tendrás que publicar nueva app)

**Si pierdes el keystore**:
- Google Play NO permite subir actualización
- Tendrás que publicar app nueva (con nuevo package name)
- Pierdes todos los usuarios/reviews/ratings

### Descargar Keystore Generado por EAS

```powershell
# Acceder a credentials manager
eas credentials

# Seleccionar:
# → Android
# → Production (o el profile que usaste)
# → Keystore
# → Download
```

Guardará `keystore.jks` en carpeta actual.

### Backup de Keystore

**Guardar en múltiples lugares seguros**:

1. **Cloud Encriptado**:
   - Google Drive (carpeta privada)
   - Dropbox
   - OneDrive

2. **Password Manager**:
   - 1Password (secure notes + file attachment)
   - LastPass (secure notes)
   - Bitwarden

3. **USB Encriptado**:
   - USB drive con BitLocker (Windows)
   - Guardar en caja fuerte

4. **Expo Servers**:
   - EAS guarda automáticamente
   - Puedes re-descargar cuando necesites

**Documentar Passwords**:

Crear documento seguro con:
```
KEYSTORE INFO - REX/MOBILE
============================

Keystore File: rex-mobile-release.keystore
Keystore Password: [TU_PASSWORD_KEYSTORE]
Key Alias: rex-mobile-key
Key Password: [TU_PASSWORD_KEY]

SHA-1: [copiar del output de keytool -list]
SHA-256: [copiar del output de keytool -list]

Fecha Creación: 2025-10-21
Validez: 10000 días (hasta ~2052)

Backup Locations:
- Google Drive: /Backups/REX-Mobile/
- 1Password: Secure Note "REX Mobile Keystore"
- USB: D:\ (USB encriptado)
- EAS: https://expo.dev/accounts/[user]/projects/testing-app/credentials
```

### Ver Información del Keystore

```powershell
# Ver detalles del keystore
keytool -list -v -keystore rex-mobile-release.keystore

# Extraer SHA-1 y SHA-256 (necesarios para Firebase, Google APIs, etc.)
keytool -list -v -keystore rex-mobile-release.keystore -alias rex-mobile-key
```

### Google Play App Signing (Recomendado para Play Store)

Si planeas publicar en Google Play:

1. **Habilitar Google Play App Signing**:
   - Google Play Console → App → Release → Setup → App Signing
   - Subir tu keystore
   - Google genera "Upload keystore" separado

2. **Ventajas**:
   - Si pierdes upload keystore, Google puede resetear
   - App signing keystore siempre seguro en Google

3. **Proceso**:
   ```
   Tu Upload Keystore → Google Play → Google App Signing Keystore → Usuarios
   ```

---

## 🔧 Troubleshooting

### Error: "Gradle build daemon disappeared unexpectedly"

**Causa**: Bundle muy grande (>500MB) o recursos insuficientes.

**Solución**:
```json
// eas.json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "large"
      }
    }
  }
}
```

---

### Error: "None of these files exist"

**Causa**: Archivo necesario en `.gitignore` no subido.

**Solución**:
1. Revisar `.gitignore`
2. Asegurar que archivos necesarios NO estén ignorados
3. Verificar que `assets/` folder exista y contenga icon.png, adaptive-icon.png

---

### Error: "Task :app:bundleReleaseJsAndAssets FAILED"

**Causa**: Metro bundler no puede empaquetar JavaScript.

**Solución**:
```powershell
# Limpiar caché
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
npx expo start --clear
```

---

### Build muy lento (>1 hora)

**Causa**: Free tier con low priority queue en horarios peak.

**Soluciones**:
1. **Construir en off-peak** (madrugada, fin de semana)
2. **Upgrade a paid plan** ($29/mes = priority queue)
3. **Usar `eas build --local`** (requiere setup WSL en Windows)

---

### Error: "Keystore not found"

**Causa**: `credentials.json` con path incorrecto o keystore no existe.

**Solución**:
```json
// Verificar path relativo a raíz del proyecto
{
  "android": {
    "keystore": {
      "keystorePath": "./rex-mobile-release.keystore",  // path correcto
      // NO: "keystorePath": "rex-mobile-release.keystore"
      ...
    }
  }
}
```

---

### App crashes al abrir

**Causas posibles**:
1. Missing permissions en app.json
2. Native module incompatibility
3. ProGuard over-minification

**Debugging**:
```powershell
# Ver logs en tiempo real
adb logcat | Select-String "ReactNative"

# O filtrar por package name
adb logcat | Select-String "com.anonymous.testingapp"
```

**Solución**:
- Revisar build logs en expo.dev
- Verificar que todas dependencies sean Expo Go compatible
- Si es ProGuard: agregar keep rules en `eas.json`

---

### AsyncStorage no persiste datos

**Causa**: AAB en lugar de APK, o permisos storage no configurados.

**Solución**:
```json
// eas.json - asegurar buildType: "apk"
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"  // NO "aab"
      }
    }
  }
}
```

---

## ✅ Checklist Final

### Antes del Primer Build

**Configuración**:
- [ ] Cuenta Expo creada (https://expo.dev/signup)
- [ ] EAS CLI instalado (`npm install -g eas-cli`)
- [ ] Login completado (`eas login`)
- [ ] `eas build:configure` ejecutado
- [ ] `eas.json` creado y configurado con `buildType: "apk"`
- [ ] `app.json` con package name válido (`android.package`)
- [ ] `.gitignore` actualizado (credentials.json, *.keystore)

**Código**:
- [ ] `npx tsc --noEmit` sin errores
- [ ] App probada en Expo Go (funciona correctamente)
- [ ] Todas las dependencias en `package.json`
- [ ] No hay archivos críticos en `.gitignore`
- [ ] Assets (icon, splash) presentes en `/assets/`

**Keystore**:
- [ ] Decisión tomada: EAS auto-generate o propio keystore
- [ ] Si propio: `credentials.json` configurado
- [ ] Si propio: Passwords documentados en lugar seguro

---

### Durante el Build

- [ ] Comando ejecutado: `eas build --platform android --profile preview`
- [ ] EAS preguntó sobre keystore (primera vez)
- [ ] Build completado sin errores
- [ ] Link del build guardado
- [ ] APK descargado

---

### Después del Build

**Testing**:
- [ ] APK instalado en dispositivo físico Android
- [ ] App abre sin crashes
- [ ] Navegación funciona (todas las pantallas)
- [ ] CRUD órdenes funciona
- [ ] Búsqueda funciona
- [ ] QR Scanner funciona (permisos otorgados)
- [ ] Dark mode funciona
- [ ] AsyncStorage persiste (cerrar y reabrir app)
- [ ] Validaciones funcionan

**Keystore**:
- [ ] Keystore descargado de EAS (`eas credentials`)
- [ ] Keystore respaldado en 3+ lugares seguros
- [ ] Passwords documentados en password manager
- [ ] SHA-1 y SHA-256 extraídos (para Firebase, etc.)

**Documentación**:
- [ ] Versión APK documentada (1.0.0)
- [ ] Build ID guardado
- [ ] Fecha de build registrada
- [ ] Notas de testing documentadas

---

## 📚 Recursos

### Documentación Oficial

- **EAS Build Intro**: https://docs.expo.dev/build/introduction/
- **EAS Build Reference**: https://docs.expo.dev/build-reference/
- **APK Build Specific**: https://docs.expo.dev/build-reference/apk/
- **App Credentials**: https://docs.expo.dev/app-signing/app-credentials/
- **Troubleshooting**: https://docs.expo.dev/build-reference/troubleshooting/
- **EAS CLI Reference**: https://docs.expo.dev/build-reference/eas-cli/

### Expo Pricing

- **Free Tier**: 30 Android builds/mes + 15 iOS builds/mes (low priority)
- **Production**: $29/mes = priority queue + unlimited builds
- **Enterprise**: Custom pricing

Link: https://expo.dev/pricing

### Comunidad

- **Expo Forums**: https://forums.expo.dev/
- **Discord**: https://chat.expo.dev/
- **GitHub Issues**: https://github.com/expo/expo/issues

---

## 🚀 Comandos Rápidos de Referencia

```powershell
# === SETUP INICIAL ===
npm install -g eas-cli
eas login
eas build:configure

# === BUILDS ===
# Preview APK (testing)
eas build --platform android --profile preview

# Production APK (optimizado)
eas build --platform android --profile production

# Monitorear builds
eas build:list

# Cancelar build en progreso
eas build:cancel

# === CREDENTIALS ===
# Gestionar keystores
eas credentials

# Download APK
eas build:download --platform android --profile preview

# === DEBUGGING ===
# Ver logs del último build
eas build:view

# === UPDATES (OTA) ===
# Configurar Expo Updates
eas update:configure

# Publicar update (JavaScript only)
eas update --branch production
```

---

## 📋 Próximos Pasos Después del Primer APK

### 1. Testing Exhaustivo
- Probar en múltiples dispositivos Android
- Diferentes versiones Android (5.0+)
- Diferentes tamaños pantalla
- Diferentes fabricantes (Samsung, Xiaomi, Huawei, etc.)

### 2. Optimización

**Icon y Splash Screen**:
```powershell
# Generar icons optimizados
npx expo-optimize
```

**Analizar Bundle Size**:
```powershell
# Ver qué librerías ocupan más espacio
npx expo-bundle-visualizer
```

**Reducir APK Size**:
- Remover dependencias no usadas
- Optimizar images (WebP)
- Enable ProGuard/R8 minification

### 3. Production Build

Una vez testing OK en preview:
```powershell
eas build --platform android --profile production
```

### 4. Google Play Store (Opcional)

**Preparar**:
- Cambiar `buildType: "aab"` en eas.json profile production
- Crear cuenta Google Play Developer ($25 one-time)
- Preparar screenshots, descripción, privacy policy

**Build AAB**:
```powershell
eas build --platform android --profile production
```

**Submit**:
```powershell
eas submit --platform android --profile production
```

### 5. Expo Updates (OTA - Over The Air)

Configurar hot fixes sin rebuild:
```powershell
eas update:configure
```

Permite actualizar código JavaScript sin nuevo build:
- Bug fixes
- Pequeñas features
- Content updates

**No requiere re-download APK por usuarios.**

### 6. CI/CD (Opcional)

Automatizar builds con GitHub Actions:
- Build automático en cada commit
- Testing automatizado
- Deploy a Play Store automático

---

## 🎉 ¡Listo!

Con esta guía tienes todo lo necesario para generar tu primer APK de REX/Mobile.

**Resumen del proceso**:
1. ✅ Setup: `eas-cli` + login
2. ✅ Configurar: `eas build:configure` + editar eas.json
3. ✅ Build: `eas build -p android --profile preview`
4. ✅ Esperar: 10-60 min (cloud build)
5. ✅ Descargar: `eas build:download`
6. ✅ Instalar: Transferir APK a Android + instalar
7. ✅ Probar: Testing exhaustivo
8. ✅ Backup: Descargar y respaldar keystore

**Tiempo total estimado**: 1-2 horas (primera vez, incluye espera build)

**¿Dudas?** Revisa la sección [Troubleshooting](#troubleshooting) o consulta la documentación oficial de Expo.

---

**Última actualización**: 2025-10-21
**Autor**: Claude Code + Willy Salas Quiroga
**Proyecto**: REX/Mobile v0.0.1
