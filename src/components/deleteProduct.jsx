// frontend-inventory-manager/src/components/deleteProduct.jsx
import { useState } from "react";

export default function InventoryManager() {
  // Sample inventory list
  const [items, setItems] = useState([
    { id: "SF-9042-X", name: "Neural Processor v4", stock: 852 },
    { id: "SF-1120-B", name: "Haptic Sensor Array", stock: 14 },
    { id: "SF-4402-Q", name: "L-ion Battery Module", stock: 410 },
  ]);

  // Delete function
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Manager</h2>

      {/* Inventory Table */}
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4">{item.id}</td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.stock}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteItem(item.id)}
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
