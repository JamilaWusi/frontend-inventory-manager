// LoginPage.jsx
import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Secure Sign In
        </h2>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="admin@stockflow.pro"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Forgot + Remember */}
          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember this device for 30 days
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
          >
            Sign In to Portal →
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            register
          </a>
        </div>

        {/* System Indicators */}
        <div className="mt-6 flex justify-between text-xs text-gray-500">
          <span>SYSTEM LIVE</span>
          <span>AES-256 ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}
