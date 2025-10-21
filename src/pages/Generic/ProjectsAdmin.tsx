// src/pages/Generic/ProjectsAdmin.tsx
import { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import PageWrapper from "@components/Layout/PageWrapper";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import ConstituencyNavbar from "@components/Navbars/ConstituencyNavbar";

interface ProjectsAdminProps {
  onAccessGranted?: () => void;
}

type SecQA = {
  q1: string; a1: string;
  q2: string; a2: string;
  q3: string; a3: string;
};

type AdminCreds = {
  username: string;
  password: string;
  isTemp?: boolean;
  secQA?: SecQA;
};

export default function ProjectsAdmin({ onAccessGranted }: ProjectsAdminProps) {
  const { region: regionParam, constituency: constituencyParam } = useParams<{
    region?: string;
    constituency?: string;
  }>();

  const format = (text: string) =>
    text
      .split("-")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ")
      .trim();

  // Title based on scope
  let displayTitle = "";
  if (!regionParam && !constituencyParam) {
    displayTitle = "National Projects";
  } else if (regionParam && !constituencyParam) {
    displayTitle = `${format(regionParam)} Projects`;
  } else if (regionParam && constituencyParam) {
    displayTitle = `${format(constituencyParam)} Projects`;
  } else {
    displayTitle = "Projects";
  }

  const region = regionParam ? format(regionParam) : "National";
  const constituency = constituencyParam ? format(constituencyParam) : "";

  const getCredentialKey = () =>
    `adminCredentials-${region}${constituency ? "-" + constituency : ""}`;

  const DEFAULT_CREDENTIALS: AdminCreds = {
    username: "admin",
    password: "1234",
  };

  const getStoredCredentials = (): AdminCreds => {
    const raw = localStorage.getItem(getCredentialKey());
    return raw ? JSON.parse(raw) : DEFAULT_CREDENTIALS;
  };

  const saveCredentials = (creds: AdminCreds) => {
    localStorage.setItem(getCredentialKey(), JSON.stringify(creds));
  };

  // --- Login state
  const [login, setLogin] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // --- Forgot password flow
  const [showForgot, setShowForgot] = useState(false);
  const [answers, setAnswers] = useState({ a1: "", a2: "", a3: "" });
  const [fpStep, setFpStep] = useState<"questionnaire" | "setTemp" | "done">("questionnaire");
  const [tempPw, setTempPw] = useState({ p1: "", p2: "" });
  const [showTempPw, setShowTempPw] = useState({ p1: false, p2: false });
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const normalize = (s: string) => s.trim().toLowerCase();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const creds = getStoredCredentials();
    if (login.username === creds.username && login.password === creds.password) {
      onAccessGranted?.();
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const verifySecurityAnswers = () => {
    setForgotMsg(null);
    const creds = getStoredCredentials();
    if (!creds.secQA) {
      setForgotMsg(
        "Security questions are not set for this scope yet. Please contact an authorized admin to set them in the dashboard."
      );
      return;
    }
    const ok =
      normalize(answers.a1) === normalize(creds.secQA.a1) &&
      normalize(answers.a2) === normalize(creds.secQA.a2) &&
      normalize(answers.a3) === normalize(creds.secQA.a3);

    if (ok) {
      setFpStep("setTemp");
    } else {
      setForgotMsg("One or more answers are incorrect.");
    }
  };

  const setTemporaryPassword = () => {
    setForgotMsg(null);
    if (!tempPw.p1 || tempPw.p1 !== tempPw.p2) {
      setForgotMsg("Passwords do not match.");
      return;
    }
    const creds = getStoredCredentials();
    saveCredentials({ ...creds, password: tempPw.p1, isTemp: true });
    setFpStep("done");
  };

  return (
    <PageWrapper>
      <ExploreRegionsNavbar />
      {region !== "National" && (
        <ConstituencyNavbar region={region} constituency={constituency} />
      )}

      <Container className="py-5" style={{ maxWidth: 640 }}>
        <h2 className="mb-4 text-center">{displayTitle}</h2>

        {!showForgot ? (
          <Card className="p-4 shadow">
            <h4 className="mb-3 text-center">🔐 Admin Login</h4>

            {loginError && (
              <Alert variant="danger" className="mb-3">
                {loginError}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={login.username}
                  onChange={handleLoginChange}
                  required
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={login.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </Button>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <Button type="submit" variant="primary">
                  Login
                </Button>

                {/* Forgot password link */}
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setForgotMsg(null);
                    setFpStep("questionnaire");
                    setAnswers({ a1: "", a2: "", a3: "" });
                    setTempPw({ p1: "", p2: "" });
                  }}
                >
                  Forgot password?
                </Button>
              </div>
            </Form>
          </Card>
        ) : (
          <Card className="p-4 shadow">
            <div className="d-flex justify-content-between align-items-start">
              <h4 className="mb-3">🔁 Reset Password</h4>
              <Button variant="link" onClick={() => setShowForgot(false)}>
                Back to login
              </Button>
            </div>

            {fpStep === "questionnaire" && (
              <>
                <p className="text-muted mb-3">
                  Answer your security questions to continue.
                </p>

                {forgotMsg && <Alert variant="warning">{forgotMsg}</Alert>}

                {(() => {
                  const creds = getStoredCredentials();
                  if (!creds.secQA) {
                    return (
                      <Alert variant="info" className="mb-0">
                        Security questions haven’t been set yet for this scope.
                        Please log in with the default credentials and set them from the dashboard,
                        or contact an authorized admin.
                      </Alert>
                    );
                  }
                  const { q1, q2, q3 } = creds.secQA;
                  return (
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        verifySecurityAnswers();
                      }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>{q1}</Form.Label>
                        <Form.Control
                          value={answers.a1}
                          onChange={(e) => setAnswers({ ...answers, a1: e.target.value })}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>{q2}</Form.Label>
                        <Form.Control
                          value={answers.a2}
                          onChange={(e) => setAnswers({ ...answers, a2: e.target.value })}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>{q3}</Form.Label>
                        <Form.Control
                          value={answers.a3}
                          onChange={(e) => setAnswers({ ...answers, a3: e.target.value })}
                          required
                        />
                      </Form.Group>

                      <Button type="submit" variant="primary">
                        Continue
                      </Button>
                    </Form>
                  );
                })()}
              </>
            )}

            {fpStep === "setTemp" && (
              <>
                {forgotMsg && <Alert variant="warning">{forgotMsg}</Alert>}
                <Alert variant="info">
                  Set a <strong>temporary</strong> password. After logging in with it,
                  you’ll be asked to replace it permanently in the dashboard.
                </Alert>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setTemporaryPassword();
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Temporary Password</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type={showTempPw.p1 ? "text" : "password"}
                        value={tempPw.p1}
                        onChange={(e) => setTempPw({ ...tempPw, p1: e.target.value })}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowTempPw((s) => ({ ...s, p1: !s.p1 }))}
                      >
                        {showTempPw.p1 ? "🙈" : "👁️"}
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Repeat Temporary Password</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type={showTempPw.p2 ? "text" : "password"}
                        value={tempPw.p2}
                        onChange={(e) => setTempPw({ ...tempPw, p2: e.target.value })}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowTempPw((s) => ({ ...s, p2: !s.p2 }))}
                      >
                        {showTempPw.p2 ? "🙈" : "👁️"}
                      </Button>
                    </div>
                  </Form.Group>

                  <Button type="submit" variant="success">Save Temporary Password</Button>
                </Form>
              </>
            )}

            {fpStep === "done" && (
              <Alert variant="success" className="mb-0">
                Temporary password saved. Go back to the login page and sign in with it,
                then replace it permanently in the dashboard.
              </Alert>
            )}
          </Card>
        )}
      </Container>
    </PageWrapper>
  );
}
