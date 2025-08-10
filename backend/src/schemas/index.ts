import { Type, Static } from '@sinclair/typebox'

export const ErrorSchema = Type.Object({
  success: Type.Literal(false),
  error: Type.String({ description: 'Mensaje de error' }),
  code: Type.Optional(
    Type.String({ description: 'Código de error específico' })
  ),
  statusCode: Type.Number({ description: 'Código de estado HTTP' }),
})

export const SuccessSchema = Type.Object({
  success: Type.Literal(true),
  message: Type.Optional(Type.String({ description: 'Mensaje de éxito' })),
  data: Type.Optional(Type.Any({ description: 'Datos de respuesta' })),
})

export const PaginationSchema = Type.Object({
  page: Type.Number({ minimum: 1, description: 'Página actual' }),
  limit: Type.Number({
    minimum: 1,
    maximum: 100,
    description: 'Elementos por página',
  }),
  total: Type.Number({ minimum: 0, description: 'Total de elementos' }),
  totalPages: Type.Number({ minimum: 0, description: 'Total de páginas' }),
  hasNext: Type.Boolean({ description: 'Tiene página siguiente' }),
  hasPrev: Type.Boolean({ description: 'Tiene página anterior' }),
})

export const PaginationQuerySchema = Type.Object({
  page: Type.Optional(
    Type.Number({
      minimum: 1,
      default: 1,
      description: 'Número de página (default: 1)',
    })
  ),
  limit: Type.Optional(
    Type.Number({
      minimum: 1,
      maximum: 100,
      default: 20,
      description: 'Elementos por página (default: 20, máx: 100)',
    })
  ),
})

export const UuidParamsSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
    description: 'ID único en formato UUID',
  }),
})

export const HealthCheckSchema = Type.Object({
  status: Type.String({ description: 'Estado del servicio' }),
  timestamp: Type.String({
    format: 'date-time',
    description: 'Timestamp del check',
  }),
  version: Type.String({ description: 'Versión de la API' }),
  uptime: Type.Number({ description: 'Tiempo de actividad en segundos' }),
})

export type ErrorResponse = Static<typeof ErrorSchema>
export type SuccessResponse = Static<typeof SuccessSchema>
export type Pagination = Static<typeof PaginationSchema>
export type PaginationQuery = Static<typeof PaginationQuerySchema>
export type UuidParams = Static<typeof UuidParamsSchema>
export type HealthCheck = Static<typeof HealthCheckSchema>
