function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-600">
        StockFlow Pro
      </h1>

      <div className="flex gap-6">
        <button>Dashboard</button>
        <button>Inventory</button>
        <button>Reports</button>
        <button>Suppliers</button>
        <button>Settings</button>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-1"
        />

        <button>🔔</button>

        <button>👤 Admin</button>
      </div>
    </nav>
  );
}

export default Navbar;