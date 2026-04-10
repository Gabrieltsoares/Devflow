import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage></AuthPage>} />
          <Route path="/" element={
            <PrivateRoute>
              <DashboardPage/>
            </PrivateRoute>
          } />
          <Route path="/projects/:id" element={
            <PrivateRoute>
              <div>Projeto</div>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App