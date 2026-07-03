// frontend-inventory-manager/src/utils/inventoryStorage.js
const INVENTORY_STORAGE_KEY = "inventory-manager-data";

export const defaultInventoryData = {
  products: [
    {
      id: 1,
      name: "Rice",
      productName: "Rice",
      currentStock: 75,
      category: "Food",
      unitPrice: 4500,
      unit: "Bag",
      reorderLevel: 10,
      supplier: "Nova Supplies",
    },
    {
      id: 2,
      name: "Sugar",
      productName: "Sugar",
      currentStock: 8,
      category: "Food",
      unitPrice: 3200,
      unit: "Bag",
      reorderLevel: 5,
      supplier: "Elite Traders",
    },
    {
      id: 3,
      name: "Milk",
      productName: "Milk",
      currentStock: 0,
      category: "Dairy",
      unitPrice: 1500,
      unit: "Carton",
      reorderLevel: 5,
      supplier: "Nova Supplies",
    },
  ],
  suppliers: [
    {
      id: 1,
      name: "Nova Supplies",
      phoneNumber: "08012345678",
      email: "sales@novasupplies.com",
      contactPerson: "Ada Okafor",
      address: "12, Broad Street, Lagos",
      createdBy: "1",
    },
    {
      id: 2,
      name: "Elite Traders",
      phoneNumber: "08123456789",
      email: "accounts@elitetraders.com",
      contactPerson: "Tunde Yusuf",
      address: "45, Herbert Macaulay Way, Abuja",
      createdBy: "1",
    },
  ],
  transactions: [
    {
      id: 1,
      productId: 1,
      productName: "Rice",
      type: "Restock",
      quantity: 20,
      note: "New delivery",
      performedBy: "Ada",
      date: "2026-06-28 09:30",
    },
    {
      id: 2,
      productId: 2,
      productName: "Sugar",
      type: "Issue",
      quantity: 5,
      note: "Sales issue",
      performedBy: "Tunde",
      date: "2026-06-29 14:10",
    },
  ],
};

function normalizeInventoryData(data) {
  return {
    products: Array.isArray(data?.products) ? data.products : defaultInventoryData.products,
    suppliers: Array.isArray(data?.suppliers) ? data.suppliers : defaultInventoryData.suppliers,
    transactions: Array.isArray(data?.transactions) ? data.transactions : defaultInventoryData.transactions,
  };
}

function getStockValue(product) {
  return Number(product.currentStock ?? product.quantity ?? product.currentStockQuantity ?? 0);
}

export function getInventoryData() {
  if (typeof window === "undefined") {
    return normalizeInventoryData(defaultInventoryData);
  }

  try {
    const saved = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!saved) {
      saveInventoryData(defaultInventoryData);
      return normalizeInventoryData(defaultInventoryData);
    }

    return normalizeInventoryData(JSON.parse(saved));
  } catch (error) {
    console.error("Unable to read inventory data", error);
    return normalizeInventoryData(defaultInventoryData);
  }
}

export function saveInventoryData(data) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(normalizeInventoryData(data)));
}

export function addInventoryProduct(product) {
  const currentData = getInventoryData();
  const nextProduct = {
    id: product.id ?? Date.now(),
    name: product.name || product.productName || "Unnamed Product",
    productName: product.productName || product.name || "Unnamed Product",
    currentStock: Number(product.currentStock ?? product.quantity ?? 0),
    category: product.category || "General",
    unitPrice: Number(product.unitPrice ?? 0),
    unit: product.unit || "pcs",
    reorderLevel: Number(product.reorderLevel ?? 0),
    supplier: product.supplier || "",
  };

  const nextData = {
    ...currentData,
    products: [...currentData.products, nextProduct],
  };

  saveInventoryData(nextData);
  return nextData;
}

export function updateInventoryProduct(updatedProduct) {
  const currentData = getInventoryData();
  const nextData = {
    ...currentData,
    products: currentData.products.map((product) =>
      product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
    ),
  };

  saveInventoryData(nextData);
  return nextData;
}

export function deleteInventoryProduct(productId) {
  const currentData = getInventoryData();
  const nextData = {
    ...currentData,
    products: currentData.products.filter((product) => product.id !== productId),
    transactions: currentData.transactions.filter((transaction) => transaction.productId !== productId),
  };

  saveInventoryData(nextData);
  return nextData;
}

export function addInventorySupplier(supplier) {
  const currentData = getInventoryData();
  const nextData = {
    ...currentData,
    suppliers: [...currentData.suppliers, supplier],
  };

  saveInventoryData(nextData);
  return nextData;
}

export function updateInventorySupplier(updatedSupplier) {
  const currentData = getInventoryData();
  const nextData = {
    ...currentData,
    suppliers: currentData.suppliers.map((supplier) =>
      supplier.id === updatedSupplier.id ? { ...supplier, ...updatedSupplier } : supplier
    ),
  };

  saveInventoryData(nextData);
  return nextData;
}

export function deleteInventorySupplier(supplierId) {
  const currentData = getInventoryData();
  const nextData = {
    ...currentData,
    suppliers: currentData.suppliers.filter((supplier) => supplier.id !== supplierId),
  };

  saveInventoryData(nextData);
  return nextData;
}

export function getWeeklyInventoryReport(data = getInventoryData()) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const weeklyTransactions = (data.transactions || []).filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return !Number.isNaN(transactionDate.getTime()) && transactionDate >= weekAgo;
  });

  const restocks = weeklyTransactions.filter((transaction) => transaction.type === "Restock");
  const issues = weeklyTransactions.filter((transaction) => transaction.type === "Issue");
  const adjustments = weeklyTransactions.filter((transaction) => transaction.type === "Adjustment");

  return {
    movementCount: weeklyTransactions.length,
    restockCount: restocks.reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0),
    issueCount: issues.reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0),
    adjustmentCount: adjustments.reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0),
    lowStockProducts: (data.products || []).filter((product) => getStockValue(product) <= Number(product.reorderLevel || 5)),
  };
}

export function recordInventoryTransaction({ productId, type, quantity, note, performedBy }) {
  const currentData = getInventoryData();
  const selectedProduct = currentData.products.find((product) => product.id === Number(productId));

  if (!selectedProduct) {
    return currentData;
  }

  const qty = Number(quantity);
  const nextStock =
    type === "Issue"
      ? Math.max(0, selectedProduct.currentStock - qty)
      : type === "Adjustment"
        ? qty
        : selectedProduct.currentStock + qty;

  const updatedProducts = currentData.products.map((product) =>
    product.id === selectedProduct.id ? { ...product, currentStock: nextStock } : product
  );

  const newTransaction = {
    id: Date.now(),
    productId: selectedProduct.id,
    productName: selectedProduct.name || selectedProduct.productName,
    type,
    quantity: qty,
    note: note || "No note added",
    performedBy,
    date: new Date().toLocaleString(),
  };

  const nextData = {
    ...currentData,
    products: updatedProducts,
    transactions: [newTransaction, ...currentData.transactions],
  };

  saveInventoryData(nextData);
  return nextData;
}

export function deleteInventoryTransaction(transactionId) {
  const currentData = getInventoryData();
  const nextData = {
    ...currentData,
    transactions: currentData.transactions.filter((transaction) => transaction.id !== transactionId),
  };

  saveInventoryData(nextData);
  return nextData;
}
