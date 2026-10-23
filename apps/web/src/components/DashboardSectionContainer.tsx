import type { ReactNode } from "react";

export type DashboardSectionState = "default" | "loading" | "empty" | "error";

type DashboardSectionContainerProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  state?: DashboardSectionState;
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
};

export function DashboardSectionContainer({ title, description, actions, children, state = "default", emptyMessage = "No data available.", errorMessage = "Unable to load this section.", className = "" }: DashboardSectionContainerProps) {
  const content = state === "loading" ? <div className="section-state" role="status" aria-label={`${title} loading`}><span className="loading-skeleton" /><span className="loading-skeleton short" /></div> : state === "empty" ? <p className="section-state" role="status">{emptyMessage}</p> : state === "error" ? <p className="section-state section-error" role="alert">{errorMessage}</p> : children;
  return (
    <section className={`dashboard-section-container ${className}`.trim()} aria-busy={state === "loading"}>
      <div className="dashboard-section-header">
        <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
        {actions && <div className="dashboard-section-actions">{actions}</div>}
      </div>
      <div className="dashboard-section-content">{content}</div>
    </section>
  );
}
