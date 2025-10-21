// src/pages/Generic/Login.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function isStrongPassword(password: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    return "Password must contain a special character.";
  return null;
}

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("0000");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [verified, setVerified] = useState(false); // ✅ new
  const [answers, setAnswers] = useState({ pet: "", mother: "", teacher: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const DEFAULT_CREDENTIALS = { username: "admin", password: "0000" };
  const DEFAULT_SECURITY = { pet: "dog", mother: "ama", teacher: "mr. smith" };

  const getStoredCredentials = () => {
    const stored = localStorage.getItem("adminCredentials");
    return stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;
  };

  const getSecurity = () => {
    const stored = localStorage.getItem("adminSecurity");
    return stored ? JSON.parse(stored) : DEFAULT_SECURITY;
  };

  const from = location.state?.from?.pathname || "/blog/admin";

  // 🔑 Login Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username: validUser, password: validPass } = getStoredCredentials();

    if (username === validUser && password === validPass) {
      login({ name: "common-admin", role: "executive" });
      navigate(from, { replace: true });
    } else {
      setError("❌ Invalid credentials");
    }
  };

  // 🔑 Step 1: Verify Security Answers
  const handleVerifyAnswers = (e: React.FormEvent) => {
    e.preventDefault();
    const storedSecurity = getSecurity();

    if (
      answers.pet.toLowerCase() !== storedSecurity.pet.toLowerCase() ||
      answers.mother.toLowerCase() !== storedSecurity.mother.toLowerCase() ||
      answers.teacher.toLowerCase() !== storedSecurity.teacher.toLowerCase()
    ) {
      alert("❌ One or more answers are incorrect");
      return;
    }

    setVerified(true); // ✅ move to password reset step
  };

  // 🔑 Step 2: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("⚠️ Passwords do not match");
      return;
    }

    const strengthError = isStrongPassword(newPassword);
    if (strengthError) {
      alert("⚠️ " + strengthError);
      return;
    }

    const creds = getStoredCredentials();
    const updated = { ...creds, password: newPassword };
    localStorage.setItem("adminCredentials", JSON.stringify(updated));

    alert("✅ Password reset successful! Please log in with your new password.");

    // Reset state
    setShowForgot(false);
    setVerified(false);
    setAnswers({ pet: "", mother: "", teacher: "" });
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center text-primary">🔐 Secure Login</h3>

      {!showForgot ? (
        <>
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈 Hide" : "👁 Show"}
                </button>
              </div>
            </div>
            {error && <div className="text-danger mb-2">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-3">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => setShowForgot(true)}
            >
              ❓ Forgot Password?
            </button>
          </div>
        </>
      ) : (
        <>
          {!verified ? (
            // Step 1: Security Questions
            <form onSubmit={handleVerifyAnswers}>
              <p className="text-muted mb-3">
                Answer all security questions to continue.
              </p>
              <div className="mb-3">
                <label>What is the name of your first pet?</label>
                <input
                  type="text"
                  className="form-control"
                  value={answers.pet}
                  onChange={(e) => setAnswers({ ...answers, pet: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label>What is your mother's maiden name?</label>
                <input
                  type="text"
                  className="form-control"
                  value={answers.mother}
                  onChange={(e) => setAnswers({ ...answers, mother: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Who was your favorite teacher?</label>
                <input
                  type="text"
                  className="form-control"
                  value={answers.teacher}
                  onChange={(e) => setAnswers({ ...answers, teacher: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                ✅ Verify Answers
              </button>
            </form>
          ) : (
            // Step 2: Reset Password
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label>New Password</label>
                <input
                  type={showResetPassword ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Confirm New Password</label>
                <input
                  type={showResetPassword ? "text" : "password"}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary mt-2"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                >
                  {showResetPassword ? "🙈 Hide" : "👁 Show"}
                </button>
                <small className="text-muted d-block mt-1">
                  Must be at least 12 characters, with uppercase, lowercase, number, and symbol.
                </small>
              </div>
              <button type="submit" className="btn btn-success w-100">
                🔄 Reset Password
              </button>
            </form>
          )}

          <div className="text-center mt-3">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => {
                setShowForgot(false);
                setVerified(false);
              }}
            >
              ⬅️ Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
}
