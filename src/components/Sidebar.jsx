import React from "react";

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-6">

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">
          Inventory Hub
        </h2>
        <p className="text-sm text-gray-500">
          Manage your business inventory
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-3">

        <button className="w-full text-left px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
          📊 Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          📦 Products
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          ➕ Add Product
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          🗑 Delete Product
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          🏷 Categories
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          🚚 Suppliers
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          📈 Reports
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition">
          ⚙ Settings
        </button>

      </nav>

      {/* Footer */}
      <div className="absolute bottom-8 left-6 right-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm font-semibold">
            StockFlow Pro
          </p>

          <p className="text-xs text-gray-500">
            Version 1.0.0
          </p>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;