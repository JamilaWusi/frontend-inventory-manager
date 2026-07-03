// frontend-inventory-manager/src/context/ProfileContext.jsx
import { createContext, useReducer } from "react";

export const ProfileContext = createContext(null);
export const profileDispatchContext = createContext(null);

function profileReducer(oldprofile, action) {
    switch (action.type) {
        case "set":
            {
                return {
                    ...oldprofile, ...action.payload
                }
            }
        case "clear": {
            return {}
        }
        default: { }
    }
}

export default function ProfileProvider({ children }) {
    const [profile, dispatch] = useReducer(profileReducer, {});
    return (<ProfileContext.Provider value={profile}>
        <profileDispatchContext.Provider value={dispatch}>
            {children}
        </profileDispatchContext.Provider>
    </ProfileContext.Provider>
    );
}