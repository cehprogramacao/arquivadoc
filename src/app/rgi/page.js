"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Stack, Grid } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import ModalList from '@/Components/Modals/ModalList';
import { useEffect, useState } from 'react';
import { CadastroModalRGI } from '@/Components/Modals/ModalCadastroRGI';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import CadastroRGITypes from '@/Components/ModalsRegistration/ModalTypesRGI';
import CustomContainer from '@/Components/CustomContainer';
import RGI from '@/services/rgi.service';

const top100Films = [
    { label: 'Nome' },
    { label: 'CPF' },
    { label: 'Prenotação ' },
    { label: 'Caixa' },

];

const docs = [
    {
        name: 'Ronaldo',
        text: 'Procuração',
        link: '/teste.pdf'
    },
];

const PageRGI = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const [open, setOpen] = useState(false);
    const [openModalRGI, setOpenModalRGI] = useState(false)
    const [data, setData] = useState([])
    const [openModalPartes, setOpenModalPartes] = useState(false)
    const handleOpenModalRGI = () => setOpenModalRGI(true)
    const handleCloseModalRGI = () => setOpenModalRGI(false)
    const handleOpenModalPartes = () => setOpenModalPartes(true)
    const handleCloseModalPartes = () => setOpenModalPartes(false)


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const getDataRGI = async () => {
        const { getData } = new RGI()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getData(accessToken)
            console.log(response.data, 'Kauannnnnnnnnnnnnnnn')
            setData(Object.values(response.data))
            return response.data
        } catch (error) {
            console.error("error listing all rgi files", error)
            throw error;
        }
    }
    useEffect(() => {
        getDataRGI()
    }, [])
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                py: 15,
                px: 4,
            }}
        >
            <CustomContainer>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                RGI
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={4} md={6} sm={6}>
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
                            <Grid item xs={12} lg={4} md={12} sm={12}>
                                <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", alignItems: "center", gap: '30px' }}>
                                    <Buttons color={'green'} title={'Buscar'} />
                                    <ButtonOpenModals onClick={handleOpenModalRGI} />
                                    <ButtonLixeira href={"/rgi/lixeira_rgi"} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <DocList onClick={handleOpen} data={docs} />
                    </Grid>
                </Grid>
            </CustomContainer>

            <ModalList onClose={handleClose} open={open} data={docs} />
            <Drawer anchor='left' open={openModalRGI} onClose={handleCloseModalRGI} >
                <CadastroModalRGI onClose={handleCloseModalRGI} onClickPartes={handleOpenModalPartes} />
            </Drawer>
            <Drawer open={openModalPartes} onClose={handleCloseModalPartes} anchor='right' >
                <CadastroPartes onClose={handleCloseModalPartes} />
            </Drawer>
        </Box>
    );
};

export default PageRGI;
