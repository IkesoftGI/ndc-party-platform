// src/components/Project.tsx

import { useEffect, useState } from "react";
import { Card, Row, Col, Alert, Badge, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import type { Project } from "../types/Project";
import CommentSection from "@components/CommentSection";

type ReactionKey = "like" | "love" | "wow" | "sad" | "angry";
type Reactions = Record<ReactionKey, number>;
const defaultReactions: Reactions = { like: 0, love: 0, wow: 0, sad: 0, angry: 0 };

export default function Project({ scope }: { scope: any }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const norm = (s?: string) => (s ?? "").trim().toLowerCase();

  // ✅ Fetch projects from backend
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (scope?.region) params.region = scope.region;
        if (scope?.constituency) params.constituency = scope.constituency;

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, { params });
        if (res.data.ok) {
          setProjects(res.data.data);
        } else {
          setError("Failed to fetch projects");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [scope]);

  // 🕓 Loading and error handling
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (projects.length === 0) return <Alert variant="info">No projects found.</Alert>;

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "success";
      case "completed":
        return "primary";
      case "delayed":
        return "danger";
      default:
        return "secondary";
    }
  };

  // 🔎 Filters and search
  let visibleProjects = projects.filter(
    (p) =>
      (statusFilter === "All" || p.status?.toLowerCase() === statusFilter.toLowerCase()) &&
      (categoryFilter === "All" || p.category === categoryFilter) &&
      (p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()))
  );

  // 🔄 Sorting
  if (sortOrder === "newest") {
    visibleProjects = [...visibleProjects].sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  } else if (sortOrder === "status") {
    const order = { ongoing: 1, completed: 2, delayed: 3 };
    visibleProjects = [...visibleProjects].sort(
      (a, b) => (order[a.status?.toLowerCase() as keyof typeof order] || 4) -
                (order[b.status?.toLowerCase() as keyof typeof order] || 4)
    );
  }

  // 👍 Reactions (localStorage-based)
  const getReactions = (id: string): Reactions => {
    try {
      const saved = localStorage.getItem(`project-reactions-${id}`);
      return saved ? { ...defaultReactions, ...JSON.parse(saved) } : defaultReactions;
    } catch {
      return defaultReactions;
    }
  };

  const getUserReaction = (id: string): ReactionKey | null => {
    return localStorage.getItem(`project-userReaction-${id}`) as ReactionKey | null;
  };

  const handleReaction = (id: string, type: ReactionKey) => {
    const current = getReactions(id);
    const prev = getUserReaction(id);
    if (prev === type) return;

    if (prev) current[prev] = Math.max(0, current[prev] - 1);
    current[type] = (current[type] || 0) + 1;

    localStorage.setItem(`project-reactions-${id}`, JSON.stringify(current));
    localStorage.setItem(`project-userReaction-${id}`, type);

    setProjects((prev) => [...prev]); // trigger re-render
  };

  return (
    <>
      {/* Filters */}
      <Row className="mb-3 g-2">
        <Col xs={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={6} md={4}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">Status: All</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={4}>
          <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">Category: All</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Roads">Roads</option>
            <option value="Water">Water</option>
            <option value="IT">IT</option>
            <option value="Agric">Agric</option>
            <option value="Human-Centered">Human-Centered</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Sorting */}
      <Form.Select className="mb-3" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="newest">Newest First</option>
        <option value="status">Group by Status</option>
      </Form.Select>

      {/* Cards */}
      <Row className="g-4">
        {visibleProjects.length === 0 ? (
          <Alert variant="warning">No projects match your filters.</Alert>
        ) : (
          visibleProjects.map((proj) => {
            // ✅ Safe project ID (fixes TypeScript errors)
            const projectId = proj._id || proj.id || `local-${Math.random().toString(36).slice(2)}`;

            const reactions = getReactions(projectId);
            const isExpanded = expanded[projectId] || false;
            const preview = proj.description?.slice(0, 120) || "";

            return (
              <Col xs={12} md={6} lg={4} key={projectId}>
                <Card className="shadow-sm h-100">
                  {proj.photo && (
                    <Card.Img
                      variant="top"
                      src={`${import.meta.env.VITE_BACKEND_URL}${proj.photo}`}
                      onError={(e) => (e.currentTarget.src = "/No Image Available.png")}
                      style={{ maxHeight: 200, objectFit: "cover" }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="fw-bold">{proj.title}</Card.Title>
                      <div className="text-end">
                        {proj.region?.toLowerCase() === "national" ? (
                          <Badge bg="dark" className="me-1">🌍 National</Badge>
                        ) : proj.constituency ? (
                          <Badge bg="info" className="me-1">📍 {proj.constituency}</Badge>
                        ) : (
                          <Badge bg="secondary" className="me-1">🏙️ {proj.region}</Badge>
                        )}
                        <Badge bg={getStatusVariant(proj.status || "")} className="me-1">
                          {proj.status}
                        </Badge>
                        <Badge bg="secondary">{proj.category}</Badge>
                      </div>
                    </div>

                    <Card.Text className="flex-grow-1">
                      {isExpanded
                        ? proj.description
                        : preview + (proj.description?.length > 120 ? "..." : "")}
                    </Card.Text>

                    {proj.description?.length > 120 && (
                      <Button
                        variant="link"
                        className="p-0 mb-2"
                        onClick={() =>
                          setExpanded((prev) => ({ ...prev, [projectId]: !isExpanded }))
                        }
                      >
                        {isExpanded ? "Read less" : "Read more"}
                      </Button>
                    )}

                    {/* Reactions */}
                    <div className="d-flex gap-2 flex-wrap mb-2">
                      <Button size="sm" variant="outline-primary" onClick={() => handleReaction(projectId, "like")}>
                        👍 {reactions.like}
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleReaction(projectId, "love")}>
                        ❤️ {reactions.love}
                      </Button>
                      <Button size="sm" variant="outline-warning" onClick={() => handleReaction(projectId, "wow")}>
                        😮 {reactions.wow}
                      </Button>
                      <Button size="sm" variant="outline-info" onClick={() => handleReaction(projectId, "sad")}>
                        😢 {reactions.sad}
                      </Button>
                      <Button size="sm" variant="outline-dark" onClick={() => handleReaction(projectId, "angry")}>
                        😡 {reactions.angry}
                      </Button>
                    </div>

                    {/* Comments */}
                    <CommentSection type="project" id={projectId} />
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </>
  );
}
