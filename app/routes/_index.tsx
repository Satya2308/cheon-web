import { redirect } from '@remix-run/node'

export function loader() {
  return redirect('/admin/teachers')
}

export default function Index() {
  return null
}