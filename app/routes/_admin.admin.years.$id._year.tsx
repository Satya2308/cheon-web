import { Outlet, useLoaderData, useMatches } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import axios from 'axios'
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

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) throw new Response('Not found', { status: 404 })
  try {
    const year = await authApi.get<Year>(`/years/${id}`).then((res) => res.data)
    return { year }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 404) throw new Response('Not found', { status: 404 })
      throw new Response('Server error', { status: 500 })
    }
    throw new Response('Unexpected error', { status: 500 })
  }
}

export default function AdminYearLayout() {
  const { year } = useLoaderData<typeof loader>()
  const basePath = `/admin/years/${year.id}/`
  const matches = useMatches()
  const last = matches.slice(-1)[0]

  const items = [
    {
      title: 'ថ្នាក់រៀន',
      href: `${basePath}classrooms`,
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
      <div className="flex justify-between mx-3 pb-3 mb-5 border-b border-b-base-200">
        <span className="text-xl">{year.name}</span>
        <a
          className="btn btn-sm btn-square btn-ghost"
          href="/admin/years"
          title="Years"
        >
          <X size={20} />
        </a>
      </div>
      <div className="flex gap-2">
        <aside className="w-48">
          <ul className="menu w-full">
            {items.map((item) => (
              <li key={item.title} className="text-lg font-semibold">
                <a
                  className={
                    isActive(item.href) ? 'bg-gray-800 text-white' : ''
                  }
                  href={item.href}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div className="flex-1">
          <Outlet context={{ year }} />
        </div>
      </div>
    </>
  )
}
