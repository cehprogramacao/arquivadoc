"use client"
import User from "@/services/user.service";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const user = new User();

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);



    useEffect(() => {
        const getDataUser = async () => {
            try {
                const data = await user.getUser();
                console.log(data)
                await updatePermissions(data.permissions)
            } catch (error) {
                console.error("Erro ao buscar dados do usuário!", error);
                throw error;
            }
        };
        getDataUser();
    }, []);
    const updatePermissions = async (newPermissions) => {
        setPermissions(newPermissions);
    };
    return (
        <AuthContext.Provider value={{ permissions, updatePermissions }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
