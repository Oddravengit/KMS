import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, breadcrumbs, actions, className = "" }: PageHeaderProps) {
  return (
    <header className={`page-header ${className}`.trim()}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="page-header-row">
        <div className="page-header-copy">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </header>
  );
}
