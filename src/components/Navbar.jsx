import { FiSearch, FiBell, FiUser } from "react-icons/fi";

function Navbar() {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* Left Section */}
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-bold text-green-600">
          StockFlow Pro
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <button className="font-semibold text-slate-900">
            Dashboard
          </button>

          <button className="text-slate-600 font-semibold hover:text-slate-900">
            Inventory
          </button>

          <button className="text-slate-600 font-semibold hover:text-slate-900">
            Reports
          </button>

          <button className="text-slate-600 font-semibold hover:text-slate-900">
            Settings
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2">
          <FiSearch className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none text-sm"
          />
        </div>

        {/* Notification */}
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <FiBell size={20} />
        </button>

        {/* Admin */}
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <FiUser />
          <span>Admin</span>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;