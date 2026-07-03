// import { Loader2 } from 'lucide-react';
import { Loader2 } from "../components/Icons";

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-4 text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}




















// import Loader from "../components/Loader";

// export default function PageLoader() {
//     return (
//         <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
//             <Loader />
//         </div>
//     )
// }