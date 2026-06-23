import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who is eligible to participate in the hackathon?",
    answer: "The hackathon is open to all students currently enrolled in any school, undergraduate, or postgraduate program. If you are passionate about technology and coding, you are eligible!"
  },
  {
    question: "What is the format of participation?",
    answer: "This is an individual-only participation hackathon. Every participant must build and submit their project independently. No team entries are allowed."
  },
  {
    question: "What is the registration fee and how do I pay?",
    answer: "The registration fee is ₹99. You can pay securely using our integrated Razorpay gateway via credit/debit cards, UPI, net banking, or wallets."
  },
  {
    question: "What is the duration of the hackathon?",
    answer: "This is a fast-paced 3-hour virtual sprint. Coding starts on July 10, 2026 at 06:00 PM and ends at 09:00 PM sharp. Submissions must be uploaded immediately upon conclusion."
  },
  {
    question: "How do I submit my project?",
    answer: "You must submit a link to a public GitHub repository containing your project code before the 09:00 PM deadline. Ensure your repository has a descriptive README file."
  },
  {
    question: "What are the prizes?",
    answer: "1st Place: ₹2,000 | 2nd Place: ₹1,000 | 3rd Place: ₹500. Additionally, the Top 10 finalists will receive Finalist Certificates, and all valid participants will receive a Participation Certificate."
  }
]

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:text-primary-600 transition-colors focus:outline-none"
            >
              <span>{faq.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 text-sm md:text-base text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
export default FaqAccordion
