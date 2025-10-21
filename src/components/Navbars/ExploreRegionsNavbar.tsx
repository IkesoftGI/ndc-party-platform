// src/components/ExploreRegionsNavbar.tsx

import { Navbar, Container } from "react-bootstrap";

export default function ExploreRegionsNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container className="justify-content-center">
        <span className="navbar-text fw-bold text-white">
          {/* You can replace or remove this text entirely */}
        </span>
      </Container>
    </Navbar>
  );
}
