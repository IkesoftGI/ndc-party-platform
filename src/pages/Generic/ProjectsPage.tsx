// src/pages/Generic/ProjectPage.tsx
import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ProjectsAdmin from "@pages/Generic/ProjectsAdmin";
import ProjectAdminDashboard from "@components/Admin/ProjectAdminDashboard";
import Project from "@components/Project";
import { norm } from "../../utils/norm";


interface Scope {
  level: string;
  region?: string;
  constituency?: string;
}

export default function ProjectPage() {
  const { region, constituency } = useParams();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const scope: Scope = {
    level: constituency ? "constituency" : region ? "region" : "national",
    region: region ? norm(region) : undefined,
    constituency: constituency ? norm(constituency) : undefined,
  };

  // ✅ Decide scope title
  const format = (text: string) =>
    text
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  let displayTitle = "";
  if (!region && !constituency) {
    displayTitle = "National Projects";
  } else if (region && !constituency) {
    displayTitle = `${format(region)} Projects`;
  } else if (region && constituency) {
    displayTitle = `${format(constituency)} Projects`;
  } else {
    displayTitle = "Projects";
  }

  const handleAdminLogin = () => setShowAdminLogin(true);
  const handleFormSuccess = () => {
    setShowAdminForm(false);
    setShowAdminLogin(false);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">{displayTitle}</h2>

      {!showAdminLogin && !showAdminForm && (
        <div className="text-end mb-3">
          <Button variant="secondary" onClick={handleAdminLogin}>
            Admin
          </Button>
        </div>
      )}

      {showAdminLogin && !showAdminForm && (
        <ProjectsAdmin onAccessGranted={() => setShowAdminForm(true)} />
      )}

      {showAdminForm && (
        <ProjectAdminDashboard scope={scope} onSave={handleFormSuccess} />
      )}

      <Project scope={scope} />
    </Container>
  );
}
