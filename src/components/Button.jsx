export default function Button({ children, type = "button", onClick, className = "" }) {
  return (
    <button
      type={type}
      className={`h-12 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-400 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}