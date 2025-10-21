// src/components/Admin/ProjectAdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { Container, Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import type { Project } from "../../types/Project";

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

interface Scope {
  level: string; // "national" | "region" | "constituency"
  region?: string; // Title Case
  constituency?: string; // Title Case
}

export default function ProjectAdminDashboard({
  scope,
  onSave,
}: {
  scope: Scope;
  onSave: () => void;
}) {
  // ---- helpers
  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
  const getCredentialKey = useMemo(() => {
    const region = scope.region ?? "National";
    const c = scope.constituency ? "-" + scope.constituency : "";
    return `adminCredentials-${region}${c}`;
  }, [scope.region, scope.constituency]);

  const getStoredCredentials = (): AdminCreds => {
    const raw = localStorage.getItem(getCredentialKey);
    return raw ? JSON.parse(raw) : { username: "admin", password: "1234" };
  };
  const saveCredentials = (creds: AdminCreds) =>
    localStorage.setItem(getCredentialKey, JSON.stringify(creds));

  // ---- banner if temp password or missing security QAs
  const [creds, setCreds] = useState<AdminCreds>(getStoredCredentials());
  useEffect(() => setCreds(getStoredCredentials()), [getCredentialKey]);

  // ---- project form
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "Health" as Project["category"],
    status: "Ongoing" as Project["status"],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const region = scope.region ?? "National";
    const constituency = scope.constituency ?? "";

    const newProject: Project = {
      id: uuidv4(),
      title: form.title,
      description: form.description,
      image: form.image,
      category: form.category,
      status: form.status,
      region,
      constituency,
    };

    const existing = JSON.parse(localStorage.getItem("constituencyProjects") || "[]");
    localStorage.setItem("constituencyProjects", JSON.stringify([...existing, newProject]));

    onSave();
  };

  // ---- credential replacement (inside dashboard)
  const [showCreds, setShowCreds] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(creds.username || "");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [qa, setQa] = useState<SecQA>({
    q1: creds.secQA?.q1 || "Enter your first security question",
    a1: "",
    q2: creds.secQA?.q2 || "Enter your second security question",
    a2: "",
    q3: creds.secQA?.q3 || "Enter your third security question",
    a3: "",
  });

  const [pwVisible, setPwVisible] = useState({ newPw: false, repeat: false, current: false });
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSaveCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg(null);

    const stored = getStoredCredentials();

    // verify current password
    if (currentPassword !== stored.password) {
      setSaveMsg("Current password is incorrect.");
      return;
    }
    // new password match
    if (!newPassword || newPassword !== repeatPassword) {
      setSaveMsg("New passwords do not match.");
      return;
    }
    // require answers for security questions
    if (!qa.a1 || !qa.a2 || !qa.a3) {
      setSaveMsg("Please provide answers to all security questions.");
      return;
    }

    const updated: AdminCreds = {
      username: newUsername || stored.username,
      password: newPassword,
      isTemp: false,
      secQA: {
        q1: qa.q1,
        a1: qa.a1,
        q2: qa.q2,
        a2: qa.a2,
        q3: qa.q3,
        a3: qa.a3,
      },
    };

    saveCredentials(updated);
    setCreds(updated);
    setCurrentPassword("");
    setNewPassword("");
    setRepeatPassword("");
    setQa({
      q1: updated.secQA!.q1,
      a1: "",
      q2: updated.secQA!.q2,
      a2: "",
      q3: updated.secQA!.q3,
      a3: "",
    });
    setSaveMsg("✅ Credentials updated successfully.");
  };

  return (
    <Container className="py-4">      
      {/* Banners */}
      {creds.isTemp && (
        <Alert variant="warning" className="mb-3">
          You are currently using a <strong>temporary</strong> password. Please change it below.
        </Alert>
      )}      

      {/* Publish Project */}
      <Card className="p-4 shadow mb-4">
        <h4 className="mb-3">+ Publish New Development Project</h4>
        <Form onSubmit={handlePublish}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
  <Form.Group>
    <Form.Label>Image</Form.Label>
    <Form.Control
      name="image"
      value={form.image}
      onChange={handleChange}
      placeholder="Paste an image URL or upload a file below"
    />
    <Form.Control
      type="file"
      accept="image/*"
      className="mt-2"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  }
}}

    />
    {form.image && (
      <img
        src={form.image}
        alt="Preview"
        style={{ marginTop: "10px", maxHeight: "120px", borderRadius: "6px" }}
      />
    )}
  </Form.Group>
</Col>

          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Delayed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Health</option>
                  <option>Education</option>
                  <option>Roads</option>
                  <option>Water</option>
                  <option>IT</option>
                  <option>Agric</option>
                  <option>Human-Centered</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="success">Publish Project</Button>
        </Form>
      </Card>

      {/* Admin Settings */}
      <Card className="p-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">🔒 Admin Settings</h5>
          <Button variant={showCreds ? "secondary" : "warning"} onClick={() => setShowCreds(s => !s)}>
            {showCreds ? "Hide" : "Change Admin Credentials"}
          </Button>
        </div>

        {showCreds && (
          <>
            {saveMsg && <Alert variant={saveMsg.startsWith("✅") ? "success" : "danger"}>{saveMsg}</Alert>}
            <Form onSubmit={handleSaveCreds}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type={pwVisible.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setPwVisible(s => ({ ...s, current: !s.current }))}
                      >
                        {pwVisible.current ? "🙈" : "👁️"}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Username</Form.Label>
                    <Form.Control
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Leave as-is to keep current"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type={pwVisible.newPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setPwVisible(s => ({ ...s, newPw: !s.newPw }))}
                      >
                        {pwVisible.newPw ? "🙈" : "👁️"}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Repeat New Password</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type={pwVisible.repeat ? "text" : "password"}
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setPwVisible(s => ({ ...s, repeat: !s.repeat }))}
                      >
                        {pwVisible.repeat ? "🙈" : "👁️"}
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-3" />
              <h6 className="mb-3">Security Questions (for “Forgot password”)</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question 1</Form.Label>
                    <Form.Control
                      value={qa.q1}
                      onChange={(e) => setQa({ ...qa, q1: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 1</Form.Label>
                    <Form.Control
                      value={qa.a1}
                      onChange={(e) => setQa({ ...qa, a1: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question 2</Form.Label>
                    <Form.Control
                      value={qa.q2}
                      onChange={(e) => setQa({ ...qa, q2: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 2</Form.Label>
                    <Form.Control
                      value={qa.a2}
                      onChange={(e) => setQa({ ...qa, a2: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question 3</Form.Label>
                    <Form.Control
                      value={qa.q3}
                      onChange={(e) => setQa({ ...qa, q3: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 3</Form.Label>
                    <Form.Control
                      value={qa.a3}
                      onChange={(e) => setQa({ ...qa, a3: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="dark">Update Credentials</Button>
            </Form>
          </>
        )}
      </Card>
    </Container>
  );
}
