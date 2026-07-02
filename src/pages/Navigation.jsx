import { Route, Routes } from "react-router";
import Dashboard from "./Dashboard";
import Suppliers from "./Suppliers";
import Signup from "./Signup";
import Products from "./Products";
import Inventory from "./Inventory";
import Container from "../components/Container";
import Login from "./Login";
import AdminPanel from "../components/Admin";
import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../context/TokenContext";
import { getProfile, getSuppliers } from "../utils/fn";
import { profileDispatchContext } from "../context/ProfileContext";
import PageLoader from "./PageLoader";
import { SupplierDispatchContext } from "../context/SupplierContext";


export default function Navigation() {

    const tokenPayload = useContext(TokenContext)
    const profileDispatch = useContext(profileDispatchContext)
    const suppliersDispatch = useContext(SupplierDispatchContext)
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        async function call() {
            try {
                setIsLoading(true)
                if (tokenPayload.token) {
                    const response = await getProfile(tokenPayload.token)
                    if (response) {
                        profileDispatch({
                            type: "set",
                            payload: response
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        call()
    }, [tokenPayload])

    useEffect(() => {
        async function fetchSuppliers() {
            try {
                if (tokenPayload.token) {
                    const response = await getSuppliers(tokenPayload.token)
                    console.log(response)
                    if (response) {
                        suppliersDispatch({
                            type: "loggedIn",
                            payload: response.data
                        })
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuppliers()
    }, [tokenPayload])

    if (isLoading) {
        return <PageLoader />
    }

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
                            path="/admin"
                            element={<AdminPanel />}
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