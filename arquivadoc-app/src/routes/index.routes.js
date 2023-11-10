import { useRouter } from 'next/router';

const createRoutes = () => {
  const router = useRouter();

  return {
    goToMainPage: () => {
      router.push('/');
    },
    goToPageRGI: () => {
      router.push('/rgi');
    },
    goToPageProtestos: () => {
      router.push('/protestos');
    },
    goToPageTermos: () => {
      router.push('/termos');
    },
  };
};

export default createRoutes;
