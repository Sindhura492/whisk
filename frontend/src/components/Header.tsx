import React from "react";

interface ApiInfo {
  name: string;
  version: string;
  description: string;
  endpoints: Record<string, string>;
}

interface HeaderProps {
  apiInfo: ApiInfo | null;
  error: string | null;
}

export const Header: React.FC<HeaderProps> = ({ apiInfo, error }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Whisk</h1>
            </div>
            {apiInfo && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {apiInfo.name} v{apiInfo.version}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {error ? (
              <div className="flex items-center space-x-2 text-red-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Backend Offline</span>
              </div>
            ) : apiInfo ? (
              <div className="flex items-center space-x-2 text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Connected</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
