import { useState } from "react";

import ProductTable from "../components/ProductTable.jsx";
import Card from "../components/Card.jsx";
import { RiShoppingCart2Fill } from "react-icons/ri";

function Dashboard() {

  return (
    <>

      <div className="mb-8">
        <h1 className="text-3xl gap-4 h-[66] w-[380] font-bold text-slate-900">
          System Overview
        </h1>

        <p className="text-slate-500">
          Real-time inventory monitoring
        </p>
      </div>
      <div className="flex gap-5">
        <Card
          icon={<RiShoppingCart2Fill />}
          stat={20}
          title={"Products"}
          desc={"All products in your database"}
        />
        <Card
          stat={20}
          title={"Products"}
          desc={"All products in your database"}
        />
        <Card
          stat={20}
          title={"Products"}
          desc={"All products in your database"}
        />

      </div>

      <p>Hello</p>

      <ProductTable />

    </>
  );
}

export default Dashboard;