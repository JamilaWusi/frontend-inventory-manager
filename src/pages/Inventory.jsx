import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiPackage, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import {
  getInventoryData,
  getWeeklyInventoryReport,
  recordInventoryTransaction,
} from "../utils/inventoryStorage";

function getStockValue(product) {
  return Number(product.currentStock ?? product.quantity ?? 0);
}

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState(() => getInventoryData());
  const [form, setForm] = useState(() => {
    const initialData = getInventoryData();
    return {
      productId: String(initialData.products?.[0]?.id || ""),
      type: "Restock",
      quantity: "",
      note: "",
      performedBy: "",
    };
  });

  const products = inventoryData.products || [];
  const suppliers = inventoryData.suppliers || [];
  const transactions = inventoryData.transactions || [];

  useEffect(() => {
    if (!products.some((product) => String(product.id) === form.productId)) {
      setForm((currentForm) => ({ ...currentForm, productId: String(products[0]?.id || "") }));
    }
  }, [products, form.productId]);

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + getStockValue(product), 0),
    [products]
  );
  const criticalProducts = useMemo(
    () => products.filter((product) => getStockValue(product) <= Number(product.reorderLevel || 5)),
    [products]
  );
  const weeklyReport = useMemo(() => getWeeklyInventoryReport(inventoryData), [inventoryData]);
  const recentUpdates = useMemo(
    () =>
      products.slice(0, 5).map((product) => ({
        id: product._id || product.id,
        name: product.name || product.productName,
        stock: getStockValue(product),
        reorderLevel: Number(product.reorderLevel || 5),
      })),
    [products]
  );

  function refreshInventory() {
    setInventoryData(getInventoryData());
  }

  function handleStockSubmit(event) {
    event.preventDefault();

    const selectedProduct = products.find((product) => String(product.id) === form.productId);
    const quantity = Number(form.quantity);

    if (!selectedProduct || !form.type || !quantity || !form.performedBy) {
      alert("Please complete all stock movement fields.");
      return;
    }

    const nextData = recordInventoryTransaction({
      productId: selectedProduct.id,
      type: form.type,
      quantity,
      note: form.note,
      performedBy: form.performedBy,
    });

    setInventoryData(nextData);
    setForm({ productId: String(selectedProduct.id), type: "Restock", quantity: "", note: "", performedBy: "" });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Inventory Overview</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Stock is updated instantly from each movement, low-stock items are surfaced here, and a weekly summary stays visible.
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
          <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiPackage size={18} />
              <span className="text-sm font-semibold">Products</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{products.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiRefreshCw size={18} />
              <span className="text-sm font-semibold">Total Stock</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{totalStock}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiAlertTriangle size={18} />
              <span className="text-sm font-semibold">Critical Alerts</span>
            </div>
            <p className="text-2xl font-semibold text-slate-100">{criticalProducts.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
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
              <p className="text-sm text-slate-600">Current stock and alert state for your live inventory.</p>
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                      No products available yet.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockValue = getStockValue(product);
                    const isCritical = stockValue <= Number(product.reorderLevel || 5);
                    return (
                      <tr key={product._id || product.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-[#191C1E]">{product.name || product.productName}</td>
                        <td className="px-4 py-3 text-[#45474C]">{product.category || "General"}</td>
                        <td className="px-4 py-3 text-[#45474C]">{stockValue}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isCritical ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                            {isCritical ? "Critical" : "Healthy"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#45474C]">{product.supplier || "N/A"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Record Stock Movement</h2>
            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Product</label>
                <select
                  value={form.productId}
                  onChange={(event) => setForm({ ...form, productId: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                >
                  {products.map((product) => (
                    <option key={product.id} value={String(product.id)}>
                      {product.name || product.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Movement Type</label>
                <select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Restock">Restock</option>
                  <option value="Issue">Issue</option>
                  <option value="Adjustment">Adjustment</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Quantity</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                  placeholder="Enter quantity"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Performed By</label>
                <input
                  type="text"
                  value={form.performedBy}
                  onChange={(event) => setForm({ ...form, performedBy: event.target.value })}
                  placeholder="Manager or staff name"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Note</label>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  placeholder="Add note for this movement"
                  className="min-h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <button type="submit" className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Save Movement
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Critical Stock Alerts</h2>
            {criticalProducts.length === 0 ? (
              <p className="text-sm text-[#45474C]">No critical stock items right now.</p>
            ) : (
              <ul className="space-y-3">
                {criticalProducts.map((product) => (
                  <li key={product._id || product.id} className="rounded-lg border border-[#F0C4C4] bg-[#FFF6F6] p-3 text-sm text-[#45474C]">
                    <div className="font-semibold text-[#191C1E]">{product.name || product.productName}</div>
                    <div>Current stock: {getStockValue(product)}</div>
                    <div>Reorder level: {product.reorderLevel || 5}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center gap-2">
              <FiTrendingUp size={16} className="text-slate-900" />
              <h2 className="text-lg font-semibold text-slate-900">Weekly Report</h2>
            </div>
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Movements</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.movementCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Low-stock items</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.lowStockProducts.length}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Restocks</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.restockCount}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="text-slate-500">Issues</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.issueCount}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {transactions.length > 0
                ? `The latest ${transactions.slice(0, 3).length} stock movements are saved for the weekly report trail.`
                : "Record your first movement to build a weekly report history."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Inventory Updates</h2>
            {recentUpdates.length === 0 ? (
              <p className="text-sm text-[#45474C]">No inventory updates available yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentUpdates.map((item) => (
                  <li key={item.id} className="rounded-lg border border-[#E6E6E9] p-3 text-sm text-[#45474C]">
                    <div className="font-semibold text-[#191C1E]">{item.name}</div>
                    <div>Current stock: {item.stock} units</div>
                    <div>Reorder level: {item.reorderLevel}</div>
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
