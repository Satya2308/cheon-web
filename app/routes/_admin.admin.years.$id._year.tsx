import { Link, Outlet, useMatches, useParams } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { X } from '~/icons'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'

export const handle = {
  title: 'ឆ្នាំ',
  backable: true,
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }]
}

export default function AdminYearLayout() {
  const { id } = useParams()
  const [year, setYear] = useState<Year | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const basePath = `/admin/years/${id}/`
  const matches = useMatches()
  const last = matches.slice(-1)[0]

  useEffect(() => {
    const fetchYear = async () => {
      if (!id) {
        setError('Year ID not found')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await authApi.get<Year>(`/years/${id}`)
        setYear(res.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status
          if (status === 404) setError('Year not found')
          else if (status === 500) setError('Server error occurred')
          else setError('Failed to load year data')
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchYear()
  }, [id])

  const items = [
    {
      title: 'ថ្នាក់រៀន',
      href: `${basePath}classrooms`,
    },
    {
      title: 'កាលវិភាគគ្រូ',
      href: `${basePath}teachers`,
    },
  ]

  const isActive = (path: string) => {
    return (
      last.pathname === path ||
      (path !== basePath && last.pathname.includes(path))
    )
  }

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <span>{error || 'Year not found'}</span>
        </div>
      )}
      {year && (
        <>
          {' '}
          <div className="flex justify-between mx-3 pb-3 mb-5 border-b border-b-base-200">
            <span className="text-xl">{year.name}</span>
            <Link
              className="btn btn-sm btn-square btn-ghost"
              to="/admin/years"
              title="Years"
            >
              <X size={20} />
            </Link>
          </div>
          <div className="flex gap-2">
            <aside className="w-48">
              <ul className="menu w-full space-y-4">
                {items.map((item) => (
                  <li key={item.title} className="text-lg font-semibold">
                    <Link
                      className={
                        isActive(item.href) ? 'bg-gray-800 text-white' : ''
                      }
                      to={item.href}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="flex-1">
              <Outlet context={{ year }} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
