import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";

function ProductTable() {

  const products = [
    {
      id: 1,
      productName: "Rice",
      category: "Food",
      supplier: "Dangote",
      unitPrice: 4500,
      currentStockQuantity: 75,
      status: "In Stock",
    },
    {
      id: 2,
      productName: "Sugar",
      category: "Food",
      supplier: "BUA",
      unitPrice: 3200,
      currentStockQuantity: 8,
      status: "Low Stock",
    },
    {
      id: 3,
      productName: "Milk",
      category: "Dairy",
      supplier: "Peak",
      unitPrice: 1500,
      currentStockQuantity: 0,
      status: "Out of Stock",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <table className="w-full">
        {/* Your table code goes here */}
      </table>
    </div>
  );
}

export default ProductTable;