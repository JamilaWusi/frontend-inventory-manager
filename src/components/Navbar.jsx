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
      label: "Profile"
    }
  ]

  return (
    <nav className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Stock <span className="text-amber-500">Track</span>
          </h1>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((nav) => (
              <NavLink
                key={nav.to}
                to={nav.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
                }
              >
                {nav.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
            <FiSearch className="text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-28 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-36"
            />
          </div>

          <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <FiBell size={18} />
          </button>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
            }
          >
            <FiUser />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;