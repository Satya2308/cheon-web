import type { MetaFunction } from '@vercel/remix'
import { useEffect, useState } from 'react'
import { EmptyState, LoadingUI } from '~/component'
import { Eye, Pen, Plus, Trash2 } from '~/icons'
import { authApi } from '~/utils/axios'
import { Teacher } from '~/types/teacher'
import { Link } from '@remix-run/react'

export const handle = {
  title: 'គ្រូ',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title }]
}

export default function ListTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Teacher[]>('/teachers')
        setTeachers(res.data)
      } catch (err) {
        setError('Failed to load teachers. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchTeachers()
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
        <div />
        <Link
          to="/admin/teachers/new"
          className="btn btn-ghost bg-none text-lg"
        >
          <Plus size={20} />
          បង្កើតថ្មី
        </Link>
      </header>

      {teachers.length === 0 && (
        <EmptyState
          actionUrl="/admin/teachers/new"
          actionLabel="បង្កើតលោកគ្រូថ្មី"
        />
      )}

      {teachers.length > 0 && (
        <table className="table table-auto">
          <thead className="uppercase bg-base-200 text-lg text-black">
            <tr className="font-semibold">
              <th>លេខកូដ</th>
              <th>ឈ្មោះ</th>
              <th>លេខទូរស័ព្ទ</th>
              <th>មុខវិជ្ជាបង្រៀន</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {teachers.map((item) => (
              <tr key={item.id} className="hover">
                <td className="text-base">{item.code}</td>
                <td>{item.name}</td>
                <td className="text-base">{item.phone}</td>
                <td>{item.subject ? item.subject : '-'}</td>
                <td>
                  <div className="flex gap-1">
                    <Link
                      to={`/admin/teachers/${item.id}`}
                      className="btn btn-sm btn-square"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/admin/teachers/${item.id}/edit`}
                      className="btn btn-sm btn-square"
                    >
                      <Pen size={16} />
                    </Link>
                    <Link
                      to={`/admin/teachers/${item.id}/delete`}
                      className="btn btn-sm btn-square"
                    >
                      <Trash2 size={16} />
                    </Link>
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
