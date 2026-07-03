// frontend-inventory-manager/src/components/Login.jsx
import React from "react";

function LoginPage({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    onLogin(); // Go to Dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Secure Sign In
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              defaultValue="admin@stockflow.pro"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between text-sm">
            <a href="#" className="text-blue-600">
              Forgot Password?
            </a>

            <label>
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In →
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600">
            Register
          </a>
        </div>

        <div className="mt-6 flex justify-between text-xs text-gray-500">
          <span>SYSTEM LIVE</span>
          <span>AES-256 ENCRYPTED</span>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;