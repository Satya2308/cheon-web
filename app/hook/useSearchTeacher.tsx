import axios from 'axios'
import { useRef, useState } from 'react'
import { authApi } from '~/utils/axios'

export function useTeacherSearch() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortController = useRef<AbortController | null>(null)

  const searchTeachers = async (query: string) => {
    if (abortController.current) abortController.current.abort()
    if (!query.trim()) {
      setTeachers([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    abortController.current = new AbortController()
    try {
      const response = await authApi.get('/teachers/search', {
        params: { q: query, limit: 20 },
        signal: abortController.current.signal,
      })
      setTeachers(response.data)
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || err.message)
          setTeachers([])
        }
      } else {
        setError('An unexpected error occurred')
        setTeachers([])
      }
    } finally {
      setLoading(false)
    }
  }

  return { teachers, loading, error, searchTeachers }
}
