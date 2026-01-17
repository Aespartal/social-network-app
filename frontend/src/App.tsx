import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { Layout } from '@/components/MuiLayout'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
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
        <Layout>
          <Suspense fallback={<LoadingFallback />}>{element}</Suspense>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
