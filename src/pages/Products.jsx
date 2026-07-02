import { useContext, useEffect, useState } from "react";
import { MdOutlineInventory2, MdOutlineAttachMoney, MdOutlineCategory, MdOutlineLowPriority, MdOutlineNumbers } from "react-icons/md";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { addInventoryProduct, getInventoryData, updateInventoryProduct } from "../utils/inventoryStorage";
import { TokenContext } from "../context/TokenContext";
import { addProduct, getProducts } from "../utils/fn";

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

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const [addProductData, setAddProductData] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    unit: "",
    reorderLevel: "",
    supplier: ""
  })

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isLoading, setIsLoading] = useState(false)


  const [formData, setFormData] = useState(emptyProductForm);

  const [products, setProducts] = useState([]);

  async function handleAddProduct(e) {
    e.preventDefault();
    try {
      setIsLoading(true)
      const res = await addProduct(tokenPayload.token, addProductData)
    } catch (error) {

    } finally {
      setIsLoading(false)
    }
  }

  function openAddProductModal() {
    setIsAddProductModalOpen(true);
  }

  function openEditProductModal(product) {

    setIsEditProductModalOpen(true);
  }

  function closeModal() {
    setIsAddProductModalOpen(false);
    setIsEditProductModalOpen(false);
  }

  useEffect(() => {
    async function call() {
      try {
        const data = await getProducts(tokenPayload.token)
        console.log(data)
        if (data.success) {
          setProducts(data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    call()

  }, []);


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
                <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{product.name || product.productName}</td>
                  <td className="px-5 py-4 text-slate-600">{product.category}</td>
                  <td className="px-5 py-4 text-slate-600">{product.currentStock}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => openEditProductModal(product)}
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
        <div className="w-[92vw] max-w-md rounded-2xl border border-[#C5C6CD] bg-white p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#191C1E]">Add Product</h2>
            <p className="text-sm text-[#45474C]">Fill in the details below to create a new product entry.</p>
          </div>
          <form className="space-y-4" onSubmit={handleAddProduct}>
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
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]">
                Cancel
              </button>
              <Button type="submit" className="w-auto px-5">Add Product</Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isEditProductModalOpen} onClose={closeModal} closeButton={false}>
        <div className="w-[92vw] max-w-md rounded-2xl border border-[#C5C6CD] bg-white p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#191C1E]">Edit Product</h2>
            <p className="text-sm text-[#45474C]">Update the product details below.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSaveProduct}>
            <Input
              className="w-full"
              id="editProductName"
              placeholder="Update Product Name"
              label="Product Name"
              value={formData.productName}
              onChange={(event) => setFormData({ ...formData, productName: event.target.value })}
              icon={<MdOutlineInventory2 size={20} color="#75777D" />}
            />
            <Input
              className="w-full"
              id="editQuantity"
              placeholder="Update Quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
              icon={<MdOutlineNumbers size={20} color="#75777D" />}
            />
            <Input
              className="w-full"
              id="editUnitPrice"
              placeholder="Update Unit Price"
              label="Unit Price"
              type="number"
              value={formData.unitPrice}
              onChange={(event) => setFormData({ ...formData, unitPrice: event.target.value })}
              icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
            />
            <Input
              className="w-full"
              id="editUnit"
              placeholder="Update Unit"
              label="Unit"
              value={formData.unit}
              onChange={(event) => setFormData({ ...formData, unit: event.target.value })}
              icon={<MdOutlineCategory size={20} color="#75777D" />}
            />
            <Input
              className="w-full"
              id="editReorderLevel"
              placeholder="Update Reorder Level"
              label="Reorder Level"
              type="number"
              value={formData.reorderLevel}
              onChange={(event) => setFormData({ ...formData, reorderLevel: event.target.value })}
              icon={<MdOutlineLowPriority size={20} color="#75777D" />}
            />
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]">
                Cancel
              </button>
              <Button type="submit" className="w-auto px-5">Save Changes</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Products;