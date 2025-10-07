import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Top Bar */}
      <header className="absolute top-0 left-0 right-0 z-10 py-6 px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Whisk
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Story Section */}
          <div className="mb-16 space-y-6">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
              <span className="block text-gray-800 mb-2">Turn Your Ideas</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Into Reality
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Imagine describing your dream app and watching it come to life.
              With Whisk, AI transforms your ideas into detailed specifications,
              beautiful UI previews, and production-ready code.
            </p>

            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Powered by GPT-4 • No coding required to start</span>
            </div>
          </div>

          {/* Center Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            {/* Generate Spec Card */}
            <button
              onClick={() => navigate("/app")}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-indigo-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <span className="text-4xl">✨</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Generate Spec
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Describe your app idea and let AI create a complete
                  specification with modules, entities, APIs, and UI components.
                </p>

                <div className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700">
                  Start Creating
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </button>

            {/* View Specifications Card */}
            <button
              onClick={() => navigate("/app/specs")}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <span className="text-4xl">📋</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Specifications
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Browse your generated specifications, preview UI designs, and
                  export production-ready Django/DRF code.
                </p>

                <div className="inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                  View All Specs
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Features Highlights */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-12">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <span>10x Faster Development</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span>Best Practices Built-in</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔄</span>
              <span>Iterative Refinement</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💎</span>
              <span>Production-Ready Code</span>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-white/50">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  Describe Your Idea
                </h4>
                <p className="text-sm text-gray-600">
                  Simply write what you want to build in plain English
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  AI Creates Spec
                </h4>
                <p className="text-sm text-gray-600">
                  Watch as AI generates complete specifications and UI
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Export & Build</h4>
                <p className="text-sm text-gray-600">
                  Get production-ready code and start building immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/30 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-4 md:mb-0">
              <p className="flex items-center">
                <span className="text-2xl mr-2">🤖</span>
                <span className="font-semibold text-gray-900">Whisk</span>
                <span className="mx-2">•</span>
                <span>© {currentYear} All rights reserved</span>
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
