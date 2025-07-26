import { redirect } from '@remix-run/react'

export async function loader() {
  return redirect('/admin/teachers')
}

export default function Index() {
  return <div>Welcome to BBK</div>
}
