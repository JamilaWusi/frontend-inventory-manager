import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import OverViewCard from "../components/OverViewCard.jsx";
import ProductTable from "../components/ProductTable.jsx";
import AddProductModal from "../components/AddProductModal.jsx";
import Card from "../components/Card.jsx";
import { RiShoppingCart2Fill } from "react-icons/ri";

function Dashboard() {
  // Products
  const [products, setProducts] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Product currently being edited
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product
  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowModal(false);  };

  // Delete Product
  const deleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  // Open Edit Modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
   
    <div className="flex-1 flex-col bg-slate-100">
      <Navbar />
      <div className="mb-8">
  <h1 className="text-3xl gap-4 h-[66] w-[380] font-bold text-slate-900">
    System Overview
  </h1>

  <p className="text-slate-500">
    Real-time inventory monitoring
  </p>
</div>

       
    
    
  

      {/* 
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Header */}
      {/* <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                System Overview
              </h1>
              <p className="text-slate-500">
                Real-time inventory monitoring
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null); // Add mode
                setShowModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              + Add Product
            </button>
          </div> */}

      {/* <OverviewCards /> */}

      {/* <div className="mt-8">
            <ProductTable
              products={products}
              deleteProduct={deleteProduct}
              onEdit={handleEdit}
            />
          </div> */}

      {/* {showModal && (
            <AddProductModal
              addProduct={addProduct}
              editingProduct={editingProduct}
              onClose={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            />
          )}
        </main> */}
      {/* </div> */}
      <main className="p-10 ml-6 flex-1 ">
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

        <ProductTable />
      </main>
       </div>
    </div>
  );
}

export default Dashboard;