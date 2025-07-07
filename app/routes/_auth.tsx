import { Outlet } from "@remix-run/react"
import type { LinksFunction } from "@vercel/remix"
import styles from "~/styles/home.css?url"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full text-center py-6 text-black">
        BKK
      </div>

      <div className="flex-grow flex items-center justify-center">
        <main className="w-full max-w-md mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
