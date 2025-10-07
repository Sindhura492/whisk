import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import type { SpecRecord, RefineSpecRequest } from "../types/spec";

const STORAGE_KEY = "whisk_last_spec_id";

export const SpecPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spec, setSpec] = useState<SpecRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refining, setRefining] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [refineFeedback, setRefineFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    loadSpec();
  }, [id]);

  const loadSpec = async () => {
    // Try to get ID from URL params first, then localStorage
    let specId = id;

    if (!specId) {
      const storedId = localStorage.getItem(STORAGE_KEY);
      if (storedId) {
        specId = storedId;
        // Redirect to the proper URL with the ID
        navigate(`/app/spec/${storedId}`, { replace: true });
        return;
      }
    }

    if (!specId) {
      setError("No specification ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.getSpec(specId);
      setSpec(data);

      // Save to localStorage for future restoration
      localStorage.setItem(STORAGE_KEY, data.id);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load specification");

      // Clear invalid ID from localStorage
      if (err.response?.status === 404) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!id || !refineFeedback.trim()) return;

    setRefining(true);
    setError(null);

    try {
      const requestData: RefineSpecRequest = { feedback: refineFeedback };
      const updated = await apiClient.refineSpec(id, requestData);
      setSpec(updated);
      setRefineFeedback("");
      setShowRefine(false);

      // Update localStorage with latest spec
      localStorage.setItem(STORAGE_KEY, updated.id);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to refine specification");
    } finally {
      setRefining(false);
    }
  };

  const handleExportJSON = () => {
    if (!spec) return;

    // Create comprehensive export with metadata
    const exportData = {
      id: spec.id,
      idea: spec.idea,
      specification: spec.spec_json,
      metadata: {
        created_at: spec.created_at,
        updated_at: spec.updated_at,
        exported_at: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const safeName =
      spec.spec_json.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "spec";
    link.download = `${safeName}_${timestamp}.json`;

    link.click();
    URL.revokeObjectURL(url);

    // Show success feedback
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleGenerateCode = () => {
    if (spec) {
      navigate(`/app/code-stubs/${spec.id}`);
    }
  };

  const handleViewDesign = () => {
    if (spec) {
      navigate(`/app/design-preview/${spec.id}`);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate("/app");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading specification...</p>
        </div>
      </div>
    );
  }

  if (error && !spec) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-1">
                Error Loading Specification
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Specification
            </button>
            <button
              onClick={() => navigate("/app/specs")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View All Specifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!spec) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Export Success Banner */}
      {exportSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center space-x-2 text-green-800">
            <span className="text-xl">✓</span>
            <p className="font-medium">Specification exported successfully!</p>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📋 Technical Specification
            </h1>
            <p className="text-sm text-gray-500">
              ID: {spec.id.split("-")[0]}... · Updated{" "}
              {new Date(spec.updated_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRefine(!showRefine)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all shadow-sm hover:shadow-md font-medium"
            >
              <span className="flex items-center space-x-1">
                <span>✏️</span>
                <span>Refine</span>
              </span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md font-medium"
            >
              <span className="flex items-center space-x-1">
                <span>📥</span>
                <span>Export JSON</span>
              </span>
            </button>
            <button
              onClick={handleViewDesign}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow-md font-medium"
            >
              <span className="flex items-center space-x-1">
                <span>🎨</span>
                <span>Preview UI</span>
              </span>
            </button>
            <button
              onClick={handleGenerateCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
            >
              <span className="flex items-center space-x-1">
                <span>💻</span>
                <span>Generate Code</span>
              </span>
            </button>
          </div>
        </div>

        {/* Original Idea Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Original Idea
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <p className="text-gray-700">{spec.idea}</p>
          </div>
        </div>

        {/* Spec Overview Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {spec.spec_json.modules?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Modules</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {spec.spec_json.modules?.reduce(
                (acc, m) => acc + (m.entities?.length || 0),
                0
              ) || 0}
            </div>
            <div className="text-sm text-gray-600">Entities</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">
              {spec.spec_json.kpis?.length || 0}
            </div>
            <div className="text-sm text-gray-600">KPIs</div>
          </div>
        </div>

        {/* Refine Section */}
        {showRefine && (
          <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <span>✏️</span>
              <span>Refine Specification</span>
            </h3>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-4 shadow-sm"
              placeholder="Enter refinement instructions... (e.g., 'Add user authentication module with JWT', 'Include inventory tracking')"
              value={refineFeedback}
              onChange={(e) => setRefineFeedback(e.target.value)}
            />
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleRefine}
                disabled={refining || !refineFeedback.trim()}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
              >
                {refining ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Refining...</span>
                  </span>
                ) : (
                  "Apply Refinement"
                )}
              </button>
              <button
                onClick={() => setShowRefine(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* JSON Viewer */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Specification JSON
            </h3>
            <button
              onClick={handleClearHistory}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              title="Clear saved specification from browser"
            >
              🗑️ Clear History
            </button>
          </div>
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <span className="text-xs text-gray-400 font-mono">
                specification.json
              </span>
            </div>
            <pre className="text-gray-100 p-6 overflow-auto max-h-[600px] text-sm font-mono">
              {JSON.stringify(spec.spec_json, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">💡 What's Next?</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            • <strong>Preview UI:</strong> See how your specification translates
            to user interface components
          </li>
          <li>
            • <strong>Generate Code:</strong> Get Django/DRF implementation code
            instantly
          </li>
          <li>
            • <strong>Refine:</strong> Use AI to modify and enhance your
            specification
          </li>
          <li>
            • <strong>Export:</strong> Download JSON for backup or sharing
          </li>
        </ul>
      </div>
    </div>
  );
};
