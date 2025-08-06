import { Form, useNavigate } from '@remix-run/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '~/contexts/authContext'
import fieldError from '~/helpers/fieldError'
import { validateLogin } from '~/zod/login'

interface LoginError {
  phone?: string[]
  password?: string[]
}

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorObj, setErrorObj] = useState<LoginError | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/teachers', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const { data, error } = await validateLogin(formData)
    if (!data) return setErrorObj(error)
    const { phone, password } = data
    try {
      await login(phone, password)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Invalid phone or password')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <header>
        <h1 className="text-center text-4xl font-semibold p-4 mb-4 text-gray-900">
          បឹងកេងកង
        </h1>
      </header>
      <Form method="POST" onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="លេខទូរស័ព្ទ"
            name="phone"
            required
          />
          {errorObj?.phone && fieldError(errorObj.phone[0])}
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="ពាក្យសម្ងាត់"
            name="password"
            required
          />
          {errorObj?.password && fieldError(errorObj.password[0])}
          {error && fieldError(error)}
          <div className="flex flex-col">
            <button type="submit" className="btn bg-gray-800 text-white">
              ចូល
            </button>
          </div>
        </fieldset>
      </Form>
    </div>
  )
}
