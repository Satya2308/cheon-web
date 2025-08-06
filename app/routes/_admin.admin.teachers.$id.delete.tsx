import { redirect, useNavigate, useParams } from '@remix-run/react'
import type { ActionFunctionArgs, MetaFunction } from '@vercel/remix'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Teacher } from '~/types/teacher'
import { authApi } from '~/utils/axios'

export const handle = {
  title: 'គ្រូ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function DeleteTeacherPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) {
        setError('Teacher ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Teacher>(`/teachers/${id}`)
        setTeacher(res.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status
          if (status === 404) setError('Teacher not found!')
          if (status === 500) setError('Server error occured!')
          else setError('Failed to load teacher data')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTeacher()
  }, [id])

  const handleSubmit = async (teacher: Teacher) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const res = await authApi.delete(`/teachers/${teacher.id}`)
      if (res.data.message) navigate('/admin/teachers')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 404) setError('Teacher not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to update teacher')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        {error && (
          <div className="alert alert-error">
            <span>{error || 'Teacher not found'}</span>
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        {teacher && (
          <>
            {' '}
            <h3 className="text-lg font-bold">
              តើអ្នកប្រាកដទេថាអ្នកចង់លុបលោកគ្រូនេះ?
            </h3>
            <p className="my-5">ការលុបមិនអាចត្រឡប់វិញបានទេ។</p>
            <form className="flex gap-1 mt-4 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={isSubmitting}
                onClick={() => navigate(-1)}
              >
                ចេញ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => handleSubmit(teacher)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex gap-2 items-center">
                    <span className="loading loading-spinner" />
                    <span>កំពុងលប់...</span>
                  </span>
                ) : (
                  'លប់'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
