import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Award, Gift, Sparkles } from 'lucide-react'

interface PrizeCard {
  place: string;
  amount: string;
  benefits: string[];
  gradient: string;
  borderColor: string;
  icon: React.ReactNode;
  delay: number;
}

const prizes: PrizeCard[] = [
  {
    place: "Second Runner-up",
    amount: "₹500",
    benefits: [
      "Cash Prize of ₹500",
      "ByTech Certificate of Merit",
      "Official E-Badge of Achievement",
      "Feature in Winners Gallery"
    ],
    gradient: "from-amber-100/50 via-amber-50/10 to-transparent",
    borderColor: "border-amber-500/20",
    icon: <Award className="w-10 h-10 text-amber-700" />,
    delay: 0.2
  },
  {
    place: "Winner (1st Place)",
    amount: "₹2,000",
    benefits: [
      "Grand Cash Prize of ₹2,000",
      "ByTech Winner Trophy & E-Badge",
      "Certificate of Merit (1st Place)",
      "Dedicated Social Media Feature",
      "Special Mentorship Invite"
    ],
    gradient: "from-yellow-100/60 via-yellow-50/20 to-transparent",
    borderColor: "border-yellow-500/30",
    icon: <Trophy className="w-14 h-14 text-yellow-600" />,
    delay: 0
  },
  {
    place: "First Runner-up",
    amount: "₹1,000",
    benefits: [
      "Cash Prize of ₹1,000",
      "ByTech Certificate of Merit",
      "Official E-Badge of Achievement",
      "Exclusive Winners Showcase Link"
    ],
    gradient: "from-slate-200/50 via-slate-100/10 to-transparent",
    borderColor: "border-slate-400/20",
    icon: <Award className="w-12 h-12 text-slate-500" />,
    delay: 0.1
  }
]

export const PrizePool: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Main Prizes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16">
        {prizes.map((prize, index) => {
          const isMain = prize.place.includes("Winner")
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: prize.delay, ease: "easeOut" }}
              className={`relative bg-white rounded-2xl border ${prize.borderColor} shadow-sm overflow-hidden flex flex-col p-8 ${
                isMain 
                  ? 'md:py-12 md:-translate-y-4 ring-2 ring-yellow-400 shadow-xl shadow-yellow-100' 
                  : 'py-8'
              }`}
            >
              {/* Highlight background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${prize.gradient} pointer-events-none`} />

              {/* Sparkles for winner */}
              {isMain && (
                <div className="absolute top-4 right-4 text-yellow-500 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}

              {/* Icon & title */}
              <div className="flex flex-col items-center text-center mb-6 relative z-10">
                <div className="mb-4">{prize.icon}</div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{prize.place}</span>
                <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">{prize.amount}</span>
              </div>

              {/* Benefits */}
              <ul className="space-y-3.5 mb-2 relative z-10 flex-grow">
                {prize.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-sm md:text-base text-slate-600">
                    <span className="text-emerald-500 mr-2.5 font-bold">&#10003;</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>

      {/* Track & Certificate Rewards */}
      <div className="bg-slate-100/50 border border-slate-200/60 rounded-2xl p-8 md:p-10">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-2">
          <Gift className="w-5 h-5 text-primary-500" />
          Additional Recognitions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs text-center md:text-left">
            <span className="font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded text-xs">
              Top 10 Finalists
            </span>
            <h4 className="font-bold text-slate-800 mt-3 mb-1.5">Finalist Certificates</h4>
            <p className="text-sm text-slate-500">The top 10 best-performing submissions receive dedicated Finalist Certificates of Excellence.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs text-center md:text-left">
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-xs">
              All Registrants
            </span>
            <h4 className="font-bold text-slate-800 mt-3 mb-1.5">Participation Certificates</h4>
            <p className="text-sm text-slate-500">Every developer who submits a valid codebase receives a ByTech Participation Certificate.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PrizePool
