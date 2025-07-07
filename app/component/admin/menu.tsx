import { Teacher } from "~/icons";
import type { IconProps } from "~/types/icons";

interface Props {
  pathname: string;
}

export default function SideMenu({ pathname }: Props) {
  const basePath = "/admin/";

  const menus = [
    {
      title: "Teachers",
      href: `${basePath}`,
      Icon: Teacher,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || (path !== basePath && pathname.includes(path));
  };

  const item = (title: string, href: string, Icon: React.FC<IconProps>) => {
    const active = isActive(href) ? "active" : "";
    return (
      <a href={href} title={title} className={active}>
        <Icon size={18} />
        <span>{title}</span>
      </a>
    );
  };

  return (
    <div className="p-2">
      <ul className="menu">
        {menus.map((menu) => (
          <li key={menu.title}>{item(menu.title, menu.href, menu.Icon)}</li>
        ))}
      </ul>
    </div>
  );
}
