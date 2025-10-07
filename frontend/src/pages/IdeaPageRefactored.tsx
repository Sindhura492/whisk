import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import type { GenerateSpecRequest } from "../types/spec";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "../components/ui";

const STORAGE_KEY = "erp_ai_last_spec_id";

export const IdeaPageRefactored: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLastSpec, setHasLastSpec] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastSpecId = localStorage.getItem(STORAGE_KEY);
    setHasLastSpec(!!lastSpecId);
  }, []);

  const handleRestoreLastSpec = () => {
    const lastSpecId = localStorage.getItem(STORAGE_KEY);
    if (lastSpecId) {
      navigate(`/spec/${lastSpecId}`);
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError("Please enter an idea");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData: GenerateSpecRequest = { idea };
      const spec = await apiClient.generateSpec(requestData);

      localStorage.setItem(STORAGE_KEY, spec.id);
      navigate(`/spec/${spec.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate specification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" className="py-8">
      {/* Restore Last Spec Banner */}
      {hasLastSpec && (
        <Card
          variant="gradient"
          className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="font-bold text-blue-900 text-lg">
                  Continue where you left off
                </h3>
                <p className="text-sm text-blue-700">
                  You have a saved specification from your last session
                </p>
              </div>
            </div>
            <Button variant="primary" onClick={handleRestoreLastSpec} icon="→">
              Restore Last Spec
            </Button>
          </div>
        </Card>
      )}

      {/* Main Card */}
      <Card>
        <CardHeader
          title="Generate Technical Specification"
          subtitle="Describe your app idea and let AI generate a comprehensive technical specification"
          icon="✨"
        />

        <CardContent>
          <div className="space-y-6">
            {/* Textarea */}
            <div>
              <label
                htmlFor="idea"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your App Idea
              </label>
              <textarea
                id="idea"
                rows={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 resize-none"
                placeholder="Example: A simple inventory management system for retail stores with product tracking, stock alerts, and sales reporting..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <Card variant="bordered" className="border-red-200 bg-red-50">
                <div className="flex items-center space-x-2 text-red-800">
                  <span className="text-xl">⚠️</span>
                  <p className="font-medium">{error}</p>
                </div>
              </Card>
            )}

            {/* Generate Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!idea.trim()}
              onClick={handleGenerate}
              icon="⚡"
            >
              {loading ? "Generating Specification" : "Generate Spec"}
            </Button>

            {/* Info Card */}
            <Card
              variant="gradient"
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Tip
                  </p>
                  <p className="text-sm text-blue-800">
                    Be specific about your requirements. Include details about
                    features, user roles, and any specific technologies you want
                    to use.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};
