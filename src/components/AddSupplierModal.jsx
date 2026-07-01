import { useState, useEffect } from "react";
import { MdOutlinePersonOutline, MdOutlinePhone, MdOutlineMail, MdOutlineLocationOn, MdOutlineBadge } from "react-icons/md";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

function AddSupplierModal({
  addSupplier,
  updateSupplier,
  editingSupplier,
  onClose,
  isOpen,
}) {
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [createdBy, setCreatedBy] = useState(sessionStorage.getItem("userId") || "1");

  useEffect(() => {
    if (editingSupplier) {
      setSupplierName(editingSupplier.name || "");
      setPhoneNumber(editingSupplier.phoneNumber || "");
      setEmail(editingSupplier.email || "");
      setContactPerson(editingSupplier.contactPerson || "");
      setAddress(editingSupplier.address || "");
      setCreatedBy(editingSupplier.createdBy || sessionStorage.getItem("userId") || "1");
    } else {
      setSupplierName("");
      setPhoneNumber("");
      setEmail("");     
      setContactPerson("");
      setAddress("");
      setCreatedBy(sessionStorage.getItem("userId") || "1");
    }
  }, [editingSupplier, isOpen]);

  const handleSave = (event) => {
    event.preventDefault();

    if (!supplierName.trim() || !phoneNumber.trim() || !email.trim() || !contactPerson.trim() || !address.trim() || !createdBy.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const supplier = {
      id: editingSupplier?.id ?? Date.now(),
      name: supplierName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      contactPerson: contactPerson.trim(),
      address: address.trim(),
      createdBy: createdBy.trim(),
    };

    if (editingSupplier) {
      updateSupplier(supplier);
    } else {
      addSupplier(supplier);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeButton={false}>
      <div className="w-[92vw] max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#191C1E]">
            {editingSupplier ? "Edit Supplier" : "Add Supplier"}
          </h2>
          <p className="text-sm text-[#45474C]">
            {editingSupplier ? "Update the supplier details below." : "Fill in the details below to create a new supplier entry."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSave}>
          <Input
            className="w-full"
            id="supplierName"
            label="Supplier Name"
            placeholder="Enter supplier name"
            value={supplierName}
            onChange={(event) => setSupplierName(event.target.value)}
            icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="phoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            icon={<MdOutlinePhone size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="email"
            label="Email"
            placeholder="Enter email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<MdOutlineMail size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="contactPerson"
            label="Contact Person"
            placeholder="Enter contact person"
            value={contactPerson}
            onChange={(event) => setContactPerson(event.target.value)}
            icon={<MdOutlinePersonOutline size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="address"
            label="Address"
            placeholder="Enter address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            icon={<MdOutlineLocationOn size={20} color="#75777D" />}
          />

          <Input
            className="w-full"
            id="createdBy"
            label="Created By"
            placeholder="Enter user ID"
            value={createdBy}
            onChange={(event) => setCreatedBy(event.target.value)}
            icon={<MdOutlineBadge size={20} color="#75777D" />}
            readOnly
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-lg border border-[#C5C6CD] px-4 text-sm font-medium text-[#45474C]"
            >
              Cancel
            </button>
            <Button type="submit" className="w-auto px-5">
              {editingSupplier ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddSupplierModal;