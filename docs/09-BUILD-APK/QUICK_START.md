# 🚀 QUICK START: Generar APK Android

**TL;DR**: Comandos esenciales para generar tu primer APK de REX/Mobile.

---

## ⚡ Opción Recomendada: EAS Build (Cloud)

### ¿Por qué?
- ✅ Setup mínimo (5 minutos)
- ✅ Funciona en Windows 11
- ✅ 30 builds gratis/mes
- ✅ No requiere Android SDK local

---

## 📝 Comandos (Copy-Paste)

### 1. Setup Inicial (Solo una vez)

```powershell
# 1. Crear cuenta en https://expo.dev/signup

# 2. Instalar EAS CLI
npm install -g eas-cli

# 3. Login
eas login

# 4. Configurar proyecto
cd c:\dev\react-native\testing-app
eas build:configure
```

### 2. Editar eas.json

Abrir `eas.json` y cambiar a:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 3. Build APK

```powershell
# Preview APK (para testing)
eas build --platform android --profile preview

# Cuando pregunte sobre keystore, seleccionar:
# > Generate new Keystore
```

### 4. Esperar y Descargar

```powershell
# Esperar 10-60 minutos (cloud build)
# Link de progreso se abrirá en navegador

# Una vez completado, descargar:
eas build:download --platform android --profile preview
```

### 5. Instalar en Android

1. Transferir APK a tu dispositivo (USB/Email/Drive)
2. Abrir APK en dispositivo
3. Permitir "Fuentes desconocidas" (si pregunta)
4. Instalar
5. Probar app completa

---

## 🔑 Keystore (IMPORTANTE)

Después del primer build, **descargar y respaldar keystore**:

```powershell
# Descargar keystore
eas credentials
# Seleccionar: Android > Keystore > Download

# Guardar en 3+ lugares seguros:
# - Google Drive
# - Password Manager (1Password, LastPass)
# - USB encriptado
```

**⚠️ Si pierdes keystore, NO podrás actualizar la app en Google Play**

---

## 📋 Checklist Rápido

Antes del build:
- [ ] Cuenta Expo creada
- [ ] `npm install -g eas-cli` ejecutado
- [ ] `eas login` completado
- [ ] `eas.json` con `buildType: "apk"`
- [ ] `npx tsc --noEmit` sin errores

Después del build:
- [ ] APK descargado
- [ ] APK instalado en dispositivo
- [ ] App probada (navegación, CRUD, búsqueda, dark mode)
- [ ] Keystore descargado y respaldado

---

## 🐛 Problemas Comunes

### Build tarda mucho (>1 hora)
**Solución**: Construir en horarios off-peak (madrugada, fines de semana)

### Build falla
**Solución**:
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### App no abre después de instalar
**Solución**: Revisar logs del build en expo.dev/accounts/[tu-usuario]/builds

---

## 📚 Documentación Completa

Ver: `/docs/09-BUILD-APK/GUIA_GENERACION_APK_ANDROID.md`

---

## 🎯 Próximos Pasos

### Production Build (cuando estés listo)
```powershell
eas build --platform android --profile production
```

### Google Play Store (opcional)
1. Cambiar `buildType: "aab"` en eas.json
2. Build: `eas build -p android --profile production`
3. Submit: `eas submit -p android`

---

## ⏱️ Tiempo Estimado

- **Setup inicial**: 10 minutos
- **Build en cloud**: 10-60 minutos
- **Testing**: 15 minutos
- **Total**: 35-85 minutos

---

**¡Listo para generar tu APK!** 🚀

Para más detalles, lee la guía completa en:
`/docs/09-BUILD-APK/GUIA_GENERACION_APK_ANDROID.md`
