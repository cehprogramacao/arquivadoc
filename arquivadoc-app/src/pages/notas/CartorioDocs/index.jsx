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

    const tipos_escrituras = [
        {
            label: 'Compra e Venda'
        },
        {
            label: 'Declatória',
        },
        {
            label: 'Doação',
        },
        {
            label: 'Rerratificação',
        },
        {
            label: 'Revogação',
        },
        {
            label: 'Aditamento',
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '30px',
                    margin: '0 auto',
                    flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                    placeContent: 'center',
                    marginTop: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
                placeContent: "center" }}>
                    <TextField
                        label="Buscar"
                        sx={{ width: isSmallScreen ? '100%' : 350, '& input': { color: 'success.main' },
                        flexShrink: 1
                    }}
                        color="success"
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 350 }}
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
                                    flexShrink: 1
                                }}
                            />
                        )}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={tipos_escrituras}
                        sx={{ width: isSmallScreen ? '100%' : 350 }}
                        renderInput={(params) => (
                            <TextField
                                color="success"
                                {...params}
                                label="Buscar Por Tipo"
                                sx={{
                                    color: "#237117",
                                    '& input': {
                                        color: 'success.main',
                                    },
                                    flexShrink: 1
                                }}
                            />
                        )}
                    />
                </Box>
                <Box sx={{ display: 'flex', width: 'auto', gap: '30px' }}>
                    <Buttons color={'green'} title={'Buscar'} />

                    <ButtonOpenModals />
                    <ButtonLixeira onClick={routes.goToPageLixeiraCartorioDocs} />
                </Box>
            </Box>


        </Box>
    )
}
export default CartorioDocs