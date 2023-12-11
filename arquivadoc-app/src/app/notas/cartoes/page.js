"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import Autocomplete from '@mui/material/Autocomplete';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { CadastrarCartoesModal } from '@/Components/Modals/ModalCadastroCartoes';
import { useState } from 'react';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';


const PageAutographCards = ({ data }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    const service = ['Nome','CPF','Ordem', 'Livro', 'Folha']
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
                        options={service}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
                        renderInput={(params) => <TextField color="success" {...params} label="Buscar Por"
                            sx={{
                                color: "#237117", '& input': {
                                    color: 'success.main',
                                },
                            }} />}
                    />
                    <Autocomplete

                        disablePortal
                        id="combo-box-demo"
                        options={['Cartoes']}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
                        renderInput={(params) => <TextField color="success" {...params} label="Tipo de serviço"
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
                    <ButtonLixeira href={"/notas/cartoes/lixeira_cartoes"} />
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