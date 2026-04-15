import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Breadcrumb from '../../components/quickMenu/Breadcrumb'
import PageHeroBanner from '../../components/quickMenu/PageHeroBanner'
import { useAuth } from '../../context/AuthContext'
import { loginStudentAccount } from '../../services/studentAccounts'

const LOGIN_NAV = [
  { label: 'Student Login', to: '/login' },
]

const StudentLogin = () => {
  const { user, isLoggedIn, isReady, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required')
      return
    }

    setSubmitting(true)
    try {
      const matched = await loginStudentAccount({
        username: form.username,
        password: form.password,
      })

      login({
        name: matched.name,
        email: matched.email,
        studentId: matched.studentId,
        username: matched.username,
        photoDataUrl: matched.photoDataUrl,
      })

      // Add a small delay to show feedback
      await new Promise((resolve) => setTimeout(resolve, 150))
      setForm({ username: '', password: '' })

      const from = location.state?.from
      navigate(from || '/student', { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Breadcrumb current="Student Login" />

      <PageHeroBanner
        title="Student Login"
        navLinks={LOGIN_NAV}
        activeTo="/login"
      />

      <section
        className="w-screen bg-white"
        style={{
          paddingTop: 'clamp(2.2rem, 4vw, 4rem)',
          paddingBottom: 'clamp(2.2rem, 4vw, 4rem)',
          paddingLeft: 'clamp(1rem, 6vw, 7rem)',
          paddingRight: 'clamp(1rem, 6vw, 7rem)',
        }}
      >
        {!isReady ? (
          <div className="text-center text-gray-blue font-medium">Loading session...</div>
        ) : isLoggedIn ? (
          <div className="max-w-2xl mx-auto bg-[#F8FBFF] border border-light-blue rounded-2xl" style={{ padding: 'clamp(1rem, 2.3vw, 2rem)' }}>
            <h2 className="font-dmSans font-semibold text-dark-blue-1" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.8rem)' }}>
              You are logged in
            </h2>
            <div className="mt-4 text-black/75" style={{ fontSize: 'clamp(0.92rem, 1.05vw, 1rem)', lineHeight: 1.8 }}>
              <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Student ID:</strong> {user?.studentId || 'N/A'}</p>
            </div>
            <div className="flex flex-wrap mt-5" style={{ gap: '0.7rem' }}>
              <button
                onClick={logout}
                className="bg-blue text-white rounded-full px-5 py-2.5 font-semibold hover:bg-dark-blue-0 transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
              <Link
                to="/student"
                className="border border-blue text-blue rounded-full px-5 py-2.5 font-semibold hover:bg-blue/10 transition-colors duration-200 inline-block cursor-pointer"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/student/profiles"
                className="border border-blue text-blue rounded-full px-5 py-2.5 font-semibold hover:bg-blue/10 transition-colors duration-200 inline-block cursor-pointer"
              >
                Go to Student Profiles
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="max-w-2xl mx-auto bg-white border border-light-blue shadow-sm rounded-2xl"
            style={{ padding: 'clamp(1rem, 2.3vw, 2rem)' }}
          >
            <h2 className="font-dmSans font-semibold text-dark-blue-1" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.8rem)' }}>
              Login to Student Portal
            </h2>
            <p className="text-gray-blue mt-1" style={{ fontSize: 'clamp(0.9rem, 1.05vw, 1rem)' }}>
              Login checks your username/password directly from the student backend API.
            </p>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 grid-cols-1 mt-5" style={{ gap: '0.9rem' }}>
              <div className="flex flex-col sm:col-span-2" style={{ gap: '0.35rem' }}>
                <label className="font-semibold text-black/80">Username *</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="border border-light-blue rounded-lg px-3 py-2 outline-none"
                  placeholder="e.g. 1903002"
                  autoComplete="username"
                />
              </div>
              <div className="flex flex-col sm:col-span-2" style={{ gap: '0.35rem' }}>
                <label className="font-semibold text-black/80">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="border border-light-blue rounded-lg px-3 py-2 outline-none"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`mt-5 bg-blue text-white rounded-full px-6 py-2.5 font-semibold transition-opacity duration-200 ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-dark-blue-0 cursor-pointer'}`}
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}
      </section>
    </>
  )
}

export default StudentLogin
