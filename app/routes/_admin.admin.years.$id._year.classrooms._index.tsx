import { Link, useOutletContext } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useEffect, useState } from 'react'
import { EmptyState, ExpClassScheduleBtn, LoadingUI } from '~/component'
import { Eye, Pen, Plus, Trash2 } from '~/icons'
import { Classroom } from '~/types/classroom'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'

export const handle = {
  title: 'ឆ្នាំ',
  backref: '/admin/years',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backref }]
}

export default function ListClassroomPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Classroom[]>(
          `/years/${year.id}/classrooms`
        )
        setClassrooms(res.data)
      } catch (err) {
        setError('Failed to load classrooms. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchClassrooms()
  }, [])

  if (loading) return <LoadingUI />

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    )
  }

  return (
    <>
      <header
        className={[
          'flex',
          'items-center',
          'justify-between',
          'border-b',
          'border-b-base-200',
          'pb-5',
        ].join(' ')}
      >
        <div className="text-2xl font-semibold">ថ្នាក់រៀន</div>
        <div className="flex gap-2"></div>
        <Link
          to={`/admin/years/${year.id}/classrooms/new`}
          className="btn btn-ghost bg-none text-lg"
        >
          <Plus size={18} />
          បង្កើតថ្មី
        </Link>
      </header>
      {classrooms.length === 0 && (
        <EmptyState
          actionUrl={`/admin/years/${year.id}/classrooms/new`}
          actionLabel="បង្កើតថ្នាក់ថ្មី"
        />
      )}
      {classrooms.length > 0 && (
        <table className="table table-auto">
          <thead className="uppercase bg-base-200 text-lg text-black">
            <tr className="font-semibold">
              <th>ឈ្មោះ</th>
              <th>គ្រូបន្ទុក</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {classrooms.map((item) => (
              <tr key={item.id} className="hover">
                <td>{item.name}</td>
                <td>
                  {item.teacher?.code
                    ? `${item.teacher.code}(${item.teacher.name})`
                    : '-'}
                </td>
                <td>
                  <div className="flex gap-1">
                    <Link
                      to={`/admin/years/${year.id}/classrooms/${item.id}`}
                      className="btn btn-sm btn-square"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/admin/years/${year.id}/classrooms/${item.id}/edit`}
                      className="btn btn-sm btn-square"
                    >
                      <Pen size={16} />
                    </Link>
                    <Link
                      to={`/admin/years/${year.id}/classrooms/${item.id}/delete`}
                      className="btn btn-sm btn-square"
                    >
                      <Trash2 size={16} />
                    </Link>
                    <div className="flex gap-2 justify-center">
                      <ExpClassScheduleBtn
                        classroomId={item.id}
                        classroomName={item.name}
                        yearId={parseInt(year.id)}
                        yearName={year.name}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
