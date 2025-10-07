import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { apiClient } from "../services/api";
import type {
  SpecRecord,
  CodeStubsResponse,
  CodeStubsRequest,
} from "../types/spec";

export const CodeStubsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [spec, setSpec] = useState<SpecRecord | null>(null);
  const [codeStubs, setCodeStubs] = useState<CodeStubsResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("models_py");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSpec();
  }, [id]);

  useEffect(() => {
    // Auto-select first module when spec loads
    if (spec && spec.spec_json.modules && spec.spec_json.modules.length > 0) {
      setSelectedModule(spec.spec_json.modules[0].name);
    }
  }, [spec]);

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

  const handleGenerateCode = async () => {
    if (!id || !selectedModule) return;

    setGenerating(true);
    setError(null);

    try {
      const requestData: CodeStubsRequest = {
        spec_id: id,
        language: "python",
        framework: "django",
      };
      const result = await apiClient.generateCodeStubs(requestData);
      setCodeStubs(result);
      setSelectedFile("models_py");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate code stubs");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = (fileKey: string) => {
    if (
      !codeStubs ||
      !codeStubs.implementation[
        fileKey as keyof typeof codeStubs.implementation
      ]
    )
      return;

    const code =
      codeStubs.implementation[
        fileKey as keyof typeof codeStubs.implementation
      ];
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(fileKey);
      setTimeout(() => setCopySuccess(null), 2000);
    });
  };

  const handleDownloadCode = (fileKey: string) => {
    if (
      !codeStubs ||
      !codeStubs.implementation[
        fileKey as keyof typeof codeStubs.implementation
      ]
    )
      return;

    const code =
      codeStubs.implementation[
        fileKey as keyof typeof codeStubs.implementation
      ];
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileKey.replace("_", ".");
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    if (!codeStubs) return;

    Object.entries(codeStubs.implementation).forEach(([key, code]) => {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = key.replace("_", ".");
      link.click();
      URL.revokeObjectURL(url);
    });
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

  const files = [
    { key: "models_py", label: "models.py", icon: "🗄️", color: "blue" },
    {
      key: "serializers_py",
      label: "serializers.py",
      icon: "🔄",
      color: "green",
    },
    { key: "views_py", label: "views.py", icon: "👁️", color: "purple" },
    { key: "urls_py", label: "urls.py", icon: "🔗", color: "orange" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              💻 Generated Code Stubs
            </h1>
            <p className="text-gray-600">
              Generate Django REST Framework implementation code
            </p>
          </div>
          {codeStubs && (
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              📥 Download All Files
            </button>
          )}
        </div>

        {/* Generation Controls */}
        {!codeStubs && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Module to Generate Code:
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-all"
                  disabled={generating || modules.length === 0}
                >
                  {modules.length === 0 ? (
                    <option value="">No modules available</option>
                  ) : (
                    modules.map((module: any, idx: number) => (
                      <option key={idx} value={module.name}>
                        {module.name} ({module.entities?.length || 0} entities)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerateCode}
                disabled={generating || !selectedModule || modules.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {generating ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Django/DRF Code...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>⚡</span>
                    <span>Generate Django/DRF Code Stubs</span>
                  </span>
                )}
              </button>

              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 Tip:</strong> The code generator will create Django
                  models, DRF serializers, ViewSets, and URL routing for the
                  selected module.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Display */}
      {codeStubs ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Code Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {codeStubs.module_name} Module
                </h2>
                <p className="text-gray-300 text-sm">
                  {codeStubs.framework.toUpperCase()} ·{" "}
                  {codeStubs.language.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setCodeStubs(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                ← Generate New
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-0">
            {/* File Tabs - Sidebar */}
            <div className="col-span-12 md:col-span-3 bg-gray-50 border-r border-gray-200">
              <div className="p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Generated Files
                </h3>
                {files.map((file) => (
                  <button
                    key={file.key}
                    onClick={() => setSelectedFile(file.key)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                      selectedFile === file.key
                        ? `bg-${file.color}-600 text-white shadow-md`
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{file.icon}</span>
                        <span className="text-sm">{file.label}</span>
                      </div>
                      {selectedFile === file.key && (
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-300">
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Module:</span>
                      <span className="font-semibold">
                        {codeStubs.module_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language:</span>
                      <span className="font-semibold">
                        {codeStubs.language}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Framework:</span>
                      <span className="font-semibold">
                        {codeStubs.framework}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Viewer - Main Area */}
            <div className="col-span-12 md:col-span-9 bg-gray-900">
              {/* Code Toolbar */}
              <div className="bg-gray-800 px-6 py-3 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <span>{files.find((f) => f.key === selectedFile)?.icon}</span>
                  <span>
                    {files.find((f) => f.key === selectedFile)?.label}
                  </span>
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(selectedFile)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      copySuccess === selectedFile
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {copySuccess === selectedFile ? (
                      <span className="flex items-center space-x-1">
                        <span>✓</span>
                        <span>Copied!</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <span>📋</span>
                        <span>Copy</span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownloadCode(selectedFile)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all text-sm font-medium"
                  >
                    <span className="flex items-center space-x-1">
                      <span>💾</span>
                      <span>Download</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "0.875rem",
                    background: "#1e1e1e",
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {codeStubs.implementation[
                    selectedFile as keyof typeof codeStubs.implementation
                  ] || "# No code generated"}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <div className="text-gray-400 text-7xl mb-6">💻</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            Ready to Generate Code
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Select a module from your specification and generate Django REST
            Framework implementation code including models, serializers, views,
            and URLs.
          </p>
          {modules.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ No modules found.</strong> This specification doesn't
                have any modules defined. Please refine your specification to
                add modules.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
