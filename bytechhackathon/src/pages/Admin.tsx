import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, CheckCircle2, AlertCircle, IndianRupee, Search, Filter, 
  Download, LogOut, MessageSquare, ShieldCheck, Mail, GraduationCap 
} from 'lucide-react'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import Button from '../components/Button'
import Input from '../components/Input'
import { participantService } from '../services/participantService'
import type { Participant, AdminStats } from '../services/participantService'
import { isSupabaseConfigured, supabase } from '../services/supabase'

export const Admin: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  
  const [stats, setStats] = useState<AdminStats>({
    totalRegistrations: 0,
    paidRegistrations: 0,
    pendingRegistrations: 0,
    totalRevenue: 0
  })
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all')
  const [isLoading, setIsLoading] = useState(false)

  // 1. Check existing session on load
  useEffect(() => {
    const mockSession = sessionStorage.getItem('bytech_admin_session')
    if (mockSession === 'active') {
      setIsAdminLoggedIn(true)
      fetchDashboardData()
      return
    }

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then((res: any) => {
        const session = res.data?.session
        if (session) {
          setIsAdminLoggedIn(true)
          fetchDashboardData()
        }
      })
    }
  }, [])

  // 2. Fetch all participants and compute dashboard stats
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const allParticipants = await participantService.getParticipantsList()
      const dashboardStats = await participantService.getAdminStats()
      
      setParticipants(allParticipants)
      setFilteredParticipants(allParticipants)
      setStats(dashboardStats)
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoading(true)

    try {
      // 1. Master admin bypass (works in both mock and Supabase configurations)
      if (loginEmail === 'admin@bytech.com' && loginPassword === 'admin123') {
        sessionStorage.setItem('bytech_admin_session', 'active')
        setIsAdminLoggedIn(true)
        fetchDashboardData()
        return
      }

      // 2. Standard Supabase Auth login
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword
        })
        if (error) throw new Error(error.message)
        
        setIsAdminLoggedIn(true)
        fetchDashboardData()
      } else {
        throw new Error('Invalid email or password. Use admin@bytech.com / admin123.')
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Handle Logout
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut()
      } else {
        sessionStorage.removeItem('bytech_admin_session')
      }
      setIsAdminLoggedIn(false)
      setParticipants([])
      setFilteredParticipants([])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // 5. Apply Search & Status Filter
  useEffect(() => {
    let result = participants

    // Apply Search Query (Name, Email, College)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.full_name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.college_name.toLowerCase().includes(q)
      )
    }

    // Apply Payment Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.payment_status === statusFilter)
    }

    setFilteredParticipants(result)
  }, [searchQuery, statusFilter, participants])

  // 6. CSV Export Trigger
  const exportToCSV = () => {
    if (filteredParticipants.length === 0) return

    const headers = [
      'Participant ID', 'Full Name', 'Email', 'WhatsApp Number', 'Contact Number',
      'College Name', 'University Name', 'Degree', 'Branch', 'Study Year', 
      'GitHub Profile', 'LinkedIn Profile', 'Skills', 'Payment ID', 'Payment Status', 'Registration Date'
    ]

    const csvRows = [
      headers.join(','), // Header row
      ...filteredParticipants.map(p =>
        [
          p.participant_id || '',
          `"${p.full_name.replace(/"/g, '""')}"`,
          p.email,
          p.whatsapp_number,
          p.contact_number,
          `"${p.college_name.replace(/"/g, '""')}"`,
          `"${p.university_name.replace(/"/g, '""')}"`,
          p.degree,
          `"${p.branch.replace(/"/g, '""')}"`,
          p.study_year,
          p.github_url || '',
          p.linkedin_url || '',
          `"${p.skills.replace(/"/g, '""')}"`,
          p.payment_id || '',
          p.payment_status,
          p.created_at
        ].join(',')
      )
    ]

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `bytech_hackathon_participants_${Date.now()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 7. Excel (XML Spreadsheet mock) Export
  const exportToExcel = () => {
    if (filteredParticipants.length === 0) return

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Participants</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; }
          th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; }
          td { border: 1px solid #cbd5e1; padding: 6px; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Participant ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>WhatsApp Number</th>
              <th>Contact Number</th>
              <th>College Name</th>
              <th>University Name</th>
              <th>Degree</th>
              <th>Branch</th>
              <th>Study Year</th>
              <th>Skills</th>
              <th>Payment ID</th>
              <th>Payment Status</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
    `

    filteredParticipants.forEach(p => {
      html += `
        <tr>
          <td>${p.participant_id || '-'}</td>
          <td>${p.full_name}</td>
          <td>${p.email}</td>
          <td>${p.whatsapp_number}</td>
          <td>${p.contact_number}</td>
          <td>${p.college_name}</td>
          <td>${p.university_name}</td>
          <td>${p.degree}</td>
          <td>${p.branch}</td>
          <td>${p.study_year}</td>
          <td>${p.skills}</td>
          <td>${p.payment_id || '-'}</td>
          <td>${p.payment_status}</td>
          <td>${p.created_at}</td>
        </tr>
      `
    })

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `bytech_hackathon_participants_${Date.now()}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format phone for wa.me link with custom pre-filled message based on payment status
  const getWhatsAppLink = (p: Participant) => {
    const cleanNum = p.whatsapp_number.replace(/\D/g, '')
    const prefix = cleanNum.length === 10 ? '91' : ''
    
    let message = ''
    if (p.payment_status === 'paid') {
      message = `Hi ${p.full_name}, thank you for successfully registering for the ByTech Virtual Hackathon 2026. Your Participant ID is ${p.participant_id}. Make sure your IDE and Git environments are ready for the 3-hour virtual sprint on July 5th. We look forward to seeing you code! Best regards, ByTech Software Solutions Team.`
    } else {
      message = `Hi ${p.full_name}, this is the ByTech Software Solutions team. We noticed you started registering for the ByTech Virtual Hackathon 2026, but your payment of ₹99 is pending. Don't miss out on ₹3,500+ in cash prizes, finalist certificates for the top 10, and participation certificates for everyone! Complete your registration by finishing the payment here. Let us know if you face any issues. Thanks!`
    }
    
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${prefix}${cleanNum}?text=${encodedMessage}`
  }

  if (!isAdminLoggedIn) {
    // ADMIN LOGIN PANEL
    return (
      <div className="min-h-screen flex flex-col gradient-bg">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-8 space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex p-3 bg-primary-50 rounded-2xl text-primary-600 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Login Portal</h2>
              <p className="text-slate-500 text-sm mt-1">
                {!isSupabaseConfigured && "Demo mode: use admin@bytech.com / admin123"}
              </p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold p-4 rounded-xl">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Admin Email"
                type="email"
                required
                placeholder="admin@bytech.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 mt-2 cursor-pointer"
                isLoading={isLoading}
              >
                Authenticate Access
              </Button>
            </form>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  // ADMIN DASHBOARD PORTAL
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hackathon Admin Dashboard
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Analyze registrations, verify payment statuses, and manage participants.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            icon={<LogOut className="w-4.5 h-4.5" />}
            className="self-start sm:self-center border-red-200 hover:bg-red-50 hover:text-red-700 text-slate-600 transition-all cursor-pointer"
          >
            Logout
          </Button>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</span>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.totalRegistrations}</h3>
            </div>
          </div>

          {/* Card 2: Paid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5">
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Registrations</span>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.paidRegistrations}</h3>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5">
            <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{stats.pendingRegistrations}</h3>
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-5">
            <div className="p-4 bg-yellow-50 rounded-xl text-yellow-600">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">₹{stats.totalRevenue}</h3>
            </div>
          </div>

        </div>

        {/* Filters and Search Tools */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                placeholder="Search by Name, Email, or College..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter & Export Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Filter */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 bg-white">
                <Filter className="w-4 h-4" />
                <select
                  className="bg-transparent text-sm focus:outline-none text-slate-700 cursor-pointer"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Exports */}
              <Button
                variant="outline"
                onClick={exportToCSV}
                icon={<Download className="w-4 h-4" />}
                className="px-3 py-2 text-sm border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                disabled={filteredParticipants.length === 0}
              >
                CSV
              </Button>
              
              <Button
                variant="outline"
                onClick={exportToExcel}
                icon={<Download className="w-4 h-4" />}
                className="px-3 py-2 text-sm border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                disabled={filteredParticipants.length === 0}
              >
                Excel
              </Button>

            </div>
          </div>
        </div>

        {/* Participants Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6">Participant ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email & College</th>
                  <th className="py-4 px-6">WhatsApp</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Reg Date</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading participants...
                      </div>
                    </td>
                  </tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No participants found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID */}
                      <td className="py-4 px-6 font-mono font-bold text-slate-800">
                        {p.participant_id || '-'}
                      </td>
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{p.full_name}</div>
                      </td>
                      {/* Email / College */}
                      <td className="py-4 px-6 max-w-xs sm:max-w-sm truncate">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-0.5">
                          <Mail className="w-3.5 h-3.5" /> {p.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <GraduationCap className="w-3.5 h-3.5" /> {p.college_name}
                        </div>
                      </td>
                      {/* WhatsApp */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-700">{p.whatsapp_number}</div>
                      </td>
                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                            p.payment_status === 'paid'
                              ? 'text-emerald-800 bg-emerald-50'
                              : 'text-amber-800 bg-amber-50'
                          }`}
                        >
                          {p.payment_status}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="py-4 px-6 text-xs font-semibold text-slate-400">
                        {new Date(p.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      {/* Action */}
                      <td className="py-4 px-6 text-center">
                        <a
                          href={getWhatsAppLink(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors focus:outline-none"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Chat
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}
export default Admin
