import { motion } from 'framer-motion';
// import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from './Icons';

export default function Card({ 
  title, 
  value, 
  icon: Icon,
  trend,
  trendValue,
  className = '',
  children,
  gradient = false
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative overflow-hidden rounded-2xl 
        ${gradient 
          ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white' 
          : 'bg-white border border-slate-200'
        }
        p-6 shadow-sm hover:shadow-xl transition-shadow duration-300
        ${className}
      `.trim()}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      )}
      
      <div className="relative z-10">
        {Icon && (
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center mb-4
            ${gradient ? 'bg-white/10' : 'bg-slate-100'}
          `}>
            <Icon className={`w-6 h-6 ${gradient ? 'text-white' : 'text-slate-700'}`} />
          </div>
        )}
        
        <p className={`text-sm font-medium ${gradient ? 'text-slate-300' : 'text-slate-600'}`}>
          {title}
        </p>
        
        <div className="mt-2 flex items-baseline gap-2">
          <h3 className={`text-3xl font-bold ${gradient ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </h3>
          
          {trend && (
            <span className={`
              inline-flex items-center gap-1 text-sm font-semibold
              ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-500'}
            `}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
               trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
               <Minus className="w-4 h-4" />}
              {trendValue}
            </span>
          )}
        </div>
        
        {children}
      </div>
    </motion.div>
  );
}























// // frontend-inventory-manager/src/components/Card.jsx
// export default function Card({ icon, title, desc, stat }) {
//   return (
//     <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-[0_16px_40px_-20px_rgba(15,23,42,0.7)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.9)]">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_45%)]" />
//       <div className="relative z-10">
//         <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
//           {icon}
//         </div>
//         <p className="text-3xl font-semibold tracking-tight">{stat}</p>
//         <h3 className="mt-2 text-lg font-semibold">{title}</h3>
//         <p className="mt-2 text-sm leading-6 text-slate-200">{desc}</p>
//       </div>
//     </div>
//   );
// }