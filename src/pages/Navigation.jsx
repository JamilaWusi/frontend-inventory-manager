// frontend-inventory-manager/src/pages/Navigation.jsx

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
import { TokenContext, TokenDispatchContext } from "../context/TokenContext";
import { getProfile, getSuppliers } from "../utils/fn";
import { profileDispatchContext } from "../context/ProfileContext";
import PageLoader from "./PageLoader";
import { SupplierDispatchContext } from "../context/SupplierContext";

export default function Navigation() {
    const tokenContextValue = useContext(TokenContext);
    const tokenDispatch = useContext(TokenDispatchContext);
    const profileDispatch = useContext(profileDispatchContext);
    const suppliersDispatch = useContext(SupplierDispatchContext);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize token from sessionStorage on first load
    useEffect(() => {
        const storedToken = sessionStorage.getItem("myToken");
        if (storedToken && !tokenContextValue?.token) {
            tokenDispatch({
                type: "loggedIn",
                payload: storedToken
            });
        }
    }, []);

    // Fetch profile when token changes
    useEffect(() => {
        async function fetchProfile() {
            if (!tokenContextValue?.token) return;
            
            try {
                setIsLoading(true);
                const response = await getProfile(tokenContextValue.token);
                if (response) {
                    profileDispatch({
                        type: "set",
                        payload: response
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [tokenContextValue?.token]);

    // Fetch suppliers when token changes
    useEffect(() => {
        async function fetchSuppliers() {
            if (!tokenContextValue?.token) return;
            
            try {
                const response = await getSuppliers(tokenContextValue.token);
                if (response?.data) {
                    suppliersDispatch({
                        type: "loggedIn",
                        payload: response.data
                    });
                }
            } catch (error) {
                console.error("Failed to fetch suppliers:", error);
            }
        }
        fetchSuppliers();
    }, [tokenContextValue?.token]);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <Routes>
            {tokenContextValue?.token ? (
                // Authenticated routes
                <Route element={<Container />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/*" element={<Dashboard />} />
                </Route>
            ) : (
                // Public routes
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/*" element={<Login />} />
                </>
            )}
        </Routes>
    );
}
















































// import { Route, Routes } from "react-router";
// import Dashboard from "./Dashboard";
// import Suppliers from "./Suppliers";
// import Signup from "./Signup";
// import Products from "./Products";
// import Inventory from "./Inventory";
// import Container from "../components/Container";
// import Login from "./Login";
// import AdminPanel from "../components/Admin";
// import { useContext, useEffect, useState } from "react";
// import { TokenContext } from "../context/TokenContext";
// import { getProfile, getSuppliers } from "../utils/fn";
// import { profileDispatchContext } from "../context/ProfileContext";
// import PageLoader from "./PageLoader";
// import { SupplierDispatchContext } from "../context/SupplierContext";


// export default function Navigation() {
//     // Fixed: Properly get token from sessionStorage or context
//     const tokenContextValue = useContext(TokenContext);
//     const [token, setToken] = useState(() => {
//         // Initialize from sessionStorage on component mount
//         const storedToken = sessionStorage.getItem("myToken");
//         return storedToken ? { token: storedToken } : tokenContextValue;
//     });

//     const profileDispatch = useContext(profileDispatchContext);
//     const suppliersDispatch = useContext(SupplierDispatchContext);
//     const [isLoading, setIsLoading] = useState(false);

//     // Update token when context changes (e.g., after login)
//     useEffect(() => {
//         if (tokenContextValue?.token) {
//             setToken(tokenContextValue);
//         }
//     }, [tokenContextValue]);

//     // Fetch profile when token is available
//     useEffect(() => {
//         async function fetchProfile() {
//             if (!token?.token) return;
            
//             try {
//                 setIsLoading(true);
//                 const response = await getProfile(token.token);
//                 if (response) {
//                     profileDispatch({
//                         type: "set",
//                         payload: response
//                     });
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch profile:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchProfile();
//     }, [token?.token]);

//     // Fetch suppliers when token is available
//     useEffect(() => {
//         async function fetchSuppliers() {
//             if (!token?.token) return;
            
//             try {
//                 const response = await getSuppliers(token.token);
//                 if (response?.data) {
//                     suppliersDispatch({
//                         type: "loggedIn",
//                         payload: response.data
//                     });
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch suppliers:", error);
//             }
//         }
//         fetchSuppliers();
//     }, [token?.token]);

//     if (isLoading) {
//         return <PageLoader />;
//     }

//     return (
//         <Routes>
//             {token?.token ? (
//                 // Authenticated routes
//                 <Route element={<Container />}>
//                     <Route index element={<Dashboard />} />
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/products" element={<Products />} />
//                     <Route path="/suppliers" element={<Suppliers />} />
//                     <Route path="/inventory" element={<Inventory />} />
//                     <Route path="/admin" element={<AdminPanel />} />
//                     <Route path="/*" element={<Dashboard />} />
//                 </Route>
//             ) : (
//                 // Unauthenticated routes
//                 <>
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/signup" element={<Signup />} />
//                     <Route path="/*" element={<Login />} />
//                 </>
//             )}
//         </Routes>
//     );
// }























































// import { Route, Routes } from "react-router";
// import Dashboard from "./Dashboard";
// import Suppliers from "./Suppliers";
// import Signup from "./Signup";
// import Products from "./Products";
// import Inventory from "./Inventory";
// import Container from "../components/Container";
// import Login from "./Login";
// import AdminPanel from "../components/Admin";
// import { useContext, useEffect, useState } from "react";
// import { TokenContext } from "../context/TokenContext";
// import { getProfile, getSuppliers } from "../utils/fn";
// import { profileDispatchContext } from "../context/ProfileContext";
// import PageLoader from "./PageLoader";
// import { SupplierDispatchContext } from "../context/SupplierContext";


// export default function Navigation() {

//     const tokenPayload = JSON.parse(sessionStorage.getItem("token")) || useContext(TokenContext)
//     const profileDispatch = useContext(profileDispatchContext)
//     const suppliersDispatch = useContext(SupplierDispatchContext)
//     const [isLoading, setIsLoading] = useState(false)


//     useEffect(() => {
//         async function call() {
//             try {
//                 setIsLoading(true)
//                 if (tokenPayload.token) {
//                     const response = await getProfile(tokenPayload.token)
//                     if (response) {
//                         profileDispatch({
//                             type: "set",
//                             payload: response
//                         })
//                     }
//                 }
//             } catch (error) {
//                 console.log(error)
//             } finally {
//                 setIsLoading(false)
//             }
//         }
//         call()
//     }, [tokenPayload])

//     useEffect(() => {
//         async function fetchSuppliers() {
//             try {
//                 if (tokenPayload.token) {
//                     const response = await getSuppliers(tokenPayload.token)
//                     console.log(response)
//                     if (response) {
//                         suppliersDispatch({
//                             type: "loggedIn",
//                             payload: response.data
//                         })
//                     }
//                 }
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//         fetchSuppliers()
//     }, [tokenPayload])

//     if (isLoading) {
//         return <PageLoader />
//     }

//     return (
//         <Routes>
//             {
//                 tokenPayload.token ? (

//                     <Route element={<Container />}>
//                         <Route
//                             index
//                             element={<Dashboard />}
//                         />
//                         <Route
//                             path="/products"
//                             element={<Products />}
//                         />
//                         <Route
//                             path="/suppliers"
//                             element={<Suppliers />}
//                         />

//                         <Route
//                             path="/inventory"
//                             element={<Inventory />}
//                         />

//                         <Route
//                             path="/admin"
//                             element={<AdminPanel />}
//                         />

//                         <Route
//                             path="/*"
//                             element={<Dashboard />}
//                         />
//                     </Route>
//                 ) : (
//                     <>
//                         <Route
//                             path="/login"
//                             element={<Login />}
//                         />
//                         <Route
//                             path="/signup"
//                             element={<Signup />}
//                         />
//                         <Route
//                             path="/*"
//                             element={<Login />}
//                         />
//                     </>
//                 )}
//         </Routes>
//     )
// }