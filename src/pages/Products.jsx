import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input"
import ProductTable from "../components/ProductTable";
import Modal from "../components/Modal";

function Products() {

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false)

  function openAddProductModal() {
    setIsAddProductModalOpen(true)
  }

  function openEditProductModal() {
    setIsEditProductModalOpen(true)
  }

  function closeModal() {
    setIsAddProductModalOpen(false)
    setIsEditProductModalOpen(false)
  }

  return (
    <>
      Products
      <Button onClick={openAddProductModal}>Add New Product</Button>
      <Button onClick={openEditProductModal}>Edit Product</Button>
      <ProductTable />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={closeModal}
      >
        <h1>Add Product</h1>
        <form>
          <Input
            id={"productName"}
            placeholder={"Enter Product Name"}
            label={"Product Name"}

          />
          <Input
            id={"quantity"}
            placeholder={"Enter Quantity"}
            label={"Quantity"}
          />
          <Input id={"unitPrice"} />
          <Input id={"unit"} />
          <Input id={"reorderLevel"} />
          <Button>
            Add Product
          </Button>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditProductModalOpen}
        onClose={closeModal}
      >
        <h1>Edit Product</h1>
      </Modal>
    </>


  );
}

export default Products;