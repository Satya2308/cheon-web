import { Await, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { Suspense } from 'react'
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

export async function loader() {
  const pendingRes = authApi.get<Year[]>('/years')
  const pendingYears = pendingRes.then((res) => res.data)
  return { pendingYears }
}

export default function ListYearPage() {
  const { pendingYears } = useLoaderData<typeof loader>()

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
        <a href="/admin/years/new" className="btn btn-ghost bg-none text-lg">
          <Plus size={20} />
          បង្កើតថ្មី
        </a>
      </header>
      <Suspense fallback={<LoadingUI />}>
        <Await resolve={pendingYears}>
          {(years) => (
            <>
              {years.length === 0 && (
                <EmptyState
                  actionUrl="/admin/years/new"
                  actionLabel="បង្កើតឆ្នាំថ្មី"
                />
              )}
              {years.length > 0 && (
                <>
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
                            {item.classDuration === '1_hour'
                              ? '1 ម៉ោង'
                              : '1 ម៉ោងកន្លះ'}
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <a
                                href={`/admin/years/${item.id}/classrooms`}
                                className="btn btn-sm btn-square"
                              >
                                <Eye size={16} />
                              </a>
                              <a
                                href={`/admin/years/${item.id}/edit`}
                                className="btn btn-sm btn-square"
                              >
                                <Pen size={16} />
                              </a>
                              <a
                                href={`/admin/years/${item.id}/delete`}
                                className="btn btn-sm btn-square"
                              >
                                <Trash2 size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </>
  )
}
