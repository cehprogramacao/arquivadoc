import User from "@/services/user.service";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);

    

    useEffect(() => {
        const getDataUser = async () => {
            try {
                const accessToken = sessionStorage.getItem("accessToken");
                const { getUser } = new User();
                const { data } = await getUser(accessToken);
                await updatePermissions(data.permissions)
            } catch (error) {
                console.error("Erro ao buscar dados do usuário!", error);
                throw error;
            }
        };

        getDataUser();
    }, []);

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
