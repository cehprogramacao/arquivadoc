import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);

    const updatePermissions = async (newPermissions) => {
        setPermissions(Object.values(newPermissions));
    };

    return (
        <AuthContext.Provider value={{ permissions, updatePermissions }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
