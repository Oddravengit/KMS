import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  className?: string;
};

export function Breadcrumb({ items, maxVisibleItems = 4, className = "" }: BreadcrumbProps) {
  if (items.length === 0) return null;
  const shouldCollapse = items.length > maxVisibleItems;
  const visibleItems = shouldCollapse ? [items[0], items[items.length - 1]] : items;
  const hiddenItems = shouldCollapse ? items.slice(1, -1) : [];
  const renderItem = (item: BreadcrumbItem, index: number, last: boolean): ReactNode => {
    const content = item.href && !last ? <Link to={item.href}>{item.label}</Link> : <span aria-current={last ? "page" : undefined}>{item.label}</span>;
    return <li key={`${item.label}-${index}`}>{content}</li>;
  };
  return (
    <nav className={`breadcrumb ${className}`.trim()} aria-label="Breadcrumb">
      <ol>
        {shouldCollapse && <li className="breadcrumb-overflow"><details><summary aria-label="Show hidden breadcrumb items">…</summary><div>{hiddenItems.map((item, index) => renderItem(item, index, false))}</div></details></li>}
        {visibleItems.map((item, index) => renderItem(item, index, index === visibleItems.length - 1))}
      </ol>
    </nav>
  );
}
