import { Link } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { useEffect, useState } from 'react'
import { EmptyState, LoadingUI } from '~/component'
import { Eye, Pen, Plus, Trash2 } from '~/icons'
import { authApi } from '~/utils/axios'
import { Year } from '~/types/year'

export const handle = {
  title: 'ឆ្នាំ',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title }]
}

export default function ListYearPage() {
  const [years, setYears] = useState<Year[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Year[]>('/years')
        setYears(res.data)
      } catch (err) {
        setError('Failed to load years. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchYears()
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
        <Link to="/admin/years/new" className="btn btn-ghost bg-none text-lg">
          <Plus size={20} />
          បង្កើតថ្មី
        </Link>
      </header>

      {years.length === 0 && (
        <EmptyState
          actionUrl="/admin/years/new"
          actionLabel="បង្កើតឆ្នាំថ្មី"
        />
      )}

      {years.length > 0 && (
        <table className="table table-auto">
          <thead className="uppercase bg-base-200 text-lg text-black">
            <tr className="font-semibold">
              <th>ឈ្មោះ</th>
              <th>ប្រភេទថ្នាក់</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="text-base">
            {years.map((item) => (
              <tr key={item.id} className="hover">
                <td>{item.name}</td>
                <td>
                  {item.classDuration === '1_hour' ? '1 ម៉ោង' : '1 ម៉ោងកន្លះ'}
                </td>
                <td>
                  <div className="flex gap-1">
                    <Link
                      to={`/admin/years/${item.id}/classrooms`}
                      className="btn btn-sm btn-square"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/admin/years/${item.id}/edit`}
                      className="btn btn-sm btn-square"
                    >
                      <Pen size={16} />
                    </Link>
                    <Link
                      to={`/admin/years/${item.id}/delete`}
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
