# 🌐 Social Network App

Una aplicación de red social full-stack moderna construida con React + TypeScript (frontend) y Fastify + TypeScript (backend).

## 📚 Documentación Completa

📖 **[Ver Documentación Completa](./docs/README.md)** - Guías detalladas, arquitectura, API y más.

### 🚀 Enlaces Rápidos

- **[Instalación y Configuración](./docs/setup/installation.md)** - Cómo empezar
- **[Estructura del Proyecto](./docs/setup/project-structure.md)** - Organización del código
- **[Scripts Disponibles](./docs/setup/scripts.md)** - Comandos npm
- **[Documentación de API](./docs/api/endpoints.md)** - Endpoints y ejemplos
- **[Git Hooks (Husky)](./docs/development/git-hooks.md)** - Automatización de calidad

## ⚡ Inicio Rápido

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd social-network-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cd backend && cp .env.example .env

# 4. Configurar base de datos
npx prisma generate
npx prisma migrate dev

# 5. Ejecutar en desarrollo
npm run dev
```

🌐 **Frontend**: http://localhost:5173  
🔌 **Backend**: http://localhost:3000

## 🚀 Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Axios** para llamadas a la API

### Backend
- **Fastify** con TypeScript
- **CORS** configurado
- **Helmet** para seguridad
- **Rate limiting**
- Estructura modular y escalable

### Shared
- Tipos y utilidades compartidas entre frontend y backend
- Validaciones comunes

## 📦 Estructura del Proyecto

```
SocialNetworkApp/
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Páginas de la aplicación
│   │   ├── hooks/      # Custom hooks
│   │   ├── services/   # Servicios de API
│   │   ├── types/      # Tipos TypeScript
│   │   ├── utils/      # Utilidades
│   │   └── styles/     # Estilos CSS
│   └── public/         # Archivos estáticos
├── backend/            # API Fastify
│   └── src/
│       ├── routes/     # Rutas de la API
│       ├── controllers/# Controladores
│       ├── services/   # Lógica de negocio
│       ├── models/     # Modelos de datos
│       ├── middleware/ # Middlewares
│       ├── types/      # Tipos TypeScript
│       ├── utils/      # Utilidades
│       └── config/     # Configuración
└── shared/             # Código compartido
    ├── types/          # Tipos compartidos
    └── utils/          # Utilidades compartidas
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd SocialNetworkApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Instalar dependencias de cada workspace**
   ```bash
   # Instalar todas las dependencias (recomendado)
   npm run install:all
   
   # O instalar individualmente
   cd frontend && npm install
   cd ../backend && npm install
   cd ../shared && npm install
   ```

## 🚀 Desarrollo

### Iniciar toda la aplicación
```bash
npm run dev
```

Esto iniciará:
- Frontend en http://localhost:3000
- Backend en http://localhost:3001

### Iniciar servicios individualmente
```bash
# Solo frontend
npm run dev:frontend

# Solo backend
npm run dev:backend
```

## 🏗️ Build

### Build completo
```bash
npm run build
```

### Build individual
```bash
npm run build:frontend
npm run build:backend
npm run build:shared
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests individuales
npm run test:frontend
npm run test:backend
```

## 📋 Scripts Disponibles

### Proyecto principal
- `npm run dev` - Inicia frontend y backend
- `npm run build` - Build completo
- `npm start` - Inicia servidor de producción
- `npm test` - Ejecuta todos los tests
- `npm run lint` - Linting completo

### Frontend
- `npm run dev:frontend` - Servidor de desarrollo
- `npm run build:frontend` - Build de producción
- `npm run preview:frontend` - Preview del build

### Backend
- `npm run dev:backend` - Servidor de desarrollo
- `npm run build:backend` - Build de producción
- `npm run start:backend` - Servidor de producción

## 🔧 Configuración

### Variables de Entorno

Crear archivos `.env` en los directorios correspondientes:

**Backend (.env)**
```env
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info
ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=your_database_url
JWT_SECRET=your_super_secret_jwt_key
JWT_ACCESS_EXPIRES_IN=24h
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🚀 Despliegue

### Frontend (Netlify, Vercel, etc.)
```bash
cd frontend
npm run build
# Deploy de la carpeta dist/
```

### Backend (Railway, Render, etc.)
```bash
cd backend
npm run build
npm start
```

## 🛠️ Herramientas de Desarrollo

### Git Hooks (Husky)
- **Pre-commit**: Linting y formateo automático
- **Pre-push**: Tests y verificación de tipos
- **Commit-msg**: Validación de formato de mensajes

### Scripts de Calidad
```bash
npm run lint          # Linting completo
npm run format        # Formateo de código
npm run typecheck     # Verificación de tipos
npm run test          # Tests completos
```

### Formato de Commits
```bash
feat(scope): descripción     # Nueva funcionalidad
fix(scope): descripción      # Corrección de errores
docs: descripción           # Cambios en documentación
style: descripción          # Formateo de código
refactor: descripción       # Refactorización
test: descripción           # Tests
chore: descripción          # Mantenimiento
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat(frontend): add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Próximos Pasos

- [✅] Agregar base de datos (PostgreSQL)
- [✅] Implementar autenticación JWT
- [ ] Agregar tests unitarios y de integración
- [ ] Configurar CI/CD
- [ ] Agregar documentación de API con Swagger
- [ ] Implementar logging estructurado
- [ ] Agregar monitoreo y métricas

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.
