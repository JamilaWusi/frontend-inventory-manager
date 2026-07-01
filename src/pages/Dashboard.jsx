import { useState } from "react";

import ProductTable from "../components/ProductTable.jsx";
import Card from "../components/Card.jsx";
import { RiShoppingCart2Fill } from "react-icons/ri";

function Dashboard() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Real-time inventory monitoring and quick access to product, supplier, and stock transaction summaries.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={20}
          title="Products"
          desc="All products in your database"
        />
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={12}
          title="Suppliers"
          desc="Active supplier relationships"
        />
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={7}
          title="Critical Alerts"
          desc="Products needing restock"
        />
      </div>

      <ProductTable />
    </div>
  );
}

export default Dashboard;