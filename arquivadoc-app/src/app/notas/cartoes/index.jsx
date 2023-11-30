import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import Autocomplete from '@mui/material/Autocomplete';
import Header from '@/Components/Header/Header';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';
import { CadastrarCartoesModal } from '@/Components/Modals/ModalCadastroCartoes';
import { useState } from 'react';
import { CadastroPartes } from '@/Components/Modals/ModalCadastroPartes';


const PageAutographCards = ({ data }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const routes = createRoutes()
    const [open, setOpen] = useState(false);
    const [openPartes, setOpenPartes] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleClosePartes = () => {
        setOpenPartes(false)
    }

    const handleOpenPartes = () => {
        setOpenPartes(true)
    }
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
                gap: '30px',
                margin: '0 auto',
                flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                placeContent: 'center',
                marginTop: 16
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', placeContent: 'center' }}>
                    <TextField label="Buscar" sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main' } }} color='success' />
                    <Autocomplete

                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
                        renderInput={(params) => <TextField color="success" {...params} label="Buscar Por"
                            sx={{
                                color: "#237117", '& input': {
                                    color: 'success.main',
                                },
                            }} />}
                    />
                </div>
                <Buttons color={'green'} title={'Buscar'} />
                <Box sx={{ display: 'flex', width: 'auto', gap: '30px' }}>
                    <ButtonOpenModals onClick={handleOpen} />
                    <ButtonLixeira onClick={routes.goToPageLixeiraCartoes} />
                </Box>
            </div>
            <Drawer anchor='left' open={open} onClose={handleClose}>
                <CadastrarCartoesModal onClose={handleClose} onClickPartes={handleOpenPartes} />
            </Drawer>
            <Drawer anchor='right' open={openPartes} onClose={handleClosePartes}>
                <CadastroPartes onClose={handleClosePartes} />
            </Drawer>
        </Box>
    )
}
export default PageAutographCards