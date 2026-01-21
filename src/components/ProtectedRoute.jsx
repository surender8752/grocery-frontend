import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { admin, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
            >
                <div style={{ color: "white", fontSize: "1.5rem" }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
