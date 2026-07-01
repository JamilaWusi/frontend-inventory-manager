import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { NavLink } from "react-router";

function Navbar() {

  const navLinks = [
    {
      to: "/",
      label: "Dashboard"
    },
    {
      to: "/products",
      label: "Products"
    },
    {
      to: "/suppliers",
      label: "Suppliers"
    },
    {
      to: "/inventory",
      label: "Inventory"
    },
    {
      to: "/admin",
      label: "Admin"
    }
  ]

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      {/* Left Section */}
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-bold text-green-600">
          Stock Track
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {
            navLinks.map(nav => {
              return (
                <NavLink to={nav.to}
                  className={({ isActive }) =>
                    isActive ? "text-amber-300" : ``
                  }
                >
                 {nav.label}
                </NavLink>
              )
            })
          }

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
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 transition ${isActive ? "bg-amber-50 text-amber-600" : "text-gray-700 hover:bg-gray-100"}`
          }
        >
          <FiUser />
          <span>Admin</span>
        </NavLink>

      </div>
    </nav>
  );
}

export default Navbar;