import { Route, Routes } from "react-router";
import Dashboard from "./Dashboard";
import Suppliers from "./Suppliers";
import Signup from "./Signup";
import Products from "./Products";
import Inventory from "./Inventory";
import Container from "../components/Container";
import Login from "./Login";
import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";

export default function Navigation() {

    const tokenPayload = useContext(TokenContext)

    return (
        <Routes>
            {
                tokenPayload.token ? (
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
                            element={<Dashboard />}
                        />
                    </Route>
                ) : (
                    <>
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                        <Route
                            path="/signup"
                            element={<Signup />}
                        />
                        <Route
                            path="/*"
                            element={<Login />}
                        />
                    </>
                )}


        </Routes>
    )
}