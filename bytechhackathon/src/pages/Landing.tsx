import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Trophy, Zap, Globe, Sparkles, CheckCircle2 } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import Button from '../components/Button'
import PrizePool from '../components/PrizePool'
import Timeline from '../components/Timeline'
import FaqAccordion from '../components/FaqAccordion'

export const Landing: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const sectionId = (location.state as any).scrollTo
      const element = document.getElementById(sectionId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 border-b border-slate-200/50">
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-100 text-xs sm:text-sm font-bold text-slate-800 mb-6"
          >
            <span className="flex items-center gap-1.5 text-primary-600">
              <Sparkles className="w-4.5 h-4.5 text-primary-500 animate-pulse" />
              ByTech Software Solutions
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-500 font-semibold text-[11px] sm:text-xs">
              Powered By ByTech Softwares
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            ByTech Virtual <span className="gradient-text">Hackathon 2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-slate-700 mt-6 tracking-wide flex items-center justify-center gap-1.5 md:gap-3 flex-wrap"
          >
            <span>Build</span>
            <span className="text-primary-500 font-extrabold">&bull;</span>
            <span>Innovate</span>
            <span className="text-primary-500 font-extrabold">&bull;</span>
            <span>Win</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-500 mt-4 leading-relaxed"
          >
            Join a high-intensity, 3-hour virtual coding sprint. Work individually to solve complex challenges and showcase your software engineering skills.
          </motion.p>

          {/* Info Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-8 max-w-lg mx-auto"
          >
            <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-lg border border-slate-200 shadow-xs">
              <Globe className="w-5 h-5 text-primary-500" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">100% Virtual Sprint</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-lg border border-slate-200 shadow-xs">
              <Zap className="w-5 h-5 text-primary-500" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">3-Hours Duration (Individual)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-lg border border-slate-200 shadow-xs">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">₹1 Registration Fee</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Button
              variant="primary"
              onClick={() => navigate('/register')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 py-3 text-base shadow-lg shadow-primary-500/25 cursor-pointer"
            >
              Register Now
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto px-8 py-3 text-base cursor-pointer"
            >
              Explore Details
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Rules & Format
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
              Designed to test your rapid prototyping, logical thinking, and clean coding capabilities in a competitive 3-hour virtual environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/50 shadow-xs">
              <div className="bg-primary-50 text-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Individual Sprint</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                This is an individual event. Work solo, solve the challenges, and demonstrate your personal software development excellence.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/50 shadow-xs">
              <div className="bg-primary-50 text-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">3-Hour Marathon</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                You will have exactly 3 hours to code and upload your solutions. Submissions will open at 06:00 PM and close at 09:00 PM sharp.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/50 shadow-xs">
              <div className="bg-primary-50 text-primary-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Merit Recognition</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Compete for ₹2,000, ₹1,000, and ₹500 prizes. Finalist certificates go to the top 10, and participation credentials to all valid submitters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Pool Section */}
      <section id="prizes" className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Prize Structure
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
              Rewards for clean code, solid architecture, and fast execution.
            </p>
          </div>
          <PrizePool />
        </div>
      </section>

      {/* Event Timeline Section */}
      <section id="timeline" className="py-20 bg-white border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Timeline & Milestones
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
              Track the schedule to ensure check-in, kick-off, and submission steps are done on time.
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
              Answers to common queries about registration, formats, and submissions.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Are You Ready to Code?
          </h2>
          <p className="text-primary-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Don't miss out on this national virtual coding sprint. Secure your slot, code clean, and prove your engineering skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-slate-100 text-primary-900 px-8 py-3 text-base shadow-md cursor-pointer"
            >
              Register Now (₹1)
            </Button>
            <a
              href="mailto:support@bytechsoftware.com"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-100 hover:text-white hover:underline focus:outline-none"
            >
              Have questions? Contact support <ArrowRight className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
export default Landing
