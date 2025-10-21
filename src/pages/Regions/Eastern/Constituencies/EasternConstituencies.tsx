// src\pages\Regions\Eastern\Constituencies\EasternConstituencies.tsx

import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageWrapper from "../../../../components/Layout/PageWrapper";
import ExploreRegionsNavbar from "../../../../components/Navbars/ExploreRegionsNavbar";

const constituencies = [
  { name: "Fanteakwa North", path: "/regions/eastern/constituencies/fanteakwa-north" },
  // Add more as you go (e.g.):
  // { name: "Abetifi", path: "/regions/eastern/constituencies/abetifi" },
  // { name: "New Juaben South", path: "/regions/eastern/constituencies/new-juaben-south" },
];

export default function EasternConstituencies() {
  return (
    <PageWrapper>
      <ExploreRegionsNavbar />
       <Container className="py-5">
        <h2 className="text-center fw-bold mb-4">🗳️ Eastern Regional Constituencies</h2>

        <div className="row">
          {constituencies.map((consti, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <Card.Title className="mb-3">{consti.name}</Card.Title>
                  <Link to={consti.path} className="btn btn-outline-primary">
                    Visit Page →
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </PageWrapper>
  );
}
