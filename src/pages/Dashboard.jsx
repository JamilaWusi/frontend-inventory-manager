import { useContext, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Package, Users, AlertTriangle, TrendingUp, 
//   DollarSign, ArrowUpRight, ArrowDownRight,
//   RefreshCcw, Plus, Search, Filter, Download,
//   Eye, Edit, Trash2, MoreVertical, Activity
// } from "lucide-react";

import { 
  Package, Users, AlertTriangle, TrendingUp, 
  DollarSign, ArrowUpRight, ArrowDownRight,
  RefreshCcw, Plus, Search, Filter, Download,
  Eye, Edit, Trash2, MoreVertical, Activity
} from "../components/Icons";

import { Link } from "react-router";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { ProfileContext } from "../context/ProfileContext";
import { TokenContext } from "../context/TokenContext";
import { SupplierContext } from "../context/SupplierContext";
import { getProducts, getSuppliers, getTransactions, deleteProduct } from "../utils/fn";
import { showToast } from "../utils/toast";
import Button from "../components/Button";
import InventoryInsights from "../components/InventoryInsights";
import PageLoader from "./PageLoader";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const profile = useContext(ProfileContext);
  const tokenPayload = useContext(TokenContext);
  const suppliers = useContext(SupplierContext);
  
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load data
  useEffect(() => {
    if (!tokenPayload?.token) return;
    loadDashboardData();
  }, [tokenPayload?.token]);

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      const [productsRes, transactionsRes] = await Promise.all([
        getProducts(tokenPayload.token),
        getTransactions(tokenPayload.token)
      ]);
      
      setProducts(productsRes?.data || []);
      setTransactions(transactionsRes || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      showToast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.unitPrice || 0)), 0);
    const lowStock = products.filter(p => (p.quantity || 0) <= (p.reorderLevel || 5));
    const outOfStock = products.filter(p => (p.quantity || 0) === 0);
    
    // Category distribution
    const categories = products.reduce((acc, p) => {
      const cat = p.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));

    // Recent transactions (last 7 days)
    const recentTransactions = transactions
      .filter(t => new Date(t.createdAt) > new Date(Date.now() - 7 * 86400000))
      .slice(0, 10);

    // Daily transactions for chart
    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate.toDateString() === date.toDateString();
      });

      return {
        name: dateStr,
        inflow: dayTransactions.filter(t => t.transactionType === 'Stock In').reduce((s, t) => s + t.quantity, 0),
        outflow: dayTransactions.filter(t => t.transactionType === 'Stock Out').reduce((s, t) => s + t.quantity, 0),
      };
    });

    return {
      totalStock,
      totalValue,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      categoryData,
      recentTransactions,
      dailyData,
      stockHealth: products.length ? Math.round(((products.length - outOfStock.length) / products.length) * 100) : 100,
    };
  }, [products, transactions]);

  // Handle product actions
  async function handleDeleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(tokenPayload.token, productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      showToast.success("Product deleted successfully");
    } catch (error) {
      showToast.error("Failed to delete product");
    }
  }

  function handleRefresh() {
    loadDashboardData();
    showToast.success("Dashboard refreshed");
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-indigo-300 text-sm font-medium mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {profile?.firstName || 'User'} 👋
            </h1>
            <p className="text-slate-400 text-lg">
              Here's what's happening with your inventory today.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" icon={RefreshCcw} onClick={handleRefresh}>
              Refresh
            </Button>
            <Link to="/products">
              <Button icon={Plus}>
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { 
              label: 'Total Products', 
              value: products.length, 
              icon: Package, 
              color: 'from-blue-500/20 to-blue-600/20',
              trend: 'up',
              trendValue: '+12%'
            },
            { 
              label: 'Total Stock', 
              value: analytics.totalStock.toLocaleString(), 
              icon: TrendingUp, 
              color: 'from-emerald-500/20 to-emerald-600/20',
              trend: 'up',
              trendValue: '+5%'
            },
            { 
              label: 'Inventory Value', 
              value: `₦${analytics.totalValue.toLocaleString()}`, 
              icon: DollarSign, 
              color: 'from-amber-500/20 to-amber-600/20',
              trend: 'up',
              trendValue: '+8%'
            },
            { 
              label: 'Low Stock Alerts', 
              value: analytics.lowStockCount, 
              icon: AlertTriangle, 
              color: 'from-rose-500/20 to-rose-600/20',
              trend: analytics.lowStockCount > 0 ? 'down' : 'up',
              trendValue: analytics.lowStockCount > 0 ? 'Needs attention' : 'All good'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10 p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-white/80" />
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trendValue}
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/60 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'insights', label: 'AI Insights', icon: TrendingUp },
          { id: 'products', label: 'Products', icon: Package },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
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
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Stock Movement Chart */}
              <motion.div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Stock Movement</h3>
                    <p className="text-sm text-slate-500">Last 7 days activity</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-xs text-slate-600">In</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-xs text-slate-600">Out</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="inflow" fill="#6366f1" radius={[8, 8, 0, 0]} name="Stock In" />
                    <Bar dataKey="outflow" fill="#f43f5e" radius={[8, 8, 0, 0]} name="Stock Out" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Category Distribution */}
              <motion.div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Category Distribution</h3>
                  <p className="text-sm text-slate-500">Products by category</p>
                </div>
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
                    No category data available
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
              </motion.div>
            </div>

            {/* Recent Activity & Stock Health */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <motion.div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                    <p className="text-sm text-slate-500">Latest stock movements</p>
                  </div>
                  <Link to="/inventory" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {analytics.recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          transaction.transactionType === 'Stock In' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-rose-100 text-rose-600'
                        }`}>
                          {transaction.transactionType === 'Stock In' ? 
                            <ArrowUpRight className="w-5 h-5" /> : 
                            <ArrowDownRight className="w-5 h-5" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{transaction.productId?.productName || 'Unknown'}</p>
                          <p className="text-sm text-slate-500">
                            {transaction.transactionType} · {transaction.quantity} units
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Stock Health */}
              <motion.div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Stock Health</h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold mb-2">{analytics.stockHealth}%</div>
                  <p className="text-indigo-200 text-sm">Products in stock</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Total Products</span>
                    <span className="font-semibold">{products.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">In Stock</span>
                    <span className="font-semibold text-emerald-300">{products.length - analytics.outOfStockCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Low Stock</span>
                    <span className="font-semibold text-amber-300">{analytics.lowStockCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Out of Stock</span>
                    <span className="font-semibold text-rose-300">{analytics.outOfStockCount}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200">Suppliers</span>
                    <span className="font-semibold">{suppliers.length}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <InventoryInsights products={products} transactions={transactions} />
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-white border border-slate-200 shadow-sm"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
                <Button variant="secondary" icon={Download}>
                  Export
                </Button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products
                    .filter(p => p.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{product.productName}</p>
                            <p className="text-xs text-slate-500">SKU: {product._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product.category || 'General'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                          (product.quantity || 0) === 0 ? 'bg-rose-100 text-rose-700' :
                          (product.quantity || 0) <= (product.reorderLevel || 5) ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {product.quantity || 0} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-semibold">
                        ₦{(product.unitPrice || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          (product.quantity || 0) === 0 ? 'text-rose-600' :
                          (product.quantity || 0) <= (product.reorderLevel || 5) ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            (product.quantity || 0) === 0 ? 'bg-rose-500' :
                            (product.quantity || 0) <= (product.reorderLevel || 5) ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`} />
                          {(product.quantity || 0) === 0 ? 'Out of Stock' :
                           (product.quantity || 0) <= (product.reorderLevel || 5) ? 'Low Stock' :
                           'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <Link to={`/products`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
























































// // frontend-inventory-manager/src/pages/Dashboard.jsx
// import { useContext, useMemo, useState } from "react";

// import ProductTable from "../components/ProductTable.jsx";
// import Card from "../components/Card.jsx";
// import { RiShoppingCart2Fill } from "react-icons/ri";
// import { ProfileContext } from "../context/ProfileContext.jsx";
// import { deleteInventoryProduct, getInventoryData, getWeeklyInventoryReport } from "../utils/inventoryStorage.js";

// function getStockValue(product) {
//   return Number(product.currentStock ?? product.quantity ?? product.currentStockQuantity ?? 0);
// }

// function Dashboard() {
//   const profile = useContext(ProfileContext);
//   const [inventoryData, setInventoryData] = useState(() => getInventoryData());

//   const products = inventoryData.products || [];
//   const suppliers = inventoryData.suppliers || [];
//   const criticalAlerts = useMemo(
//     () => products.filter((product) => getStockValue(product) <= Number(product.reorderLevel || 5)),
//     [products]
//   );
//   const weeklyReport = useMemo(() => getWeeklyInventoryReport(inventoryData), [inventoryData]);

//   function handleDeleteProduct(productId) {
//     const nextData = deleteInventoryProduct(productId);
//     setInventoryData(nextData);
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold tracking-tight text-slate-900">
//           Welcome, <span>{`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "there"}</span>, to StockTrack
//         </h1>
//         <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
//           Real-time inventory monitoring and quick access to product, supplier, and stock transaction summaries.
//         </p>
//       </div>

//       <div className="grid gap-5 md:grid-cols-3">
//         <Card
//           icon={<RiShoppingCart2Fill />}
//           stat={products.length}
//           title="Products"
//           className="font-semibold"
//           desc="All products in your database"
//         />
//         <Card
//           icon={<RiShoppingCart2Fill />}
//           stat={suppliers.length}
//           title="Suppliers"
//           desc="Active supplier relationships"
//         />
//         <Card
//           icon={<RiShoppingCart2Fill />}
//           stat={criticalAlerts.length}
//           title="Critical Alerts"
//           desc="Products needing restock"
//         />
//       </div>

//       <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
//         <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)]">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-slate-900">Low Stock Products</h2>
//               <p className="text-sm text-slate-600">Items that need attention before they run out.</p>
//             </div>
//           </div>
//           {criticalAlerts.length === 0 ? (
//             <p className="text-sm text-slate-600">All products are being kept above the reorder level.</p>
//           ) : (
//             <ul className="space-y-3">
//               {criticalAlerts.map((product) => (
//                 <li key={product._id || product.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
//                   <div className="font-semibold text-slate-900">{product.name || product.productName}</div>
//                   <div>Current stock: {getStockValue(product)}</div>
//                   <div>Reorder level: {product.reorderLevel || 5}</div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)]">
//           <div className="mb-4">
//             <h2 className="text-lg font-semibold text-slate-900">Weekly Report Snapshot</h2>
//             <p className="text-sm text-slate-600">A quick view of the last seven days of inventory movement.</p>
//           </div>
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="text-sm text-slate-500">Movements</div>
//               <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.movementCount}</div>
//             </div>
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="text-sm text-slate-500">Low stock</div>
//               <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.lowStockProducts.length}</div>
//             </div>
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="text-sm text-slate-500">Restocks</div>
//               <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.restockCount}</div>
//             </div>
//             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//               <div className="text-sm text-slate-500">Issues</div>
//               <div className="mt-1 text-2xl font-semibold text-slate-900">{weeklyReport.issueCount}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <ProductTable products={products} onDelete={handleDeleteProduct} />
//     </div>
//   );
// }

// export default Dashboard;