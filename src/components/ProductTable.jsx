function ProductTable({ products, deleteProduct, onEdit }) {
 
  products = [
    {
      id: 1,
      name: "Tomatoes",
      stock: 60
    }
  ]
 
  return (
    <div className="bg-white rounded-xl shadow">
      {/* Table */}
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left px-6 py-4">Product Name</th>
            <th className="text-left px-6 py-4">Stock</th>
            <th className="text-left px-6 py-4">Status</th>
            <th className="text-left px-6 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center py-10 text-slate-500"
              >
                No products available.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>

                <td className="px-6 py-4">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  {product.stock > 50 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Healthy
                    </span>
                  ) : product.stock > 10 ? (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Low
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Critical
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-4 border-t">
        <p className="text-sm text-slate-500">
          Showing {products.length} products
        </p>

        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded">
            Previous
          </button>

          <button className="bg-slate-900 text-white px-3 py-1 rounded">
            1
          </button>

          <button className="border px-3 py-1 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductTable;