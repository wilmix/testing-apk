# 📦 BUILD APK - Documentación

Documentación completa para generar APK instalable de Android para REX/Mobile.

---

## 📄 Archivos en esta Carpeta

### 1. GUIA_GENERACION_APK_ANDROID.md
**Guía completa y exhaustiva** (15,000+ palabras)

Incluye:
- Comparación de todas las opciones (EAS Cloud, EAS Local, expo run:android, Manual)
- Proceso paso a paso detallado (6 fases)
- Gestión de keystore (generación, backup, seguridad)
- APK vs AAB explicado
- Troubleshooting exhaustivo
- Checklist completa
- Recursos y comandos de referencia

**Cuándo usar**: Primera vez generando APK, necesitas entender todo el proceso.

---

### 2. QUICK_START.md
**Guía rápida** (~500 palabras)

Comandos esenciales copy-paste:
- Setup inicial (4 pasos)
- Build APK (1 comando)
- Keystore backup
- Checklist rápido

**Cuándo usar**: Ya leíste la guía completa, solo necesitas comandos.

---

## 🎯 Recomendación

**Primera vez**: Lee `GUIA_GENERACION_APK_ANDROID.md` completa

**Builds siguientes**: Usa `QUICK_START.md` para referencia rápida

---

## 🏆 Opción Recomendada para REX/Mobile

**EAS Build (Cloud)** porque:
- ✅ Setup mínimo (5 min)
- ✅ Funciona en Windows 11
- ✅ 30 builds gratis/mes
- ✅ Expo managed workflow compatible
- ✅ No requiere Android SDK local

---

## 📊 Comparación Rápida

| Opción | Dificultad | Setup | Build Time | Costo |
|--------|-----------|-------|------------|-------|
| **EAS Cloud** | ⭐ Fácil | 5 min | 10-60 min | FREE (30/mes) |
| EAS Local | ⭐⭐⭐⭐ Difícil | 2-3h | 5-15 min | FREE ∞ |
| expo run:android | ⭐⭐ Media | 30 min | 2-5 min | FREE ∞ (debug only) |
| Manual | ⭐⭐⭐⭐⭐ Muy Difícil | 1-2h | 5-15 min | FREE ∞ |

---

## ⚡ Quick Start (Ultra Rápido)

```powershell
# 1. Setup
npm install -g eas-cli
eas login
eas build:configure

# 2. Editar eas.json → buildType: "apk"

# 3. Build
eas build --platform android --profile preview

# 4. Download (después de 10-60 min)
eas build:download
```

---

## 🔗 Links Útiles

- **Expo Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Pricing**: https://expo.dev/pricing (30 builds/mes FREE)
- **Troubleshooting**: https://docs.expo.dev/build-reference/troubleshooting/

---

## 📅 Historial

- **2025-10-21**: Documentación inicial creada
- **Autor**: Claude Code + Willy Salas Quiroga
- **Proyecto**: REX/Mobile v0.0.1

---

**¿Listo para generar tu APK?**

Comienza con: `GUIA_GENERACION_APK_ANDROID.md` 🚀
