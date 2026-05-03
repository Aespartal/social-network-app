# 📚 Documentación del Proyecto

Bienvenido a la documentación de **Social Network App**, una aplicación full-stack estilo Twitter desarrollada con React + TypeScript (frontend) y Fastify + TypeScript con **Domain-Driven Design** (backend).

## 📋 Índice de Documentación

### 🚀 Primeros Pasos
- [**Instalación y Configuración**](./setup/installation.md) - Cómo configurar el proyecto desde cero
- [**Estructura del Proyecto**](./setup/project-structure.md) - Organización de archivos y carpetas con DDD
- [**Scripts Disponibles**](./setup/scripts.md) - Comandos npm y tareas comunes

### 🏗️ Arquitectura
- [**Arquitectura General**](./architecture/overview.md) - Visión general del sistema con DDD
- **Backend (API)** - Estructura modular (auth, posts, users)
- **Frontend (React)** - Material-UI con Guards y Contexts
- **Base de Datos** - PostgreSQL con Prisma

### 🔧 Desarrollo
- **Configuración de Desarrollo** - Entorno de desarrollo
- [**Git Hooks (Husky)**](./development/git-hooks.md) - Automatización de calidad de código
- [**Fastify Schemas**](./development/fastify-schemas.md) - Validación con TypeBox
- **Testing** - Vitest para tests unitarios e integración

### 📡 API
- [**Documentación de API**](./api/endpoints.md) - Endpoints disponibles (auth, posts, users)
- **Autenticación** - Sistema de auth con JWT + Google OAuth
- **Sistema de Roles** - Control de acceso basado en roles (RBAC)
- **Swagger** - Documentación interactiva en `/documentation`

### 🎨 Frontend
- **Componentes UI** - Material-UI v6 con componentes personalizados
- **Theming** - Sistema de temas personalizado
- **Routing** - React Router con Guards de roles
- **State Management** - Context API (AuthContext)

### 🚀 Despliegue
- [**Construcción**](./deployment/build.md) - Proceso de build y optimización
- [**Variables de Entorno**](./deployment/environment.md) - Configuración para diferentes entornos
- [**Docker**](./deployment/docker.md) - Containerización de la aplicación

### 📊 Monitoreo
- [**Logs**](./monitoring/logging.md) - Sistema de logging
- [**Métricas**](./monitoring/metrics.md) - Monitoreo de rendimiento
- [**Debugging**](./monitoring/debugging.md) - Herramientas de depuración

## 🤝 Contribución

Para contribuir al proyecto:

1. Lee la [Guía de Configuración](./setup/installation.md)
2. Revisa los [Estándares de Código](./development/code-quality.md)
3. Consulta la [Guía de Git Hooks](./development/git-hooks.md)
4. Sigue las convenciones de [Commits](./development/git-hooks.md#commit-message-format)

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Revisa la documentación correspondiente
- Consulta los logs de desarrollo
- Verifica la configuración del entorno

---

**Última actualización:** Abril 2026  
**Versión del proyecto:** 0.0.1
