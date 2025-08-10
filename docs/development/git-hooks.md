# Configuración de Husky

Este proyecto utiliza [Husky](https://typicode.github.io/husky/) para automatizar verificaciones antes de commits y pushes.

## ¿Qué es Husky?

Husky es una herramienta que permite ejecutar scripts automáticamente en ciertos momentos del flujo de trabajo de Git (hooks), como antes de hacer commit o push.

## Configuración actual

### 🪝 Git Hooks configurados

#### Pre-commit
- **Qué hace**: Ejecuta `lint-staged` antes de cada commit
- **Archivos afectados**: 
  - `frontend/src/**/*.{ts,tsx}` - Archivos TypeScript/React del frontend
  - `backend/src/**/*.ts` - Archivos TypeScript del backend
- **Acciones**:
  - Ejecuta ESLint con auto-fix en archivos modificados
  - Ejecuta Prettier para formatear código
  - Solo procesa archivos que están en el staging area

#### Pre-push
- **Qué hace**: Ejecuta verificaciones completas antes de hacer push
- **Acciones**:
  - Ejecuta todos los tests del proyecto
  - Verifica tipos TypeScript en frontend y backend
  - Previene push si hay errores

#### Commit-msg
- **Qué hace**: Valida el formato del mensaje de commit
- **Formato requerido**: `tipo(alcance): descripción`
- **Tipos válidos**:
  - `feat`: Nueva funcionalidad
  - `fix`: Corrección de errores
  - `docs`: Cambios en documentación
  - `style`: Cambios de formato
  - `refactor`: Refactorización de código
  - `test`: Añadir o modificar tests
  - `chore`: Tareas de mantenimiento

### 📝 Ejemplos de mensajes de commit válidos

```bash
git commit -m "feat(auth): add login functionality"
git commit -m "fix(api): resolve user validation error"
git commit -m "docs: update README installation steps"
git commit -m "style(frontend): format component files"
git commit -m "refactor(backend): reorganize user service"
git commit -m "test(auth): add unit tests for login"
git commit -m "chore: update dependencies"
```

## 🚀 Comandos disponibles

```bash
# Ejecutar linting en todo el proyecto
npm run lint

# Ejecutar formateo en todo el proyecto
npm run format

# Ejecutar verificación de tipos
npm run typecheck

# Ejecutar todos los tests
npm run test
```

## 🔧 Configuración de lint-staged

La configuración está en `package.json`:

```json
{
  "lint-staged": {
    "frontend/src/**/*.{ts,tsx}": [
      "cd frontend && npm run lint:fix",
      "cd frontend && npm run format"
    ],
    "backend/src/**/*.ts": [
      "cd backend && npm run lint:fix",
      "cd backend && npm run format"
    ]
  }
}
```

## 🛠️ Personalización

### Deshabilitar hooks temporalmente

```bash
# Saltar pre-commit (no recomendado)
git commit --no-verify

# Saltar pre-push (no recomendado)
git push --no-verify
```

### Modificar hooks

Los archivos de configuración están en:
- `.husky/pre-commit`
- `.husky/pre-push`
- `.husky/commit-msg`

### Agregar nuevos hooks

```bash
npx husky add .husky/[nombre-del-hook] "[comando]"
```

## 🐛 Solución de problemas

### Error: "husky command not found"
```bash
npm install
```

### Los hooks no se ejecutan
```bash
npx husky install
```

### Resetear configuración
```bash
rm -rf .husky
npx husky install
# Reconfigurar hooks manualmente
```

## 📦 Dependencias

- `husky`: Para gestionar Git hooks
- `lint-staged`: Para ejecutar linting solo en archivos modificados
- `eslint`: Para análisis estático de código
- `prettier`: Para formateo de código
