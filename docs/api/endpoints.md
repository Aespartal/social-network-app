# 📡 Documentación de API

Esta documentación describe todos los endpoints disponibles en la API de **Social Network App**.

## 🌐 Información General

- **Base URL**: `http://localhost:3000/api` (desarrollo)
- **Formato**: REST API con respuestas JSON
- **Autenticación**: JWT Bearer tokens + Google OAuth
- **Rate Limiting**: Aplicado en endpoints sensibles
- **Sistema de Roles**: User, Moderator, Admin
- **Documentación Interactiva**: `http://localhost:3000/documentation` (Swagger)

## 🔐 Autenticación

### Headers Requeridos

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Obtener Token

Los tokens JWT se obtienen mediante login y deben incluirse en el header `Authorization` para endpoints protegidos.

## 👤 Endpoints de Usuario

### POST `/api/auth/register`

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
  "id": "clx123...",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
```

**Errores:**
- `400`: Datos inválidos o usuario ya existe
- `429`: Demasiados intentos de registro

---

### POST `/api/auth/login`

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
  "id": "clx123...",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
```

**Errores:**
- `401`: Credenciales inválidas
- `429`: Demasiados intentos de login

---

### POST `/api/auth/google`

Autenticación con Google OAuth.

**Request:**
```json
{
  "token": "google_id_token_here"
}
```

**Response (200):**
```json
{
  "id": "clx123...",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "googleId": "google_user_id",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errores:**
- `401`: Token de Google inválido
- `429`: Demasiados intentos de login

---

### GET `/api/auth/profile`

Obtiene el perfil del usuario autenticado.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "clx123...",
  "username": "johndoe",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "USER",
  "avatar": "https://cloudinary.com/...",
  "bio": "Software developer",
  "verified": false,
  "createdAt": "2025-08-10T10:00:00.000Z"
}
```
```

**Errores:**
- `401`: Token inválido o expirado

---

### GET `/api/users/:username`

Obtiene el perfil público de un usuario.

**Response (200):**
```json
{
  "id": "clx123...",
  "username": "johndoe",
  "name": "John Doe",
  "avatar": "https://cloudinary.com/...",
  "bio": "Software developer",
  "verified": false,
  "role": "USER",
  "createdAt": "2025-08-10T10:00:00.000Z",
  "_count": {
    "posts": 42,
    "followers": 150,
    "following": 89
  }
}
```
```

**Errores:**
- `404`: Usuario no encontrado

## 📝 Endpoints de Posts

### POST `/api/posts`

Crea un nuevo post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request (multipart/form-data):**
```json
{
  "content": "Mi primer post en la red social!",
  "image": "<file>" // Opcional
}
```

**Response (201):**
```json
{
  "id": "clx456...",
  "content": "Mi primer post en la red social!",
  "image": "https://cloudinary.com/...",
  "authorId": "clx123...",
  "author": {
    "id": "clx123...",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://cloudinary.com/..."
  },
  "createdAt": "2025-08-10T10:30:00.000Z",
  "_count": {
    "likes": 0,
    "replies": 0
  },
  "isLikedByMe": false,
  "isBookmarkedByMe": false
}
```
```

**Errores:**
- `400`: Contenido inválido
- `401`: No autenticado

---

### GET `/api/posts/feed`

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
  "posts": [
    {
      "id": "clx456...",
      "content": "Mi primer post en la red social!",
      "image": "https://cloudinary.com/...",
      "authorId": "clx123...",
      "author": {
        "id": "clx123...",
        "username": "johndoe",
        "name": "John Doe",
        "avatar": "https://cloudinary.com/..."
      },
      "createdAt": "2025-08-10T10:30:00.000Z",
      "_count": {
        "likes": 5,
        "replies": 2
      },
      "isLikedByMe": true,
      "isBookmarkedByMe": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```
```

---

### GET `/api/posts/:id`

Obtiene un post específico con sus comentarios.

**Response (200):**
```json
{
  "id": "clx456...",
  "content": "Mi primer post en la red social!",
  "image": "https://cloudinary.com/...",
  "authorId": "clx123...",
  "author": {
    "id": "clx123...",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": "https://cloudinary.com/..."
  },
  "createdAt": "2025-08-10T10:30:00.000Z",
  "_count": {
    "likes": 5,
    "replies": 2
  },
  "isLikedByMe": false,
  "isBookmarkedByMe": false,
  "replies": [
    {
      "id": "clx789...",
      "content": "Gran post!",
      "parentId": "clx456...",
      "author": {
        "id": "clx999...",
        "username": "janedoe",
        "name": "Jane Doe",
        "avatar": null
      },
      "createdAt": "2025-08-10T11:00:00.000Z",
      "_count": {
        "likes": 1,
        "replies": 0
      }
    }
  ]
}
```
```

**Errores:**
- `404`: Post no encontrado

---

### POST `/api/posts/:id/like`

Alterna el like en un post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "liked": true,
  "likesCount": 6
}
```
```

---

### POST `/api/posts/:id/bookmark`

Alterna el bookmark en un post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "bookmarked": true
}
```

---

### DELETE `/api/posts/:id`

Elimina un post (soft delete). Solo el autor o un admin puede eliminar.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Post eliminado exitosamente"
}
```

**Errores:**
- `403`: No tienes permisos para eliminar este post
- `404`: Post no encontrado

---

### POST `/api/posts/:id/reply`

Crea una respuesta (comentario) a un post.

**Headers:**
```http
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "Gran post! Estoy de acuerdo."
}
```

**Response (201):**
```json
{
  "id": "clx789...",
  "content": "Gran post! Estoy de acuerdo.",
  "parentId": "clx456...",
  "authorId": "clx123...",
  "author": {
    "id": "clx123...",
    "username": "johndoe",
    "name": "John Doe",
    "avatar": null
  },
  "createdAt": "2025-08-10T11:00:00.000Z",
  "_count": {
    "likes": 0,
    "replies": 0
  }
}
```
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
  avatar?: string | null;
  bio?: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  verified: boolean;
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post

```typescript
interface Post {
  id: string;
  content: string;
  image?: string | null;
  authorId: string;
  parentId?: string | null; // Para hilos/comentarios
  author: {
    id: string;
    username: string;
    name: string;
    avatar?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  _count: {
    likes: number;
    replies: number;
  };
  isLikedByMe: boolean;
  isBookmarkedByMe: boolean;
  replies?: Post[]; // Solo en GET /posts/:id
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
localStorage.setItem('access_token', token);

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
