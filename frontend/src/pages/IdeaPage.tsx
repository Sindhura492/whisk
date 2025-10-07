import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import type { GenerateSpecRequest } from "../types/spec";

const STORAGE_KEY = "whisk_last_spec_id";

export const IdeaPage: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLastSpec, setHasLastSpec] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a saved spec in localStorage
    const lastSpecId = localStorage.getItem(STORAGE_KEY);
    setHasLastSpec(!!lastSpecId);
  }, []);

  const handleRestoreLastSpec = () => {
    const lastSpecId = localStorage.getItem(STORAGE_KEY);
    if (lastSpecId) {
      navigate(`/app/spec/${lastSpecId}`);
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

      // Save spec ID to localStorage for persistence
      localStorage.setItem(STORAGE_KEY, spec.id);

      // Navigate to the spec page
      navigate(`/app/spec/${spec.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate specification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Restore Last Spec Banner */}
      {hasLastSpec && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-blue-900">
                  Continue where you left off
                </p>
                <p className="text-sm text-blue-700">
                  You have a saved specification from your last session
                </p>
              </div>
            </div>
            <button
              onClick={handleRestoreLastSpec}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Restore Last Spec →
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Generate Technical Specification
        </h1>
        <p className="text-gray-600 mb-6">
          Describe your app idea and let AI generate a comprehensive technical
          specification
        </p>

        <div className="mb-6">
          <label
            htmlFor="idea"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your App Idea
          </label>
          <textarea
            id="idea"
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Example: A simple inventory management system for retail stores with product tracking, stock alerts, and sales reporting..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !idea.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Generating Specification..." : "Generate Spec"}
        </button>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Be specific about your requirements. Include
            details about features, user roles, and any specific technologies
            you want to use.
          </p>
        </div>
      </div>
    </div>
  );
};
