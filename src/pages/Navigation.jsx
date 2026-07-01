import { Route, Routes } from "react-router";
import Dashboard from "./Dashboard";
import Suppliers from "./Suppliers";
import Signup from "./Signup";
import Products from "./Products";
import Inventory from "./Inventory";
import Container from "../components/Container";
import Login from "./Login";
import AdminPanel from "../components/Admin";
import { useContext } from "react";
import { TokenContext } from "../context/TokenContext";
import { getProfile } from "../utils/fn";
import { profileDispatchContext } from "../context/ProfileContext";

export default function AppRoutes() {
    const tokenPayload = useContext(TokenContext)
    const profileDispatch = useContext(profileDispatchContext)

    useEffect(() => {
       async function call() {
        try {
            if (tokenPayLoad.token) {
                const response = await getProfile(tokenPayLoad.token)
                if (response.user) {
                    profileDispatch({ 
                        type: "set", 
                        payload: response.user 
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    call()
}, [tokenPayload])

}

export default function Navigation() {

    const tokenPayload = useContext(TokenContext)
    const adminUser = {
        firstName: sessionStorage.getItem("firstName") || "Admin",
        lastName: sessionStorage.getItem("lastName") || "User",
        role: "Admin",
        businessName: "StockTrack",
        email: sessionStorage.getItem("email") || "admin@stocktrack.com",
        phoneNumber: sessionStorage.getItem("phoneNumber") || "N/A",
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
                            element={<AdminPanel currentUser={adminUser} />}
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