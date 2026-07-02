import { useContext, useEffect, useState } from "react";
import { MdOutlineInventory2, MdOutlineLocationOn, MdOutlineMail, MdOutlinePersonOutline, MdOutlinePhone } from "react-icons/md";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { addSupplier, editSupplier, getSuppliers, deleteSupplier } from "../utils/fn";
import { TokenContext } from "../context/TokenContext";
import PageLoader from "./PageLoader";
import Input from "../components/Input";
import { SupplierContext, SupplierDispatchContext } from "../context/SupplierContext";

export default function Suppliers() {

  const tokenPayload = useContext(TokenContext)
  const supplierPayload = useContext(SupplierContext)
  const supplierDispatch = useContext(SupplierDispatchContext)

  console.log(supplierPayload)

  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);

  const [suppliers, setSuppliers] = useState(supplierPayload || []);
  const [isLoading, setIsLoading] = useState(false);

  const [addSupplierData, setAddSupplierData] = useState({
    supplierName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
  })

  const [editSupplierData, setEditSupplierData] = useState({
    id: "",
    supplierName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
  })

  function openAddSupplierModal() {
    setIsAddSupplierModalOpen(true);
  }

  function openEditSupplierModal(id) {
    console.log(id)
    setIsEditSupplierModalOpen(true);
    setEditSupplierData(suppliers.find((supplier) => supplier._id === id));
  }

  function closeModal() {
    setIsAddSupplierModalOpen(false);
    setIsEditSupplierModalOpen(false);
  }


  async function handleAddSupplier(e) {
    try {
      e.preventDefault();
      setIsLoading(true);

      const newSupplier = await addSupplier(tokenPayload.token, addSupplierData);

      if (newSupplier) {
        setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier.data]);
        supplierDispatch({
          action: "add",
          payload: newSupplier
        })

      }

      closeModal();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditSupplier(e) {
    try {
      e.preventDefault();
      setIsLoading(true);

      const updatedSupplier = await editSupplier(tokenPayload.token, editSupplierData._id, editSupplierData);

      if (updatedSupplier) {
        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((supplier) =>
            supplier._id === updatedSupplier.data._id ? updatedSupplier.data : supplier
          )
        );
      }

      closeModal();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSupplier(id) {
    try {
      setIsLoading(true);
      const deletedSupplier = await deleteSupplier(tokenPayload.token, id);

      if (deletedSupplier) {
        setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id));
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   async function call() {
  //     try {
  //       setIsLoading(true);
  //       const response = await getSuppliers(tokenPayload.token);
  //       console.log(response);
  //       if (response) {
  //         setSuppliers(response.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   call();
  // }, []);

  if (isLoading) {
    return <PageLoader />;
  }


  return (
    <div className="space-y-6">
      <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">Manage your supplier information and contact details with a modern, consistent interface.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={openAddSupplierModal} className="w-full sm:w-auto">Add New Supplier</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Current Suppliers</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Supplier</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Contact Person</th>
                <th className="px-5 py-3 font-semibold">Address</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier._id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-600">{supplier.supplierName}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.phoneNumber}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.email}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.contactPerson}</td>
                    <td className="px-5 py-4 text-slate-600">{supplier.address}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditSupplierModal(supplier._id)}
                          className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-900 transition hover:bg-slate-100"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSupplier(supplier._id)}
                          disabled={isLoading}
                          className="rounded-full border border-slate-200 bg-slate-50 p-2 text-red-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
                    No suppliers added yet. Use the button above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add supplier modal */}
      <Modal isOpen={isAddSupplierModalOpen} closeButton={false} onClose={closeModal}>
        <form className="space-y-4" onSubmit={handleAddSupplier}>
          <Input
            className="w-full"
            id="supplierName"
            label="Supplier Name"
            placeholder="Enter supplier name"
            value={addSupplierData.supplierName}
            onChange={(event) => setAddSupplierData({ ...addSupplierData, supplierName: event.target.value })}
            icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="phoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            value={addSupplierData.phoneNumber}
            onChange={(event) => setAddSupplierData({ ...addSupplierData, phoneNumber: event.target.value })}
            icon={<MdOutlinePhone size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="email"
            label="Email"
            placeholder="Enter email address"
            type="email"
            value={addSupplierData.email}
            onChange={(event) => setAddSupplierData({ ...addSupplierData, email: event.target.value })}
            icon={<MdOutlineMail size={20} color="#75777D" />}
            required={false}
          />

          <Input
            className="w-full"
            id="contactPerson"
            label="Contact Person"
            placeholder="Enter contact person"
            value={addSupplierData.contactPerson}
            onChange={(event) => setAddSupplierData({ ...addSupplierData, contactPerson: event.target.value })}
            icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
            required={false}
          />

          <Input
            className="w-full"
            id="address"
            label="Address"
            placeholder="Enter address"
            value={addSupplierData.address}
            onChange={(event) => setAddSupplierData({ ...addSupplierData, address: event.target.value })}
            icon={<MdOutlineLocationOn size={20} color="#75777D" />}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]"
            >
              Cancel
            </button>
            <Button type="submit" className="w-auto px-5">
              Add Supplier
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit supplier modal */}
      <Modal isOpen={isEditSupplierModalOpen} closeButton={false} onClose={closeModal}>
        <form className="space-y-4" onSubmit={handleEditSupplier}>
          <Input
            className="w-full"
            id="editSupplierName"
            label="Supplier Name"
            placeholder="Enter supplier name"
            value={editSupplierData?.supplierName || ""}
            onChange={(event) => setEditSupplierData({ ...editSupplierData, supplierName: event.target.value })}
            icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="editPhoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            value={editSupplierData?.phoneNumber || ""}
            onChange={(event) => setEditSupplierData({ ...editSupplierData, phoneNumber: event.target.value })}
            icon={<MdOutlinePhone size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="editEmail"
            label="Email"
            placeholder="Enter email address"
            type="email"
            value={editSupplierData?.email || ""}
            onChange={(event) => setEditSupplierData({ ...editSupplierData, email: event.target.value })}
            icon={<MdOutlineMail size={20} color="#75777D" />}
            required={false}
          />

          <Input
            className="w-full"
            id="editContactPerson"
            label="Contact Person"
            placeholder="Enter contact person"
            value={editSupplierData?.contactPerson || ""}
            onChange={(event) => setEditSupplierData({ ...editSupplierData, contactPerson: event.target.value })}
            icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
            required={false}
          />

          <Input
            className="w-full"
            id="editAddress"
            label="Address"
            placeholder="Enter address"
            value={editSupplierData?.address || ""}
            onChange={(event) => setEditSupplierData({ ...editSupplierData, address: event.target.value })}
            icon={<MdOutlineLocationOn size={20} color="#75777D" />}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]"
            >
              Cancel
            </button>
            <Button type="submit" className="w-auto px-5">
              Update Supplier
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}


