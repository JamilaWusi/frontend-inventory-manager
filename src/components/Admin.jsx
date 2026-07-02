import { useEffect, useState } from "react";

function UsersManager({ users = [], currentUser }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">User Access</h2>
          <p className="text-sm text-slate-600">Manage staff and admin access for {currentUser?.businessName || "your business"}.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.length > 0 ? users.map((user) => (
              <tr key={user.id || user.email}>
                <td className="px-4 py-3 font-medium text-slate-900">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-slate-700">{user.email}</td>
                <td className="px-4 py-3 text-slate-700">{user.role}</td>
                <td className="px-4 py-3 text-slate-700">Active</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-slate-500">No users have been added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsManager({ products = [], currentUser }) {
  const productList = products.length > 0 ? products : [
    { id: 1, name: "Rice", category: "Food", stock: 25, price: 4500 },
    { id: 2, name: "Sugar", category: "Food", stock: 8, price: 3200 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Product Management</h2>
          <p className="text-sm text-slate-600">View current products for {currentUser?.businessName || "your business"}.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {productList.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{product.name || product.productName}</td>
                <td className="px-4 py-3 text-slate-700">{product.category}</td>
                <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                <td className="px-4 py-3 text-slate-700">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPanel({
  currentUser,
  users,
  products,
  transactions,
  onLogout,
  onBack,
  onAddUser,
  onDeleteUser,
  onAddProduct,
  onDeleteProduct,
  onAddTransaction,
  onDeleteTransaction,
  onDeleteProfile,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
  });

  const isAdminView = currentUser?.role === "Admin" || currentUser?.role === "Owner";

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || "",
        businessName: currentUser.businessName || "",
      });
    }
  }, [currentUser]);

  function handleProfileUpdate(event) {
    event.preventDefault();
    alert("Profile updated successfully.");
  }

  function handleDeleteProfile() {
    const confirmed = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmed) return;

    if (onDeleteProfile) {
      onDeleteProfile(currentUser?.id);
    }

    onLogout?.();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="mb-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              {isAdminView ? "Admin Dashboard" : "User Dashboard"}
            </h1>
            <p className="text-sm text-slate-600">
              Signed in as {currentUser?.firstName} {currentUser?.lastName} ({currentUser?.role})
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              onClick={onBack}
              className="rounded bg-slate-200 px-4 py-2 text-sm text-slate-800 hover:bg-slate-300"
            >
              Back to Landing
            </button>
            <button
              onClick={onLogout}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-1 sm:gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`whitespace-nowrap rounded px-4 py-2 text-sm ${
              activeTab === "profile" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
            }`}
          >
            My Profile
          </button>
          {isAdminView && (
            <>
              <button
                onClick={() => setActiveTab("users")}
                className={`whitespace-nowrap rounded px-4 py-2 text-sm ${
                  activeTab === "users" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
                }`}
              >
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`whitespace-nowrap rounded px-4 py-2 text-sm ${
                  activeTab === "products" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
                }`}
              >
                Manage Products
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`whitespace-nowrap rounded px-4 py-2 text-sm ${
                  activeTab === "transactions" ? "bg-indigo-600 text-white" : "bg-white text-slate-700 shadow"
                }`}
              >
                Stock Transactions
              </button>
            </>
          )}
        </div>

        <div className="rounded-lg bg-white p-3 shadow sm:p-6">
          {activeTab === "profile" && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <h2 className="mb-2 text-xl font-semibold text-slate-900">Profile Overview</h2>
                <p className="mb-4 text-sm text-slate-600">
                  Review and update your account details from here.
                </p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 sm:flex-row sm:justify-between">
                    <span className="font-medium text-slate-500">Name</span>
                    <span>{currentUser?.firstName} {currentUser?.lastName}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 sm:flex-row sm:justify-between">
                    <span className="font-medium text-slate-500">Email</span>
                    <span className="break-all">{currentUser?.email}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 sm:flex-row sm:justify-between">
                    <span className="font-medium text-slate-500">Role</span>
                    <span>{currentUser?.role}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 sm:flex-row sm:justify-between">
                    <span className="font-medium text-slate-500">Business</span>
                    <span>{currentUser?.businessName || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="font-medium text-slate-500">Phone</span>
                    <span>{currentUser?.phoneNumber || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 sm:p-6">
                <h2 className="mb-2 text-xl font-semibold text-slate-900">Update Profile</h2>
                <p className="mb-4 text-sm text-slate-600">
                  Edit your profile information below.
                </p>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(event) => setProfileForm({ ...profileForm, firstName: event.target.value })}
                      placeholder="First Name"
                      className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(event) => setProfileForm({ ...profileForm, lastName: event.target.value })}
                      placeholder="Last Name"
                      className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                      placeholder="Email"
                      className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={profileForm.phoneNumber}
                      onChange={(event) => setProfileForm({ ...profileForm, phoneNumber: event.target.value })}
                      placeholder="Phone Number"
                      className="w-full rounded border border-slate-300 px-3 py-2"
                    />
                  </div>
                  <input
                    type="text"
                    value={profileForm.businessName}
                    onChange={(event) => setProfileForm({ ...profileForm, businessName: event.target.value })}
                    placeholder="Business Name"
                    className="w-full rounded border border-slate-300 px-3 py-2"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="submit"
                      className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Update Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteProfile}
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {activeTab === "users" && (
            <UsersManager
              users={users}
              onAddUser={onAddUser}
              onDeleteUser={onDeleteUser}
              currentUser={currentUser}
            />
          )}
          {activeTab === "products" && (
            <ProductsManager
              products={products}
              onAddProduct={onAddProduct}
              onDeleteProduct={onDeleteProduct}
              currentUser={currentUser}
            />
          )}
          {activeTab === "transactions" && <StockTransactions />}
        </div>
      </div>
    </div>
  );
}
