import { useContext, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, AlertTriangle, TrendingUp, RefreshCcw,
  ArrowUpRight, ArrowDownRight, ClipboardList,
  BarChart3, Activity, Download, Plus
} from "../components/Icons";
import Button from "../components/Button";
import { TokenContext } from "../context/TokenContext";
import { ProfileContext } from "../context/ProfileContext";
import { getProducts, getSuppliers, getTransactions, addProduct } from "../utils/fn";
import { showToast } from "../utils/toast";
import PageLoader from "./PageLoader";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Inventory() {
  const tokenPayload = useContext(TokenContext);
  const profile = useContext(ProfileContext);

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");

  // Stock movement form
  const [form, setForm] = useState({
    productId: "",
    transactionType: "Stock In",
    quantity: "",
    reason: "",
  });

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.unitPrice || 0)), 0);
    const lowStock = products.filter(p => (p.quantity || 0) <= (p.reorderLevel || 5) && (p.quantity || 0) > 0);
    const outOfStock = products.filter(p => (p.quantity || 0) === 0);
    
    // Stock movement trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => {
        return t.createdAt?.startsWith(dateStr);
      });

      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        stockIn: dayTransactions.filter(t => t.transactionType === 'Stock In').reduce((s, t) => s + t.quantity, 0),
        stockOut: dayTransactions.filter(t => t.transactionType === 'Stock Out').reduce((s, t) => s + t.quantity, 0),
      };
    });

    // Category distribution
    const categories = products.reduce((acc, p) => {
      const cat = p.category || 'General';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));

    // Recent transactions
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      totalStock,
      totalValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      movementTrends: last7Days,
      categoryData,
      recentTransactions,
      stockHealth: products.length ? Math.round(((products.length - outOfStock.length) / products.length) * 100) : 100,
    };
  }, [products, transactions]);

  async function loadInventoryData() {
    if (!tokenPayload?.token) return;
    
    try {
      setIsLoading(true);
      const [productsRes, suppliersRes, transactionsRes] = await Promise.all([
        getProducts(tokenPayload.token),
        getSuppliers(tokenPayload.token),
        getTransactions(tokenPayload.token)
      ]);

      setProducts(productsRes?.data || []);
      setSuppliers(suppliersRes?.data || []);
      setTransactions(transactionsRes || []);
    } catch (error) {
      console.error("Failed to load inventory:", error);
      showToast.error("Failed to load inventory data");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStockMovement(e) {
    e.preventDefault();

    if (!form.productId || !form.quantity || !form.transactionType) {
      showToast.error("Please fill in all required fields");
      return;
    }

    const loadingToast = showToast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const movementData = {
            productId: form.productId,
            transactionType: form.transactionType,
            quantity: Number(form.quantity),
            reason: form.reason || `${form.transactionType} transaction`,
          };

          // Use the stock transaction endpoint
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/stock`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenPayload.token}`
            },
            body: JSON.stringify(movementData)
          });

          const data = await response.json();

          if (data.success) {
            await loadInventoryData();
            setForm({
              productId: "",
              transactionType: "Stock In",
              quantity: "",
              reason: "",
            });
            resolve();
          } else {
            reject(new Error(data.message || 'Failed to record movement'));
          }
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Recording stock movement...',
        success: 'Stock movement recorded! 📦',
        error: 'Failed to record movement',
      }
    );
  }

  function handleExportReport() {
    const reportData = [
      ["Product", "Category", "Current Stock", "Reorder Level", "Unit Price", "Total Value", "Status"].join(","),
      ...products.map(p => {
        const stock = p.quantity || 0;
        const status = stock === 0 ? 'Out of Stock' : stock <= (p.reorderLevel || 5) ? 'Low Stock' : 'In Stock';
        return [
          p.productName || p.name,
          p.category || 'General',
          stock,
          p.reorderLevel || 5,
          p.unitPrice || 0,
          stock * (p.unitPrice || 0),
          status
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast.success("Report exported successfully");
  }

  useEffect(() => {
    loadInventoryData();
  }, [tokenPayload?.token]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-500 p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Inventory Management</h1>
              <p className="text-amber-100 text-lg">
                Real-time stock tracking and movement control
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={Download} 
                onClick={handleExportReport}
                className="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30"
              >
                Export Report
              </Button>
              <Button 
                icon={RefreshCcw} 
                onClick={loadInventoryData}
                className="!bg-white text-white hover:!bg-amber-50"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Products', value: products.length, icon: Package, color: 'from-white/20 to-white/10' },
              { label: 'Total Stock', value: analytics.totalStock.toLocaleString(), icon: BarChart3, color: 'from-blue-400/30 to-blue-500/20' },
              { label: 'Stock Value', value: `₦${analytics.totalValue.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-400/30 to-emerald-500/20' },
              { label: 'Alerts', value: analytics.lowStockCount + analytics.outOfStockCount, icon: AlertTriangle, color: 'from-rose-400/30 to-rose-500/20' },
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

      {/* View Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'movements', label: 'Stock Movements', icon: ClipboardList },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
          >
            {/* Stock Status Table */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Current Stock Status</h2>
                    <p className="text-sm text-slate-500">Real-time inventory levels</p>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-3 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(p => (p.productName || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((product) => {
                        const stock = product.quantity || 0;
                        const reorderLevel = product.reorderLevel || 5;
                        const isCritical = stock <= reorderLevel;
                        const totalValue = stock * (product.unitPrice || 0);
                        
                        return (
                          <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  stock === 0 ? 'bg-rose-100' : isCritical ? 'bg-amber-100' : 'bg-emerald-100'
                                }`}>
                                  <Package className={`w-4 h-4 ${
                                    stock === 0 ? 'text-rose-600' : isCritical ? 'text-amber-600' : 'text-emerald-600'
                                  }`} />
                                </div>
                                <span className="font-semibold text-slate-900 text-sm">
                                  {product.productName || product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                {product.category || 'General'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-900">{stock}</span>
                              <span className="text-xs text-slate-500 ml-1">{product.unit || 'pcs'}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                stock === 0 
                                  ? 'bg-rose-50 text-rose-700'
                                  : isCritical
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  stock === 0 ? 'bg-rose-500' : isCritical ? 'bg-amber-500' : 'bg-emerald-500'
                                }`} />
                                {stock === 0 ? 'Out of Stock' : isCritical ? 'Low Stock' : 'Healthy'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-indigo-600">
                                ₦{totalValue.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Stock Movement Form */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Record Movement</h2>
                </div>
                <form onSubmit={handleStockMovement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Product</label>
                    <select
                      value={form.productId}
                      onChange={(e) => setForm({ ...form, productId: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                    >
                      <option value="">Select product</option>
                      {products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.productName || product.name} (Stock: {product.quantity || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Movement Type</label>
                    <select
                      value={form.transactionType}
                      onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                    >
                      <option value="Stock In">Stock In (Restock)</option>
                      <option value="Stock Out">Stock Out (Issue)</option>
                      <option value="Adjustment">Adjustment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="Enter quantity"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Reason/Note</label>
                    <textarea
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      placeholder="Add note for this movement..."
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Save Movement
                  </Button>
                </form>
              </div>

              {/* Critical Alerts */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Critical Alerts</h2>
                  <span className="ml-auto bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {analytics.lowStockCount + analytics.outOfStockCount}
                  </span>
                </div>
                {analytics.lowStockCount + analytics.outOfStockCount === 0 ? (
                  <p className="text-sm text-slate-500">All products are well-stocked! 🎉</p>
                ) : (
                  <div className="space-y-2">
                    {products
                      .filter(p => (p.quantity || 0) <= (p.reorderLevel || 5))
                      .slice(0, 5)
                      .map(product => (
                        <div key={product._id} className="flex items-center justify-between p-2 rounded-lg bg-rose-50">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{product.productName}</p>
                            <p className="text-xs text-slate-600">Stock: {product.quantity || 0}</p>
                          </div>
                          <span className="text-xs font-semibold text-rose-700">
                            {(product.quantity || 0) === 0 ? 'OUT' : 'LOW'}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Stock Health */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 p-6 text-white shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Stock Health</h2>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{analytics.stockHealth}%</div>
                  <p className="text-amber-100 text-sm">Products in stock</p>
                </div>
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.stockHealth}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeView === 'movements' && (
          <motion.div
            key="movements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Transaction History</h2>
              <p className="text-sm text-slate-500">Complete audit trail of stock movements</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.recentTransactions.map(transaction => (
                    <tr key={transaction._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {transaction.productId?.productName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.transactionType === 'Stock In' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : transaction.transactionType === 'Stock Out'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {transaction.transactionType === 'Stock In' ? <ArrowUpRight className="w-3 h-3" /> : 
                           transaction.transactionType === 'Stock Out' ? <ArrowDownRight className="w-3 h-3" /> : 
                           <Activity className="w-3 h-3" />}
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{transaction.quantity}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{transaction.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeView === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Stock Movement Chart */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Stock Movement Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.movementTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="stockIn" fill="#10b981" radius={[8, 8, 0, 0]} name="Stock In" />
                  <Bar dataKey="stockOut" fill="#ef4444" radius={[8, 8, 0, 0]} name="Stock Out" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h2>
              {analytics.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-400">
                  No data available
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-4">
                {analytics.categoryData.map((cat, index) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-slate-600">{cat.name} ({cat.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




































// // frontend-inventory-manager/src/pages/Inventory.jsx
// import { useEffect, useMemo, useState } from "react";
// import { FiAlertTriangle, FiPackage, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
// import {
//   getInventoryData,
//   getWeeklyInventoryReport,
//   recordInventoryTransaction,
// } from "../utils/inventoryStorage";

// function getStockValue(product) {
//   return Number(product.currentStock ?? product.quantity ?? 0);
// }

// export default function Inventory() {
//   const [inventoryData, setInventoryData] = useState(() => getInventoryData());
//   const [form, setForm] = useState(() => {
//     const initialData = getInventoryData();
//     return {
//       productId: String(initialData.products?.[0]?.id || ""),
//       type: "Restock",
//       quantity: "",
//       note: "",
//       performedBy: "",
//     };
//   });

//   const products = inventoryData.products || [];
//   const suppliers = inventoryData.suppliers || [];
//   const transactions = inventoryData.transactions || [];

//   useEffect(() => {
//     if (!products.some((product) => String(product.id) === form.productId)) {
//       setForm((currentForm) => ({ ...currentForm, productId: String(products[0]?.id || "") }));
//     }
//   }, [products, form.productId]);

//   const totalStock = useMemo(
//     () => products.reduce((sum, product) => sum + getStockValue(product), 0),
//     [products]
//   );
//   const criticalProducts = useMemo(
//     () => products.filter((product) => getStockValue(product) <= Number(product.reorderLevel || 5)),
//     [products]
//   );
//   const weeklyReport = useMemo(() => getWeeklyInventoryReport(inventoryData), [inventoryData]);
//   const recentUpdates = useMemo(
//     () =>
//       products.slice(0, 5).map((product) => ({
//         id: product._id || product.id,
//         name: product.name || product.productName,
//         stock: getStockValue(product),
//         reorderLevel: Number(product.reorderLevel || 5),
//       })),
//     [products]
//   );

//   function refreshInventory() {
//     setInventoryData(getInventoryData());
//   }

//   function handleStockSubmit(event) {
//     event.preventDefault();

//     const selectedProduct = products.find((product) => String(product.id) === form.productId);
//     const quantity = Number(form.quantity);

//     if (!selectedProduct || !form.type || !quantity || !form.performedBy) {
//       alert("Please complete all stock movement fields.");
//       return;
//     }

//     const nextData = recordInventoryTransaction({
//       productId: selectedProduct.id,
//       type: form.type,
//       quantity,
//       note: form.note,
//       performedBy: form.performedBy,
//     });

//     setInventoryData(nextData);
//     setForm({ productId: String(selectedProduct.id), type: "Restock", quantity: "", note: "", performedBy: "" });
//   }

//   return (
//     <div className="space-y-6">
//       <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
//         <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Inventory Overview</h1>
//             <p className="mt-1 text-sm leading-6 text-slate-600">
//               Stock is updated instantly from each movement, low-stock items are surfaced here, and a weekly summary stays visible.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={refreshInventory}
//             className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
//           >
//             Refresh
//           </button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-4">
//           <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
//             <div className="mb-2 flex items-center gap-2 text-slate-100">
//               <FiPackage size={18} />
//               <span className="text-sm font-semibold">Products</span>
//             </div>
//             <p className="text-2xl font-semibold text-slate-100">{products.length}</p>
//           </div>
//           <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
//             <div className="mb-2 flex items-center gap-2 text-slate-100">
//               <FiRefreshCw size={18} />
//               <span className="text-sm font-semibold">Total Stock</span>
//             </div>
//             <p className="text-2xl font-semibold text-slate-100">{totalStock}</p>
//           </div>
//           <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
//             <div className="mb-2 flex items-center gap-2 text-slate-100">
//               <FiAlertTriangle size={18} />
//               <span className="text-sm font-semibold">Critical Alerts</span>
//             </div>
//             <p className="text-2xl font-semibold text-slate-100">{criticalProducts.length}</p>
//           </div>
//           <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
//             <div className="mb-2 flex items-center gap-2 text-slate-100">
//               <FiPackage size={18} />
//               <span className="text-sm font-semibold">Suppliers</span>
//             </div>
//             <p className="text-2xl font-semibold text-slate-100">{suppliers.length}</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
//         <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-slate-900">Inventory Status</h2>
//               <p className="text-sm text-slate-600">Current stock and alert state for your live inventory.</p>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left text-sm text-slate-700">
//               <thead className="bg-slate-50 text-slate-500">
//                 <tr>
//                   <th className="px-4 py-3 font-medium">Product</th>
//                   <th className="px-4 py-3 font-medium">Category</th>
//                   <th className="px-4 py-3 font-medium">Stock</th>
//                   <th className="px-4 py-3 font-medium">Alert</th>
//                   <th className="px-4 py-3 font-medium">Supplier</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
//                       No products available yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   products.map((product) => {
//                     const stockValue = getStockValue(product);
//                     const isCritical = stockValue <= Number(product.reorderLevel || 5);
//                     return (
//                       <tr key={product._id || product.id} className="border-t border-slate-200 hover:bg-slate-50">
//                         <td className="px-4 py-3 font-semibold text-[#191C1E]">{product.name || product.productName}</td>
//                         <td className="px-4 py-3 text-[#45474C]">{product.category || "General"}</td>
//                         <td className="px-4 py-3 text-[#45474C]">{stockValue}</td>
//                         <td className="px-4 py-3">
//                           <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isCritical ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
//                             {isCritical ? "Critical" : "Healthy"}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-[#45474C]">{product.supplier || "N/A"}</td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
//             <h2 className="mb-4 text-lg font-semibold text-slate-900">Record Stock Movement</h2>
//             <form onSubmit={handleStockSubmit} className="space-y-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">Product</label>
//                 <select
//                   value={form.productId}
//                   onChange={(event) => setForm({ ...form, productId: event.target.value })}
//                   className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//                 >
//                   {products.map((product) => (
//                     <option key={product.id} value={String(product.id)}>
//                       {product.name || product.productName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">Movement Type</label>
//                 <select
//                   value={form.type}
//                   onChange={(event) => setForm({ ...form, type: event.target.value })}
//                   className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//                 >
//                   <option value="Restock">Restock</option>
//                   <option value="Issue">Issue</option>
//                   <option value="Adjustment">Adjustment</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">Quantity</label>
//                 <input
//                   type="number"
//                   value={form.quantity}
//                   onChange={(event) => setForm({ ...form, quantity: event.target.value })}
//                   placeholder="Enter quantity"
//                   className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">Performed By</label>
//                 <input
//                   type="text"
//                   value={form.performedBy}
//                   onChange={(event) => setForm({ ...form, performedBy: event.target.value })}
//                   placeholder="Manager or staff name"
//                   className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">Note</label>
//                 <textarea
//                   value={form.note}
//                   onChange={(event) => setForm({ ...form, note: event.target.value })}
//                   placeholder="Add note for this movement"
//                   className="min-h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               <button type="submit" className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
//                 Save Movement
//               </button>
//             </form>
//           </div>

//           <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
//             <h2 className="mb-3 text-lg font-semibold text-slate-900">Critical Stock Alerts</h2>
//             {criticalProducts.length === 0 ? (
//               <p className="text-sm text-[#45474C]">No critical stock items right now.</p>
//             ) : (
//               <ul className="space-y-3">
//                 {criticalProducts.map((product) => (
//                   <li key={product._id || product.id} className="rounded-lg border border-[#F0C4C4] bg-[#FFF6F6] p-3 text-sm text-[#45474C]">
//                     <div className="font-semibold text-[#191C1E]">{product.name || product.productName}</div>
//                     <div>Current stock: {getStockValue(product)}</div>
//                     <div>Reorder level: {product.reorderLevel || 5}</div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
//             <div className="mb-3 flex items-center gap-2">
//               <FiTrendingUp size={16} className="text-slate-900" />
//               <h2 className="text-lg font-semibold text-slate-900">Weekly Report</h2>
//             </div>
//             <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                 <div className="text-slate-500">Movements</div>
//                 <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.movementCount}</div>
//               </div>
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                 <div className="text-slate-500">Low-stock items</div>
//                 <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.lowStockProducts.length}</div>
//               </div>
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                 <div className="text-slate-500">Restocks</div>
//                 <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.restockCount}</div>
//               </div>
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                 <div className="text-slate-500">Issues</div>
//                 <div className="mt-1 text-lg font-semibold text-slate-900">{weeklyReport.issueCount}</div>
//               </div>
//             </div>
//             <p className="mt-3 text-sm text-slate-600">
//               {transactions.length > 0
//                 ? `The latest ${transactions.slice(0, 3).length} stock movements are saved for the weekly report trail.`
//                 : "Record your first movement to build a weekly report history."}
//             </p>
//           </div>

//           <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
//             <h2 className="mb-3 text-lg font-semibold text-slate-900">Recent Inventory Updates</h2>
//             {recentUpdates.length === 0 ? (
//               <p className="text-sm text-[#45474C]">No inventory updates available yet.</p>
//             ) : (
//               <ul className="space-y-3">
//                 {recentUpdates.map((item) => (
//                   <li key={item.id} className="rounded-lg border border-[#E6E6E9] p-3 text-sm text-[#45474C]">
//                     <div className="font-semibold text-[#191C1E]">{item.name}</div>
//                     <div>Current stock: {item.stock} units</div>
//                     <div>Reorder level: {item.reorderLevel}</div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
