import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./ui";

const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api";

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken = localStorage.getItem("access_token");

      // Call logout endpoint if tokens exist
      if (refreshToken && accessToken) {
        try {
          await axios.post(
            `${API_URL}/auth/logout/`,
            { refresh_token: refreshToken },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } catch (error) {
          // Continue with logout even if API call fails
          console.error("Logout API error:", error);
        }
      }

      // Clear all auth data from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      // Clear any other user-related data
      // Add more keys here if you store other user data

      // Redirect to home/landing page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear tokens and redirect even on error
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      loading={loading}
      icon={loading ? undefined : "🚪"}
    >
      {loading ? "Logging out" : "Logout"}
    </Button>
  );
};
