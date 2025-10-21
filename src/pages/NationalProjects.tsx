import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageWrapper from "../components/Layout/PageWrapper";

const projects = [
  {
    id: 1,
    title: "Agenda 111 Hospitals",
    description: "Nationwide initiative to build district hospitals across Ghana for universal healthcare access.",
  },
  {
    id: 2,
    title: "One District One Factory (1D1F)",
    description: "Flagship industrialization project aimed at creating jobs and economic growth in each district.",
  },
  {
    id: 3,
    title: "Free SHS Infrastructure Expansion",
    description: "Massive expansion of senior high schools to accommodate increased enrollment under Free SHS.",
  },
];

export default function NationalProjects() {
  return (
    <PageWrapper>
      <Container className="py-5">
        {/* Back Button */}
        <div className="mb-3">
          <Link to="/">
            <Button variant="secondary">← Back to Home</Button>
          </Link>
        </div>

        <h2 className="text-center fw-bold text-primary mb-4">
          🏗️ National Development Projects
        </h2>

        <Row className="g-4">
          {projects.map((project) => (
            <Col md={4} key={project.id}>
              <Card className="h-100 shadow-sm">
                <div
                  style={{
                    height: "200px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontSize: "1rem",
                  }}
                >
                  No Image Available
                </div>
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </PageWrapper>
  );
}
