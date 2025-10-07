import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "../components/ui";

const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/auth/login/`, formData);

      // Store tokens
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Redirect to app home page (navigation will detect the token)
      navigate("/app");

      // Force a page reload to update navigation state
      window.location.reload();
    } catch (err: any) {
      if (err.response?.data) {
        setError(
          err.response.data.detail ||
            "Invalid credentials. Please check your email and password."
        );
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        {/* Success Message */}
        {successMessage && (
          <Card
            variant="bordered"
            className="border-green-200 bg-green-50 mb-6 animate-fade-in"
          >
            <div className="flex items-center space-x-2 text-green-800 p-4">
              <span className="text-xl">✓</span>
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </Card>
        )}

        <Card className="shadow-2xl">
          <CardHeader
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
            icon="🤖"
          />

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <Card
                  variant="bordered"
                  className="border-red-200 bg-red-50 p-4"
                >
                  <div className="flex items-center space-x-2 text-red-800">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </Card>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                  placeholder="your.email@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon="🔐"
              >
                Sign In
              </Button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card
          variant="gradient"
          className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                First time here?
              </p>
              <p className="text-xs text-blue-800">
                Create an account with Whisk to start generating AI-powered
                specifications, previewing UI designs, and generating Django/DRF
                code instantly.
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
};
