"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme, Grid } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import Autocomplete from '@mui/material/Autocomplete';
import { CadastroProtesto } from '@/Components/Modals/ModalCadastroProtesto';
import { useState } from 'react';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import ModalList from '@/Components/Modals/ModalList';
import CustomContainer from '@/Components/CustomContainer';
import { width } from '@mui/system';

const top100Films = [
    { label: 'Nome' },
    { label: 'CPF' },
    { label: 'Caixa' },
];

const docs = [
    {
        name: 'Ronaldo',
        text: 'Procuração',
        link: "/teste.pdf"
    },
]

const PageProtesto = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [openModalCadastro, setOpenModalCadastro] = useState(false)
    const [openModalPartes, setOpenModalPartes] = useState(false)
    const [openModalListFile, setOpenModalListFile] = useState(false)
    const handleOpenModalPartes = () => {
        setOpenModalPartes(true)
    }
    const handleCloseModalPartes = () => {
        setOpenModalPartes(false)
    }
    const handleOpenModalCadastro = () => {
        setOpenModalCadastro(true)
    }
    const handleCloseModalCadastro = () => {
        setOpenModalCadastro(false)
    }
    const handleOpenModalFile = () => {
        setOpenModalListFile(true)
    }
    const handleCloseModalFile = () => {
        setOpenModalListFile(false)
    }


    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                py: 15,
                px: 3
            }}
        >
            <CustomContainer>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                Protestos
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={5} md={6} sm={6}>
                                <TextField
                                    label="Buscar"
                                    fullWidth
                                    sx={{ '& input': { color: 'success.main' } }}
                                    color="success"
                                />
                            </Grid>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={top100Films}
                                    fullWidth
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
                            </Grid>
                            <Grid item xs={12} lg={3} md={12} sm={12}>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    gap: 2,
                                    justifyContent: "center"
                                }}>
                                    <Buttons color={'green'} title={'Buscar'} />

                                    <ButtonOpenModals onClick={handleOpenModalCadastro} />
                                    <ButtonLixeira href={"/protestos/lixeira_protesto"} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <DocList data={docs} onClick={handleOpenModalFile} />
                    </Grid>
                </Grid>




            </CustomContainer>
            <Drawer anchor='left' open={openModalCadastro} onClose={handleCloseModalCadastro} >
                <CadastroProtesto onClickPartes={handleOpenModalPartes} onClose={handleCloseModalCadastro} />
            </Drawer>
            <Drawer anchor='right' onClose={handleCloseModalPartes} open={openModalPartes}>
                <CadastroPartes onClose={handleCloseModalPartes} />
            </Drawer>
            <ModalList open={openModalListFile} onClose={handleCloseModalFile} data={docs} />
        </Box>
    );
};

export default PageProtesto;
