import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

interface RegionalNavbarProps {
  region: string;
}

export default function RegionalNavbar({ region }: RegionalNavbarProps) {
  const location = useLocation();

  const basePath = `/regions/${region.toLowerCase().replace(/\s+/g, "-")}`;

  const navLinks = [
    { name: "Regional Minister's Office", path: `${basePath}/minister` },
    { name: "Executives", path: `${basePath}/executives` },
    { name: "Council of Elders", path: `${basePath}/council-of-elders` },
    { name: "Projects", path: `${basePath}/projects` },
    { name: "Blog", path: `${basePath}/blog` },
    { name: "Donate", path: `${basePath}/donate` },
    { name: "Login", path: `${basePath}/login` },
  ];

  return (
    <Navbar bg="light" expand="lg" className="border-bottom shadow-sm mb-3">
      <Container>
        <Navbar.Brand className="fw-bold text-primary">
          {region} Region
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="regional-navbar-nav" />
        <Navbar.Collapse id="regional-navbar-nav">
          <Nav className="ms-auto">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.name}
                as={Link}
                to={link.path}
                active={location.pathname.startsWith(link.path)}
                className="fw-semibold"
              >
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
