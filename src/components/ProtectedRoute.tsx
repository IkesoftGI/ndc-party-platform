// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Only used for admin pages
}

// ✅ Refactored ProtectedRoute
export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If this is an admin-only page (allowedRoles specified)
  if (allowedRoles.length > 0) {
    if (!isAuthenticated || !user) {
      // Not logged in → redirect to admin login
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Logged in but role not allowed → redirect to dashboard or home
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // For read-only pages (allowedRoles empty) → allow all users
  return <>{children}</>;
}
