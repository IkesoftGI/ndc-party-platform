// src/components/Footer.tsx

import { Container } from "react-bootstrap";
import ndcLogo from "../assets/NDC.png";

export default function Footer() {
  return (
    <footer className="bg-light text-center py-4 border-top mt-5">
      <Container>
        <img
          src={ndcLogo}
          alt="ndc Logo"
          width={40}
          height={40}
          className="mb-2"
        />
        <h5 className="fw-bold mb-2">New Patriotic Party Platform</h5>
        <p className="mb-1">© 2025 IKESOFT. All rights reserved.</p>

        {/* ✅ Electoral Commission Link */}
        <p className="text-muted mb-0">
          Official reference:{" "}
          <a
            href="https://ec.gov.gh"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-semibold text-decoration-underline"
          >
            Electoral Commission of Ghana
          </a>
        </p>
      </Container>
    </footer>
  );
}
