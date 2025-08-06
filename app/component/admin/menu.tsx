import { Link } from '@remix-run/react'
import clsx from 'clsx'
import { Teacher, Year } from '~/icons'
import type { IconProps } from '~/types/icons'

interface Props {
  pathname: string
}

export default function SideMenu({ pathname }: Props) {
  const basePath = '/admin'

  const menus = [
    {
      title: 'គ្រូ',
      href: `${basePath}/teachers`,
      Icon: Teacher,
    },
    {
      title: 'ឆ្នាំ',
      href: `${basePath}/years`,
      Icon: Year,
    },
  ]

  const isActive = (path: string) => {
    return pathname === path || (path !== basePath && pathname.includes(path))
  }

  const item = (title: string, href: string, Icon: React.FC<IconProps>) => {
    const active = isActive(href) ? 'bg-gray-800 text-white' : ''
    return (
      <Link to={href} title={title} className={clsx('space-x-2', active)}>
        <Icon size={20} />
        <span className="font-semibold">{title}</span>
      </Link>
    )
  }

  return (
    <div className="p-2">
      <ul className="menu space-y-2 w-full">
        {menus.map((menu) => (
          <li key={menu.title} className="text-lg">
            {item(menu.title, menu.href, menu.Icon)}
          </li>
        ))}
      </ul>
    </div>
  )
}
