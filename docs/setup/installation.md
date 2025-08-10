# 🚀 Instalación y Configuración

Esta guía te ayudará a configurar el proyecto **Social Network App** en tu entorno de desarrollo local.

## 📋 Requisitos Previos

### Software Requerido

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** (última versión)
- **Editor de código** (recomendado: VS Code)

### Verificar Instalación

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version
```

## 📥 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Aespartal/social-network-app.git
cd social-network-app
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del proyecto raíz y todos los workspaces
npm install
```

Este comando instalará automáticamente las dependencias para:
- Proyecto raíz (scripts de coordinación)
- Frontend (React + TypeScript)
- Backend (Fastify + TypeScript)
- Shared (tipos y utilidades compartidas)

### 3. Configurar Variables de Entorno

#### Backend

```bash
# Navegar al directorio backend
cd backend

# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables de entorno
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-super-secret-jwt-key"
# PORT=3000
```

#### Frontend (opcional)

```bash
# Navegar al directorio frontend
cd frontend

# Crear archivo .env.local si es necesario
# VITE_API_URL=http://localhost:3000
```

### 4. Configurar Base de Datos

```bash
# Desde el directorio raíz
cd backend

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar con datos de prueba
npx prisma db seed
```

## 🏃‍♂️ Ejecutar en Desarrollo

### Opción 1: Ejecutar Todo (Recomendado)

```bash
# Desde el directorio raíz
npm run dev
```

Este comando ejecuta simultáneamente:
- Backend en http://localhost:3000
- Frontend en http://localhost:5173

### Opción 2: Ejecutar Individualmente

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 🔧 Configuración del Entorno de Desarrollo

### VS Code (Recomendado)

#### Extensiones Recomendadas

Instala estas extensiones para una mejor experiencia:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### Configuración de Workspace

El proyecto incluye configuración de VS Code en `.vscode/`:
- `settings.json` - Configuración del editor
- `extensions.json` - Extensiones recomendadas
- `launch.json` - Configuración de debugging

### Git Hooks (Husky)

Los Git hooks se configuran automáticamente tras `npm install`:

```bash
# Verificar que Husky esté configurado
ls -la .husky/
```

Hooks disponibles:
- **pre-commit**: Linting y formateo automático
- **pre-push**: Tests y verificación de tipos
- **commit-msg**: Validación de formato de mensajes

## 🧪 Verificar Instalación

### Ejecutar Tests

```bash
# Tests completos
npm run test

# Tests por módulo
npm run test:frontend
npm run test:backend
```

### Verificar Linting

```bash
# Linting completo
npm run lint

# Linting por módulo
npm run lint:frontend
npm run lint:backend
```

### Verificar Tipos

```bash
# Verificación de tipos completa
npm run typecheck

# Por módulo
npm run typecheck:frontend
npm run typecheck:backend
```

## 🚨 Solución de Problemas

### Error: "Module not found"

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de Prisma

```bash
# Regenerar cliente
cd backend
npx prisma generate

# Resetear base de datos
npx prisma migrate reset
```

### Error de Puertos

Si los puertos 3000 o 5173 están ocupados:

```bash
# Backend - cambiar PORT en backend/.env
PORT=3001

# Frontend - Vite preguntará automáticamente por otro puerto
```

### Error de Permisos (Windows)

```bash
# Ejecutar como administrador si es necesario
# O cambiar política de ejecución de PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📚 Siguientes Pasos

1. Lee la [Estructura del Proyecto](./project-structure.md)
2. Revisa los [Scripts Disponibles](./scripts.md)
3. Consulta la [Guía de Desarrollo](../development/dev-setup.md)

## 💡 Consejos

- Usa `npm run dev` para desarrollo diario
- Ejecuta `npm run lint` antes de hacer commits
- Revisa los logs del terminal si algo falla
- Consulta la documentación de cada tecnología para detalles específicos

---

**¿Problemas?** Consulta la sección de [Debugging](../monitoring/debugging.md) o revisa los logs de desarrollo.
