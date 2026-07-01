import { Route, Routes } from "react-router";
import Dashboard from "./Dashboard";
import Suppliers from "./Suppliers";
import Signup from "./Signup";
import Products from "./Products";
import Inventory from "./Inventory";
import Container from "../components/Container";
import Login from "./Login";

export default function Navigation() {
    return (
        <Routes>
            <Route element={<Container />}>
                <Route
                    index
                    element={<Dashboard />}
                />
                <Route
                    path="/products"
                    element={<Products />}
                />
                <Route
                    path="/suppliers"
                    element={<Suppliers />}
                />

                <Route
                    path="/inventory"
                    element={<Inventory />}
                />

                <Route
                    path="/*"
                    // element={<NotFound />}
                />
            </Route>
            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/signup"
                element={<Signup />}
            />
        </Routes>
    )
}