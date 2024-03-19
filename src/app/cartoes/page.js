"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme, Grid } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import Autocomplete from '@mui/material/Autocomplete';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { CadastrarCartoesModal } from '@/Components/Modals/ModalCadastroCartoes';
import { useState } from 'react';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import CustomContainer from '@/Components/CustomContainer';


const PageAutographCards = () => {
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
    const service = ['Nome', 'CPF', 'Ordem', 'Livro', 'Folha']
    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            py: 14,
            px: 4,
        }}>
            <CustomContainer>
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Typography fontSize={40} fontWeight={'bold'} color="#000">
                                Cartões
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={3} md={3} sm={12}>
                                <TextField label="Buscar"
                                    sx={{
                                        '& input': { color: 'success.main' }
                                    }}
                                    color='success'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={3} sm={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={service}
                                    fullWidth
                                    renderInput={(params) => <TextField color="success" {...params} label="Buscar Por"
                                        sx={{
                                            color: "#237117", '& input': {
                                                color: 'success.main',
                                            },
                                        }} />}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={3} sm={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={['Cartoes']}
                                    fullWidth
                                    renderInput={(params) => <TextField color="success" {...params} label="Tipo de serviço"
                                        sx={{
                                            color: "#237117", '& input': {
                                                color: 'success.main',
                                            },
                                        }} />}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={3} sm={12}>
                                <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", gap: '30px' }}>
                                    <Buttons color={'green'} title={'Buscar'} />
                                    <ButtonOpenModals onClick={handleOpen} />
                                    <ButtonLixeira href={"/cartoes/lixeira_cartoes"} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CustomContainer>
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