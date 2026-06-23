import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Success from './pages/Success'
import Admin from './pages/Admin'

function App() {
  // Dynamically resolve basename from Vite's base configuration
  // E.g., '/registration/bytechhackathon/' -> '/registration/bytechhackathon'
  const base = import.meta.env.BASE_URL
  const basename = base === '/' ? '' : base.replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
