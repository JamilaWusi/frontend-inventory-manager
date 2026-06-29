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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h2 className="text-2xl font-bold mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />

        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;