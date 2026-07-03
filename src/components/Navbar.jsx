import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Bell, User, LogOut, Settings, 
  LayoutDashboard, Package, Users, BarChart3,
  ChevronDown, X
} from "./Icons";
import { ProfileContext } from "../context/ProfileContext";
import { TokenDispatchContext } from "../context/TokenContext";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const profile = useContext(ProfileContext);
  const tokenDispatch = useContext(TokenDispatchContext);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Package },
    { to: "/suppliers", label: "Suppliers", icon: Users },
    { to: "/inventory", label: "Inventory", icon: BarChart3 },
    { to: "/admin", label: "Profile", icon: User },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    tokenDispatch({ type: "loggedOut" });
    sessionStorage.removeItem("myToken");
    navigate("/login");
  }

  return (
    <>
      {/* <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-500/5" 
            : "bg-transparent"
        }`}
      > */} 

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg" 
            : "bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <NavLink to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">S</span>
                  </div>
                </div>
                <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                  Stock<span className="text-indigo-500">Track</span>
                </span>
              </NavLink>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? `${isScrolled ? 'bg-indigo-50 text-indigo-700' : 'bg-white/20 text-white'}`
                          : `${isScrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                        <span>{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className={`absolute inset-0 rounded-xl ${isScrolled ? 'bg-indigo-50' : 'bg-white/20'}`}
                            style={{ zIndex: -1 }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      autoFocus
                      className={`w-48 lg:w-64 px-4 py-2 rounded-xl border text-sm outline-none transition-colors ${
                        isScrolled 
                          ? 'border-slate-200 bg-slate-50 focus:border-indigo-300' 
                          : 'border-white/30 bg-white/10 text-white placeholder-white/60 focus:border-white/50'
                      }`}
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsSearchOpen(true)}
                    className={`p-2 rounded-xl transition-all ${
                      isScrolled 
                        ? 'text-slate-600 hover:bg-slate-100' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Notifications */}
              <button className={`relative p-2 rounded-xl transition-all ${
                isScrolled 
                  ? 'text-slate-600 hover:bg-slate-100' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl transition-all ${
                    isScrolled 
                      ? 'hover:bg-slate-100' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                    isScrolled 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {profile?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-semibold leading-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                      {profile?.firstName || "User"}
                    </p>
                    <p className={`text-xs leading-tight ${isScrolled ? 'text-slate-500' : 'text-white/60'}`}>
                      {profile?.role || "Member"}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-slate-400' : 'text-white/60'}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-500/10 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {profile?.firstName?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {profile?.firstName} {profile?.lastName}
                            </p>
                            <p className="text-sm text-slate-500">{profile?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <NavLink
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </NavLink>
                        <NavLink
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </NavLink>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all ${
                  isScrolled 
                    ? 'text-slate-600 hover:bg-slate-100' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 lg:hidden left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              ))}
              
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
































































// // frontend-inventory-manager/src/components/Navbar.jsx
// import { FiSearch, FiBell, FiUser } from "react-icons/fi";
// import { NavLink } from "react-router";

// function Navbar() {

//   const navLinks = [
//     {
//       to: "/",
//       label: "Dashboard"
//     },
//     {
//       to: "/products",
//       label: "Products"
//     },
//     {
//       to: "/suppliers",
//       label: "Suppliers"
//     },
//     {
//       to: "/inventory",
//       label: "Inventory"
//     },
//     {
//       to: "/admin",
//       label: "Profile"
//     }
//   ]

//   return (
//     <nav className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
//       <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
//         <div className="flex items-center gap-6">
//           <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//             Stock <span className="text-amber-500">Track</span>
//           </h1>

//           <div className="hidden items-center gap-2 md:flex">
//             {navLinks.map((nav) => (
//               <NavLink
//                 key={nav.to}
//                 to={nav.to}
//                 className={({ isActive }) =>
//                   `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
//                 }
//               >
//                 {nav.label}
//               </NavLink>
//             ))}
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
//             <FiSearch className="text-slate-500" />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="w-28 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-36"
//             />
//           </div>

//           <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
//             <FiBell size={18} />
//           </button>

//           <NavLink
//             to="/admin"
//             className={({ isActive }) =>
//               `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
//             }
//           >
//             <FiUser />
//             <span className="hidden sm:inline">Profile</span>
//           </NavLink>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;