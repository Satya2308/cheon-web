import { useOutletContext, useParams } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { authApi } from '~/utils/axios'
import { Forehead } from '~/component'
import axios from 'axios'
import { Classroom } from '~/types/classroom'
import { Year } from '~/types/year'
import { useEffect, useState } from 'react'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function ClassroomDetailPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const { id, cid } = useParams()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id) {
        setError('Classroom  ID not found')
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
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 404) setError('Classroom  not found')
          else if (status === 500) setError('Server error occurred')
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

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <Forehead
          title="ថ្នាក់រៀន"
          backref={`/admin/years/${year.id}/classrooms`}
        />
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error || 'Classroom not found'}</span>
          </div>
        )}
        {classroom && (
          <table className="table">
            <tbody className="text-base">
              <tr>
                <td>ថ្នាក់</td>
                <td>{classroom.name}</td>
              </tr>
              <tr>
                <td width="240">គ្រូបន្ទុកថ្នាក់</td>
                <td>
                  {classroom.teacher?.name ? classroom.teacher?.name : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
