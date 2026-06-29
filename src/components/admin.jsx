import { useState } from "react";
import UsersManager from "./users.jsx";
import ProductsManager from "./product.jsx";
import StockTransactions from "./stockTransactions.jsx";

export default function AdminPanel({
  currentUser,
  users,
  products,
  transactions,
  onLogout,
  onBack,
  onAddUser,
  onDeleteUser,
  onAddProduct,
  onDeleteProduct,
  onAddTransaction,
  onDeleteTransaction,
}) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">Signed in as {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.role})</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded bg-slate-200 text-slate-800 hover:bg-slate-300"
            >
              Back to Landing
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              activeTab === "users" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              activeTab === "products" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              activeTab === "transactions" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
            }`}
          >
            Stock Transactions
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === "users" && (
            <UsersManager
              users={users}
              onAddUser={onAddUser}
              onDeleteUser={onDeleteUser}
              currentUser={currentUser}
            />
          )}
          {activeTab === "products" && (
            <ProductsManager
              products={products}
              onAddProduct={onAddProduct}
              onDeleteProduct={onDeleteProduct}
              currentUser={currentUser}
            />
          )}
          {activeTab === "transactions" && (
            <StockTransactions
              products={products}
              transactions={transactions}
              onAddTransaction={onAddTransaction}
              onDeleteTransaction={onDeleteTransaction}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}
