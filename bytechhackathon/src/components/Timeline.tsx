import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Flag, Rocket, CheckCircle, Trophy, UserCheck } from 'lucide-react'

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const events: TimelineEvent[] = [
  {
    date: "June 22, 2026",
    title: "Registrations Open",
    description: "Secure your individual slot for ₹99 and begin prepping your IDE.",
    icon: <UserCheck className="w-5 h-5" />
  },
  {
    date: "July 8, 2026",
    title: "Registrations Close",
    description: "Last day to register. Make sure your environment variables and Git configs are ready.",
    icon: <Calendar className="w-5 h-5" />
  },
  {
    date: "July 10, 2026 (05:45 PM)",
    title: "Verification Queue",
    description: "Log in to the dashboard portal to verify your payment status and check-in.",
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    date: "July 10, 2026 (06:00 PM)",
    title: "Coding Kick-off",
    description: "The official problem statements are released. The 3-hour coding marathon begins!",
    icon: <Rocket className="w-5 h-5" />
  },
  {
    date: "July 10, 2026 (09:00 PM)",
    title: "Submission Window Closes",
    description: "Coding stops. Push your codebase to public GitHub repos and submit links.",
    icon: <Flag className="w-5 h-5" />
  },
  {
    date: "July 15, 2026",
    title: "Results Declaration",
    description: "Evaluation results, finalist certificates, and cash distributions are published.",
    icon: <Trophy className="w-5 h-5" />
  }
]

export const Timeline: React.FC = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform md:-translate-x-1/2" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        {events.map((event, index) => {
          const isEven = index % 2 === 0
          
          return (
            <div key={index} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Icon Dot */}
              <div className="absolute left-0 md:left-1/2 top-1.5 w-9 h-9 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center text-primary-600 shadow-md transform -translate-x-1/2 z-10">
                {event.icon}
              </div>

              {/* Card */}
              <div className="w-full md:w-[calc(50%-2rem)] ml-8 md:ml-0">
                <motion.div
                  variants={cardVariants}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-3">
                    {event.date}
                  </span>
                  
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              </div>

              <div className="hidden md:block w-[calc(50%-2rem)]" />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
export default Timeline
