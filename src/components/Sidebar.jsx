import {
  FiGrid,
  FiUsers,
  FiBox,
  FiHome,
  FiAlertTriangle,
  FiPlus,
} from "react-icons/fi";

function Sidebar() {
  return (
    <aside className="w-{350px} min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between">

      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Inventory Hub
          </h2>

          <p className="text-sm text-green-600 mt-1">
            ● System Online
          </p>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">

          <button className="w-full h-[35px] px-3 rounded-lg flex items-center gap-4 bg-slate-900 text-white">
            <FiGrid />
            Categories
          </button>

          <button className="w-full h-[35px] px-3 rounded-lg flex items-center gap-4 hover:bg-gray-100">
            <FiUsers />
            Suppliers
          </button>

          <button className="w-full h-[35px] px-3 rounded-lg flex items-center gap-4 hover:bg-gray-100">
            <FiBox />
            Products
          </button>

          <button className="w-full h-[35px] px-3 rounded-lg flex items-center gap-4 hover:bg-gray-100">
            <FiHome />
            Warehouse B
          </button>

          <button className="w-full h-[35px] px-3 rounded-lg flex items-center gap-4 hover:bg-gray-100">
            <FiAlertTriangle />
            Critical Stock
          </button>

        </nav>
      </div>

      {/* Bottom Section */}
<div className="p-4 border-t border-gray-200">

  <button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center justify-center gap-2 transition">
    <FiPlus />
    <span className="font-medium">Add New Entry</span>
  </button>

  <div className="mt-6">
    <div className="flex items-center gap-2 text-green-600 text-sm">
      <span className="w-2 h-2 rounded-full bg-green-500"></span>
      <span>Database Connected</span>
    </div>

    <p className="text-xs text-gray-500 mt-2">
      ©2024 StockFlow Systems
    </p>

    <p className="text-xs text-gray-400">
      Version 2.4.1
    </p>
  </div>
</div>
</aside>
)
}

export default Sidebar;