import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../services/api";
import type { SpecRecord } from "../types/spec";

export const SpecsListPage: React.FC = () => {
  const [specs, setSpecs] = useState<SpecRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpecs();
  }, []);

  const loadSpecs = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getSpecs();
      setSpecs(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load specifications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Specifications</h1>
        <Link
          to="/app"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New
        </Link>
      </div>

      {specs.length > 0 ? (
        <div className="grid gap-6">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 mb-3 line-clamp-2">{spec.idea}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      Created: {new Date(spec.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(spec.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/app/spec/${spec.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Spec
                  </Link>
                  <Link
                    to={`/app/design-preview/${spec.id}`}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Preview UI
                  </Link>
                  <Link
                    to={`/app/code-stubs/${spec.id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Generate Code
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-600 mb-6">No specifications yet</p>
          <Link
            to="/app"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Specification
          </Link>
        </div>
      )}
    </div>
  );
};
