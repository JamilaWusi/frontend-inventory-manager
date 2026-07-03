export function calculateInventoryScore(products, transactions) {
  let score = 100;
  
  // Deduct for low stock items
  const lowStockCount = products.filter(p => p.currentStock <= p.reorderLevel).length;
  score -= (lowStockCount / products.length) * 30;
  
  // Deduct for out of stock
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;
  score -= (outOfStockCount / products.length) * 40;
  
  // Bonus for good turnover (if we have transaction data)
  if (transactions?.length > 0) {
    score += Math.min(10, transactions.length / 10);
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function predictStockout(product, transactions) {
  if (!transactions?.length) return null;
  
  const productTransactions = transactions.filter(t => t.productId === product._id);
  if (productTransactions.length < 3) return null;
  
  // Calculate average daily consumption
  const dailyConsumption = calculateDailyConsumption(productTransactions);
  
  if (dailyConsumption <= 0) return null;
  
  const daysUntilStockout = Math.floor(product.currentStock / dailyConsumption);
  
  return {
    daysUntilStockout,
    predictedDate: new Date(Date.now() + daysUntilStockout * 86400000),
    recommendedReorder: Math.ceil(dailyConsumption * 30), // 30 days supply
    urgency: daysUntilStockout < 3 ? 'critical' : daysUntilStockout < 7 ? 'warning' : 'normal'
  };
}

function calculateDailyConsumption(transactions) {
  const stockOutTransactions = transactions.filter(t => t.type === 'Stock Out' || t.transactionType === 'Stock Out');
  if (stockOutTransactions.length < 2) return 0;
  
  const sorted = stockOutTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalQuantity = sorted.reduce((sum, t) => sum + t.quantity, 0);
  const daysDiff = (new Date(sorted[0].createdAt) - new Date(sorted[sorted.length - 1].createdAt)) / 86400000;
  
  return daysDiff > 0 ? totalQuantity / daysDiff : totalQuantity;
}

export function analyzeSupplierPerformance(suppliers, transactions, products) {
  return suppliers.map(supplier => {
    const supplierProducts = products.filter(p => p.supplier === supplier._id);
    const supplierTransactions = transactions.filter(t => 
      supplierProducts.some(p => p._id === t.productId)
    );
    
    const rating = calculateSupplierRating(supplierTransactions, supplierProducts);
    
    return {
      ...supplier,
      rating,
      productCount: supplierProducts.length,
      totalTransactions: supplierTransactions.length,
    };
  });
}

function calculateSupplierRating(transactions, products) {
  if (!transactions.length) return 0;
  
  let score = 50;
  
  // More transactions = better rating
  score += Math.min(20, transactions.length);
  
  // In-stock products = better rating
  const inStockRatio = products.filter(p => p.currentStock > 0).length / products.length;
  score += inStockRatio * 20;
  
  // Recent activity bonus
  const recentTransactions = transactions.filter(t => 
    new Date(t.createdAt) > new Date(Date.now() - 30 * 86400000)
  );
  score += Math.min(10, recentTransactions.length);
  
  return Math.min(100, Math.round(score));
}