import { useContext, useMemo, useState } from "react";

import ProductTable from "../components/ProductTable.jsx";
import Card from "../components/Card.jsx";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { ProfileContext } from "../context/ProfileContext.jsx";
import { deleteInventoryProduct, getInventoryData, getWeeklyInventoryReport } from "../utils/inventoryStorage.js";

function getStockValue(product) {
  return Number(product.currentStock ?? product.quantity ?? product.currentStockQuantity ?? 0);
}

function Dashboard() {
  const profile = useContext(ProfileContext);
  const [inventoryData, setInventoryData] = useState(() => getInventoryData());

  const products = inventoryData.products || [];
  const suppliers = inventoryData.suppliers || [];
  const criticalAlerts = useMemo(
    () => products.filter((product) => getStockValue(product) <= Number(product.reorderLevel || 5)),
    [products]
  );
  const weeklyReport = useMemo(() => getWeeklyInventoryReport(inventoryData), [inventoryData]);

  function handleDeleteProduct(productId) {
    const nextData = deleteInventoryProduct(productId);
    setInventoryData(nextData);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Welcome, <span>{`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "there"}</span>, to StockTrack
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Real-time inventory monitoring and quick access to product, supplier, and stock transaction summaries.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={products.length}
          title="Products"
          className="font-semibold"
          desc="All products in your database"
        />
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={suppliers.length}
          title="Suppliers"
          desc="Active supplier relationships"
        />
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={criticalAlerts.length}
          title="Critical Alerts"
          desc="Products needing restock"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Low Stock Products</h2>
              <p className="text-sm text-slate-600">Items that need attention before they run out.</p>
            </div>
          </div>
          {criticalAlerts.length === 0 ? (
            <p className="text-sm text-slate-600">All products are being kept above the reorder level.</p>
          ) : (
            <ul className="space-y-3">
              {criticalAlerts.map((product) => (
                <li key={product._id || product.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">{product.name || product.productName}</div>
                  <div>Current stock: {getStockValue(product)}</div>
                  <div>Reorder level: {product.reorderLevel || 5}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)]">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Weekly Report Snapshot</h2>
            <p className="text-sm text-slate-600">A quick view of the last seven days of inventory movement.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Movements</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.movementCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Low stock</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.lowStockProducts.length}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Restocks</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.restockCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Issues</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.issueCount}</div>
            </div>
          </div>
        </div>
      </div>

      <ProductTable products={products} onDelete={handleDeleteProduct} />
    </div>
  );
}

export default Dashboard;