// src\components\Navbars\ConstituencyNavbar.tsx

import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

interface ConstituencyNavbarProps {
  region: string;
  constituency: string;
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function ConstituencyNavbar({
  region,
  constituency,
}: ConstituencyNavbarProps) {
  const basePath = `/regions/${slugify(region)}/constituencies/${slugify(
    constituency
  )}`;

  return (
    <Navbar bg="light" expand="lg" className="border-bottom shadow-sm">
      <Container>
        <Navbar.Brand className="fw-bold">
          {constituency.toUpperCase()} Constituency
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="constituency-navbar" />
        <Navbar.Collapse id="constituency-navbar">
          <Nav className="ms-auto">
            <NavLink to={`${basePath}/mp`} className="nav-link">
              MP Office
            </NavLink>

            {/* ✅ Added MMDCE Office link */}
            <NavLink to={`${basePath}/mmdce`} className="nav-link">
              MMDCE Office
            </NavLink>

            <NavLink to={`${basePath}/executives`} className="nav-link">
              Executives
            </NavLink>

            <NavLink to={`${basePath}/council-of-elders`} className="nav-link">
              Council of Elders
            </NavLink>

            <NavLink
              to={`${basePath}/c-dinators`}
              className="nav-link"
            >
              Electoral Area Coordinators
            </NavLink>            

            <NavLink to={`${basePath}/polling-stations`} className="nav-link">
              Polling Stations
            </NavLink> 
              
            <NavLink to={`${basePath}/blog`} className="nav-link">
              Blog
            </NavLink>

            <NavLink to={`${basePath}/projects`} className="nav-link">
              Projects
            </NavLink>

            <NavLink to={`${basePath}/donate`} className="nav-link">
              Donate
            </NavLink>

            <NavLink to={`${basePath}/login`} className="nav-link">
              Login
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
