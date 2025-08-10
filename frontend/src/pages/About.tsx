import React from 'react'

export const About: React.FC = () => {
  return (
    <div className='px-4 py-6 sm:px-0'>
      <div className='border-4 border-dashed border-gray-200 rounded-lg p-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Acerca de Aplica
        </h2>

        <div className='prose max-w-none'>
          <p className='text-gray-600 mb-4'>
            Aplica es una aplicación full-stack moderna construida con las
            últimas tecnologías:
          </p>

          <div className='grid md:grid-cols-2 gap-6 mt-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h3 className='text-xl font-semibold text-blue-600 mb-3'>
                Frontend
              </h3>
              <ul className='space-y-2 text-gray-600'>
                <li>• React 18 con TypeScript</li>
                <li>• Vite para desarrollo rápido</li>
                <li>• React Router para navegación</li>
                <li>• CSS personalizado para estilos</li>
                <li>• Axios para llamadas a la API</li>
              </ul>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h3 className='text-xl font-semibold text-green-600 mb-3'>
                Backend
              </h3>
              <ul className='space-y-2 text-gray-600'>
                <li>• Fastify con TypeScript</li>
                <li>• CORS configurado</li>
                <li>• Helmet para seguridad</li>
                <li>• Rate limiting</li>
                <li>• Estructura modular</li>
              </ul>
            </div>
          </div>

          <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6'>
            <div className='flex'>
              <div className='ml-3'>
                <p className='text-sm text-yellow-700'>
                  <strong>Nota:</strong> Esta es una plantilla base. Puedes
                  extenderla agregando base de datos, autenticación, más rutas,
                  componentes y funcionalidades según tus necesidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
