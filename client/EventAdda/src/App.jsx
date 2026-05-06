import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import UserDashboard from './pages/userDashboard'
import AdminDashboard from './pages/adminDashboard'
import EventDetail from './pages/eventDetail'
import Navbar from './components/navbar'
import Footer from './components/footer'

function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App