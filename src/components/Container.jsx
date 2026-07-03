import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Container({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            {/* Add pt-20 (or pt-16) to push content below the fixed navbar */}
            <main className="pt-20 lg:pt-24 px-5 md:px-10 mx-auto max-w-[1440px] pb-10">
                <Outlet />
            </main>
        </div>
    )
}





















// // frontend-inventory-manager/src/components/Container.jsx
// import { Outlet } from "react-router";
// import Navbar from "./Navbar";

// export default function Container({ children }) {

//     return (
//         <div className="min-h-screen">
//             <Navbar />
//             <main className="py-5 px-5 md:px-10 mx-auto max-w-[1440px]">
//                 <Outlet />
//             </main>

//         </div>
//     )
// }