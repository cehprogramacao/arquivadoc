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
    goToPageNotas: () => {
      router.push('/notas');
    },
    goToPageCartoes: () => {
      router.push('/notas/cartoes')
    },
    goToPageCartorioDocs: () => {
      router.push('/notas/CartorioDocs')
    },
    goToPageOficios: () => {
      router.push('/oficio')
    },
    goToPageRTD: () => {
      router.push('/rtd')
    },
    goToPageRPJ: () => {
      router.push('/rpj')
    }
  };
};

export default createRoutes;
