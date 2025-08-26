"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminSettings() {
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [loadingMe, setLoadingMe] = useState(true)

  // Admin gating
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        setMe(data.user)
      } catch (_) {
        setMe(null)
      } finally {
        setLoadingMe(false)
      }
    }
    loadMe()
  }, [])

  const isAdmin = useMemo(() => {
    const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    return !!(me?.email && admins.includes(String(me.email).toLowerCase()))
  }, [me])

  useEffect(() => {
    if (!loadingMe) {
      if (!me) router.replace('/auth')
      else if (!isAdmin) router.replace('/dashboard')
    }
  }, [loadingMe, me, isAdmin, router])

  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    siteName: "Admin Dashboard",
    siteDescription: "Powerful admin interface",
    maxFileSize: "50",
    allowedFileTypes: "pdf,doc,docx,jpg,png,gif",
    sessionTimeout: "24",
    enableRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    adminEmails: "",
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpSecure: true,
    backupFrequency: "daily",
    retentionDays: "30",
    enableLogging: true,
    logLevel: "info"
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "security", name: "Security", icon: "🔐" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "backup", name: "Backup", icon: "💾" },
    { id: "advanced", name: "Advanced", icon: "🔧" }
  ]

  // Load current admin settings (adminEmails) from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' })
        const data = await res.json()
        if (res.ok) {
          const emails = Array.isArray(data.adminEmails) ? data.adminEmails.join(', ') : ''
          setSettings(prev => ({ ...prev, adminEmails: emails }))
        }
      } catch (_) {
        // ignore for now
      }
    }
    if (isAdmin) loadSettings()
  }, [isAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      // Persist only adminEmails for now (backend supports that). Parse comma list -> array
      const adminEmailsArray = settings.adminEmails.split(',').map(s => s.trim()).filter(Boolean)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmails: adminEmailsArray })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setErrors(data.errors || { general: data.error || 'Failed to save settings' })
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      setErrors({ general: 'Network error occurred' })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const InputField = ({ label, field, type = "text", placeholder, description, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={settings[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
        />
      ) : type === "select" ? (
        <select
          value={settings[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
          {placeholder && <option value="">{placeholder}</option>}
        </select>
      ) : type === "checkbox" ? (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings[field]}
            onChange={(e) => handleInputChange(field, e.target.checked)}
            className="w-5 h-5 text-purple-500 bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-gray-300">{description}</span>
        </label>
      ) : (
        <input
          type={type}
          value={settings[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      )}
      {description && type !== "checkbox" && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      {errors[field] && (
        <p className="text-sm text-red-400">{errors[field]}</p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Back to Admin
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                >
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">⚙️</span>
                        <div>
                          <h2 className="text-2xl font-bold">General Settings</h2>
                          <p className="text-gray-400">Configure basic site settings</p>
                        </div>
                      </div>
                      <InputField label="Site Name" field="siteName" placeholder="Enter site name" required />
                      <InputField label="Site Description" field="siteDescription" type="textarea" placeholder="Brief description of your site" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Max File Size (MB)" field="maxFileSize" type="number" placeholder="50" />
                        <InputField label="Session Timeout (Hours)" field="sessionTimeout" type="number" placeholder="24" />
                      </div>
                      <InputField label="Allowed File Types" field="allowedFileTypes" placeholder="pdf,doc,docx,jpg,png,gif" description="Comma-separated list of file extensions" />
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🔐</span>
                        <div>
                          <h2 className="text-2xl font-bold">Security Settings</h2>
                          <p className="text-gray-400">Manage security and access control</p>
                        </div>
                      </div>
                      <InputField label="Admin Emails" field="adminEmails" type="textarea" placeholder="admin@example.com, manager@example.com" description="Comma-separated list of admin email addresses" />
                      <div className="space-y-4">
                        <InputField type="checkbox" field="enableRegistration" description="Allow new user registration" />
                        <InputField type="checkbox" field="requireEmailVerification" description="Require email verification for new accounts" />
                        <InputField type="checkbox" field="maintenanceMode" description="Enable maintenance mode (restricts access)" />
                      </div>
                    </div>
                  )}

                  {activeTab === "email" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">📧</span>
                        <div>
                          <h2 className="text-2xl font-bold">Email Configuration</h2>
                          <p className="text-gray-400">Configure SMTP settings for email delivery</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="SMTP Host" field="smtpHost" placeholder="smtp.gmail.com" />
                        <InputField label="SMTP Port" field="smtpPort" type="number" placeholder="587" />
                      </div>
                      <InputField label="SMTP Username" field="smtpUsername" placeholder="your-email@gmail.com" />
                      <InputField label="SMTP Password" field="smtpPassword" type="password" placeholder="Enter SMTP password" />
                      <InputField type="checkbox" field="smtpSecure" description="Use secure connection (SSL/TLS)" />
                      <InputField type="checkbox" field="enableNotifications" description="Send email notifications to users" />
                    </div>
                  )}

                  {activeTab === "backup" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">💾</span>
                        <div>
                          <h2 className="text-2xl font-bold">Backup Settings</h2>
                          <p className="text-gray-400">Configure automated backups and retention</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-200">Backup Frequency</label>
                          <select
                            value={settings.backupFrequency}
                            onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                        <InputField label="Retention Days" field="retentionDays" type="number" placeholder="30" description="How long to keep backups" />
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-400">ℹ️</span>
                          <span className="font-medium text-blue-300">Backup Status</span>
                        </div>
                        <p className="text-sm text-blue-200">Last backup: Today at 3:00 AM • Next backup: Tomorrow at 3:00 AM</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "advanced" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">🔧</span>
                        <div>
                          <h2 className="text-2xl font-bold">Advanced Settings</h2>
                          <p className="text-gray-400">Advanced configuration options</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <InputField type="checkbox" field="enableLogging" description="Enable system logging" />
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-200">Log Level</label>
                          <select
                            value={settings.logLevel}
                            onChange={(e) => handleInputChange("logLevel", e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={!settings.enableLogging}
                          >
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warn">Warning</option>
                            <option value="error">Error</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-red-400">⚠️</span>
                          <span className="font-medium text-red-300">Danger Zone</span>
                        </div>
                        <p className="text-sm text-red-200 mb-4">These actions are irreversible. Please proceed with caution.</p>
                        <div className="flex gap-3">
                          <button type="button" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Clear All Logs</button>
                          <button type="button" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Reset Settings</button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  {saved && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-green-400">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Settings saved successfully!
                    </motion.div>
                  )}
                  {errors.general && (
                    <div className="flex items-center gap-2 text-red-400">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      {errors.general}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" className="px-6 py-2 border border-white/20 text-gray-300 hover:text-white hover:border-white/40 rounded-xl transition-colors" onClick={() => window.location.reload()}>Reset</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer className="bg-black/50 py-8 border-t border-white/20">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding */}
        <div className="text-gray-300 font-medium">
          DevNotes • Developer Cheat Sheets <br className="md:hidden" />
          <span className="text-sm text-gray-400">by CodeWithRaheem</span>
        </div>

        {/* Right: Social & Info */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-gray-400 text-sm">
            Updated regularly • Copy & use safely
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="https://github.com/RaheemSiddiqui527" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" 
                alt="GitHub" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
            <a href="https://twitter.com/codewithraheem" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" 
                alt="Twitter" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
            <a href="https://www.linkedin.com/in/codewithraheem" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" 
                alt="LinkedIn" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
          </div>
        </div>

      </div>
    </footer>
    </div>
  )
}
