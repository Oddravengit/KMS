import { Link } from "react-router-dom";
import { Icon } from "./Icon";

export type TopbarIconButtonKind = "quick-action" | "messages";

type TopbarIconButtonProps = {
  kind: TopbarIconButtonKind;
  label: string;
  to?: string;
  onClick?: () => void;
  interactive?: boolean;
};

export function TopbarIconButton({ kind, label, to, onClick, interactive = true }: TopbarIconButtonProps) {
  const content = <Icon name={kind} />;
  if (!interactive) return <span className="topbar-icon-button" aria-label={label}>{content}</span>;
  if (to) {
    return <Link className="topbar-icon-button" to={to} aria-label={label}>{content}</Link>;
  }
  return <button className="topbar-icon-button" type="button" aria-label={label} onClick={onClick}>{content}</button>;
}
