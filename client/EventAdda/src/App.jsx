import { useState } from 'react'
import Home from './pages/home'
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Home />
      </div>
      <Footer />
    </>
  )
}

export default App
