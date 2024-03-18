import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import User from '@/services/user.service';
import { AuthProvider, useAuth } from '@/context';

const PrivateRoute = ({ children, requiredPermissions }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { permissions, updatePermissions } = useAuth();

    const getDataUserByAdmin = async (userId) => {
        try {
            const accessToken = sessionStorage.getItem("accessToken");
            const { getUserById } = new User();
            const { data } = await getUserById(userId, accessToken);
            await updatePermissions(Object.values(data.permissions) || []);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário!", error);
            throw error;
        }
    };

    useEffect(() => {
        const getDataUser = async () => {
            try {
                const accessToken = sessionStorage.getItem("accessToken");
                const { getUser } = new User();
                const { data } = await getUser(accessToken);
                await getDataUserByAdmin(data.id);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário!", error);
                throw error;
            } finally {
                setLoading(false);
            }
        };

        getDataUser();
    }, [updatePermissions]);

    const hasRequiredPermissions = () => {
        return requiredPermissions.every(permission =>
            permissions.some(p => p.public_name === permission && p.view === 1)
        );
    };

    useEffect(() => {
        if (loading) return; // Aguarda o carregamento dos dados do usuário
        if (permissions.length === 0 || !hasRequiredPermissions()) {
            router.push('/');
        }
    }, [loading, permissions, requiredPermissions, router]);

    return loading ? null : children;
};

export default PrivateRoute;
