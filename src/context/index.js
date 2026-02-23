"use client"
import User from "@/services/user.service";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const user = new User();

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);
    const [cargoServentia, setCargoServentia] = useState('geral');



    useEffect(() => {
        const getDataUser = async () => {
            try {
                const data = await user.getUser();
                console.log(data)
                await updatePermissions(data.permissions)
                const cargo = data.user?.[0]?.cargo_serventia || localStorage.getItem('cargoServentia') || 'geral';
                setCargoServentia(cargo);
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
        <AuthContext.Provider value={{ permissions, updatePermissions, cargoServentia }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
