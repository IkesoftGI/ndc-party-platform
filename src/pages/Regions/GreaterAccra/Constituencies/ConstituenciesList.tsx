// src/pages/Regions/GreaterAccra/ConstituencyList.tsx

import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import ExploreRegionsNavbar from "@components/Navbars/ExploreRegionsNavbar";
import RegionalNavbar from "@components/Navbars/RegionalNavbar";

const constituencies = [
  "Dome-Kwabenya",
  "Ablekuma North",
  "Ablekuma Central",
  "Ablekuma South",
  "Ablekuma West",
  "Okaikwei North",
  "Okaikwei Central",
  "Okaikwei South",
  "Ayawaso West Wuogon",
  "Ayawaso East",
  "Ayawaso Central",
  "Ayawaso North",
  "Korle Klottey",
  "Dadekotopon",
  "Ledzokuku",
  "Krowor",
  "Tema East",
  "Tema West",
  "Tema Central",
  "Ashaiman",
  "Adenta",
  "Madina",
  "Shai Osudoku",
  "Ningo Prampram",
  "Sege",
  "Kpone Katamanso",
  "Amasaman",
  "Odododiodioo",
  "Bortianor-Ngleshie Amanfro",
  "Anyaa Sowutuom",
  "Trobu",
  "Ada",
  "Weija Gbawe",
  "Domeabra Obom",
];

export default function ConstituencyList() {
  return (
    <PageWithFlagBackground title="Greater Accra Region Constituencies">
      <ExploreRegionsNavbar />
      <RegionalNavbar region="Greater Accra" />

      <Container className="py-4">
        <h2 className="text-center mb-4 text-primary fw-bold">
          🗳️ Greater Accra Constituencies
        </h2>

        <Row>
          {constituencies.map((name) => (
            <Col key={name} md={6} lg={4} className="mb-4">
              <Link
                to={`/regions/greater-accra/constituencies/${name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="text-decoration-none"
              >
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-primary fw-bold">{name}</Card.Title>
                    <Card.Text>Click to view details</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </PageWithFlagBackground>
  );
}
