# 📡 Documentación de API

Esta documentación describe todos los endpoints disponibles en la API de **Social Network App**.

## 🌐 Información General

- **Base URL**: `http://localhost:3000` (desarrollo)
- **Formato**: REST API con respuestas JSON
- **Autenticación**: JWT Bearer tokens
- **Rate Limiting**: Aplicado en endpoints sensibles

## 🔐 Autenticación

### Headers Requeridos

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Obtener Token

Los tokens JWT se obtienen mediante login y deben incluirse en el header `Authorization` para endpoints protegidos.

## 👤 Endpoints de Usuario

### POST `/auth/register`

Registra un nuevo usuario.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2025-08-10T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errores:**
- `400`: Datos inválidos o usuario ya existe
- `429`: Demasiados intentos de registro

---

### POST `/auth/login`

Inicia sesión de usuario.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errores:**
- `401`: Credenciales inválidas
- `429`: Demasiados intentos de login

---

### GET `/auth/profile`

Obtiene el perfil del usuario autenticado.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2025-08-10T10:00:00.000Z",
      "updatedAt": "2025-08-10T10:00:00.000Z"
    }
  }
}
```

**Errores:**
- `401`: Token inválido o expirado

---

### GET `/users/:username`

Obtiene el perfil público de un usuario.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "username": "johndoe",
      "name": "John Doe",
      "createdAt": "2025-08-10T10:00:00.000Z"
    }
  }
}
```

**Errores:**
- `404`: Usuario no encontrado

## 📝 Endpoints de Posts

### POST `/posts`

Crea un nuevo post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Mi primer post en la red social!",
  "title": "Título opcional"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "clx456...",
      "content": "Mi primer post en la red social!",
      "title": "Título opcional",
      "authorId": "clx123...",
      "author": {
        "username": "johndoe",
        "name": "John Doe"
      },
      "createdAt": "2025-08-10T10:30:00.000Z",
      "likesCount": 0,
      "commentsCount": 0,
      "isLiked": false,
      "isBookmarked": false
    }
  }
}
```

**Errores:**
- `400`: Contenido inválido
- `401`: No autenticado

---

### GET `/feed`

Obtiene el feed de posts del usuario autenticado.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Posts por página (default: 20, max: 100)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "clx456...",
        "content": "Mi primer post en la red social!",
        "title": "Título opcional",
        "authorId": "clx123...",
        "author": {
          "username": "johndoe",
          "name": "John Doe"
        },
        "createdAt": "2025-08-10T10:30:00.000Z",
        "likesCount": 5,
        "commentsCount": 2,
        "isLiked": true,
        "isBookmarked": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### GET `/posts/:id`

Obtiene un post específico.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "clx456...",
      "content": "Mi primer post en la red social!",
      "title": "Título opcional",
      "authorId": "clx123...",
      "author": {
        "username": "johndoe",
        "name": "John Doe"
      },
      "createdAt": "2025-08-10T10:30:00.000Z",
      "likesCount": 5,
      "commentsCount": 2,
      "isLiked": false,
      "isBookmarked": false,
      "comments": [
        {
          "id": "clx789...",
          "content": "¡Excelente post!",
          "authorId": "clx321...",
          "author": {
            "username": "janedoe",
            "name": "Jane Doe"
          },
          "createdAt": "2025-08-10T11:00:00.000Z"
        }
      ]
    }
  }
}
```

**Errores:**
- `404`: Post no encontrado

---

### POST `/posts/:id/like`

Alterna el like en un post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likesCount": 6
  }
}
```

---

### POST `/posts/:id/bookmark`

Alterna el bookmark en un post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isBookmarked": true
  }
}
```

## 🔧 Rate Limiting

### Límites por Endpoint

| Endpoint | Límite | Ventana | Scope |
|----------|--------|---------|--------|
| `/auth/login` | 5 requests | 15 minutos | IP + email |
| `/auth/register` | 3 requests | 1 hora | IP |
| `/posts` (POST) | 10 requests | 1 hora | Usuario |

### Respuesta de Rate Limit

```json
{
  "success": false,
  "error": "Demasiados intentos. Intenta más tarde",
  "retryAfter": 300
}
```

## 🚨 Manejo de Errores

### Estructura de Error

```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Recurso no encontrado |
| `409` | Conflict - Conflicto de recursos |
| `422` | Unprocessable Entity - Validación fallida |
| `429` | Too Many Requests - Rate limit excedido |
| `500` | Internal Server Error - Error del servidor |

## 📊 Modelos de Datos

### Usuario (User)

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post

```typescript
interface Post {
  id: string;
  title?: string;
  content: string;
  authorId: string;
  author: {
    username: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}
```

### Paginación

```typescript
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

## 🔍 Ejemplos de Uso

### Flujo Completo de Autenticación

```javascript
// 1. Registro
const registerResponse = await fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepassword123',
    name: 'John Doe'
  })
});

// 2. Guardar token
const { data } = await registerResponse.json();
const token = data.token;
localStorage.setItem('authToken', token);

// 3. Usar token en requests subsecuentes
const feedResponse = await fetch('/feed', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Crear y Interactuar con Posts

```javascript
// Crear post
const createPostResponse = await fetch('/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Mi nuevo post!',
    title: 'Título del post'
  })
});

// Dar like a un post
const likeResponse = await fetch(`/posts/${postId}/like`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

**Para desarrollo**: Usa herramientas como Postman o Thunder Client en VS Code para probar los endpoints.

**Próximo**: Revisa la [Documentación de Autenticación](./authentication.md) para detalles sobre JWT y seguridad.
