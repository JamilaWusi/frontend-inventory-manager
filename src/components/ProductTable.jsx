// frontend-inventory-manager/src/components/ProductTable.jsx
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";

function ProductTable({ products = [], onDelete }) {
  function getStockValue(product) {
    return Number(product.currentStock ?? product.quantity ?? product.currentStockQuantity ?? 0);
  }

  function getStatus(product) {
    const stock = getStockValue(product);
    if (stock <= 0) return "Out of Stock";
    if (stock <= Number(product.reorderLevel || 5)) return "Low Stock";
    return "In Stock";
  }

  function getStatusStyles(status) {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-700";
    }
    if (status === "Low Stock") {
      return "bg-amber-50 text-amber-700";
    }
    return "bg-rose-50 text-rose-700";
  }

  function getCriticalStockAlert(product) {
    const stock = getStockValue(product);
    if (stock <= 0) return "Critical";
    if (stock <= Number(product.reorderLevel || 5)) return "Critical";
    return "Stable";
  }

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <MdOutlineInventory2 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Inventory Summary</h2>
            <p className="text-sm text-slate-500">Live stock overview with clear status indicators</p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          No products to display right now.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]">Critical Stock Alert</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em]">Delete Product</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStatus(product);
                return (
                  <tr key={product._id || product.id} className="border-t border-slate-200 bg-white hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{product.name || product.productName}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{getCriticalStockAlert(product)}</td>
                    <td className="px-6 py-4 text-slate-600">{product.category || "General"}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onDelete?.(product._id || product.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductTable;