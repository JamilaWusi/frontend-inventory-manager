import { useState } from "react";

const statusForStock = (stock, reorderLevel) => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= reorderLevel) return "Low Stock";
  return "In Stock";
};

export default function ProductsManager({ products = [], onAddProduct, onDeleteProduct, currentUser }) {
  const [newProduct, setNewProduct] = useState({
    productName: "",
    sku: "",
    category: "",
    description: "",
    unitPrice: "",
    costPrice: "",
    currentStock: "",
    reorderLevel: "",
    status: "In Stock",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.productName || !newProduct.sku) return;

    const startingStock = parseInt(newProduct.currentStock || "0", 10);
    const product = {
      id: Date.now(),
      productName: newProduct.productName,
      sku: newProduct.sku,
      category: newProduct.category,
      description: newProduct.description,
      unitPrice: parseFloat(newProduct.unitPrice) || 0,
      costPrice: parseFloat(newProduct.costPrice) || 0,
      currentStock: startingStock,
      startingStock,
      reorderLevel: parseInt(newProduct.reorderLevel || "0", 10),
      status: statusForStock(startingStock, parseInt(newProduct.reorderLevel || "0", 10)),
      createdBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Admin",
      dateCreated: new Date().toLocaleString(),
      dateUpdated: new Date().toLocaleString(),
    };

    onAddProduct(product);
    setNewProduct({
      productName: "",
      sku: "",
      category: "",
      description: "",
      unitPrice: "",
      costPrice: "",
      currentStock: "",
      reorderLevel: "",
      status: "In Stock",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.productName}
          onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="SKU / Product Code"
          value={newProduct.sku}
          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Unit Price"
          value={newProduct.unitPrice}
          onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Cost Price"
          value={newProduct.costPrice}
          onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Current Stock"
          value={newProduct.currentStock}
          onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Reorder Level"
          value={newProduct.reorderLevel}
          onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded md:col-span-2"
        >
          Add Product
        </button>
      </form>

      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4">{product.sku}</td>
              <td className="px-6 py-4">{product.productName}</td>
              <td className="px-6 py-4">{product.currentStock}</td>
              <td className="px-6 py-4">{product.status}</td>
              <td className="px-6 py-4">{product.createdBy}</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
