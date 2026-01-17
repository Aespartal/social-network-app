# 🏛️ Arquitectura General

Esta documentación describe la arquitectura del sistema **Social Network App**, una aplicación full-stack moderna construida con tecnologías web actuales.

## 🎯 Visión General

**Social Network App** es una aplicación de red social estilo Twitter que permite a los usuarios crear perfiles, publicar contenido, interactuar mediante likes y comentarios, y seguir a otros usuarios. Está construida con **Domain-Driven Design (DDD)** y una arquitectura modular de tres capas:

```mermaid
graph TB
    subgraph "Cliente"
        A[React Frontend]
        B[Material-UI Components]
        C[React Router]
        D[AuthContext + RoleGuard]
    end
    
    subgraph "Servidor - Arquitectura DDD"
        E[Fastify API]
        F[JWT Auth + Google OAuth]
        G[Middleware Auth/Role]
        H[Módulo Auth]
        I[Módulo Posts]
        J[Módulo Users]
    end
    
    subgraph "Capas DDD (por módulo)"
        K[Infrastructure Layer]
        L[Application Layer - Use Cases]
        M[Domain Layer - Entities]
    end
    
    subgraph "Datos"
        N[Prisma ORM]
        O[PostgreSQL]
    end
    
    A --> E
    E --> H
    E --> I
    E --> J
    H --> K
    I --> K
    J --> K
    K --> L
    L --> M
    K --> N
    N --> O
    
    subgraph "Shared"
        P[TypeScript Types]
        Q[API Types]
    end
    
    A --> P
    E --> P
```

## 🏗️ Arquitectura de Alto Nivel

### Principios de Diseño

1. **Domain-Driven Design (DDD)**: Arquitectura en capas (Domain, Application, Infrastructure)
2. **Separación de Responsabilidades**: Cada módulo es independiente y cohesivo
3. **Tipado Fuerte**: TypeScript en toda la aplicación
4. **Código Compartido**: Tipos y utilidades reutilizables en el workspace `shared`
5. **API First**: Backend diseñado como API RESTful con documentación Swagger
6. **Componentes Reutilizables**: UI modular con Material-UI
7. **Sistema de Roles**: Control de acceso basado en roles (RBAC)

### Tecnologías Core

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Frontend** | React 18 + TypeScript | Interfaz de usuario reactiva |
| **Build Tool** | Vite | Desarrollo rápido y build optimizado |
| **UI Framework** | Material-UI v6 | Componentes UI consistentes y modernos |
| **Backend** | Fastify + TypeScript | API REST de alta performance |
| **Arquitectura** | DDD (Domain-Driven Design) | Organización modular y escalable |
| **ORM** | Prisma | Gestión de base de datos type-safe |
| **Database** | PostgreSQL | Almacenamiento de datos relacional |
| **Auth** | JWT + Google OAuth | Autenticación stateless y social login |
| **Storage** | Cloudinary | Upload y almacenamiento de imágenes |
| **Docs** | Swagger | Documentación automática de API |
## 🔄 Flujo de Datos

### Arquitectura Request-Response

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Interacción (click, form, etc.)
    F->>A: HTTP Request + JWT Token
    A->>A: Validar Token
    A->>A: Validar Datos
    A->>D: Query/Mutation
    D->>A: Resultado
    A->>F: JSON Response
    F->>F: Actualizar Estado
    F->>U: UI Actualizada
```

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Login (email/password)
    F->>A: POST /auth/login
    A->>D: Verificar credenciales
    D->>A: Usuario válido
    A->>A: Generar JWT
    A->>F: Token + Usuario
    F->>F: Guardar en localStorage
    F->>U: Redirigir a dashboard
    
    Note over F,A: Requests subsecuentes incluyen token
    F->>A: Request + Authorization header
    A->>A: Validar JWT
    A->>F: Response autorizada
```

## 📁 Estructura Modular

### Frontend (React)

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── social/         # Feed, PostCard, CreatePost, Comments
│   └── ui/             # Componentes UI base (Material-UI wrappers)
├── pages/              # Páginas/Vistas principales
│   ├── Home.tsx        # Feed principal
│   ├── Profile.tsx     # Perfil de usuario
│   ├── PostDetail.tsx  # Detalle de post con comentarios
│   ├── Login.tsx       # Login
│   ├── Register.tsx    # Registro
│   └── AdminDashboard.tsx # Panel de administración
├── contexts/           # React Contexts
│   └── AuthContext.tsx # Manejo de autenticación global
├── guards/             # Protección de rutas
│   └── RoleGuard.tsx   # Guard basado en roles
├── hooks/              # Custom hooks para lógica reutilizable
│   ├── useAuth.tsx     # Hook de autenticación
│   ├── useFeed.tsx     # Hook para el feed de posts
│   ├── usePostDetail.tsx # Hook para detalles de post
│   └── useInfiniteScroll.tsx # Scroll infinito
├── services/           # Comunicación con API
├── theme/              # Temas de Material-UI
├── enums/              # Enumeraciones (Role)
└── utils/              # Utilidades del frontend
```

**Patrones Utilizados:**
- **Component Composition**: Componentes pequeños y reutilizables
- **Custom Hooks**: Lógica de estado extraída y reutilizable
- **Context API**: Manejo de estado global (Auth)
- **Protected Routes**: Rutas protegidas por autenticación y roles
- **Service Layer**: Abstracción de llamadas a API
- **Material-UI Theming**: Sistema de temas personalizado

### Backend (Fastify)

```
src/
├── modules/            # Módulos DDD
│   ├── auth/
│   │   ├── domain/         # Entidades y lógica de negocio
│   │   ├── application/    # Casos de uso (LoginUseCase, RegisterUseCase)
│   │   └── infrastructure/ # Controladores, repositorios, DTOs, plugin
│   ├── posts/
│   │   ├── domain/         # Post entity, value objects
│   │   ├── application/    # CreatePost, GetFeed, DeletePost use cases
│   │   └── infrastructure/ # PostController, PrismaPostRepository
│   └── users/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
├── middleware/        # Middleware de autenticación y roles
│   ├── auth.middleware.ts
│   └── role.middleware.ts
├── config/            # Configuración (env, etc.)
├── lib/               # Librerías (prisma client, cloudinary)
├── schemas/           # Schemas de validación TypeBox
├── plugins/           # Plugins Fastify (swagger)
└── generated/         # Código generado (Prisma client)
```

**Patrones Utilizados:**
- **Domain-Driven Design**: Arquitectura en capas (Domain, Application, Infrastructure)
- **Use Cases**: Cada acción de negocio es un caso de uso independiente
- **Repository Pattern**: Abstracción de acceso a datos con interfaces
- **Entity Pattern**: Entidades de dominio con validaciones y lógica de negocio
- **DTO Pattern**: Objetos de transferencia de datos para validación
- **Plugin Pattern**: Módulos como plugins de Fastify
- **Dependency Injection**: Inyección de dependencias en use cases

## 🔐 Seguridad

### Autenticación y Autorización

```typescript
// Flujo de autenticación
interface AuthFlow {
  login: (credentials) => JWT;
  verify: (token) => User | null;
  refresh: (token) => JWT;
  logout: (token) => void;
}
```

**Características de Seguridad:**
- **JWT Tokens**: Autenticación stateless con expiración configurable
- **Google OAuth**: Login social con Google
- **Password Hashing**: bcrypt para seguridad de contraseñas
- **Sistema de Roles**: Control de acceso basado en roles (User, Moderator, Admin)
- **CORS**: Configurado para requests cross-origin seguros
- **Helmet**: Headers de seguridad automáticos
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Soft Delete**: Eliminación lógica de posts con campo `deletedAt`

### Validación de Datos

```typescript
// Validación en múltiples capas
Frontend: Zod/Yup schemas → 
API: Request validation → 
Database: Prisma schema validation
```

## 📊 Gestión de Estado

### Frontend State Management

```mermaid
graph TB
    A[React Component State] --> B[Custom Hooks]
    B --> C[Context API]
    C --> D[localStorage]
    
    E[Server State] --> F[API Calls]
    F --> G[Response Caching]
    
    H[Form State] --> I[Controlled Components]
    I --> J[Validation]
```

**Estrategias de Estado:**
- **Local State**: useState para estado de componente
- **Shared State**: Context API para estado global
- **Server State**: API calls con cache inteligente
- **Form State**: Controlled components con validación

### Backend State Management

- **Stateless Design**: No estado en memoria del servidor
- **Database State**: Estado persistente en Prisma/DB
- **Session State**: JWT tokens para mantener sesiones
- **Cache**: En memoria para queries frecuentes

## 🚀 Performance y Escalabilidad

### Frontend Optimizations

```typescript
// Técnicas de optimización
React.lazy()           // Code splitting
React.memo()           // Component memoization
useMemo() / useCallback() // Hook memoization
Vite chunking          // Bundle optimization
```

### Backend Optimizations

```typescript
// Optimizaciones del servidor
Fastify performance    // Framework rápido
Connection pooling     // DB connections
Query optimization     // Prisma efficient queries
Middleware caching     // Response caching
```

### Database Optimizations

```sql
-- Optimizaciones de base de datos
Indexed fields         -- Búsquedas rápidas
Normalized schema      -- Eficiencia de storage
Query optimization     -- Prisma query engine
Connection pooling     -- Múltiples connections
```

## 🔧 Configuración de Entornos

### Variables de Entorno

```bash
# Development
NODE_ENV=development
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret

# Production  
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=secure-production-secret
```

### Configuración por Ambiente

| Ambiente | Database | Logging | Auth | Build |
|----------|----------|---------|------|-------|
| **Development** | SQLite | Verbose | Permissive | Fast |
| **Testing** | In-memory | Minimal | Mock | Quick |
| **Production** | PostgreSQL | Structured | Strict | Optimized |

## 📈 Monitoreo y Observabilidad

### Logging Strategy

```typescript
// Niveles de logging
error   // Errores críticos
warn    // Advertencias importantes  
info    // Información general
debug   // Debugging detallado
```

### Métricas Clave

- **Response Time**: Tiempo de respuesta de API
- **Error Rate**: Porcentaje de errores
- **Throughput**: Requests por segundo
- **Database Performance**: Tiempo de queries

## 🔮 Futuras Mejoras

### Escalabilidad Horizontal

- **Microservices**: Separar funcionalidades en servicios independientes
- **Load Balancing**: Distribuir carga entre múltiples instancias
- **Caching Layer**: Redis para cache distribuido
- **CDN**: Contenido estático servido desde CDN

### Nuevas Funcionalidades

- **Real-time Features**: WebSockets para chat en tiempo real
- **File Upload**: Sistema de carga de imágenes/archivos
- **Search**: Búsqueda avanzada con Elasticsearch
- **Analytics**: Dashboard de métricas y analytics

---

**Siguiente**: Revisa la documentación específica de [Backend](./backend.md) y [Frontend](./frontend.md) para detalles técnicos.
