# 📜 Scripts Disponibles

Esta guía describe todos los comandos npm disponibles en el proyecto **Social Network App**.

## 🚀 Scripts de Desarrollo

### Ejecutar en Modo Desarrollo

```bash
# Ejecutar frontend y backend simultáneamente (recomendado)
npm run dev

# Ejecutar solo el frontend
npm run dev:frontend

# Ejecutar solo el backend  
npm run dev:backend
```

**¿Cuándo usar cada uno?**
- `npm run dev`: Para desarrollo completo de la aplicación
- `npm run dev:frontend`: Cuando solo trabajas en UI/UX
- `npm run dev:backend`: Cuando solo trabajas en API/lógica de servidor

## 🏗️ Scripts de Construcción

### Build de Producción

```bash
# Build completo del proyecto
npm run build

# Build por módulo
npm run build:frontend
npm run build:backend
npm run build:shared
```

**Orden de construcción:**
1. `shared` - Primero los tipos compartidos
2. `backend` - Luego la API
3. `frontend` - Finalmente la aplicación web

### Ejecutar en Producción

```bash
# Ejecutar la aplicación construida
npm start
```

## 🧪 Scripts de Testing

### Ejecutar Tests

```bash
# Tests completos del proyecto
npm run test

# Tests por módulo
npm run test:frontend
npm run test:backend
```

### Cobertura de Tests

```bash
# Ejecutar con reporte de cobertura
npm run test:coverage

# Ver reporte de cobertura en navegador
npm run test:coverage:open
```

## 🔍 Scripts de Calidad de Código

### Linting (Análisis Estático)

```bash
# Linting completo del proyecto
npm run lint

# Linting con auto-fix
npm run lint:fix

# Linting por módulo
npm run lint:frontend
npm run lint:backend

# Auto-fix por módulo  
npm run lint:fix:frontend
npm run lint:fix:backend
```

### Formateo de Código

```bash
# Formatear todo el proyecto
npm run format

# Verificar formato sin aplicar cambios
npm run format:check

# Formateo por módulo
npm run format:frontend
npm run format:backend
```

### Verificación de Tipos

```bash
# Verificar tipos en todo el proyecto
npm run typecheck

# Verificación por módulo
npm run typecheck:frontend
npm run typecheck:backend
```

## 🗃️ Scripts de Base de Datos

### Prisma - Gestión de DB

```bash
# Generar cliente Prisma (después de cambios en schema)
cd backend && npx prisma generate

# Crear y aplicar nueva migración
cd backend && npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones pendientes
cd backend && npx prisma migrate deploy

# Resetear base de datos (¡CUIDADO!)
cd backend && npx prisma migrate reset

# Poblar con datos de prueba
cd backend && npx prisma db seed

# Abrir Prisma Studio (GUI para DB)
cd backend && npx prisma studio
```

## 🔧 Scripts de Configuración

### Husky (Git Hooks)

```bash
# Instalar/reinstalar Git hooks
npx husky install

# Agregar nuevo hook
npx husky add .husky/[nombre-hook] "[comando]"
```

### Dependencias

```bash
# Instalar dependencias (monorepo)
npm install

# Instalar en workspace específico
npm install [paquete] --workspace=frontend
npm install [paquete] --workspace=backend

# Actualizar todas las dependencias
npm update

# Auditar vulnerabilidades
npm audit
npm audit fix
```

## 📊 Scripts de Monitoreo

### Análisis de Bundle

```bash
# Analizar tamaño del bundle del frontend
cd frontend && npm run analyze

# Ver dependencias y su peso
cd frontend && npm run bundle-analyzer
```

### Performance

```bash
# Ejecutar con profiling
npm run dev:profile

# Analizar rendimiento del backend
cd backend && npm run perf
```

## 🚀 Scripts de Despliegue

### Preparación

```bash
# Verificación completa antes de deploy
npm run pre-deploy

# Build optimizado para producción
npm run build:prod
```

### Docker

```bash
# Construir imagen Docker
docker build -t social-network-app .

# Ejecutar con Docker Compose
docker-compose up -d

# Ver logs de containers
docker-compose logs -f
```

## 🎯 Scripts Personalizados por Workspace

### Frontend Específicos

```bash
cd frontend

# Servidor de desarrollo con hot reload
npm run dev

# Build con análisis de bundle
npm run build:analyze

# Previsualizar build de producción
npm run preview

# Storybook (si configurado)
npm run storybook
```

### Backend Específicos  

```bash
cd backend

# Desarrollo con hot reload
npm run dev

# Ejecutar en modo debug
npm run dev:debug

# Generar documentación de API
npm run docs:generate

# Validar esquema de Prisma
npm run prisma:validate
```

### Shared Específicos

```bash
cd shared

# Build de tipos compartidos
npm run build

# Validar tipos
npm run typecheck

# Publicar paquete (si es público)
npm run publish
```

## 🔄 Workflows Comunes

### Desarrollo Diario

```bash
# 1. Actualizar código
git pull

# 2. Instalar dependencias nuevas
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Antes de commit
npm run lint:fix
npm run format
npm run typecheck
```

### Antes de Hacer Push

```bash
# Tests completos
npm run test

# Verificación de tipos
npm run typecheck

# Build para verificar que compila
npm run build

# Push (hooks automáticos harán verificaciones)
git push
```

### Release/Deploy

```bash
# 1. Tests completos
npm run test

# 2. Build de producción
npm run build:prod

# 3. Verificar build
npm start

# 4. Tag de versión
git tag v1.0.0
git push --tags
```

## ⚡ Tips de Productividad

### Aliases Recomendados

Agrega a tu `.bashrc` o `.zshrc`:

```bash
# Aliases para desarrollo rápido
alias dev="npm run dev"
alias build="npm run build"
alias test="npm run test"
alias lint="npm run lint:fix"
alias fmt="npm run format"
```

### Scripts en VS Code

Configura tasks en `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Dev: Start Full Stack",
      "type": "npm",
      "script": "dev",
      "group": "build"
    }
  ]
}
```

### Combinaciones Útiles

```bash
# Limpiar todo y empezar fresh
rm -rf node_modules package-lock.json && npm install

# Verificación completa
npm run lint && npm run typecheck && npm run test

# Deploy completo
npm run build && npm run test && git push
```

## 🆘 Solución de Problemas

### Script Falla

```bash
# Ver logs detallados
npm run [script] --verbose

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules && npm install
```

### Problemas de Permisos

```bash
# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ejecutar como administrador si es necesario
```

---

**Próximo paso**: Revisa la [Configuración de Desarrollo](../development/dev-setup.md) para optimizar tu entorno.
