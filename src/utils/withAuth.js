// import { useRouter } from 'next/navigation';
// import { useEffect, useCallback } from 'react';
// import { jwtDecode } from 'jwt-decode';


// const verifyJWTExpiration = (token) => {
//   const decoded = jwtDecode(token);
//   const timestamp = new Date().getTime();
//   return decoded.exp * 1000 > timestamp;
// };

// const withAuth = (WrappedComponent) => {


//   const Wrapper = (props) => {
//     const router = useRouter();

//     const refreshAccessToken = useCallback(async (refreshToken) => {
//       try {
//         const response = await auth.refreshTokenService(refreshToken);
//         const { accessToken } = response.data;
//         console.log('Novo accesstoken', accessToken);
//         localStorage.setItem('accessToken', accessToken);
//       } catch (error) {
//         console.error('Erro ao renovar o token de acesso:', error);
//         router.push('/login');
//       }
//     }, [router]);

//     useEffect(() => {
//       const accessToken = localStorage.getItem('accessToken');
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!accessToken || !refreshToken) {
//         router.push('/login');
//         return;
//       }

//       const isAccessTokenExpired = !verifyJWTExpiration(accessToken);
//       const isRefreshTokenExpired = !verifyJWTExpiration(refreshToken);

//       if (isAccessTokenExpired && isRefreshTokenExpired) {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         router.push('/login');
//       } else if (isAccessTokenExpired) {
//         refreshAccessToken(refreshToken);
//       }
//     }, [refreshAccessToken, router]);

//     return <WrappedComponent {...props} />;
//   };

//   return Wrapper;
// };

// export default withAuth;

"use client";
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
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        router.push('/');
        return;
      }
      const isAccessTokenExpired = !verifyJWTExpiration(accessToken);
      const isRefreshTokenExpired = !verifyJWTExpiration(refreshToken);
      if (isAccessTokenExpired || isRefreshTokenExpired) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;







