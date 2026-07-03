import { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
// import { 
//   Lightbulb, TrendingUp, AlertTriangle, 
//   Star, Package, ArrowUpRight 
// } from 'lucide-react';
import { 
  Lightbulb, TrendingUp, AlertTriangle, 
  Star, Package, ArrowUpRight 
} from './Icons';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProfileContext } from '../context/ProfileContext';
import { SupplierContext } from '../context/SupplierContext';
import { calculateInventoryScore, predictStockout, analyzeSupplierPerformance } from '../utils/inventoryAnalytics';

export default function InventoryInsights({ products = [], transactions = [] }) {
  const profile = useContext(ProfileContext);
  const suppliers = useContext(SupplierContext);
  
  const insights = useMemo(() => {
    const score = calculateInventoryScore(products, transactions);
    const predictions = products.map(p => ({
      product: p,
      prediction: predictStockout(p, transactions)
    })).filter(p => p.prediction);
    
    const supplierRatings = analyzeSupplierPerformance(suppliers, transactions, products);
    const criticalPredictions = predictions.filter(p => p.prediction?.urgency === 'critical');
    
    return {
      score,
      predictions,
      supplierRatings,
      criticalPredictions,
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0),
    };
  }, [products, transactions, suppliers]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      stockIn: transactions.filter(t => 
        t.createdAt?.startsWith(date) && 
        (t.transactionType === 'Stock In' || t.type === 'Restock')
      ).reduce((sum, t) => sum + t.quantity, 0),
      stockOut: transactions.filter(t => 
        t.createdAt?.startsWith(date) && 
        (t.transactionType === 'Stock Out' || t.type === 'Issue')
      ).reduce((sum, t) => sum + t.quantity, 0),
    }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Smart Insights</h2>
          <p className="text-sm text-slate-600">AI-powered analytics for your inventory</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-600">AI Active</span>
        </div>
      </div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Inventory Health Score</p>
              <div className="mt-2 flex items-baseline gap-3">
                <h3 className="text-6xl font-bold">{insights.score}</h3>
                <span className="text-2xl text-indigo-200">/100</span>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="text-xs text-indigo-200">Products</div>
              </div>
            </div>
          </div>
          
          {/* Score Bar */}
          <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${insights.score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl bg-amber-50 border border-amber-200 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Critical Alerts</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{insights.criticalPredictions.length}</p>
          <p className="text-xs text-amber-700 mt-1">Products need immediate attention</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl bg-emerald-50 border border-emerald-200 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-900">Stock Value</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">
            ₦{insights.totalValue.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-700 mt-1">Total inventory value</p>
        </motion.div>
      </div>

      {/* Stock Movement Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white border border-slate-200 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">7-Day Movement Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="stockIn" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.1} 
              name="Stock In"
            />
            <Area 
              type="monotone" 
              dataKey="stockOut" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.1} 
              name="Stock Out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Predictions */}
      {insights.predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Stock Predictions</h3>
          <div className="space-y-3">
            {insights.predictions.slice(0, 5).map(({ product, prediction }) => (
              <div key={product._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{product.productName}</p>
                    <p className="text-sm text-slate-600">
                      Stock: {product.currentStock} units
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    prediction.urgency === 'critical' ? 'text-rose-600' : 
                    prediction.urgency === 'warning' ? 'text-amber-600' : 
                    'text-emerald-600'
                  }`}>
                    {prediction.daysUntilStockout} days left
                  </p>
                  <p className="text-xs text-slate-500">
                    Reorder {prediction.recommendedReorder} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Supplier Ratings */}
      {insights.supplierRatings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Supplier Performance</h3>
          <div className="space-y-3">
            {insights.supplierRatings.slice(0, 5).map(supplier => (
              <div key={supplier._id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-semibold text-slate-900">{supplier.supplierName}</p>
                  <p className="text-sm text-slate-600">{supplier.productCount} products</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(supplier.rating / 20) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{supplier.rating}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}