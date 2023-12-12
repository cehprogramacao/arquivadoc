"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Stack } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import ModalList from '@/Components/Modals/ModalList';
import { useState } from 'react';
import { CadastroModalRGI } from '@/Components/Modals/ModalCadastroRGI';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';

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
        link:'/teste.pdf'
    },
];

const PageRGI = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const [open, setOpen] = useState(false);
    const [openModalRGI, setOpenModalRGI] = useState(false)
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
                gap: '10px'
            }}
        >
             <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                RGI
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    gap: '30px',
                    placeItems: 'center',
                    placeContent: "center",
                    flexWrap: 'wrap',
                    marginTop: 1
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, placeContent: "center",flexWrap: 'wrap' }}>
                    <TextField
                        label="Buscar"
                        sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main' } }}
                        color="success"
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
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
                <Buttons color={'green'} title={'Buscar'} />
                <Box sx={{display: 'flex', width: 'fit-content', gap: '30px'}}>
                    <ButtonOpenModals onClick={handleOpenModalRGI} />
                    <ButtonLixeira href={"/rgi/lixeira_rgi"} />
                </Box>
            </Box>

            <DocList onClick={handleOpen} data={docs} sx={{ marginTop: isSmallScreen ? 2 : 0 }} />
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
