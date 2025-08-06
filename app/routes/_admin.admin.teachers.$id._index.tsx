import { useParams } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useEffect, useState } from 'react'
import { authApi } from '~/utils/axios'
import { Forehead } from '~/component'
import axios from 'axios'
import { format } from 'date-fns'
import { Teacher } from '~/types/teacher'

export const handle = {
  title: 'គ្រូ',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title }]
}

export default function TeacherDetailPage() {
  const { id } = useParams()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        console.log('res', res)
        setTeacher(res.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 404) setError('Teacher not found')
          else if (status === 500) setError('Server error occurred')
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

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <Forehead title="គ្រូ" backref={'/admin/teachers'} />
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error || 'Teacher not found'}</span>
          </div>
        )}
        {teacher && (
          <table className="table">
            <tbody className="text-base">
              <tr>
                <td>លេខកូដ</td>
                <td>{teacher.code}</td>
              </tr>
              <tr>
                <td>ឈ្មោះ</td>
                <td>{teacher.name}</td>
              </tr>
              <tr>
                <td width="240">លេខទូរស័ព្ទ</td>
                <td>{teacher.phone}</td>
              </tr>
              <tr>
                <td>ថ្ងៃកំណើត</td>
                <td>
                  {teacher.dob
                    ? format(new Date(teacher.dob), 'dd/MM/yyyy')
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>មុខវិជ្ជាបង្រៀន</td>
                <td>{teacher.subject ? teacher.subject : '-'}</td>
              </tr>
              <tr>
                <td width="240">ភេទ</td>
                <td>
                  {teacher.gender
                    ? { MALE: 'ប្រុស', FEMALE: 'ស្រី' }[teacher.gender]
                    : '-'}
                </td>
              </tr>
              <tr>
                <td>ឯកទេសទី ១</td>
                <td>{teacher.profession1 ? teacher.profession1 : '-'}</td>
              </tr>
              <tr>
                <td>ឯកទេសទី ​២</td>
                <td>{teacher.profession2 ? teacher.profession2 : '-'}</td>
              </tr>
              <tr>
                <td>ឋានន្តរស័ក្ត</td>
                <td>{teacher.rank ? teacher.rank : '-'}</td>
              </tr>
              <tr>
                <td>ក្របខណ្ឌ</td>
                <td>{teacher.krobkan ? teacher.krobkan : '-'}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
