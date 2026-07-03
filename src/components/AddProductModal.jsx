// frontend-inventory-manager/src/components/AddProductModal.jsx
import { useState, useEffect } from "react";

function AddProductModal({
  addProduct,
  updateProduct,
  editingProduct,
  onClose,
}) {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");

  // Fill the form when editing
  useEffect(() => {
    if (editingProduct) {
      setProductId(editingProduct.id);
      setProductName(editingProduct.name);
      setStock(editingProduct.stock);
    } else {
      setProductId("");
      setProductName("");
      setStock("");
    }
  }, [editingProduct]);

  const handleSave = () => {
    if (!productId || !productName || !stock) {
      alert("Please fill in all fields.");
      return;
    }

    const product = {
      id: productId,
      name: productName,
      stock: Number(stock),
    };

    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/45 px-3">
      <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-slate-900">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {editingProduct ? "Update the selected product details below." : "Create a new product entry with stock details."}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Product ID</label>
            <input
              type="text"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Stock</label>
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;