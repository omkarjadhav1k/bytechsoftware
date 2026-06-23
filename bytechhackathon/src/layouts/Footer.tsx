import React from 'react'
import { Mail, ExternalLink, Globe } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="ByTech Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-extrabold text-lg tracking-tight text-slate-900 flex flex-col leading-none">
                <span>ByTech</span>
                <span className="text-primary-600 text-[9px] font-bold tracking-widest uppercase mt-0.5">Software Solutions</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Empowering student developers to collaborate, innovate, and build impactful solutions for the real world. Join us for ByTech Virtual Hackathon 2026!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://bytechsoftware.vercel.app" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                  Base Website <ExternalLink className="w-3 h-3" />
                </a>
              </li>

              <li>
                <a href="mailto:support@bytechsoftware.com" className="text-slate-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1">
                  <Mail className="w-4.5 h-4.5" /> Support Email
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                For partnerships, sponsorship, or general queries, please email us directly or check out our primary portal.
              </p>
              <a
                href="https://bytechsoftware.vercel.app/contact"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
              >
                <Globe className="w-4 h-4" /> Contact ByTech Team
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col md:flex-row md:items-center gap-1.5 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} ByTech Software Solutions. All rights reserved.</p>
            <span className="hidden md:inline text-slate-300">|</span>
            <p className="font-semibold text-slate-500">Powered By ByTech Softwares</p>
          </div>
          <div className="flex gap-6">
            <a href="https://bytechsoftware.vercel.app/privacy" target="_blank" rel="noreferrer" className="hover:text-slate-600">Privacy Policy</a>
            <a href="https://bytechsoftware.vercel.app/terms" target="_blank" rel="noreferrer" className="hover:text-slate-600">Terms & Conditions</a>
            <a href="https://bytechsoftware.vercel.app/cookies" target="_blank" rel="noreferrer" className="hover:text-slate-600">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
