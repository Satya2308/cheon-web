import { Await, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@vercel/remix'
import { Suspense } from 'react'
import { EmptyState, LoadingUI } from '~/component'
import { Eye, Pen, Plus, Trash2 } from '~/icons'
import { authApi } from '~/utils/axios'
import { Response } from './type'

export const handle = {
  title: 'គ្រូ',
}

export const meta: MetaFunction = () => {
  return [{ title: handle.title }]
}

export async function loader() {
  const pendingRes = authApi.get<Response>('/teacher')
  const pendingTeachers = pendingRes.then((res) => res.data)
  return { pendingTeachers }
}

export default function AdminTeachers() {
  const { pendingTeachers } = useLoaderData<typeof loader>()

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
        <a href="/admin/teachers/new" className="btn btn-ghost bg-none text-lg">
          <Plus size={20} />
          បង្កើតថ្មី
        </a>
      </header>
      <Suspense fallback={<LoadingUI />}>
        <Await resolve={pendingTeachers}>
          {(teachers) => (
            <>
              {teachers.length === 0 && (
                <EmptyState
                  actionUrl="/admin/teachers/new"
                  actionLabel="បង្កើតលោកគ្រូថ្មី"
                />
              )}
              {teachers.length > 0 && (
                <>
                  <table className="table table-auto">
                    <thead className="uppercase bg-base-200 text-lg text-black">
                      <tr>
                        <th>លេខរៀង</th>
                        <th>ឈ្មោះ</th>
                        <th>លេខកូដ</th>
                        <th>លេខទូរស័ព្ទ</th>
                        <th>មុខវិជ្ជាបង្រៀន</th>
                        <th>សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody className="text-lg">
                      {teachers.map((item) => (
                        <tr key={item.id} className="hover">
                          <td className="text-base font-bold">{item.id}</td>
                          <td>{item.name}</td>
                          <td className="text-base">{item.code}</td>
                          <td className="text-base">{item.user.phone}</td>
                          <td>{item.subject}</td>
                          <td>
                            <div className="flex gap-1">
                              <a
                                href={`/admin/teachers/${item.id}`}
                                className="btn btn-sm btn-square"
                              >
                                <Eye size={16} />
                              </a>
                              <a
                                href={`/admin/teachers/${item.id}/edit`}
                                className="btn btn-sm btn-square"
                              >
                                <Pen size={16} />
                              </a>
                              <a
                                href={`/admin/teachers/${item.id}/delete`}
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
