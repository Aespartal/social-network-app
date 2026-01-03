import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import { About } from '@/pages/About'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { Layout } from '@/components/MuiLayout'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Profile } from './pages/Profile'
import { PostDetail } from './pages/PostDetail'

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
            <Route path='/profile/:username' element={<Profile />} />
            <Route path='/post/:id' element={<PostDetail />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
