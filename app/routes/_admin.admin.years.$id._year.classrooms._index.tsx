import { Await, useLoaderData, useOutletContext } from '@remix-run/react'
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix'
import { Suspense } from 'react'
import { EmptyState, LoadingUI } from '~/component'
import { Eye, Pen, Plus, Trash2 } from '~/icons'
import { Classroom } from '~/types/classroom'
import { Year } from '~/types/year'
import { authApi } from '~/utils/axios'

export const handle = {
  title: 'ឆ្នាំ',
  backref: '/admin/years',
}

export const meta: MetaFunction = () => {
  return [
    {
      title: handle.title,
      backable: handle.backref,
    },
  ]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) throw new Response('Year ID is required', { status: 404 })
  const pendingRes = authApi.get<Classroom[]>(`/years/${id}/classrooms`)
  const pendingClassrooms = pendingRes.then((res) => res.data)
  return { pendingClassrooms }
}

export default function ListClassroomPage() {
  const { year } = useOutletContext<{ year: Year }>()
  const { pendingClassrooms } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<LoadingUI />}>
      <Await resolve={pendingClassrooms}>
        {(classrooms) => (
          <>
            {classrooms.length === 0 && (
              <EmptyState
                actionUrl={`/admin/years/${year.id}/classrooms/new`}
                actionLabel="បង្កើតថ្នាក់រៀនថ្មី"
              />
            )}
            {classrooms.length > 0 && (
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
                  <a
                    href={`/admin/years/${year.id}/classrooms/new`}
                    className="btn btn-ghost bg-none text-lg"
                  >
                    <Plus size={18} />
                    បង្កើតថ្មី
                  </a>
                </header>
                <table className="table table-auto">
                  <thead className="uppercase bg-base-200 text-lg text-black">
                    <tr className="font-semibold">
                      <th>ឈ្មោះ</th>
                      <th>គ្រូបន្ទុក</th>
                      <th>ចំនួនគ្រូ</th>
                      <th>សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="text-base">
                    {classrooms.map((item) => (
                      <tr key={item.id} className="hover">
                        <td>{item.name}</td>
                        <td>{item.teacher.name}</td>
                        <td>{`${item.assignedTimeslots}/${item.totalTimeslots}`}</td>
                        <td>
                          <div className="flex gap-1">
                            <a
                              href={`/admin/years/${year.id}/classrooms/${item.id}`}
                              className="btn btn-sm btn-square"
                            >
                              <Eye size={16} />
                            </a>
                            <a
                              href={`/admin/years/${year.id}/classrooms/${item.id}/edit`}
                              className="btn btn-sm btn-square"
                            >
                              <Pen size={16} />
                            </a>
                            <a
                              href={`/admin/years/${year.id}/classrooms/${item.id}/delete`}
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
  )
}
