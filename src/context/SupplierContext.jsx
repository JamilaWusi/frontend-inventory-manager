// frontend-inventory-manager/src/context/SupplierContext.jsx
import { createContext, useReducer } from "react";

export const SupplierContext = createContext(null);
export const SupplierDispatchContext = createContext(null);

function supplierReducer(oldSupplier, action) {
    switch (action.type) {
        case "loggedIn": {
            return [
                ...oldSupplier,...action.payload,
            ]
            };

        case "add": {
            return [
                ...oldSupplier, action.payload
            ]
        }

        case "loggedOut": {
            return []
        }
        default: {
            return oldSupplier;
        }
    }
}

export default function SupplierProvider({ children }) {
    const [supplier, dispatch] = useReducer(supplierReducer, []);

    return (
        <SupplierContext.Provider value={supplier}>
            <SupplierDispatchContext.Provider value={dispatch}>
                {children}
            </SupplierDispatchContext.Provider>
        </SupplierContext.Provider>
    );
}
