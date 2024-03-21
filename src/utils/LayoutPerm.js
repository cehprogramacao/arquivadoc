import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import User from '@/services/user.service';
import { useAuth } from '@/context';

const PrivateRoute = ({ children, requiredPermissions }) => {
    const router = useRouter();
    const { permissions, updatePermissions } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = sessionStorage.getItem("accessToken");
                const { getUser } = new User();
                const { data } = await getUser(accessToken);
                await updatePermissions(data.permissions);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário!", error);
                throw error;
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const hasRequiredPermissions = () => {
                return requiredPermissions.every(permission => {
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                });
            };

            if (!hasRequiredPermissions()) {
                router.push('/');
            }
        }
    }, [loading, permissions, requiredPermissions, router]);

    return <>{children}</>;
};

export default PrivateRoute;
