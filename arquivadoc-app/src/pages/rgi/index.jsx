import { Box, TextField, Typography } from '@mui/material';

import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '@/Components/List/DocList';
import Header from '@/Components/Header/Header';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';

const top100Films = [
    {
        label: 'Prenotação'
    },
    {
        label: 'Matrícula '
    },
    {
        label: 'Caixa'
    },
    {
        label: 'Apresentante(documento)'
    }
];
const docs = [
    {
        name: 'Ronaldo',
        text: 'Procuração'
    },
    

]
const PageRGI = () => {
    const routes = createRoutes()
    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            marginTop: 11,
            position: 'relative',
            padding: '30px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        }}>
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} >
                RGI
            </Typography>
            <div style={{
                height: '40px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                margin: '0 auto',
                justifyContent: 'space-between'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
                    <TextField label="Buscar" sx={{ width: 400, '& input': {color: 'success.main', }}} color='success' />
                    <AutoComplete data={top100Films} />
                </div>
                <Buttons color={'green'} title={'Buscar'} />
                <ButtonOpenModals />
                <ButtonLixeira onClick={routes.goToPageLixeiraRGI}/>
            </div>

            <DocList data={docs} />
        </Box>
    );
};
export default PageRGI;