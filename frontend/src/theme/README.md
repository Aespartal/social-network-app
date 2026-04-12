# Sistema de Diseño - Documentación

## Arquitectura Centralizada de Tokens

Este sistema de diseño proporciona una **única fuente de verdad** para todos los valores de diseño de la aplicación, permitiendo cambios consistentes y tipado estricto en TypeScript.

## 📁 Estructura

```
frontend/src/theme/
├── tokens.ts              # Tokens de diseño centralizados
├── theme.ts               # Temas Light/Dark configurados
├── ThemeProvider.tsx      # Proveedor de tema con contexto
├── hooks.ts               # Hooks especializados para acceso a tokens
├── components.tsx         # Componentes base con tokens integrados
├── index.ts               # Exportaciones centralizadas
├── designTokens.ts        # Legacy (mantener compatibilidad)
└── migrationHelper.ts     # Helpers para migración
```

## 🎨 Tokens Disponibles

### Espaciado
```typescript
const { spacing } = tokens
// spacing.xs = 4px, spacing.sm = 8px, spacing.md = 16px, etc.
```

### Tipografía
```typescript
const { fontSize, fontWeight, lineHeight } = tokens
// fontSize.base = '1rem', fontWeight.semibold = 600, etc.
```

### Colores
```typescript
const { semanticColors, themeColors } = tokens
// semanticColors.primary = '#1d9bf0'
// themeColors.light.background.default = '#ffffff'
```

### Bordes y Sombras
```typescript
const { borderRadius, shadows } = tokens
// borderRadius.lg = 12, shadows.card.light = '0 4px 12px rgba(0,0,0,0.03)'
```

## 🪝 Hooks Especializados

### useTokens()
Acceso completo a todos los tokens con tipado estricto:
```tsx
import { useTokens } from '@/theme'

function MyComponent() {
  const t = useTokens()
  return (
    <Box sx={{ 
      padding: t.spacing.md,
      borderRadius: t.borderRadius.lg 
    }} />
  )
}
```

### useThemeColors()
Colores adaptados al tema actual (light/dark):
```tsx
import { useThemeColors } from '@/theme'

function MyComponent() {
  const colors = useThemeColors()
  return (
    <Box sx={{ 
      backgroundColor: colors.background.default,
      color: colors.text.primary 
    }} />
  )
}
```

### useThemeShadows()
Sombras adaptativas por tema:
```tsx
import { useThemeShadows } from '@/theme'

function MyComponent() {
  const shadows = useThemeShadows()
  return <Card sx={{ boxShadow: shadows.card }} />
}
```

### useSx()
Generador de estilos sx consistentes:
```tsx
import { useSx } from '@/theme'

function MyComponent() {
  const sx = useSx()
  return (
    <Box sx={{
      ...sx.padding('md'),
      ...sx.rounded('lg'),
      ...sx.transition('normal')
    }} />
  )
}
```

## 🧱 Componentes Base

### Box
Contenedor flexible con tokens de espaciado:
```tsx
import { Box } from '@/theme'

<Box p="md" px="lg" rounded="xl">
  Contenido
</Box>
```

### Typography
Texto con tokens tipográficos:
```tsx
import { Typography } from '@/theme'

<Typography size="lg" weight="bold">
  Título
</Typography>
```

### Avatar
Avatares con tamaños tokenizados:
```tsx
import { Avatar } from '@/theme'

<Avatar src="/avatar.jpg" size="md" />
// size: xs | sm | md | lg | xl | xxl
```

### Button
Botones con variantes semánticas:
```tsx
import { Button } from '@/theme'

<Button colorVariant="like">Me gusta</Button>
<Button colorVariant="retweet">Retweet</Button>
```

## 🌓 Temas

### Cambio de Tema
Para cambiar entre light/dark:
```tsx
import { useAppTheme } from '@/theme'

function ThemeToggle() {
  const { isDark, toggleTheme } = useAppTheme()
  return (
    <Button onClick={toggleTheme}>
      {isDark ? 'Modo Claro' : 'Modo Oscuro'}
    </Button>
  )
}
```

### Configuración de Temas
Los temas se definen en `theme.ts` y usan los tokens centralizados:
- **Light Theme**: Fondo blanco, texto oscuro
- **Dark Theme**: Fondo negro "Lights Out", texto claro

Para modificar colores de tema, edita `tokens.ts`:
```typescript
export const themeColors = {
  light: {
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#0f1419', secondary: '#536471' },
  },
  dark: {
    background: { default: '#000000', paper: '#16181c' },
    text: { primary: '#e7e9ea', secondary: '#71767b' },
  },
}
```

## 📝 Buenas Prácticas

### 1. Usar siempre tokens, nunca valores hardcodeados
```tsx
// ❌ Mal
<Box sx={{ padding: 16, borderRadius: 8 }} />

// ✅ Bien
<Box sx={{ padding: theme.tokens.spacing.md, borderRadius: theme.tokens.borderRadius.md }} />
// o
<Box p="md" rounded="md" />
```

### 2. Usar hooks para acceso consistente
```tsx
// ❌ Mal
const theme = useTheme()
// theme.tokens puede ser undefined

// ✅ Bien
const tokens = useTokens()
// Siempre retorna tokens con tipado estricto
```

### 3. Adaptar colores al tema actual
```tsx
// ❌ Mal
<Box sx={{ color: '#0f1419' }} />

// ✅ Bien
const colors = useThemeColors()
<Box sx={{ color: colors.text.primary }} />
```

### 4. Usar componentes base para consistencia
```tsx
// ❌ Mal
import { Avatar } from '@mui/material'
<Avatar sx={{ width: 40, height: 40 }} />

// ✅ Bien
import { Avatar } from '@/theme'
<Avatar size="md" />
```

## 🔄 Migración desde Valores Hardcodeados

Si encuentras valores hardcodeados, úsalos como guía:

| Hardcodeado | Token Equivalente |
|-------------|-------------------|
| `16` | `theme.tokens.spacing.md` |
| `8` | `theme.tokens.spacing.sm` |
| `borderRadius: 12` | `theme.tokens.borderRadius.md` |
| `width: 40, height: 40` | `theme.tokens.avatar.md` |
| `fontSize: '1rem'` | `theme.tokens.fontSize.base` |

## 📚 Referencia Completa

### Tokens Exportados
```typescript
export {
  tokens,           // Todos los tokens
  spacing,          // Espaciado
  fontSize,         // Tamaños de fuente
  fontWeight,       // Pesos de fuente
  lineHeight,       // Alturas de línea
  semanticColors,   // Colores semánticos
  themeColors,      // Colores por tema
  borderRadius,     // Radios de borde
  shadows,          // Sombras
  avatar,           // Tamaños de avatar
  iconSize,         // Tamaños de icono
  layout,           // Layout y breakpoints
  transition,       // Transiciones
  zIndex,           // Z-index
  opacity,          // Opacidades
} from '@/theme'
```

### Tipos Exportados
```typescript
export type {
  Tokens,              // Tipo de todos los tokens
  SpacingToken,        // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  FontSizeToken,       // 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  BorderRadiusToken,   // 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  AvatarToken,         // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  ThemeColorScheme,    // 'light' | 'dark'
} from '@/theme'
```

## 🎯 Ejemplo Completo

```tsx
import { 
  Box, 
  Typography, 
  Avatar, 
  useTokens, 
  useThemeColors,
  useThemeShadows 
} from '@/theme'

function UserCard({ user }: { user: User }) {
  const t = useTokens()
  const colors = useThemeColors()
  const shadows = useThemeShadows()

  return (
    <Box 
      p="lg" 
      rounded="lg"
      sx={{ 
        backgroundColor: colors.background.paper,
        boxShadow: shadows.card,
        transition: `all ${t.transition.normal} ${t.transition.easing}`,
        '&:hover': {
          boxShadow: shadows.hover,
        }
      }}
    >
      <Avatar src={user.avatar} size="lg" />
      <Typography size="xl" weight="bold">
        {user.name}
      </Typography>
      <Typography size="sm" sx={{ color: colors.text.secondary }}>
        @{user.username}
      </Typography>
    </Box>
  )
}
```

## ⚠️ Notas Importantes

1. **No modificar archivos legacy**: `designTokens.ts` y `migrationHelper.ts` se mantienen para compatibilidad
2. **Siempre importar desde `@/theme`**: No importar directamente desde subarchivos
3. **Usar componentes base cuando sea posible**: Proporcionan la mejor consistencia
4. **Verificar tipado**: TypeScript ayudará a mantener consistencia

## 🆘 Soporte

Para dudas o problemas con el sistema de diseño:
1. Revisar esta documentación
2. Ver ejemplos en componentes existentes
3. Consultar los tipos en `tokens.ts`
