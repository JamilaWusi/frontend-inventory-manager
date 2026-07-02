import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Container({ children }) {

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="py-5 px-5 md:px-10 mx-auto max-w-[1440px]">
                <Outlet />
            </main>

        </div>
    )
}