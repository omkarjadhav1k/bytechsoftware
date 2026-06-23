import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Home, MessageSquareCode } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import Button from '../components/Button'

export const Success: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const participant = location.state?.participant

  // Redirect if accessed directly without participant state
  useEffect(() => {
    if (!participant) {
      navigate('/register')
    }
  }, [participant, navigate])

  if (!participant) {
    return null
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* Hide Navbar during print */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full flex flex-col items-center">
          
          {/* Main Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden print:border-none print:shadow-none"
          >
            
            {/* Header Success Section */}
            <div className="bg-emerald-50 border-b border-slate-100 px-8 py-10 text-center relative flex flex-col items-center print:bg-white print:border-none">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
                className="bg-emerald-500 text-white p-3 rounded-full mb-4 shadow-md shadow-emerald-500/20 print:border print:border-slate-200"
              >
                <CheckCircle className="w-10 h-10" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                Registration Successful!
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Thank you for joining ByTech Virtual Hackathon 2026.
              </p>
            </div>

            {/* Receipt Details Ticket */}
            <div className="p-8 space-y-6">
              
              {/* Unique ID Badge */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center print:bg-white">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Participant ID
                </span>
                <span className="text-3xl font-mono font-extrabold text-primary-900 mt-1">
                  {participant.participant_id}
                </span>
              </div>

              {/* Grid Info */}
              <div className="border-t border-b border-slate-100 py-5 space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Name</span>
                  <span className="text-slate-900 font-bold text-right">{participant.full_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Email</span>
                  <span className="text-slate-900 font-bold text-right break-all ml-4">{participant.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Payment Status</span>
                  <span className="px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 bg-emerald-100 rounded-full uppercase tracking-wider print:border print:border-slate-200">
                    {participant.payment_status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Payment ID</span>
                  <span className="text-slate-700 font-mono font-semibold break-all text-right ml-4">
                    {participant.payment_id || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Amount Paid</span>
                  <span className="text-slate-900 font-extrabold">₹1.00</span>
                </div>
              </div>

              {/* Next Steps CTA */}
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 print:hidden">
                <h4 className="font-bold text-primary-900 text-sm flex items-center gap-1.5">
                  <MessageSquareCode className="w-5 h-5 text-primary-500" />
                  What's Next?
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  We've sent a welcome email to <strong>{participant.email}</strong> with your registration confirmation and details for the upcoming 3-hour virtual hackathon.
                </p>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 print:hidden">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  icon={<Download className="w-4.5 h-4.5" />}
                  className="w-full cursor-pointer"
                >
                  Print Receipt
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/')}
                  icon={<Home className="w-4.5 h-4.5" />}
                  className="w-full cursor-pointer shadow-md shadow-primary-500/10"
                >
                  Back to Home
                </Button>
              </div>

            </div>
          </motion.div>

          {/* Inline Print Styles */}
          <style>{`
            @media print {
              body {
                background-color: #ffffff !important;
                color: #000000 !important;
              }
              .gradient-bg {
                background: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
              .print\\:border-none {
                border: none !important;
              }
              .print\\:shadow-none {
                box-shadow: none !important;
              }
              .print\\:bg-white {
                background-color: #ffffff !important;
              }
            }
          `}</style>
          
        </div>
      </div>

      {/* Hide Footer during print */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  )
}
export default Success
