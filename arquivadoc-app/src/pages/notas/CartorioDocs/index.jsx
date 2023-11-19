import { Box, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import Header from '@/Components/Header/Header';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';
import Autocomplete from '@mui/material/Autocomplete';
const CartorioDocs = ({ data }) => {
    const routes = createRoutes()
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const top100Films = [
        {
            label: 'Ordem'
        },
        {
            label: 'Livro'
        },
    ];
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                marginTop: 11,
                position: 'relative',
                padding: '30px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
            }}
        >
            <Header />
            <Typography fontSize={40} fontWeight={'bold'}>
                Notas
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: isSmallScreen ? 'center' : 'flex-start',
                    gap: '40px',
                    margin: '0 auto',
                    flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                    placeContent: 'center',
                    marginTop: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', placeContent: "center"}}>
                    <TextField
                        label="Buscar"
                        sx={{ width: isSmallScreen ? '100%' : 500, '& input': { color: 'success.main' } }}
                        color="success"
                    />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            sx={{ width: isSmallScreen ? '100%' : 500}}
                            renderInput={(params) => (
                                <TextField
                                    color="success"
                                    {...params}
                                    label="Buscar Por"
                                    sx={{
                                        color: "#237117",
                                        '& input': {
                                            color: 'success.main',
                                        },
                                    }}
                                />
                            )}
                        />
                </Box>
                <Box sx={{display: 'flex', width: 'auto', gap: '10px'}}>
                    <Buttons color={'green'} title={'Buscar'} />
                    <ButtonOpenModals />
                    <ButtonLixeira onClick={routes.goToPageLixeiraCartorioDocs} />
                </Box>
            </Box>

                
        </Box>
    )
}
export default CartorioDocs