// src/pages/National/Council/N-Council2020_2024.tsx

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageWithFlagBackground from "@components/Layout/PageWithFlagBackground";
import NationalNavbar from "@components/Navbars/Navbar";
import type { User } from "../../../types/User";

const NCouncil2020_2024 = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");

        // ✅ Filter for National Council of Elders 2020–2024
        const filtered = res.data.data.filter(
          (user: User) =>
            user.role?.scope?.toLowerCase() === "national" &&
            user.role?.unit?.toLowerCase() === "national council of elders" &&
            user.role?.termStartDate?.startsWith("2020") &&
            user.role?.termEndDate?.startsWith("2024")
        );

        setUsers(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch 2020–2024 elders:", err);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <>
      <NationalNavbar />
      <div style={{ backgroundColor: "#004225", minHeight: "100vh" }}>
        <PageWithFlagBackground title="🇬🇭 National Council of Elders (2020–2024)">
          <Container className="py-5">
            {/* ✅ Back Button */}
            <Button
              variant="secondary"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>

            {users.length === 0 ? (
              <p className="text-center text-muted">
                No council members recorded yet for 2020–2024.
              </p>
            ) : (
              <Row className="g-4">
                {users.map((user) => (
                  <Col key={user._id} xs={12} sm={6} md={4}>
                    <Card className="h-100 text-center shadow border-0">
                      <Card.Img
                        variant="top"
                        src={
                          user.photo
                            ? `http://localhost:5000/uploads/${user.photo}`
                            : "/No Image Available.png"
                        }
                        alt={user.name}
                        style={{ height: "280px", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/No Image Available.png";
                        }}
                      />
                      <Card.Body>
                        <Card.Title className="fw-bold">{user.name}</Card.Title>
                        <Card.Text className="text-muted">
                          {user.role?.position}
                        </Card.Text>
                        {user.role?.termStartDate && user.role?.termEndDate && (
                          <Card.Text className="small text-secondary">
                            {formatDate(user.role.termStartDate)} –{" "}
                            {formatDate(user.role.termEndDate)}
                          </Card.Text>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </PageWithFlagBackground>
      </div>
    </>
  );
};

export default NCouncil2020_2024;
