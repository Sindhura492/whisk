import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./pages/LandingPage";
import { IdeaPage } from "./pages/IdeaPage";
import { SpecPage } from "./pages/SpecPage";
import { SpecsListPage } from "./pages/SpecsListPage";
import { DesignPreviewPage } from "./pages/DesignPreviewPage";
import { CodeStubsPage } from "./pages/CodeStubsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route wrapper (redirects to app if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return !isAuthenticated ? <>{children}</> : <Navigate to="/app" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Landing Page - Redirects to /app if logged in */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* Auth Routes - No Navigation */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App Routes - With Navigation - Protected */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <Navigation />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<IdeaPage />} />
                    <Route path="/specs" element={<SpecsListPage />} />
                    <Route path="/spec/:id" element={<SpecPage />} />
                    <Route
                      path="/design-preview/:id"
                      element={<DesignPreviewPage />}
                    />
                    <Route path="/code-stubs/:id" element={<CodeStubsPage />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
