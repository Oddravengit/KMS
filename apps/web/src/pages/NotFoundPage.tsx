import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="workspace-card" aria-label="Page not found">
      <h1>Page not found</h1>
      <p>This workspace page does not exist.</p>
      <Link to="/dashboard">Return to Dashboard</Link>
    </section>
  );
}
