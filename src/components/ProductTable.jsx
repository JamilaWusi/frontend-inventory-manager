import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineInventory2 } from "react-icons/md";

function ProductTable() {
  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "Rice",
      category: "Food",
      supplier: "Dangote",
      unitPrice: 4500,
      currentStockQuantity: 75,
      status: "In Stock",
    },
    {
      id: 2,
      productName: "Sugar",
      category: "Food",
      supplier: "BUA",
      unitPrice: 3200,
      currentStockQuantity: 8,
      status: "Low Stock",
    },
    {
      id: 3,
      productName: "Milk",
      category: "Dairy",
      supplier: "Peak",
      unitPrice: 1500,
      currentStockQuantity: 0,
      status: "Out of Stock",
    },
  ]);

  function getCriticalStockAlert(quantity) {
    if (quantity <= 0) return "Critical";
    if (quantity <= 5) return "Critical";
    return "Stable";
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

  function deleteProduct(id) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
  }

  return (
    <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <MdOutlineInventory2 size={20} color="#0F172A" />
          <h2 className="text-lg font-semibold text-slate-900">Inventory Summary</h2>
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
                <th className="px-5 py-3 font-semibold">Product Name</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Critical Stock Alert</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Delete Product</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{product.productName}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{getCriticalStockAlert(product.currentStockQuantity)}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductTable;