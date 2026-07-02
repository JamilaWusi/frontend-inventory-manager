import { useMemo, useState } from "react";
import { FiAlertTriangle, FiPackage, FiRefreshCw } from "react-icons/fi";
import { getInventoryData } from "../utils/inventoryStorage";

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState(() => getInventoryData());

  const products = inventoryData.products;
  const suppliers = inventoryData.suppliers;
  const transactions = inventoryData.transactions;

  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.currentStock, 0), [products]);
  const criticalProducts = useMemo(
    () => products.filter((product) => product.currentStock <= (product.reorderLevel || 5)),
    [products]
  );

  function refreshInventory() {
    setInventoryData(getInventoryData());
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Inventory Overview</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Live stock levels, supplier links, alerts, and recent activity from product, supplier, and stock movement actions.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshInventory}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiPackage size={18} />
              <span className="text-sm font-semibold">Products</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{products.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiRefreshCw size={18} />
              <span className="text-sm font-semibold">Total Stock</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{totalStock}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiAlertTriangle size={18} />
              <span className="text-sm font-semibold">Critical Alerts</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{criticalProducts.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiPackage size={18} />
              <span className="text-sm font-semibold">Suppliers</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{suppliers.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Inventory Status</h2>
              <p className="text-sm text-slate-600">Current stock and alert state for products.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Alert</th>
                  <th className="px-4 py-3 font-medium">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isCritical = product.currentStock <= (product.reorderLevel || 5);
                  return (
                    <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-[#191C1E]">{product.name || product.productName}</td>
                      <td className="px-4 py-3 text-[#45474C]">{product.category}</td>
                      <td className="px-4 py-3 text-[#45474C]">{product.currentStock}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isCritical ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {isCritical ? "Critical" : "Healthy"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#45474C]">{product.supplier || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Critical Stock Alerts</h2>
            {criticalProducts.length === 0 ? (
              <p className="text-sm text-[#45474C]">No critical stock items right now.</p>
            ) : (
              <ul className="space-y-3">
                {criticalProducts.map((product) => (
                  <li key={product.id} className="rounded-lg border border-[#F0C4C4] bg-[#FFF6F6] p-3 text-sm text-[#45474C]">
                    <div className="font-semibold text-[#191C1E]">{product.name || product.productName}</div>
                    <div>Current stock: {product.currentStock}</div>
                    <div>Reorder level: {product.reorderLevel || 5}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Inventory Updates</h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-[#45474C]">No inventory updates yet.</p>
            ) : (
              <ul className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <li key={transaction.id} className="rounded-lg border border-[#E6E6E9] p-3 text-sm text-[#45474C]">
                    <div className="font-semibold text-[#191C1E]">{transaction.productName}</div>
                    <div>{transaction.type} • {transaction.quantity} units</div>
                    <div>By {transaction.performedBy} • {transaction.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
