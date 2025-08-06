import { Link } from '@remix-run/react'
import type { ReactNode } from 'react'
import { BeanOff, Plus } from '~/icons'

interface Props {
  message?: string
  actionUrl?: string
  actionLabel?: string
  actionElement?: ReactNode
}

export default function EmptyState({
  message,
  actionUrl,
  actionLabel = 'Create New',
  actionElement,
}: Props) {
  return (
    <div className="w-full min-h-16 flex flex-col gap-4 items-center justify-center bg-base-200/50 rounded-lg p-10">
      <BeanOff size={48} className="opacity-60" />
      <p>{message ? message : 'គ្មានទិន្នន័យ'}</p>
      {actionElement ||
        (actionUrl && (
          <Link to={actionUrl} className="btn btn-sm btn-primary">
            <Plus size={16} />
            {actionLabel}
          </Link>
        ))}
    </div>
  )
}
