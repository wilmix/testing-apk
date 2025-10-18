# Copilot Instructions for React Native & Expo Projects

Este documento proporciona instrucciones detalladas y mejores prácticas para trabajar en proyectos de React Native con Expo. Está diseñado para agentes de IA (como GitHub Copilot) y desarrolladores, basado en consultas previas, principios KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself) y SOLID, y recomendaciones actuales de Expo SDK 54 y React Native 0.81.4. Incluye configuraciones, componentes comunes, theming, librerías recomendadas y patrones prácticos.

## Overview
- **Framework**: React Native con Expo para desarrollo cross-platform (Android, iOS, Web).
- **Versiones**: Expo ~54.0.13, React Native 0.81.4, React 19.1.0, TypeScript ~5.9.2.
- **Enfoque**: Apps móviles simples a complejas, con énfasis en UI/UX, estado y navegación.
- **Principios**: KISS (soluciones simples), DRY (evitar duplicación), SOLID (responsabilidades claras).

## 🖥️ Environment Setup
- **Sistema Operativo**: Windows (no Linux/Mac)
- **IDE**: Visual Studio Code (VSCode)
- **Terminal**: PowerShell (pwsh.exe) - NO bash, NO cmd, NO Git Bash
- **Node.js**: v18+ instalado
- **Proyecto**: c:\Users\willy\projects\testing-apk

### ⚠️ IMPORTANTE - Comandos para PowerShell en Windows
Cuando generes comandos de terminal:
- ✅ Usa PowerShell cmdlets: `Get-ChildItem`, `Move-Item`, `Remove-Item`, `Set-Location`
- ✅ Usa rutas Windows: `c:\Users\willy\projects\...` (backslash)
- ✅ Usa `&&` para encadenar comandos
- ✅ Usa backtick (\`) para nueva línea en PowerShell
- ❌ NO uses `ls`, `mv`, `rm` (son aliases de Unix)
- ❌ NO uses rutas Unix: `/home/user/...`
- ❌ NO uses `$()` syntax de bash, usa PowerShell `$()`
- ❌ NO uses `\n`, usa backtick `` ` ``

## Project Setup
### Inicialización
- Usa `npx create-expo-app@latest` para proyectos nuevos.
- Configura `app.json` con `"userInterfaceStyle": "automatic"` para soporte de temas light/dark.
- Instala dependencias con `npx expo install` para compatibilidad.

### Estructura de Archivos
- `App.tsx`: Componente raíz.
- `app.json`: Configuración de Expo.
- `package.json`: Dependencias.
- Usa TypeScript para tipado fuerte.

### Configuración Inicial
- Habilita `newArchEnabled: true` en `app.json` para nueva arquitectura.
- Para temas: Importa `useColorScheme` de 'react-native'.

## Comandos PowerShell Comunes para Windows

### Navegación y Archivos
```powershell
# Ir a directorio
cd c:\Users\willy\projects\testing-apk

# Listar archivos
Get-ChildItem                          # Equivalente a 'ls'
Get-ChildItem -Filter "*.md"           # Filtrar archivos
Get-ChildItem -Filter "*.md" -File     # Solo archivos (no carpetas)
Get-ChildItem -Recurse                 # Recursivo (incluye subcarpetas)

# Crear carpeta
New-Item -ItemType Directory -Path c:\ruta\nueva

# Mover archivo
Move-Item -Path c:\origen\archivo.txt -Destination c:\destino\

# Eliminar archivo
Remove-Item c:\ruta\archivo.txt

# Ver contenido de archivo
Get-Content archivo.txt
cat archivo.txt  # Alias
```

### Git Commands
```powershell
# Estado
git status
git log --oneline -5

# Agregar y commit
git add -A
git commit -m "mensaje"

# Ver cambios
git diff
git show HEAD
```

### NPM y Node
```powershell
# Instalar dependencias
npm install
npm install nombre-librería

# Verificar versión
npm list
npm list react

# Ejecutar scripts
npm start
npm run build
npx tsc --noEmit  # TypeScript check
```

### Expo Commands
```powershell
# Iniciar desarrollo
npx expo start
npx expo start --clear  # Limpiar cache

# Compilar
eas build --platform android
eas build --platform ios

# Publish
eas update
```

### Comandos Importantes a EVITAR en Windows
```powershell
# ❌ NO USES (son de bash/Linux):
ls                    # Usa: Get-ChildItem
mv                    # Usa: Move-Item
rm                    # Usa: Remove-Item
cat                   # OK (pero Get-Content es mejor)
mkdir                 # OK (pero New-Item es mejor)
pwd                   # Usa: Get-Location
cd /home/user/...     # Usa: cd c:\Users\user\...

# ❌ NO en bash/Git Bash, estamos en PowerShell nativo
/c/Users/...          # NO - usa c:\Users\...
$(...) con \n         # NO - usa `n en PowerShell
```


## Best Practices (KISS, DRY, SOLID)
- **KISS**: Soluciones simples; prefiere built-ins sobre librerías complejas.
- **DRY**: Reusa estilos y componentes; evita duplicación en código.
- **SOLID**:
  - **Single Responsibility**: Un componente por función (ej. Button solo para toques).
  - **Open/Closed**: Extiende sin modificar (ej. temas via props).
  - **Liskov Substitution**: Componentes intercambiables.
  - **Interface Segregation**: Props minimalistas.
  - **Dependency Inversion**: Depende de abstracciones (ej. hooks).

## Convenciones Windows & VSCode

### Rutas de Archivos
- Siempre usa **backslash** `\` en rutas Windows: `c:\Users\willy\projects\testing-apk`
- En herramientas que requieren forward slash `/` (Git, Node), el sistema las convierte automáticamente
- Nunca uses rutas Unix `/home/user/...` - no existen en Windows

### Archivos en el Proyecto
```
c:\Users\willy\projects\testing-apk\
├── README.md
├── App.tsx
├── package.json
├── tsconfig.json
├── app.json
├── src/
│   ├── types/
│   ├── constants/
│   ├── services/
│   ├── hooks/
│   ├── components/
│   └── utils/
└── docs/
    ├── 00-ANALISIS/
    ├── 01-FASE1-SETUP/
    └── ...
```

### VSCode Integrations
- Terminal integrada en VSCode usa PowerShell por defecto en Windows
- Presiona `` Ctrl+` `` para abrir/cerrar terminal
- Los comandos git, npm, npx funcionan directamente
- TypeScript LSP proporciona errores en tiempo real

### Errores Comunes a EVITAR
```powershell
# ❌ ERROR: Comando bash en PowerShell
$ npm install      # $ es syntax de bash
Get-Item: command not found

# ✅ CORRECTO: PowerShell puro
npm install

# ❌ ERROR: Ruta Unix
cd /home/user/projects

# ✅ CORRECTO: Ruta Windows
cd c:\Users\willy\projects

# ❌ ERROR: Alias Unix
ls -la            # ls podría funcionar como alias, pero no es nativo

# ✅ CORRECTO: PowerShell cmdlet
Get-ChildItem -Recurse

# ❌ ERROR: Nueva línea bash
echo "hola\nmundo"   # \n no funciona

# ✅ CORRECTO: Nueva línea PowerShell
echo "hola`nmundo"   # backtick
```

## Troubleshooting
- **Hot Reload**: Si no actualiza, `npx expo start --clear`.
- **Errores de Tema**: Verifica `userInterfaceStyle` y `expo-system-ui`.
- **Librerías**: Confirma versiones compatibles con Expo 54.
- **Performance**: Usa `React.memo` para componentes pesados.

## Instrucciones para GitHub Copilot

### Contexto del Proyecto
- **Plataforma**: Windows 10/11
- **IDE**: Visual Studio Code
- **Terminal**: PowerShell (pwsh.exe) - integrada en VSCode
- **Ruta del Proyecto**: `c:\Users\willy\projects\testing-apk`

### Cómo Generarme Comandos Correctamente

#### ✅ Comando Correcto en Windows PowerShell
```
"En PowerShell, necesito listar todos los archivos .md"
```
Yo generaré:
```powershell
Get-ChildItem -Filter "*.md" -File | Select-Object Name
```

#### ❌ Comando Incorrecto (A EVITAR)
```
"Dame el comando bash para..."
"Necesito un comando de Linux..."
```
Yo NO generaré:
```bash
ls *.md
find . -name "*.md"
```

### Mejores Prácticas al Pedirme Cosas

1. **Especifica el lenguaje si es importante**
   - "En PowerShell, ..."
   - "Para Windows, ..."
   - "En VSCode, ..."

2. **Menciona la ruta completa**
   - "En `c:\Users\willy\projects\testing-apk`..."
   - "Del archivo `c:\Users\willy\projects\testing-apk\src\types\ordenTrabajo.ts`..."

3. **Sé específico sobre el contexto**
   - "Soy en Windows con PowerShell"
   - "Desarrollo en VSCode"
   - "Proyecto React Native con Expo 54"

4. **Cómo Pedir Archivos**
   - "Crea el archivo `src/hooks/useFormData.ts`"
   - "Edita `src/types/ordenTrabajo.ts` cambiando..."
   - "Lee el archivo `docs/01-FASE1-SETUP/README.md`"

5. **Cómo Pedir Comandos**
   - "Ejecuta en PowerShell: instala el paquete X"
   - "En terminal, verifica que TypeScript compila"
   - "En PowerShell, haz commit de los cambios"

### Errores que NO Debo Cometer

| Error | Síntoma | Solución |
|-------|--------|----------|
| Comandos bash | `ls: command not found` | Usar PowerShell cmdlets |
| Rutas Unix | `/home/user/...` | Usar rutas Windows `c:\Users\...` |
| Syntax bash | `$()` con `\n` | Usar backtick PowerShell `` ` `` |
| Alias Unix | `mv`, `rm`, `cat` | Usar cmdlets: `Move-Item`, `Remove-Item` |
| Paths mixtos | `c:/Users/...` | Consistente: `c:\Users\...` |

### Checkpoints Antes de Generar Comandos
- [ ] ¿Estoy generando para PowerShell?
- [ ] ¿Usé rutas con backslash `\`?
- [ ] ¿Evité comandos Unix como `ls`, `mv`, `rm`?
- [ ] ¿La sintaxis es correcta para PowerShell?
- [ ] ¿El comando se ejecutará en Windows?
