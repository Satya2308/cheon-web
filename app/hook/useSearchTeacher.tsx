import { useRef, useState } from 'react'

export function useTeacherSearch() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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
      const response = await fetch(
        `/teachers/search?q=${encodeURIComponent(query)}&limit=20`,
        { signal: abortController.current.signal }
      )
      if (!response.ok) throw new Error('Failed to search teachers')
      const data = await response.json()
      setTeachers(data)
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message)
        setTeachers([])
      }
    } finally {
      setLoading(false)
    }
  }

  return { teachers, loading, error, searchTeachers }
}
