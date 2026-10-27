import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <section className="workspace-card" aria-label="Login preview">
      <h1>Login placeholder</h1>
      <p>Sign-in will be available after the authentication service is connected.</p>
      <small>This is a frontend preview. No credentials are collected or verified.</small>
      <p><Link to="/dashboard">View Dashboard preview</Link></p>
    </section>
  );
}
