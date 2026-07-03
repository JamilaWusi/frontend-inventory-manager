// import { Loader2 } from 'lucide-react';
import { Loader2 } from "./Icons";

const variants = {
  primary: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/25',
  secondary: 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50',
  danger: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/25',
  success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25',
  ghost: 'hover:bg-slate-100 text-slate-600',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export default function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '', 
  ...props 
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 
        rounded-xl font-semibold
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}









// // frontend-inventory-manager/src/components/Button.jsx
// export default function Button({ children, type = "button", onClick, disabled=false, className = "" }) {
//     return (
//         <button
//             type={type}
//             disabled={disabled}
//             className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
//             onClick={onClick}
//         >
//             {children}
//         </button>
//     )
//   }