import { Suspense, useEffect } from 'react'
import { useRoutes, useLocation } from 'react-router-dom'
import { Box, Loading } from '@/components/ui'
import { Layout } from '@/components/MuiLayout'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { routes } from '@/routes'

// Componente para restaurar el scroll suavemente al navegar
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const LoadingFallback = () => (
  <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
    minHeight='100vh'
    // sx={{ bgcolor: 'background.default' }}
  >
    <Loading text='Entrando en el Aura...' size='lg' />
  </Box>
)

function App() {
  const element = useRoutes(routes)

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <ScrollToTop />
            <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
