import { useContext, useEffect, useMemo, useState } from "react";

import ProductTable from "../components/ProductTable.jsx";
import Card from "../components/Card.jsx";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { ProfileContext } from "../context/ProfileContext.jsx";
import { TokenContext } from "../context/TokenContext.jsx";
import { deleteProduct, getProducts, getSuppliers } from "../utils/fn.js";
import PageLoader from "./PageLoader";

function getStockValue(product) {
  return Number(product.currentStock ?? product.quantity ?? product.currentStockQuantity ?? 0);
}

function Dashboard() {
  const profile = useContext(ProfileContext);
  const tokenPayload = useContext(TokenContext);

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboardData() {
    if (!tokenPayload?.token) {
      setProducts([]);
      setSuppliers([]);
      setError("");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [productsResponse, suppliersResponse] = await Promise.all([
        getProducts(tokenPayload.token),
        getSuppliers(tokenPayload.token),
      ]);

      setProducts(Array.isArray(productsResponse?.data) ? productsResponse.data : []);
      setSuppliers(Array.isArray(suppliersResponse?.data) ? suppliersResponse.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data right now.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [tokenPayload?.token]);

  const criticalAlerts = useMemo(
    () => products.filter((product) => getStockValue(product) <= Number(product.reorderLevel || 5)),
    [products]
  );

  async function handleDeleteProduct(productId) {
    if (!tokenPayload?.token) return;

    try {
      setIsLoading(true);
      const response = await deleteProduct(tokenPayload.token, productId);

      if (response) {
        setProducts((currentProducts) =>
          currentProducts.filter((product) => (product._id || product.id) !== productId)
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete this product right now.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Welcome, <span>{`${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "there"}</span>, to StockTrack
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Real-time inventory monitoring and quick access to product, supplier, and stock transaction summaries.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={products.length}
          title="Products"
          className="font-semibold"
          desc="All products in your database"
        />
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={suppliers.length}
          title="Suppliers"
          desc="Active supplier relationships"
        />
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={criticalAlerts.length}
          title="Critical Alerts"
          desc="Products needing restock"
        />
      </div>

      <ProductTable products={products} onDelete={handleDeleteProduct} />
    </div>
  );
}

export default Dashboard;