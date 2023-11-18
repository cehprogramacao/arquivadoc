import { Box, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import Autocomplete from '@mui/material/Autocomplete';
import Header from '@/Components/Header/Header';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';


const PageAutographCards = ({ data }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const routes = createRoutes()
    const top100Films = [
        {
            label: 'Número'
        },
        {
            label: 'Caixa'
        },
        {
            label: 'Parte'
        },
    ];
    const handleGoToLixeira = () => {
        routes.goToPageLixeiraCartoes()
    }
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
                Cartões
            </Typography>
            <div style={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                alignItems: isSmallScreen ? 'center' : 'flex-start',
                gap: '40px',
                margin: '0 auto',
                flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                placeContent: 'center',
                marginTop: 16
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', placeContent: 'center' }}>
                    <TextField label="Buscar" sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main'} }} color='success'/>
                    <Autocomplete
                
                disablePortal
                id="combo-box-demo"
                options={top100Films}
                sx={{ width: isSmallScreen ? '100%' : 450 }}
                renderInput={(params) => <TextField color="success" {...params} label="Buscar Por" 
                sx={{ color: "#237117", '& input': {
                    color: 'success.main', 
                }, }} />}
            />
                </div>
                <Buttons color={'green'} title={'Buscar'} />
                <ButtonOpenModals />
                <ButtonLixeira onClick={routes.goToPageLixeiraCartoes}/>
            </div>
        </Box>
    )
}
export default PageAutographCards