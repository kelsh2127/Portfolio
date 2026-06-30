import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Services from './components/Services'
import Skills from './components/Skills'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Admin from './components/Admin'
import './index.css'

function PortfolioPage() {
  useEffect(() => {
    const btn = document.querySelector('.top')
    const onScroll = () => {
      if (window.scrollY > 400) btn?.classList.add('visible')
      else btn?.classList.remove('visible')
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Services />
      <Skills />
      <Portfolio />
      <Contact />
      <div className="last-text">
        <p>This is My Portfolio You Can Contact To Me Using Email or Phone Number</p>
      </div>
      <a href="#home" className="top">
        <i className="fas fa-arrow-up" id="ik"></i>
      </a>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
