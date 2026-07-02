import { useContext, useEffect, useState } from "react";
import { MdOutlineInventory2, MdOutlineAttachMoney, MdOutlineCategory, MdOutlineLowPriority, MdOutlineNumbers } from "react-icons/md";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";

import { TokenContext } from "../context/TokenContext";
import { addProduct, getProducts, editProduct } from "../utils/fn";
import PageLoader from "./PageLoader";
import { SupplierContext } from "../context/SupplierContext";

const emptyProductForm = {
  productName: "",
  quantity: "",
  unitPrice: "",
  unit: "",
  reorderLevel: "",
  category: "General",
};

function Products() {

  const tokenPayload = useContext(TokenContext)
  const supplierPayload = useContext(SupplierContext)

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const [addProductData, setAddProductData] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    unit: "",
    reorderLevel: "",
    supplier: "",
    currentStockQuantity: "",

  })

  const [editProductData, setEditProductData] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    unit: "",
    reorderLevel: "",
    supplier: "",
    currentStockQuantity: "",
  })

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);



  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState("")

  const [formData, setFormData] = useState(emptyProductForm);

  const [products, setProducts] = useState([]);

  async function loadProducts() {
    if (!tokenPayload?.token) {
      setProducts([]);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getProducts(tokenPayload.token);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error(error);
      setFeedback("Could not load products from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetAddProductForm() {
    setAddProductData({
      productName: "",
      quantity: "",
      unitPrice: "",
      unit: "",
      reorderLevel: "",
      supplier: "",
    });
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!tokenPayload?.token) {
      setFeedback("Please sign in before adding a product.");
      return;
    }

    if (!addProductData.productName?.trim()) {
      setFeedback("Please enter a product name.");
      return;
    }

    try {
      setIsLoading(true);
      setFeedback("");

      const payload = {
        productName: addProductData.productName.trim(),
        quantity: Number(addProductData.quantity || 0),
        currentStock: Number(addProductData.quantity || 0),
        unitPrice: Number(addProductData.unitPrice || 0),
        unit: addProductData.unit.trim(),
        reorderLevel: Number(addProductData.reorderLevel || 0),
        supplier: addProductData.supplier || "",

      };

      const res = await addProduct(tokenPayload.token, payload);
      if (res?.success !== false) {
        setProducts((prevProducts) => [res?.data ?? { ...payload, _id: Date.now().toString() }, ...prevProducts]);
        closeModal();
        resetAddProductForm();
        await loadProducts();
      } else {
        setFeedback("The server rejected the product request.");
      }
    } catch (error) {
      console.error(error);
      setFeedback("Unable to add the product right now.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEditProduct(e) {
    try {
      e.preventDefault()
      setIsLoading(true)
      const response = await editProduct(tokenPayload.token,
        editProductData._id || editProductData.id, { editProductData })
      if (response?.success) {
        console.log(response)
        await loadProducts();
      }
        closeModal();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  function openAddProductModal() {
    setIsAddProductModalOpen(true);
  }

  function openEditProductModal(id) {
    setEditProductData(products.find((product) => (product._id || product.id) === id));
    setIsEditProductModalOpen(true);
    console.log(editProductData);
  }

  function closeModal() {
    setIsAddProductModalOpen(false);
    setIsEditProductModalOpen(false);
  }

  useEffect(() => {
    loadProducts();
  }, [tokenPayload?.token]);

  if (isLoading) {
    return <PageLoader />;
  }


  return (
    <div className="space-y-6">
      <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">Manage your inventory catalog and stock levels with a clean and modern interface.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={openAddProductModal} className="w-full sm:w-auto">Add New Product</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Current Products</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((product) => (
                <tr key={product._id || product.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{product.name || product.productName}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category || "General"}</td>
                  <td className="px-5 py-4 text-slate-600">{product.currentStock ?? product.quantity ?? 0}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(product._id || product.id)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )) : <tr>
                <td colSpan={4} className="text-center py-5">
                  No product added yet
                </td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddProductModalOpen} onClose={closeModal} closeButton={false}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#191C1E]">Add Product</h2>
          <p className="text-sm text-[#45474C]">Fill in the details below to create a new product entry.</p>
        </div>
        <form className="space-y-4" onSubmit={handleAddProduct}>
          {feedback ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{feedback}</div> : null}
          <Input
            className="w-full"
            id="productName"
            placeholder="Enter Product Name"
            label="Product Name"
            value={addProductData.productName}
            onChange={(event) => setAddProductData({ ...addProductData, productName: event.target.value })}
            icon={<MdOutlineInventory2 size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="quantity"
            placeholder="Enter Quantity"
            label="Quantity"
            type="number"
            value={addProductData.quantity}
            onChange={(event) => setAddProductData({ ...addProductData, quantity: event.target.value })}
            icon={<MdOutlineNumbers size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="unitPrice"
            placeholder="Enter Unit Price"
            label="Unit Price"
            type="number"
            value={addProductData.unitPrice}
            onChange={(event) => setAddProductData({ ...addProductData, unitPrice: event.target.value })}
            icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="unit"
            placeholder="Enter Unit"
            label="Unit"
            value={addProductData.unit}
            onChange={(event) => setAddProductData({ ...addProductData, unit: event.target.value })}
            icon={<MdOutlineCategory size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="reorderLevel"
            placeholder="Enter Reorder Level"
            label="Reorder Level"
            type="number"
            value={addProductData.reorderLevel}
            onChange={(event) => setAddProductData({ ...addProductData, reorderLevel: event.target.value })}
            icon={<MdOutlineLowPriority size={20} color="#75777D" />}
          />
          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Suppliers
            </label>
            <select
              className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              value={addProductData.supplier || ""}
              onChange={(e) =>
                setAddProductData({
                  ...addProductData,
                  supplier: e.target.value,
                })
              }
            >
              <option value="">Select Supplier</option>

              {supplierPayload.map((supplier) => (
                <option
                  key={supplier._id}
                  value={supplier._id}
                >
                  {supplier.supplierName}
                </option>
              ))}
            </select>

          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeModal} className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]">
              Cancel
            </button>
            <Button type="submit" className="w-auto px-5">
              Add Product
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditProductModalOpen} onClose={closeModal} closeButton={false}>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#191C1E]">Edit Product</h2>
          <p className="text-sm text-[#45474C]">Update the product details below.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={handleEditProduct}
        >
          <Input
            className="w-full"
            id="editProductName"
            placeholder="Update Product Name"
            label="Product Name"
            value={editProductData.productName}
            onChange={(event) => setEditProductData({ ...editProductData, productName: event.target.value })}
            icon={<MdOutlineInventory2 size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="editQuantity"
            placeholder="Update Quantity"
            label="Quantity"
            type="number"
            value={editProductData.quantity}
            onChange={(event) => setEditProductData({ ...editProductData, quantity: event.target.value })}
            icon={<MdOutlineNumbers size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="editUnitPrice"
            placeholder="Update Unit Price"
            label="Unit Price"
            type="number"
            value={editProductData.unitPrice}
            onChange={(event) => setEditProductData({ ...editProductData, unitPrice: event.target.value })}
            icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="editUnit"
            placeholder="Update Unit"
            label="Unit"
            value={editProductData.unit}
            onChange={(event) => setEditProductData({ ...editProductData, unit: event.target.value })}
            icon={<MdOutlineCategory size={20} color="#75777D" />}
          />
          <Input
            className="w-full"
            id="editReorderLevel"
            placeholder="Update Reorder Level"
            label="Reorder Level"
            type="number"
            value={editProductData.reorderLevel}
            onChange={(event) => setEditProductData({ ...editProductData, reorderLevel: event.target.value })}
            icon={<MdOutlineLowPriority size={20} color="#75777D" />}
          />
          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Suppliers
            </label>
            <select
              className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              value={editProductData.supplier || ""}
              onChange={(e) =>
                setEditProductData({
                  ...editProductData,
                  supplier: e.target.value,
                })
              }
            >
              <option value="">Select Supplier</option>

              {supplierPayload.map((supplier) => (
                <option
                  key={supplier._id}
                  value={supplier._id}
                >
                  {supplier.supplierName}
                </option>
              ))}
            </select>

          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeModal} className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]">
              Cancel
            </button>
            <Button type="submit" className="w-auto px-5">Save Changes</Button>
          </div>
        </form>

      </Modal>
    </div>
  );
}

export default Products;