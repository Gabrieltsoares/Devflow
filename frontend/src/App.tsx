import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import Layout from './components/Layout'
import ProjectPage from './pages/ProjectPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<AuthPage />} />
          <Route path='/' element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path='/projects/:id' element={
            <PrivateRoute>
              <Layout>
                <ProjectPage/>
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
