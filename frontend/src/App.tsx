import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { Layout } from '@/components/MuiLayout'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { routes } from '@/routes'

const LoadingFallback = () => (
  <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
    minHeight='80vh'
  >
    <CircularProgress />
  </Box>
)

function App() {
  const element = useRoutes(routes)

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
