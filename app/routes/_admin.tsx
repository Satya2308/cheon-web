import {
  Link,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
} from '@remix-run/react'
import { useEffect } from 'react'
import { SideMenu } from '~/component'
import { useAuth } from '~/contexts/authContext'
import { ChevronLeft, Logout } from '~/icons'

export default function AdminLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const matches = useMatches()
  const m = matches.slice(-1)[0] // last item
  const h = m.handle as { title?: string; backref?: string } | undefined
  const title = h?.title ?? ''
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: '/avatar.png',
    role: 'admin',
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-60 bg-base-200">
        <header className="border-b border-b-base-300">
          <div className="h-14 flex justify-between items-center p-4">
            <div className="flex max-w-32 text-gray-900 text-2xl font-semibold">
              បឹងកេងកង
            </div>
          </div>
        </header>
        <div>
          <SideMenu pathname={location.pathname} />
        </div>
      </aside>
      <div className="flex-1">
        <header className="border-b border-b-base-300">
          <div className="h-14 flex justify-between items-center p-4">
            <div className="flex gap-2 items-center">
              {h?.backref && (
                <Link className="btn btn-sm btn-square" to={h.backref}>
                  <ChevronLeft size={23} />
                </Link>
              )}
              <h2 className="text-2xl text-gray-800 font-semibold">{title}</h2>
            </div>
            <div className="text-right">
              {user && (
                <div className="mr-4">
                  <Link
                    className="btn btn-square btn-sm btn-ghost"
                    to="/logout"
                    title="Logout"
                  >
                    <Logout size={20} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main>
          <div className="p-4 pb-24 h-screen overflow-hidden overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
