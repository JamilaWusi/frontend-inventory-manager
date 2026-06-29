import { useState } from "react";
import ProductTable from "./ProductTable";

function Dashboard() {
  const [products, setProducts] = useState([
    {
      id: "SF-9042-X",
      name: "Neural Processor v4",
      stock: 852,
    },
    {
      id: "SF-1120-B",
      name: "Haptic Sensor Array",
      stock: 14,
    },
    {
      id: "SF-4402-Q",
      name: "L-ion Battery Module",
      stock: 410,
    },
  ]);

  // Delete Product
  const deleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  return (
    <div>
      <ProductTable
        products={products}
        deleteProduct={deleteProduct}
      />
    </div>
  );
}

export default Dashboard;