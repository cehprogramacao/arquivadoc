// PrivateRoute.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PrivateRoute = ({ permissions, requiredPermissions, children }) => {
    const router = useRouter();
    console.log(permissions, 'permssssssssssssssssionsssss')
    useEffect(() => {
        if (!permissions || !requiredPermissions) return;

        const hasPermission = requiredPermissions.every(permission =>
            permissions.some(userPermission => userPermission.public_name === permission)
        );

        if (!hasPermission) {
            router.push('/');
        }
    }, [permissions, requiredPermissions]);

    return children;
};

export default PrivateRoute;
