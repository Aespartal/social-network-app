import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import { About } from '@/pages/About'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { Layout } from '@/components/MuiLayout'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { AuthProvider } from '@/hooks/useAuth'
import './styles/App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
