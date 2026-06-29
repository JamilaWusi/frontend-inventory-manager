import { useState } from "react";
import UsersManager from "./UsersManager";
import ProductsManager from "./ProductsManager";
import StockTransactions from "./StockTransactions";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded ${
            activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded ${
            activeTab === "transactions" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Stock Transactions
        </button>
      </div>

      {/* Render Active Section */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === "users" && <UsersManager />}
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "transactions" && <StockTransactions />}
      </div>
    </div>
  );
}
