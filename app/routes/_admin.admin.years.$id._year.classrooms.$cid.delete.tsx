import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
  useParams,
} from '@remix-run/react'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@vercel/remix'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Classroom } from '~/types/classroom'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function DeleteClassroomPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const { id, cid } = useParams()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id) {
        setError('Classroom ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Classroom>(
          `/years/${year.id}/classrooms/${cid}`
        )
        setClassroom(res.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status
          if (status === 404) setError('Classroom not found!')
          if (status === 500) setError('Server error occured!')
          else setError('Failed to load classroom data')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchClassroom()
  }, [id])

  const handleSubmit = async (classroom: Classroom) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const res = await authApi.delete(
        `/years/${year.id}/classrooms/${classroom.id}`
      )
      if (res.data.message)
        return navigate(`/admin/years/${year.id}/classrooms`)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 404) setError('Classroom not found')
        else if (status === 500) setError('Server error occurred')
        else setError('Failed to update classroom')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!classroom) return

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
        <h3 className="text-lg font-bold">
          តើអ្នកប្រាកដទេថាអ្នកចង់លុបថ្នាក់នេះ?
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
            onClick={() => handleSubmit(classroom)}
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
      </div>
    </div>
  )
}
