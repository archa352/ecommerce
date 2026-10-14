import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { LoginRole } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

function Login() {
  const { user, login, notice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<LoginRole>("admin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";
  if (user) return <Navigate to={from} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your email or phone and password.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await login(role, identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card form" onSubmit={submit} noValidate>
        <h2>Zeen Admin</h2>
        {notice && <div className="notice">{notice}</div>}
        <div className="tabs" role="tablist">
          {(["admin", "staff"] as LoginRole[]).map((r) => (
            <button type="button" key={r} role="tab" aria-selected={role === r} className={role === r ? "active" : ""} onClick={() => setRole(r)}>
              {r === "admin" ? "Admin" : "Staff"}
            </button>
          ))}
        </div>
        <label className="field">
          <span className="field-label">Email or phone</span>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <div className="status status-error" role="alert">{error}</div>}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default Login;
