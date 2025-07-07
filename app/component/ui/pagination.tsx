import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "~/icons";
import type { IconProps } from "~/types/icons";

interface Props {
  page: number;
  pageCount: number;
  pageUrl: URL;
}

export default function Pagination({ page, pageCount, pageUrl }: Props) {
  const itemLink = (pageNum: number) => {
    const url = new URL(pageUrl);
    const hasPage = url.searchParams.has("page");
    if (!hasPage && pageNum > 1)
      url.searchParams.append("page", pageNum.toString());
    if (hasPage && pageNum > 1)
      url.searchParams.set("page", pageNum.toString());
    if (hasPage && pageNum === 1) url.searchParams.delete("page");
    return url.toString();
  };

  const Item = (props: {
    key?: number;
    href: string;
    active?: boolean;
    text?: string;
    Icon?: React.FC<IconProps>;
  }) => {
    const activeCls = `${props.active ? "btn-active btn-disabled" : ""}`;
    return (
      <a href={props.href} className={`btn btn-ghost ${activeCls}`}>
        {props.Icon && <props.Icon width={20} />}
        {props.text && <span>{props.text}</span>}
      </a>
    );
  };

  const midItems = (i: number) => {
    let num = page + i;
    if (page > 1 && page <= pageCount) num = page + i - 1;
    if (page === pageCount && pageCount > 2) num = page + i - 2;
    return (
      <Item
        key={i}
        href={itemLink(num)}
        active={num === page}
        text={num.toString()}
      />
    );
  };

  const DotItem = () => (
    <span className="flex items-center px-3 py-2">...</span>
  );

  const edge = pageCount > 3;
  const firstUrl = edge && page > 2 ? itemLink(1) : null;
  const lastUrl = edge && page < pageCount - 1 ? itemLink(pageCount) : null;
  const prevUrl = edge && page > 3 ? itemLink(page - 1) : null;
  const nextUrl = edge && page < pageCount - 1 ? itemLink(page + 1) : null;

  return (
    <>
      {pageCount > 1 && (
        <div className="inline-flex gap-2 items-center">
          {firstUrl && <Item href={firstUrl} Icon={ChevronFirst} />}
          {prevUrl && <Item href={prevUrl} Icon={ChevronLeft} />}
          {edge && page > 2 && <DotItem />}
          {Array.from({ length: pageCount > 2 ? 3 : 2 }, (_, i) => midItems(i))}
          {edge && page < pageCount - 1 && <DotItem />}
          {nextUrl && <Item href={nextUrl} Icon={ChevronRight} />}
          {lastUrl && <Item href={lastUrl} Icon={ChevronLast} />}
        </div>
      )}
    </>
  );
}
