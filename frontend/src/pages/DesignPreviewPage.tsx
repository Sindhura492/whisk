import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import { DesignPreview } from "../components/DesignPreview";
import type { SpecRecord } from "../types/spec";

export const DesignPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spec, setSpec] = useState<SpecRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpec();
  }, [id]);

  const loadSpec = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await apiClient.getSpec(id);
      setSpec(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load specification");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading design preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Error Loading Specification
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spec) return null;

  const modules = spec.spec_json?.modules || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎨 Design Preview
            </h1>
            <p className="text-gray-600">
              Interactive preview of UI components from your specification
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/app/spec/${spec.id}`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              ← Back to Spec
            </button>
            <button
              onClick={() => navigate(`/app/code-stubs/${spec.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Code →
            </button>
          </div>
        </div>

        {/* Module Selector */}
        {modules.length > 0 && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">
              Select Module:
            </label>
            <div className="flex-1 max-w-md">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-all"
              >
                {modules.map((module: any, idx: number) => (
                  <option key={idx} value={idx}>
                    {module.name} ({module.entities?.length || 0} entities,{" "}
                    {module.ui?.length || 0} UI components)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Design Preview */}
      {modules.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <DesignPreview
            spec={spec.spec_json}
            selectedModuleIndex={selectedModule}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Modules Found
            </h3>
            <p className="text-gray-600 mb-6">
              This specification doesn't have any modules defined yet.
            </p>
            <button
              onClick={() => navigate(`/app/spec/${spec.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Refine Specification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
