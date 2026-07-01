
export default function Button({ children, type = "button", onClick, disabled=false, className = "" }) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
            onClick={onClick}
        >
            {children}
        </button>
    )
  }