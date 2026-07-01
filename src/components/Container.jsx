import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Container({ children }) {

    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Outlet />
            </main>

        </div>
    )
}