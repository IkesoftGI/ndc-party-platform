// src\pages\ThankYou.tsx

import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const { state } = useLocation() as { state?: { name?: string } };

  return (
    <div className="container py-5">
      <h2>✅ Submission Received</h2>
      <p>
        Thank you{state?.name ? `, ${state.name}` : ""}! Your details were
        submitted successfully.
      </p>
      <Link className="btn btn-primary mt-3" to="/">Go Home</Link>
    </div>
  );
}
