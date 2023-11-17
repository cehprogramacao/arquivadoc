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
    },
    goToPageLixeiraCartoes: () => {
      router.push('/notas/cartoes/lixeira_cartoes')
    },
    goToPageLixeiraCartorioDocs: () => {
      router.push('/notas/CartorioDocs/lixeira_notas')
    },
    goToPageLixeiraTermosLixeira: () => {
      router.push('/termos/lixeira_termo')
    },
    goToPageLixeiraRGI: () => {
      router.push('/rgi/lixeira_rgi')
    },
    goToPageLixeiraProtestos: () => {
      router.push('/protestos/lixeira_protesto')
    },
  };
};

export default createRoutes;
