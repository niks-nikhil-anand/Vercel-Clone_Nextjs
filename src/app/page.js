"use client";
import { useState } from 'react';

export default function DeployPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        throw new Error('Deployment failed');
      }

      setSuccess(true);
      setRepoUrl('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deploy Your Repository
          </h1>
          <p className="text-gray-600 mb-8">
            Paste your GitHub repository URL below to deploy your application.
            We'll handle the build and deployment process automatically.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label 
              htmlFor="repo-url" 
              className="block text-sm font-medium text-gray-700 sr-only"
            >
              Repository URL
            </label>
            <input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleDeploy}
            disabled={loading || !repoUrl}
            className={`w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
              ${!repoUrl ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploying...
              </span>
            ) : (
              'Deploy Now'
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              Deployment initiated successfully! Your site will be live shortly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}