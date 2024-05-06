"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const verifyJWTExpiration = (token) => {
  const decoded = jwtDecode(token);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTimestamp;
};

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = sessionStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        router.push('/');
        return;
      }
      const isAccessTokenExpired = !verifyJWTExpiration(accessToken);
      const isRefreshTokenExpired = !verifyJWTExpiration(refreshToken);
      if (isAccessTokenExpired || isRefreshTokenExpired) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('isAdmin')
        window.location.reload
        router.push('/');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;







