import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdOutlineInventory2, MdOutlineAttachMoney, 
  MdOutlineCategory, MdOutlineLowPriority, MdOutlineNumbers 
} from "react-icons/md";
import { 
  Package, Plus, Search, Filter, Download, 
  Eye, Edit, Trash2, TrendingUp, AlertTriangle,
  ArrowUpRight, RefreshCcw
} from "../components/Icons";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { TokenContext } from "../context/TokenContext";
import { SupplierContext } from "../context/SupplierContext";
import { addProduct, getProducts, editProduct, deleteProduct } from "../utils/fn";
import { showToast } from "../utils/toast";
import PageLoader from "./PageLoader";

const emptyProductForm = {
  productName: "",
  quantity: "",
  unitPrice: "",
  unit: "",
  reorderLevel: "",
  category: "General",
  supplier: "",
};

function Products() {
  const tokenPayload = useContext(TokenContext);
  const supplierPayload = useContext(SupplierContext);

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [addProductData, setAddProductData] = useState({
    productName: "",
    quantity: "",
    unitPrice: "",
    unit: "",
    reorderLevel: "",
    supplier: "",
    category: "General",
  });

  const [editProductData, setEditProductData] = useState({
    _id: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    unit: "",
    reorderLevel: "",
    supplier: "",
    category: "General",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [products, setProducts] = useState([]);

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: [],
  });

  // async function loadProducts() {
  //   if (!tokenPayload?.token) {
  //     setProducts([]);
  //     return;
  //   }
  //   try {
  //     setIsLoading(true);
  //     const data = await getProducts(tokenPayload.token);
  //     if (data?.success) {
  //       setProducts(data.data);
  //       calculateAnalytics(data.data);
  //     } else {
  //       setFeedback("Failed to load products");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setFeedback("Could not load products from the server.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }


async function loadProducts() {
  if (!tokenPayload?.token) {
    setProducts([]);
    return;
  }
  try {
    setIsLoading(true);
    const data = await getProducts(tokenPayload.token);
    console.log("Loaded products:", data);
    
    if (data?.success && data?.data) {
      setProducts(data.data);
      calculateAnalytics(data.data);
      setFeedback("");
    } else if (data?.data) {
      // Handle case where data might not have success property
      setProducts(data.data);
      calculateAnalytics(data.data);
      setFeedback("");
    } else {
      console.warn("No products data received");
      setFeedback("No products found");
    }
  } catch (error) {
    console.error("Load products error:", error);
    setFeedback("Could not load products from the server.");
  } finally {
    setIsLoading(false);
  }
}


  function calculateAnalytics(productsData) {
    const totalValue = productsData.reduce((sum, p) => 
      sum + ((p.quantity || 0) * (p.unitPrice || 0)), 0
    );
    const lowStock = productsData.filter(p => 
      (p.quantity || 0) <= (p.reorderLevel || 5) && (p.quantity || 0) > 0
    ).length;
    const outOfStock = productsData.filter(p => (p.quantity || 0) === 0).length;
    
    const categories = [...new Set(productsData.map(p => p.category || 'General'))];

    setAnalytics({
      totalProducts: productsData.length,
      totalValue,
      lowStock,
      outOfStock,
      categories,
    });
  }

  function resetAddProductForm() {
    setAddProductData({
      productName: "",
      quantity: "",
      unitPrice: "",
      unit: "",
      reorderLevel: "",
      supplier: "",
      category: "General",
    });
    setFeedback("");
  }

  // async function handleAddProduct(e) {
  //   e.preventDefault();
  //   if (!tokenPayload?.token) {
  //     showToast.error("Please sign in first");
  //     return;
  //   }

  //   if (!addProductData.productName?.trim()) {
  //     setFeedback("Please enter a product name.");
  //     return;
  //   }

  //   const loadingToast = showToast.promise(
  //     new Promise(async (resolve, reject) => {
  //       try {
  //         const payload = {
  //           productName: addProductData.productName.trim(),
  //           quantity: Number(addProductData.quantity || 0),
  //           unitPrice: Number(addProductData.unitPrice || 0),
  //           unit: addProductData.unit?.trim() || "pcs",
  //           reorderLevel: Number(addProductData.reorderLevel || 0),
  //           supplier: addProductData.supplier || undefined,
  //           category: addProductData.category || "General",
  //         };

  //         const res = await addProduct(tokenPayload.token, payload);
  //         if (res?.success !== false) {
  //           await loadProducts();
  //           closeModal();
  //           resetAddProductForm();
  //           resolve();
  //         } else {
  //           reject(new Error("Server rejected the request"));
  //         }
  //       } catch (error) {
  //         reject(error);
  //       }
  //     }),
  //     {
  //       loading: 'Adding product...',
  //       success: 'Product added successfully! 🎉',
  //       error: 'Failed to add product',
  //     }
  //   );
  // }

  async function handleAddProduct(e) {
  e.preventDefault();
  if (!tokenPayload?.token) {
    showToast.error("Please sign in first");
    return;
  }

  if (!addProductData.productName?.trim()) {
    setFeedback("Please enter a product name.");
    return;
  }

  try {
    setIsLoading(true);
    setFeedback("");

    // const payload = {
    //   productName: addProductData.productName.trim(),
    //   quantity: Number(addProductData.quantity || 0),
    //   unitPrice: Number(addProductData.unitPrice || 0),
    //   unit: addProductData.unit?.trim() || "pcs",
    //   reorderLevel: Number(addProductData.reorderLevel || 0),
    //   supplier: addProductData.supplier || undefined,
    //   category: addProductData.category || "General",
    // };




    const payload = {
      productName: addProductData.productName.trim(),
      quantity: Number(addProductData.quantity || 0),
      unitPrice: Number(addProductData.unitPrice || 0),
      unit: addProductData.unit?.trim() || "pcs",
      reorderLevel: Number(addProductData.reorderLevel || 0),
      // Only include supplier if it's a valid ObjectId (not empty string)
      ...(addProductData.supplier && addProductData.supplier !== "" 
        ? { supplier: addProductData.supplier } 
        : {}
      ),
    };




    const res = await addProduct(tokenPayload.token, payload);
    
    if (res?.success !== false) {
      closeModal();
      resetAddProductForm();
      await loadProducts(); // Reload from backend
      showToast.success("Product added successfully! 🎉");
    } else {
      showToast.error("Failed to add product");
    }
  } catch (error) {
    console.error(error);
    showToast.error("Unable to add the product right now.");
  } finally {
    setIsLoading(false);
  }
}

  async function handleEditProduct(e) {
    e.preventDefault();
    
    const loadingToast = showToast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const productId = editProductData._id;
          const updateData = {
            productName: editProductData.productName,
            quantity: Number(editProductData.quantity),
            unitPrice: Number(editProductData.unitPrice),
            unit: editProductData.unit,
            reorderLevel: Number(editProductData.reorderLevel),
            supplier: editProductData.supplier || undefined,
            category: editProductData.category,
          };

          const response = await editProduct(tokenPayload.token, productId, updateData);
          if (response?.success) {
            await loadProducts();
            closeModal();
            resolve();
          } else {
            reject(new Error("Failed to update"));
          }
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Updating product...',
        success: 'Product updated successfully! ✨',
        error: 'Failed to update product',
      }
    );
  }

  async function handleDeleteProduct() {
    if (!productToDelete) return;

    const loadingToast = showToast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await deleteProduct(tokenPayload.token, productToDelete);
          await loadProducts();
          setIsDeleteConfirmOpen(false);
          setProductToDelete(null);
          resolve();
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Deleting product...',
        success: 'Product deleted successfully',
        error: 'Failed to delete product',
      }
    );
  }

  function openAddProductModal() {
    resetAddProductForm();
    setIsAddProductModalOpen(true);
  }

  function openEditProductModal(id) {
    const product = products.find((p) => (p._id || p.id) === id);
    if (product) {
      setEditProductData({
        _id: product._id || product.id,
        productName: product.productName || product.name || "",
        quantity: product.quantity || 0,
        unitPrice: product.unitPrice || 0,
        unit: product.unit || "",
        reorderLevel: product.reorderLevel || 0,
        supplier: product.supplier?._id || product.supplier || "",
        category: product.category || "General",
      });
      setIsEditProductModalOpen(true);
    }
  }

  function openDeleteConfirm(id) {
    setProductToDelete(id);
    setIsDeleteConfirmOpen(true);
  }

  function openViewProduct(product) {
    setViewProduct(product);
  }

  function closeModal() {
    setIsAddProductModalOpen(false);
    setIsEditProductModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setViewProduct(null);
    setFeedback("");
  }

  function handleExport() {
    const csvContent = [
      ["Product Name", "Category", "Quantity", "Unit Price", "Unit", "Reorder Level", "Total Value"].join(","),
      ...products.map(p => [
        p.productName,
        p.category || "General",
        p.quantity || 0,
        p.unitPrice || 0,
        p.unit || "pcs",
        p.reorderLevel || 0,
        (p.quantity || 0) * (p.unitPrice || 0)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast.success("Products exported successfully");
  }

  useEffect(() => {
    loadProducts();
  }, [tokenPayload?.token]);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.productName || product.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || 
      (product.category || "General") === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (isLoading && products.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Products</h1>
              <p className="text-indigo-100 text-lg">
                Manage your inventory catalog with precision
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
                onClick={openAddProductModal}
                className="!bg-white text-white hover:!bg-indigo-50"
              >
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Products', value: analytics.totalProducts, icon: Package, color: 'from-white/20 to-white/10' },
              { label: 'Total Value', value: `₦${analytics.totalValue.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-400/30 to-emerald-500/20' },
              { label: 'Low Stock', value: analytics.lowStock, icon: AlertTriangle, color: 'from-amber-400/30 to-amber-500/20' },
              { label: 'Out of Stock', value: analytics.outOfStock, icon: AlertTriangle, color: 'from-rose-400/30 to-rose-500/20' },
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
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
            >
              <option value="all">All Categories</option>
              {analytics.categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Button variant="secondary" icon={RefreshCcw} onClick={loadProducts}>
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
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
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => {
                    const stock = product.quantity || 0;
                    const reorderLevel = product.reorderLevel || 5;
                    const status = stock === 0 ? 'out' : stock <= reorderLevel ? 'low' : 'good';
                    const totalValue = stock * (product.unitPrice || 0);
                    
                    return (
                      <motion.tr
                        key={product._id || product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              status === 'out' ? 'bg-rose-100' : 
                              status === 'low' ? 'bg-amber-100' : 
                              'bg-emerald-100'
                            }`}>
                              <Package className={`w-5 h-5 ${
                                status === 'out' ? 'text-rose-600' : 
                                status === 'low' ? 'text-amber-600' : 
                                'text-emerald-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {product.productName || product.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                SKU: {(product._id || product.id)?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {product.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{stock}</p>
                            <p className="text-xs text-slate-500">{product.unit || 'pcs'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">
                            ₦{(product.unitPrice || 0).toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-indigo-600">
                            ₦{totalValue.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            status === 'out' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : status === 'low'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              status === 'out' ? 'bg-rose-500' : 
                              status === 'low' ? 'bg-amber-500' : 
                              'bg-emerald-500'
                            }`} />
                            {status === 'out' ? 'Out of Stock' : 
                             status === 'low' ? 'Low Stock' : 
                             'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openViewProduct(product)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                              onClick={() => openEditProductModal(product._id || product.id)}
                              className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-indigo-600" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(product._id || product.id)}
                              className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No products found</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {searchTerm ? 'Try adjusting your search' : 'Add your first product to get started'}
                      </p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddProductModalOpen} onClose={closeModal} closeButton={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[95vw] max-w-lg p-6"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Product</h2>
                <p className="text-sm text-slate-500">Create a new product entry</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAddProduct}>
            {feedback && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {feedback}
              </div>
            )}

            <Input
              label="Product Name"
              id="productName"
              placeholder="Enter product name"
              value={addProductData.productName}
              onChange={(e) => setAddProductData({ ...addProductData, productName: e.target.value })}
              icon={<MdOutlineInventory2 size={20} color="#75777D" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity"
                id="quantity"
                placeholder="0"
                type="number"
                value={addProductData.quantity}
                onChange={(e) => setAddProductData({ ...addProductData, quantity: e.target.value })}
                icon={<MdOutlineNumbers size={20} color="#75777D" />}
              />
              <Input
                label="Unit Price (₦)"
                id="unitPrice"
                placeholder="0.00"
                type="number"
                value={addProductData.unitPrice}
                onChange={(e) => setAddProductData({ ...addProductData, unitPrice: e.target.value })}
                icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Unit"
                id="unit"
                placeholder="pcs, kg, etc."
                value={addProductData.unit}
                onChange={(e) => setAddProductData({ ...addProductData, unit: e.target.value })}
                icon={<MdOutlineCategory size={20} color="#75777D" />}
              />
              <Input
                label="Reorder Level"
                id="reorderLevel"
                placeholder="5"
                type="number"
                value={addProductData.reorderLevel}
                onChange={(e) => setAddProductData({ ...addProductData, reorderLevel: e.target.value })}
                icon={<MdOutlineLowPriority size={20} color="#75777D" />}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                Category
              </label>
              <select
                value={addProductData.category}
                onChange={(e) => setAddProductData({ ...addProductData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option value="General">General</option>
                <option value="Electronics">Electronics</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Clothing">Clothing</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Raw Materials">Raw Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                Supplier
              </label>
              <select
                value={addProductData.supplier || ""}
                onChange={(e) => setAddProductData({ ...addProductData, supplier: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option value="">Select Supplier</option>
                {supplierPayload.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Product
              </Button>
            </div>
          </form>
        </motion.div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditProductModalOpen} onClose={closeModal} closeButton={false}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[95vw] max-w-lg p-6"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Edit className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
                <p className="text-sm text-slate-500">Update product details</p>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleEditProduct}>
            <Input
              label="Product Name"
              id="editProductName"
              placeholder="Product name"
              value={editProductData.productName}
              onChange={(e) => setEditProductData({ ...editProductData, productName: e.target.value })}
              icon={<MdOutlineInventory2 size={20} color="#75777D" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity"
                id="editQuantity"
                placeholder="0"
                type="number"
                value={editProductData.quantity}
                onChange={(e) => setEditProductData({ ...editProductData, quantity: e.target.value })}
                icon={<MdOutlineNumbers size={20} color="#75777D" />}
              />
              <Input
                label="Unit Price (₦)"
                id="editUnitPrice"
                placeholder="0.00"
                type="number"
                value={editProductData.unitPrice}
                onChange={(e) => setEditProductData({ ...editProductData, unitPrice: e.target.value })}
                icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Unit"
                id="editUnit"
                placeholder="pcs, kg, etc."
                value={editProductData.unit}
                onChange={(e) => setEditProductData({ ...editProductData, unit: e.target.value })}
                icon={<MdOutlineCategory size={20} color="#75777D" />}
              />
              <Input
                label="Reorder Level"
                id="editReorderLevel"
                placeholder="5"
                type="number"
                value={editProductData.reorderLevel}
                onChange={(e) => setEditProductData({ ...editProductData, reorderLevel: e.target.value })}
                icon={<MdOutlineLowPriority size={20} color="#75777D" />}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                Category
              </label>
              <select
                value={editProductData.category || "General"}
                onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option value="General">General</option>
                <option value="Electronics">Electronics</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Clothing">Clothing</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Raw Materials">Raw Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-2">
                Supplier
              </label>
              <select
                value={editProductData.supplier || ""}
                onChange={(e) => setEditProductData({ ...editProductData, supplier: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option value="">Select Supplier</option>
                {supplierPayload.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.supplierName}
                  </option>
                ))}
              </select>
            </div>

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
          <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Product</h2>
          <p className="text-slate-600 mb-6">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct} className="flex-1">
              Delete
            </Button>
          </div>
        </motion.div>
      </Modal>

      {/* View Product Modal */}
      <Modal isOpen={!!viewProduct} onClose={closeModal} closeButton={false}>
        {viewProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[95vw] max-w-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{viewProduct.productName}</h2>
                <p className="text-sm text-slate-500">SKU: {viewProduct._id?.slice(-8)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Quantity', value: `${viewProduct.quantity || 0} ${viewProduct.unit || 'pcs'}` },
                { label: 'Unit Price', value: `₦${(viewProduct.unitPrice || 0).toLocaleString()}` },
                { label: 'Total Value', value: `₦${((viewProduct.quantity || 0) * (viewProduct.unitPrice || 0)).toLocaleString()}` },
                { label: 'Reorder Level', value: viewProduct.reorderLevel || 0 },
                { label: 'Category', value: viewProduct.category || 'General' },
                { label: 'Supplier', value: viewProduct.supplier?.supplierName || 'N/A' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-slate-50">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
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

export default Products;


























































// // frontend-inventory-manager/src/pages/Products.jsx
// import { useContext, useEffect, useState } from "react";
// import { MdOutlineInventory2, MdOutlineAttachMoney, MdOutlineCategory, MdOutlineLowPriority, MdOutlineNumbers } from "react-icons/md";
// import Button from "../components/Button";
// import Input from "../components/Input";
// import Modal from "../components/Modal";

// import { TokenContext } from "../context/TokenContext";
// import { addProduct, getProducts, editProduct } from "../utils/fn";
// import PageLoader from "./PageLoader";
// import { SupplierContext } from "../context/SupplierContext";

// const emptyProductForm = {
//   productName: "",
//   quantity: "",
//   unitPrice: "",
//   unit: "",
//   reorderLevel: "",
//   category: "General",
// };

// function Products() {

//   const tokenPayload = useContext(TokenContext)
//   const supplierPayload = useContext(SupplierContext)

//   const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

//   const [addProductData, setAddProductData] = useState({
//     productName: "",
//     quantity: "",
//     unitPrice: "",
//     unit: "",
//     reorderLevel: "",
//     supplier: "",
//     currentStockQuantity: "",

//   })

//   const [editProductData, setEditProductData] = useState({
//     productName: "",
//     quantity: "",
//     unitPrice: "",
//     unit: "",
//     reorderLevel: "",
//     supplier: "",
//     currentStockQuantity: "",
//   })

//   const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);



//   const [isLoading, setIsLoading] = useState(false)
//   const [feedback, setFeedback] = useState("")

//   const [formData, setFormData] = useState(emptyProductForm);

//   const [products, setProducts] = useState([]);

//   async function loadProducts() {
//     if (!tokenPayload?.token) {
//       setProducts([]);
//       return;
//     }
//     try {
//       setIsLoading(true);
//       const data = await getProducts(tokenPayload.token);
//       if (data.success) {
//         setProducts(data.data);
//       }
//     } catch (error) {
//       console.error(error);
//       setFeedback("Could not load products from the server.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   function resetAddProductForm() {
//     setAddProductData({
//       productName: "",
//       quantity: "",
//       unitPrice: "",
//       unit: "",
//       reorderLevel: "",
//       supplier: "",
//     });
//   }

//   async function handleAddProduct(e) {
//     e.preventDefault();
//     if (!tokenPayload?.token) {
//       setFeedback("Please sign in before adding a product.");
//       return;
//     }

//     if (!addProductData.productName?.trim()) {
//       setFeedback("Please enter a product name.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setFeedback("");

//       const payload = {
//         productName: addProductData.productName.trim(),
//         quantity: Number(addProductData.quantity || 0),
//         currentStock: Number(addProductData.quantity || 0),
//         unitPrice: Number(addProductData.unitPrice || 0),
//         unit: addProductData.unit.trim(),
//         reorderLevel: Number(addProductData.reorderLevel || 0),
//         supplier: addProductData.supplier || "",

//       };

//       const res = await addProduct(tokenPayload.token, payload);
//       if (res?.success !== false) {
//         setProducts((prevProducts) => [res?.data ?? { ...payload, _id: Date.now().toString() }, ...prevProducts]);
//         closeModal();
//         resetAddProductForm();
//         await loadProducts();
//       } else {
//         setFeedback("The server rejected the product request.");
//       }
//     } catch (error) {
//       console.error(error);
//       setFeedback("Unable to add the product right now.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function handleEditProduct(e) {
//     try {
//       e.preventDefault()
//       setIsLoading(true)
//       const response = await editProduct(tokenPayload.token,
//         editProductData._id || editProductData.id, { editProductData })
//       if (response?.success) {
//         console.log(response)
//         await loadProducts();
//       }
//         closeModal();
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   function openAddProductModal() {
//     setIsAddProductModalOpen(true);
//   }

//   function openEditProductModal(id) {
//     setEditProductData(products.find((product) => (product._id || product.id) === id));
//     setIsEditProductModalOpen(true);
//     console.log(editProductData);
//   }

//   function closeModal() {
//     setIsAddProductModalOpen(false);
//     setIsEditProductModalOpen(false);
//   }

//   useEffect(() => {
//     loadProducts();
//   }, [tokenPayload?.token]);

//   if (isLoading) {
//     return <PageLoader />;
//   }


//   return (
//     <div className="space-y-6">
//       <div className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Products</h1>
//           <p className="mt-1 text-sm leading-6 text-slate-600">Manage your inventory catalog and stock levels with a clean and modern interface.</p>
//         </div>
//         <div className="flex flex-col gap-3 sm:flex-row">
//           <Button onClick={openAddProductModal} className="w-full sm:w-auto">Add New Product</Button>
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
//         <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
//           <h2 className="text-lg font-semibold text-slate-900">Current Products</h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left text-sm text-slate-700">
//             <thead className="bg-slate-50 text-slate-500">
//               <tr>
//                 <th className="px-5 py-3 font-semibold">Product</th>
//                 <th className="px-5 py-3 font-semibold">Category</th>
//                 <th className="px-5 py-3 font-semibold">Stock</th>
//                 <th className="px-5 py-3 font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.length > 0 ? products.map((product) => (
//                 <tr key={product._id || product.id} className="border-t border-slate-200 hover:bg-slate-50">
//                   <td className="px-5 py-4 font-semibold text-slate-900">{product.name || product.productName}</td>
//                   <td className="px-5 py-4 text-slate-600">{product.category || "General"}</td>
//                   <td className="px-5 py-4 text-slate-600">{product.currentStock ?? product.quantity ?? 0}</td>
//                   <td className="px-5 py-4">
//                     <button
//                       type="button"
//                       onClick={() => openEditProductModal(product._id || product.id)}
//                       className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               )) : <tr>
//                 <td colSpan={4} className="text-center py-5">
//                   No product added yet
//                 </td></tr>}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Modal isOpen={isAddProductModalOpen} onClose={closeModal} closeButton={false}>
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold text-[#191C1E]">Add Product</h2>
//           <p className="text-sm text-[#45474C]">Fill in the details below to create a new product entry.</p>
//         </div>
//         <form className="space-y-4" onSubmit={handleAddProduct}>
//           {feedback ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{feedback}</div> : null}
//           <Input
//             className="w-full"
//             id="productName"
//             placeholder="Enter Product Name"
//             label="Product Name"
//             value={addProductData.productName}
//             onChange={(event) => setAddProductData({ ...addProductData, productName: event.target.value })}
//             icon={<MdOutlineInventory2 size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="quantity"
//             placeholder="Enter Quantity"
//             label="Quantity"
//             type="number"
//             value={addProductData.quantity}
//             onChange={(event) => setAddProductData({ ...addProductData, quantity: event.target.value })}
//             icon={<MdOutlineNumbers size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="unitPrice"
//             placeholder="Enter Unit Price"
//             label="Unit Price"
//             type="number"
//             value={addProductData.unitPrice}
//             onChange={(event) => setAddProductData({ ...addProductData, unitPrice: event.target.value })}
//             icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="unit"
//             placeholder="Enter Unit"
//             label="Unit"
//             value={addProductData.unit}
//             onChange={(event) => setAddProductData({ ...addProductData, unit: event.target.value })}
//             icon={<MdOutlineCategory size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="reorderLevel"
//             placeholder="Enter Reorder Level"
//             label="Reorder Level"
//             type="number"
//             value={addProductData.reorderLevel}
//             onChange={(event) => setAddProductData({ ...addProductData, reorderLevel: event.target.value })}
//             icon={<MdOutlineLowPriority size={20} color="#75777D" />}
//           />
//           <div>
//             <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
//               Suppliers
//             </label>
//             <select
//               className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//               value={addProductData.supplier || ""}
//               onChange={(e) =>
//                 setAddProductData({
//                   ...addProductData,
//                   supplier: e.target.value,
//                 })
//               }
//             >
//               <option value="">Select Supplier</option>

//               {supplierPayload.map((supplier) => (
//                 <option
//                   key={supplier._id}
//                   value={supplier._id}
//                 >
//                   {supplier.supplierName}
//                 </option>
//               ))}
//             </select>

//           </div>

//           <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
//             <button type="button" onClick={closeModal} className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]">
//               Cancel
//             </button>
//             <Button type="submit" className="w-auto px-5">
//               Add Product
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       <Modal isOpen={isEditProductModalOpen} onClose={closeModal} closeButton={false}>

//         <div className="mb-6">
//           <h2 className="text-xl font-semibold text-[#191C1E]">Edit Product</h2>
//           <p className="text-sm text-[#45474C]">Update the product details below.</p>
//         </div>
//         <form
//           className="space-y-4"
//           onSubmit={handleEditProduct}
//         >
//           <Input
//             className="w-full"
//             id="editProductName"
//             placeholder="Update Product Name"
//             label="Product Name"
//             value={editProductData.productName}
//             onChange={(event) => setEditProductData({ ...editProductData, productName: event.target.value })}
//             icon={<MdOutlineInventory2 size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="editQuantity"
//             placeholder="Update Quantity"
//             label="Quantity"
//             type="number"
//             value={editProductData.quantity}
//             onChange={(event) => setEditProductData({ ...editProductData, quantity: event.target.value })}
//             icon={<MdOutlineNumbers size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="editUnitPrice"
//             placeholder="Update Unit Price"
//             label="Unit Price"
//             type="number"
//             value={editProductData.unitPrice}
//             onChange={(event) => setEditProductData({ ...editProductData, unitPrice: event.target.value })}
//             icon={<MdOutlineAttachMoney size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="editUnit"
//             placeholder="Update Unit"
//             label="Unit"
//             value={editProductData.unit}
//             onChange={(event) => setEditProductData({ ...editProductData, unit: event.target.value })}
//             icon={<MdOutlineCategory size={20} color="#75777D" />}
//           />
//           <Input
//             className="w-full"
//             id="editReorderLevel"
//             placeholder="Update Reorder Level"
//             label="Reorder Level"
//             type="number"
//             value={editProductData.reorderLevel}
//             onChange={(event) => setEditProductData({ ...editProductData, reorderLevel: event.target.value })}
//             icon={<MdOutlineLowPriority size={20} color="#75777D" />}
//           />
//           <div>
//             <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
//               Suppliers
//             </label>
//             <select
//               className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//               value={editProductData.supplier || ""}
//               onChange={(e) =>
//                 setEditProductData({
//                   ...editProductData,
//                   supplier: e.target.value,
//                 })
//               }
//             >
//               <option value="">Select Supplier</option>

//               {supplierPayload.map((supplier) => (
//                 <option
//                   key={supplier._id}
//                   value={supplier._id}
//                 >
//                   {supplier.supplierName}
//                 </option>
//               ))}
//             </select>

//           </div>
//           <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
//             <button type="button" onClick={closeModal} className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]">
//               Cancel
//             </button>
//             <Button type="submit" className="w-auto px-5">Save Changes</Button>
//           </div>
//         </form>

//       </Modal>
//     </div>
//   );
// }

// export default Products;