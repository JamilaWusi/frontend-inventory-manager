import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdOutlineLocationOn, MdOutlineMail, 
  MdOutlinePersonOutline, MdOutlinePhone 
} from "react-icons/md";
import { 
  Users, Plus, Search, Download,
  Edit, Trash2, Phone, Mail, MapPin,
  ArrowUpRight, RefreshCcw, Building2,
  UserCheck
} from "../components/Icons";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { addSupplier, editSupplier, getSuppliers, deleteSupplier } from "../utils/fn";
import { TokenContext } from "../context/TokenContext";
import { SupplierContext, SupplierDispatchContext } from "../context/SupplierContext";
import { showToast } from "../utils/toast";
import PageLoader from "./PageLoader";

export default function Suppliers() {
  const tokenPayload = useContext(TokenContext);
  const supplierPayload = useContext(SupplierContext);
  const supplierDispatch = useContext(SupplierDispatchContext);

  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [viewSupplier, setViewSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [suppliers, setSuppliers] = useState(supplierPayload || []);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [addSupplierData, setAddSupplierData] = useState({
    supplierName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [editSupplierData, setEditSupplierData] = useState({
    _id: "",
    supplierName: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalSuppliers: 0,
    withEmail: 0,
    withPhone: 0,
    withAddress: 0,
  });

  async function loadSuppliers() {
    if (!tokenPayload?.token) return;
    
    try {
      setIsLoading(true);
      const response = await getSuppliers(tokenPayload.token);
      if (response?.data) {
        setSuppliers(response.data);
        supplierDispatch({
          type: "loggedIn",
          payload: response.data
        });
        calculateAnalytics(response.data);
      }
    } catch (error) {
      console.error(error);
      showToast.error("Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  }

  function calculateAnalytics(suppliersData) {
    setAnalytics({
      totalSuppliers: suppliersData.length,
      withEmail: suppliersData.filter(s => s.email).length,
      withPhone: suppliersData.filter(s => s.phoneNumber).length,
      withAddress: suppliersData.filter(s => s.address).length,
    });
  }

  function resetAddForm() {
    setAddSupplierData({
      supplierName: "",
      contactPerson: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setFeedback("");
  }

  async function handleAddSupplier(e) {
    e.preventDefault();

    if (!addSupplierData.supplierName?.trim()) {
      setFeedback("Supplier name is required");
      return;
    }

    if (!addSupplierData.phoneNumber?.trim()) {
      setFeedback("Phone number is required");
      return;
    }

    const loadingToast = showToast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const newSupplier = await addSupplier(tokenPayload.token, addSupplierData);
          if (newSupplier?.data) {
            await loadSuppliers();
            closeModal();
            resetAddForm();
            resolve();
          } else {
            reject(new Error("Failed to add supplier"));
          }
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Adding supplier...',
        success: 'Supplier added successfully! 🎉',
        error: 'Failed to add supplier',
      }
    );
  }

  async function handleEditSupplier(e) {
    e.preventDefault();

    const loadingToast = showToast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const updatedSupplier = await editSupplier(
            tokenPayload.token, 
            editSupplierData._id, 
            editSupplierData
          );
          if (updatedSupplier?.data) {
            await loadSuppliers();
            closeModal();
            resolve();
          } else {
            reject(new Error("Failed to update supplier"));
          }
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Updating supplier...',
        success: 'Supplier updated successfully! ✨',
        error: 'Failed to update supplier',
      }
    );
  }

  async function handleDeleteSupplier() {
    if (!supplierToDelete) return;

    const loadingToast = showToast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await deleteSupplier(tokenPayload.token, supplierToDelete);
          await loadSuppliers();
          setIsDeleteConfirmOpen(false);
          setSupplierToDelete(null);
          resolve();
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Deleting supplier...',
        success: 'Supplier deleted successfully',
        error: 'Failed to delete supplier',
      }
    );
  }

  function openAddSupplierModal() {
    resetAddForm();
    setIsAddSupplierModalOpen(true);
  }

  function openEditSupplierModal(id) {
    const supplier = suppliers.find((s) => s._id === id);
    if (supplier) {
      setEditSupplierData({
        _id: supplier._id,
        supplierName: supplier.supplierName || "",
        contactPerson: supplier.contactPerson || "",
        phoneNumber: supplier.phoneNumber || "",
        email: supplier.email || "",
        address: supplier.address || "",
      });
      setIsEditSupplierModalOpen(true);
    }
  }

  function openDeleteConfirm(id) {
    setSupplierToDelete(id);
    setIsDeleteConfirmOpen(true);
  }

  function openViewSupplier(supplier) {
    setViewSupplier(supplier);
  }

  function closeModal() {
    setIsAddSupplierModalOpen(false);
    setIsEditSupplierModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setViewSupplier(null);
    setFeedback("");
  }

  function handleExport() {
    const csvContent = [
      ["Supplier Name", "Contact Person", "Phone", "Email", "Address"].join(","),
      ...suppliers.map(s => [
        s.supplierName,
        s.contactPerson || "N/A",
        s.phoneNumber || "N/A",
        s.email || "N/A",
        s.address || "N/A"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suppliers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast.success("Suppliers exported successfully");
  }

  useEffect(() => {
    if (tokenPayload?.token) {
      loadSuppliers();
    }
  }, [tokenPayload?.token]);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const search = searchTerm.toLowerCase();
    return (
      (supplier.supplierName || "").toLowerCase().includes(search) ||
      (supplier.contactPerson || "").toLowerCase().includes(search) ||
      (supplier.email || "").toLowerCase().includes(search) ||
      (supplier.phoneNumber || "").toLowerCase().includes(search)
    );
  });

  if (isLoading && suppliers.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Suppliers</h1>
              <p className="text-emerald-100 text-lg">
                Manage your supplier network efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={Download} 
                onClick={handleExport}
                className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30"
              >
                Export
              </Button>
              <Button 
                icon={Plus} 
                onClick={openAddSupplierModal}
                className="!bg-white text-white hover:!bg-emerald-50"
              >
                Add Supplier
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Suppliers', value: analytics.totalSuppliers, icon: Building2, color: 'from-white/20 to-white/10' },
              { label: 'With Email', value: analytics.withEmail, icon: Mail, color: 'from-blue-400/30 to-blue-500/20' },
              { label: 'With Phone', value: analytics.withPhone, icon: Phone, color: 'from-amber-400/30 to-amber-500/20' },
              { label: 'With Address', value: analytics.withAddress, icon: MapPin, color: 'from-purple-400/30 to-purple-500/20' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/20 p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-white/80" />
                  <ArrowUpRight className="w-4 h-4 text-white/60" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search suppliers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
            />
          </div>
          <Button variant="secondary" icon={RefreshCcw} onClick={loadSuppliers}>
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Suppliers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier, index) => (
                    <motion.tr
                      key={supplier._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {supplier.supplierName}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {supplier._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {supplier.contactPerson || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {supplier.phoneNumber ? (
                          <a 
                            href={`tel:${supplier.phoneNumber}`}
                            className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {supplier.phoneNumber}
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {supplier.email ? (
                          <a 
                            href={`mailto:${supplier.email}`}
                            className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {supplier.email}
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 max-w-xs truncate">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                          <span className="truncate">{supplier.address || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openViewSupplier(supplier)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Building2 className="w-4 h-4 text-slate-600" />
                          </button>
                          <button
                            onClick={() => openEditSupplierModal(supplier._id)}
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(supplier._id)}
                            className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No suppliers found</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {searchTerm ? 'Try adjusting your search' : 'Add your first supplier to get started'}
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Supplier Modal */}
      <Modal isOpen={isAddSupplierModalOpen} closeButton={false} onClose={closeModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[95vw] max-w-lg p-6"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Supplier</h2>
                <p className="text-sm text-slate-500">Create a new supplier entry</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAddSupplier}>
            {feedback && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {feedback}
              </div>
            )}

            <Input
              label="Supplier Name"
              id="supplierName"
              placeholder="Enter supplier name"
              value={addSupplierData.supplierName}
              onChange={(e) => setAddSupplierData({ ...addSupplierData, supplierName: e.target.value })}
              icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
            />

            <Input
              label="Contact Person"
              id="contactPerson"
              placeholder="Enter contact person name"
              value={addSupplierData.contactPerson}
              onChange={(e) => setAddSupplierData({ ...addSupplierData, contactPerson: e.target.value })}
              icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
            />

            <Input
              label="Phone Number"
              id="phoneNumber"
              placeholder="Enter phone number"
              type="tel"
              value={addSupplierData.phoneNumber}
              onChange={(e) => setAddSupplierData({ ...addSupplierData, phoneNumber: e.target.value })}
              icon={<MdOutlinePhone size={20} color="#75777D" />}
            />

            <Input
              label="Email Address"
              id="email"
              placeholder="Enter email address"
              type="email"
              value={addSupplierData.email}
              onChange={(e) => setAddSupplierData({ ...addSupplierData, email: e.target.value })}
              icon={<MdOutlineMail size={20} color="#75777D" />}
              required={false}
            />

            <Input
              label="Address"
              id="address"
              placeholder="Enter full address"
              value={addSupplierData.address}
              onChange={(e) => setAddSupplierData({ ...addSupplierData, address: e.target.value })}
              icon={<MdOutlineLocationOn size={20} color="#75777D" />}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Supplier
              </Button>
            </div>
          </form>
        </motion.div>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal isOpen={isEditSupplierModalOpen} closeButton={false} onClose={closeModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[95vw] max-w-lg p-6"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Edit className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Supplier</h2>
                <p className="text-sm text-slate-500">Update supplier details</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleEditSupplier}>
            <Input
              label="Supplier Name"
              id="editSupplierName"
              placeholder="Enter supplier name"
              value={editSupplierData.supplierName}
              onChange={(e) => setEditSupplierData({ ...editSupplierData, supplierName: e.target.value })}
              icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
            />

            <Input
              label="Contact Person"
              id="editContactPerson"
              placeholder="Enter contact person name"
              value={editSupplierData.contactPerson}
              onChange={(e) => setEditSupplierData({ ...editSupplierData, contactPerson: e.target.value })}
              icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
            />

            <Input
              label="Phone Number"
              id="editPhoneNumber"
              placeholder="Enter phone number"
              type="tel"
              value={editSupplierData.phoneNumber}
              onChange={(e) => setEditSupplierData({ ...editSupplierData, phoneNumber: e.target.value })}
              icon={<MdOutlinePhone size={20} color="#75777D" />}
            />

            <Input
              label="Email Address"
              id="editEmail"
              placeholder="Enter email address"
              type="email"
              value={editSupplierData.email}
              onChange={(e) => setEditSupplierData({ ...editSupplierData, email: e.target.value })}
              icon={<MdOutlineMail size={20} color="#75777D" />}
              required={false}
            />

            <Input
              label="Address"
              id="editAddress"
              placeholder="Enter full address"
              value={editSupplierData.address}
              onChange={(e) => setEditSupplierData({ ...editSupplierData, address: e.target.value })}
              icon={<MdOutlineLocationOn size={20} color="#75777D" />}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={closeModal} closeButton={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[95vw] max-w-md p-6 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Supplier</h2>
          <p className="text-slate-600 mb-6">
            Are you sure you want to delete this supplier? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSupplier} className="flex-1">
              Delete
            </Button>
          </div>
        </motion.div>
      </Modal>

      {/* View Supplier Modal */}
      <Modal isOpen={!!viewSupplier} onClose={closeModal} closeButton={false}>
        {viewSupplier && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[95vw] max-w-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{viewSupplier.supplierName}</h2>
                <p className="text-sm text-slate-500">Supplier Details</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Contact Person', value: viewSupplier.contactPerson || 'N/A', icon: UserCheck },
                { label: 'Phone Number', value: viewSupplier.phoneNumber || 'N/A', icon: Phone },
                { label: 'Email', value: viewSupplier.email || 'N/A', icon: Mail },
                { label: 'Address', value: viewSupplier.address || 'N/A', icon: MapPin },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                  <p className="font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button variant="secondary" onClick={closeModal} className="w-full">
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}












































// // frontend-inventory-manager/src/pages/Suppliers.jsx
// import { useContext, useEffect, useState } from "react";
// import { MdOutlineInventory2, MdOutlineLocationOn, MdOutlineMail, MdOutlinePersonOutline, MdOutlinePhone } from "react-icons/md";
// import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import Button from "../components/Button";
// import Modal from "../components/Modal";
// import { addSupplier, editSupplier, getSuppliers, deleteSupplier } from "../utils/fn";
// import { TokenContext } from "../context/TokenContext";
// import PageLoader from "./PageLoader";
// import Input from "../components/Input";
// import { SupplierContext, SupplierDispatchContext } from "../context/SupplierContext";

// export default function Suppliers() {

//   const tokenPayload = useContext(TokenContext)
//   const supplierPayload = useContext(SupplierContext)
//   const supplierDispatch = useContext(SupplierDispatchContext)

//   console.log(supplierPayload)

//   const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
//   const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);

//   const [suppliers, setSuppliers] = useState(supplierPayload || []);
//   const [isLoading, setIsLoading] = useState(false);

//   const [addSupplierData, setAddSupplierData] = useState({
//     supplierName: "",
//     contactPerson: "",
//     phoneNumber: "",
//     email: "",
//     address: "",
//   })

//   const [editSupplierData, setEditSupplierData] = useState({
//     id: "",
//     supplierName: "",
//     contactPerson: "",
//     phoneNumber: "",
//     email: "",
//     address: "",
//   })

//   function openAddSupplierModal() {
//     setIsAddSupplierModalOpen(true);
//   }

//   function openEditSupplierModal(id) {
//     console.log(id)
//     setIsEditSupplierModalOpen(true);
//     setEditSupplierData(suppliers.find((supplier) => supplier._id === id));
//   }

//   function closeModal() {
//     setIsAddSupplierModalOpen(false);
//     setIsEditSupplierModalOpen(false);
//   }


//   async function handleAddSupplier(e) {
//     try {
//       e.preventDefault();
//       setIsLoading(true);

//       const newSupplier = await addSupplier(tokenPayload.token, addSupplierData);

//       if (newSupplier) {
//         setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier.data]);
//         supplierDispatch({
//           action: "add",
//           payload: newSupplier
//         })

//       }

//       closeModal();
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function handleEditSupplier(e) {
//     try {
//       e.preventDefault();
//       setIsLoading(true);

//       const updatedSupplier = await editSupplier(tokenPayload.token, editSupplierData._id, editSupplierData);

//       if (updatedSupplier) {
//         setSuppliers((prevSuppliers) =>
//           prevSuppliers.map((supplier) =>
//             supplier._id === updatedSupplier.data._id ? updatedSupplier.data : supplier
//           )
//         );
//       }

//       closeModal();
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function deleteSupplier(id) {
//     try {
//       setIsLoading(true);
//       const deletedSupplier = await deleteSupplier(tokenPayload.token, id);

//       if (deletedSupplier) {
//         setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id));
//       }
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // useEffect(() => {
//   //   async function call() {
//   //     try {
//   //       setIsLoading(true);
//   //       const response = await getSuppliers(tokenPayload.token);
//   //       console.log(response);
//   //       if (response) {
//   //         setSuppliers(response.data);
//   //       }
//   //     } catch (error) {
//   //       console.log(error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   }

//   //   call();
//   // }, []);

//   if (isLoading) {
//     return <PageLoader />;
//   }


//   return (
//     <div className="space-y-6">
//       <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
//           <p className="mt-1 text-sm leading-6 text-slate-600">Manage your supplier information and contact details with a modern, consistent interface.</p>
//         </div>
//         <div className="flex flex-col gap-3 sm:flex-row">
//           <Button onClick={openAddSupplierModal} className="w-full sm:w-auto">Add New Supplier</Button>
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
//         <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
//           <h2 className="text-lg font-semibold text-slate-900">Current Suppliers</h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left text-sm text-slate-700">
//             <thead className="bg-slate-50 text-slate-500">
//               <tr>
//                 <th className="px-5 py-3 font-semibold">Supplier</th>
//                 <th className="px-5 py-3 font-semibold">Phone</th>
//                 <th className="px-5 py-3 font-semibold">Email</th>
//                 <th className="px-5 py-3 font-semibold">Contact Person</th>
//                 <th className="px-5 py-3 font-semibold">Address</th>
//                 <th className="px-5 py-3 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {suppliers.length > 0 ? (
//                 suppliers.map((supplier) => (
//                   <tr key={supplier._id} className="border-t border-slate-200 hover:bg-slate-50">
//                     <td className="px-5 py-4 text-slate-600">{supplier.supplierName}</td>
//                     <td className="px-5 py-4 text-slate-600">{supplier.phoneNumber}</td>
//                     <td className="px-5 py-4 text-slate-600">{supplier.email}</td>
//                     <td className="px-5 py-4 text-slate-600">{supplier.contactPerson}</td>
//                     <td className="px-5 py-4 text-slate-600">{supplier.address}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex gap-2">
//                         <button
//                           type="button"
//                           onClick={() => openEditSupplierModal(supplier._id)}
//                           className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-900 transition hover:bg-slate-100"
//                         >
//                           <FiEdit2 size={16} />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => deleteSupplier(supplier._id)}
//                           disabled={isLoading}
//                           className="rounded-full border border-slate-200 bg-slate-50 p-2 text-red-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">
//                     No suppliers added yet. Use the button above to create one.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>


//       {/* Add supplier modal */}
//       <Modal isOpen={isAddSupplierModalOpen} closeButton={false} onClose={closeModal}>
//         <form className="space-y-4" onSubmit={handleAddSupplier}>
//           <Input
//             className="w-full"
//             id="supplierName"
//             label="Supplier Name"
//             placeholder="Enter supplier name"
//             value={addSupplierData.supplierName}
//             onChange={(event) => setAddSupplierData({ ...addSupplierData, supplierName: event.target.value })}
//             icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
//           />

//           <Input
//             className="w-full"
//             id="phoneNumber"
//             label="Phone Number"
//             placeholder="Enter phone number"
//             type="tel"
//             value={addSupplierData.phoneNumber}
//             onChange={(event) => setAddSupplierData({ ...addSupplierData, phoneNumber: event.target.value })}
//             icon={<MdOutlinePhone size={20} color="#75777D" />}
//           />

//           <Input
//             className="w-full"
//             id="email"
//             label="Email"
//             placeholder="Enter email address"
//             type="email"
//             value={addSupplierData.email}
//             onChange={(event) => setAddSupplierData({ ...addSupplierData, email: event.target.value })}
//             icon={<MdOutlineMail size={20} color="#75777D" />}
//             required={false}
//           />

//           <Input
//             className="w-full"
//             id="contactPerson"
//             label="Contact Person"
//             placeholder="Enter contact person"
//             value={addSupplierData.contactPerson}
//             onChange={(event) => setAddSupplierData({ ...addSupplierData, contactPerson: event.target.value })}
//             icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
//             required={false}
//           />

//           <Input
//             className="w-full"
//             id="address"
//             label="Address"
//             placeholder="Enter address"
//             value={addSupplierData.address}
//             onChange={(event) => setAddSupplierData({ ...addSupplierData, address: event.target.value })}
//             icon={<MdOutlineLocationOn size={20} color="#75777D" />}
//           />

//           <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={closeModal}
//               className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]"
//             >
//               Cancel
//             </button>
//             <Button type="submit" className="w-auto px-5">
//               Add Supplier
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Edit supplier modal */}
//       <Modal isOpen={isEditSupplierModalOpen} closeButton={false} onClose={closeModal}>
//         <form className="space-y-4" onSubmit={handleEditSupplier}>
//           <Input
//             className="w-full"
//             id="editSupplierName"
//             label="Supplier Name"
//             placeholder="Enter supplier name"
//             value={editSupplierData?.supplierName || ""}
//             onChange={(event) => setEditSupplierData({ ...editSupplierData, supplierName: event.target.value })}
//             icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
//           />

//           <Input
//             className="w-full"
//             id="editPhoneNumber"
//             label="Phone Number"
//             placeholder="Enter phone number"
//             type="tel"
//             value={editSupplierData?.phoneNumber || ""}
//             onChange={(event) => setEditSupplierData({ ...editSupplierData, phoneNumber: event.target.value })}
//             icon={<MdOutlinePhone size={20} color="#75777D" />}
//           />

//           <Input
//             className="w-full"
//             id="editEmail"
//             label="Email"
//             placeholder="Enter email address"
//             type="email"
//             value={editSupplierData?.email || ""}
//             onChange={(event) => setEditSupplierData({ ...editSupplierData, email: event.target.value })}
//             icon={<MdOutlineMail size={20} color="#75777D" />}
//             required={false}
//           />

//           <Input
//             className="w-full"
//             id="editContactPerson"
//             label="Contact Person"
//             placeholder="Enter contact person"
//             value={editSupplierData?.contactPerson || ""}
//             onChange={(event) => setEditSupplierData({ ...editSupplierData, contactPerson: event.target.value })}
//             icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
//             required={false}
//           />

//           <Input
//             className="w-full"
//             id="editAddress"
//             label="Address"
//             placeholder="Enter address"
//             value={editSupplierData?.address || ""}
//             onChange={(event) => setEditSupplierData({ ...editSupplierData, address: event.target.value })}
//             icon={<MdOutlineLocationOn size={20} color="#75777D" />}
//           />

//           <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
//             <button
//               type="button"
//               onClick={closeModal}
//               className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]"
//             >
//               Cancel
//             </button>
//             <Button type="submit" className="w-auto px-5">
//               Update Supplier
//             </Button>
//           </div>
//         </form>
//       </Modal>

//     </div>
//   );
// }


