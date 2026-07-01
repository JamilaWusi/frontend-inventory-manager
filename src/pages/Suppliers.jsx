import { useEffect, useState } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../components/Button";
import AddSupplierModal from "../components/AddSupplierModal";
import { addInventorySupplier, deleteInventorySupplier, getInventoryData, updateInventorySupplier } from "../utils/inventoryStorage";

function Suppliers() {
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setSuppliers(getInventoryData().suppliers);
  }, []);

  function openAddSupplierModal() {
    setEditingSupplier(null);
    setIsSupplierModalOpen(true);
  }

  function openEditSupplierModal(supplier) {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  }

  function closeModal() {
    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
  }

  function addSupplier(supplier) {
    const nextData = addInventorySupplier(supplier);
    setSuppliers(nextData.suppliers);
  }

  function updateSupplier(updatedSupplier) {
    const nextData = updateInventorySupplier(updatedSupplier);
    setSuppliers(nextData.suppliers);
  }

  function deleteSupplier(id) {
    const nextData = deleteInventorySupplier(id);
    setSuppliers(nextData.suppliers);
  }

  return (
    <div className="space-y-6">
      <div className="mb-0 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">Manage your supplier information and contact details in one place.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={openAddSupplierModal} className="w-full sm:w-auto">Add New Supplier</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <MdOutlineInventory2 size={20} color="#091426" />
            <h2 className="text-lg font-semibold text-[#191C1E]">Supplier List</h2>
          </div>
        </div>

        {suppliers.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#45474C]">
            No suppliers added yet. Use the button above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Supplier</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Contact Person</th>
                  <th className="px-5 py-3 font-semibold">Address</th>
                  <th className="px-5 py-3 font-semibold">Created By</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{supplier.name}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{supplier.phoneNumber}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.email}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.contactPerson}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.address}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.createdBy}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditSupplierModal(supplier)}
                          className="rounded-full border border-[#C5C6CD] p-2 text-[#091426]"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSupplier(supplier.id)}
                          className="rounded-full border border-[#C5C6CD] p-2 text-[#C0392B]"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddSupplierModal
        addSupplier={addSupplier}
        updateSupplier={updateSupplier}
        editingSupplier={editingSupplier}
        onClose={closeModal}
        isOpen={isSupplierModalOpen}
      />
    </div>
  );
}

export default Suppliers;