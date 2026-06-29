import { Route, Routes } from "react-router";
import Dashboard from "./Dashboard";
import createAccount from "./create account";
import suppliers from "./supppliers";
import NotFound from "./";

export default function Navigation() {
    return (
        <Routes>
            <Route
                index
                element={<Login />}
            />
            <Route
                path="/suppliers"
                element={<suppliers />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />
            <Route
                path="/dashboard"
                element={<Dashboard />}
            />
            <Route
                path="/*"
                element={<NotFound />}
            />
        </Routes>
    )
}