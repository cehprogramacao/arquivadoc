import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import User from '@/services/user.service';
import { AuthProvider, useAuth } from '@/context';

const PrivateRoute = ({ children, requiredPermissions }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { permissions, updatePermissions } = useAuth();

    const hasRequiredPermissions = () => {
        return requiredPermissions.every(permission => {
            switch (permission) {
                case 'Protesto':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                case 'RGI':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                case 'RTD':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                case 'RPJ':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                case 'Ofícios':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                case 'Cadastros':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                case 'Notas':
                    return permissions.some(p => p?.public_name === permission && p.view === 1);
                default:
                    return false;
            }
        });
    };

    useEffect(() => {
        if (loading) return;
        if (permissions.length === 0 || !hasRequiredPermissions()) {
            router.push('/');
        }
    }, [loading, permissions, requiredPermissions, router]);

    return children;
};

export default PrivateRoute;
