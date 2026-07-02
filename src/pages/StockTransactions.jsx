import { useMemo, useState } from "react";
import { FiPackage, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { deleteInventoryTransaction, getInventoryData, recordInventoryTransaction } from "../utils/inventoryStorage";

export default function StockTransactions() {
  const [inventoryData, setInventoryData] = useState(() => getInventoryData());
  const [form, setForm] = useState({
    productId: "1",
    type: "Restock",
    quantity: "",
    note: "",
    performedBy: "",
  });

  const products = inventoryData.products;
  const transactions = inventoryData.transactions;

  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.currentStock, 0), [products]);
  const criticalItems = useMemo(
    () => products.filter((product) => product.currentStock <= (product.reorderLevel || 5)),
    [products]
  );

  function handleSubmit(event) {
    event.preventDefault();

    const selectedProduct = products.find((product) => String(product.id) === form.productId);
    const quantity = Number(form.quantity);

    if (!selectedProduct || !form.type || !quantity || !form.performedBy) {
      alert("Please complete all transaction fields.");
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
    setForm({ productId: "1", type: "Restock", quantity: "", note: "", performedBy: "" });
  }

  function deleteTransaction(transactionId) {
    const nextData = deleteInventoryTransaction(transactionId);
    setInventoryData(nextData);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Stock Transactions</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Track every stock movement, update inventory instantly, and keep an audit trail.
            </p>
          </div>
          <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900">
            Total Stock: {totalStock}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <FiPackage size={18} />
              <span className="text-sm font-semibold">Products</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <FiRefreshCw size={18} />
              <span className="text-sm font-semibold">Movements</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{transactions.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-900">
              <FiTrash2 size={18} />
              <span className="text-sm font-semibold">Critical Items</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{criticalItems.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Record New Movement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Product</label>
              <select
                value={form.productId}
                onChange={(event) => setForm({ ...form, productId: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
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
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Inventory Movement History</h3>
              <p className="text-sm text-slate-600">A complete audit trail of stock changes.</p>
            </div>
            <div className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Report-ready history
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">By</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-[#E6E6E9]">
                    <td className="px-4 py-3 font-medium text-[#191C1E]">{transaction.productName}</td>
                    <td className="px-4 py-3 text-[#45474C]">{transaction.type}</td>
                    <td className="px-4 py-3 text-[#45474C]">{transaction.quantity}</td>
                    <td className="px-4 py-3 text-[#45474C]">{transaction.performedBy}</td>
                    <td className="px-4 py-3 text-[#45474C]">{transaction.date}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="rounded-full border border-[#F0C4C4] bg-[#FFF6F6] px-3 py-2 text-sm font-medium text-[#C0392B]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
