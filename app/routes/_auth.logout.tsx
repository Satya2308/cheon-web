import { useEffect, useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { useAuth } from '~/contexts/authContext'
import axios from 'axios'

export default function Logout() {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  console.log("isAuthenticated", isAuthenticated)

  useEffect(() => {
    async function doLogout() {
      setIsSubmitting(true)
      try {
        await logout()
        navigate('/login', { replace: true })
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Logout failed')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setIsSubmitting(false)
      }
    }
    if (isAuthenticated) doLogout()
    else navigate('/login', { replace: true })
  }, [isAuthenticated, logout, navigate])

  return (
    <>
      {isSubmitting && <p>Logging out...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}
