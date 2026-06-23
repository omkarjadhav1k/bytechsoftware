import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { User, GraduationCap, Code2, ShieldCheck, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import Button from '../components/Button'
import Input from '../components/Input'
import { participantService } from '../services/participantService'


// Indian Mobile Number Regex (10 digits starting with 6-9)
const phoneRegex = /^[6-9]\d{9}$/

const personalSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  whatsapp_number: z.string().regex(phoneRegex, 'Please enter a valid 10-digit WhatsApp number'),
  contact_number: z.string().regex(phoneRegex, 'Please enter a valid 10-digit contact number')
})

const academicSchema = z.object({
  college_name: z.string().min(3, 'College name must be at least 3 characters'),
  university_name: z.string().min(2, 'University name must be at least 2 characters'),
  degree: z.string().min(2, 'Degree must be at least 2 characters'),
  branch: z.string().min(2, 'Branch must be at least 2 characters'),
  study_year: z.string().min(1, 'Please select your year of study')
})

const technicalSchema = z.object({
  github_url: z.string().url('Please enter a valid URL (include http:// or https://)').or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid URL (include http:// or https://)').or(z.literal('')),
  skills: z.string().min(1, 'Please list your skills (e.g. React, Python, Java)'),
  agree: z.boolean().refine(val => val === true, {
    message: 'You must agree to the hackathon rules and policies.'
  })
})

const formSchema = personalSchema.merge(academicSchema).merge(technicalSchema)
type FormData = z.infer<typeof formSchema>

const steps = [
  { id: 1, title: 'Personal Info', icon: <User className="w-5 h-5" /> },
  { id: 2, title: 'Academic Details', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 3, title: 'Technical Profile', icon: <Code2 className="w-5 h-5" /> },
  { id: 4, title: 'Review & Pay', icon: <ShieldCheck className="w-5 h-5" /> }
]

// Dynamic script loader for Razorpay Checkout
const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      whatsapp_number: '',
      contact_number: '',
      college_name: '',
      university_name: '',
      degree: '',
      branch: '',
      study_year: '',
      github_url: '',
      linkedin_url: '',
      skills: '',
      agree: false
    }
  })

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof FormData> = []

    if (currentStep === 1) {
      fieldsToValidate = ['full_name', 'email', 'whatsapp_number', 'contact_number']
    } else if (currentStep === 2) {
      fieldsToValidate = ['college_name', 'university_name', 'degree', 'branch', 'study_year']
    } else if (currentStep === 3) {
      fieldsToValidate = ['github_url', 'linkedin_url', 'skills', 'agree']
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setServerError(null)
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setServerError(null)
    setCurrentStep(prev => prev - 1)
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const participantDbId = await participantService.createPendingRegistration(data)

      const isRazorpayLoaded = await loadRazorpay()
      if (!isRazorpayLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.')
      }

      const order = await participantService.createRazorpayOrder(participantDbId)

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: 'INR',
        name: 'ByTech Virtual Hackathon 2026',
        description: 'Registration Fee',
        ...(order.order_id.startsWith('order_mock_') ? {} : { order_id: order.order_id }),
        prefill: {
          name: data.full_name,
          email: data.email,
          contact: data.contact_number
        },
        theme: {
          color: '#2563eb'
        },
        handler: async (response: any) => {
          try {
            setIsSubmitting(true)
            const confirmedParticipant = await participantService.verifyPaymentAndConfirm({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              participant_db_id: participantDbId
            })

            navigate('/success', { state: { participant: confirmedParticipant } })
          } catch (err: any) {
            setServerError(err.message || 'Payment verification failed. Please contact support.')
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
            setServerError('Payment window closed. Please complete the payment to register.')
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', (response: any) => {
        setServerError(`Payment Failed: ${response.error.description}`)
        setIsSubmitting(false)
      })
      rzp.open()
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please check details and try again.')
      setIsSubmitting(false)
    }
  }

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-primary-900 px-8 py-8 text-white text-center relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_70%)]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold relative z-10">
              Registration Portal
            </h2>
            <p className="text-primary-100 text-xs sm:text-sm mt-2 relative z-10">
              ByTech Virtual Hackathon 2026 - ByTech Software Solutions
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 pt-8 border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all ${
                        currentStep === step.id
                          ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20'
                          : currentStep > step.id
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {currentStep > step.id ? '✓' : step.icon}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        currentStep === step.id ? 'text-primary-600' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-grow h-0.5 max-w-[4rem] sm:max-w-none mx-2 rounded transition-colors duration-300 ${
                        currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {serverError && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-semibold flex items-center gap-2">
              <span className="text-red-500">&#9888;</span>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <User className="w-5 h-5 text-primary-500" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        required
                        error={errors.full_name?.message}
                        {...register('full_name')}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>

                    <Input
                      label="WhatsApp Number"
                      type="tel"
                      placeholder="10-digit mobile number"
                      required
                      error={errors.whatsapp_number?.message}
                      helperText="For event updates"
                      {...register('whatsapp_number')}
                    />

                    <Input
                      label="Contact Number"
                      type="tel"
                      placeholder="10-digit calling number"
                      required
                      error={errors.contact_number?.message}
                      helperText="Primary contact number"
                      {...register('contact_number')}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <GraduationCap className="w-5 h-5 text-primary-500" />
                    Academic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="College Name"
                        placeholder="Enter your college/institute name"
                        required
                        error={errors.college_name?.message}
                        {...register('college_name')}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        label="University Name"
                        placeholder="Enter university name (e.g. Mumbai University)"
                        required
                        error={errors.university_name?.message}
                        {...register('university_name')}
                      />
                    </div>

                    <Input
                      label="Degree / Course"
                      placeholder="e.g. B.Tech, BCA, B.Sc"
                      required
                      error={errors.degree?.message}
                      {...register('degree')}
                    />

                    <Input
                      label="Branch / Department"
                      placeholder="e.g. Computer Science, Mechanical"
                      required
                      error={errors.branch?.message}
                      {...register('branch')}
                    />

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Year of Study <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={`w-full block rounded-lg border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm py-2.5 px-3.5 ${
                          errors.study_year ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                        {...register('study_year')}
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.study_year && (
                        <p className="text-xs font-medium text-red-600">{errors.study_year.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Code2 className="w-5 h-5 text-primary-500" />
                    Technical Profile
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="GitHub Profile URL (Optional)"
                      placeholder="https://github.com/username"
                      error={errors.github_url?.message}
                      {...register('github_url')}
                    />

                    <Input
                      label="LinkedIn Profile URL (Optional)"
                      placeholder="https://linkedin.com/in/username"
                      error={errors.linkedin_url?.message}
                      {...register('linkedin_url')}
                    />

                    <div className="md:col-span-2">
                      <Input
                        label="Skills"
                        placeholder="React, Java, Python, SQL, CSS (comma separated)"
                        required
                        error={errors.skills?.message}
                        {...register('skills')}
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 mt-1 cursor-pointer"
                          {...register('agree')}
                        />
                        <span className="text-sm text-slate-600 select-none">
                          I agree to all ByTech Virtual Hackathon 2026 rules, guidelines, code of conduct, and payment policies.
                        </span>
                      </label>
                      {errors.agree && (
                        <p className="text-xs font-medium text-red-600 mt-1.5">{errors.agree.message}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Review Your Information
                  </h3>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5 text-sm">
                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-200/60 pb-1 mb-2.5">Personal Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-600">
                        <div><strong>Name:</strong> {getValues('full_name')}</div>
                        <div><strong>Email:</strong> {getValues('email')}</div>
                        <div><strong>WhatsApp:</strong> {getValues('whatsapp_number')}</div>
                        <div><strong>Contact:</strong> {getValues('contact_number')}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-200/60 pb-1 mb-2.5">Academic Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-600">
                        <div className="sm:col-span-2"><strong>College:</strong> {getValues('college_name')}</div>
                        <div className="sm:col-span-2"><strong>University:</strong> {getValues('university_name')}</div>
                        <div><strong>Degree:</strong> {getValues('degree')}</div>
                        <div><strong>Branch:</strong> {getValues('branch')}</div>
                        <div><strong>Year of Study:</strong> {getValues('study_year')}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-200/60 pb-1 mb-2.5">Technical Profile</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-600">
                        <div className="sm:col-span-2"><strong>Skills:</strong> {getValues('skills')}</div>
                        <div><strong>GitHub:</strong> {getValues('github_url') || '-'}</div>
                        <div><strong>LinkedIn:</strong> {getValues('linkedin_url') || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg text-primary-700 hidden sm:block">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Registration Fee</h4>
                        <p className="text-slate-500 text-xs mt-0.5">Pay securely via Razorpay Checkout</p>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">₹1</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  icon={<ChevronLeft className="w-4 h-4" />}
                  className="cursor-pointer"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  className="cursor-pointer"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Proceed to Payment (₹1)
                  </Button>
                </div>
              )}
            </div>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  )
}
export default Register
