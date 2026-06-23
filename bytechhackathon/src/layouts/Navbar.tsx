import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from '../components/Button'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isLandingPage = location.pathname === '/'

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false)
    if (isLandingPage) {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: sectionId } })
    }
  }

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-slate-900 focus:outline-none">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="ByTech Logo" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-none flex flex-col">
              <span className="text-slate-900">ByTech</span>
              <span className="text-primary-600 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mt-0.5">Software Solutions</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('about')} className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors focus:outline-none cursor-pointer">
              About
            </button>
            <button onClick={() => handleNavClick('prizes')} className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors focus:outline-none cursor-pointer">
              Prizes
            </button>
            <button onClick={() => handleNavClick('timeline')} className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors focus:outline-none cursor-pointer">
              Timeline
            </button>
            <button onClick={() => handleNavClick('faq')} className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors focus:outline-none cursor-pointer">
              FAQs
            </button>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Button onClick={() => navigate('/register')} className="cursor-pointer">
              Register Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-3">
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('prizes')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all cursor-pointer"
          >
            Prizes
          </button>
          <button
            onClick={() => handleNavClick('timeline')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all cursor-pointer"
          >
            Timeline
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all cursor-pointer"
          >
            FAQs
          </button>

          <div className="pt-2 border-t border-slate-100">
            <Button onClick={() => { setIsOpen(false); navigate('/register'); }} className="w-full cursor-pointer">
              Register Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
export default Navbar
