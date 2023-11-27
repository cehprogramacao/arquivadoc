import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '@/Components/List/DocList';
import Header from '@/Components/Header/Header';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';
import { Stack } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import ModalList from '@/Components/Modals/ModalList';
import { useState } from 'react';
import { CadastroModalRPJ } from '@/Components/Modals/ModalCadastroRPJ';
import { CadastroPartes } from '@/Components/Modals/ModalCadastroPartes';

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
        id: 1,
        name: 'Ronaldo',
        text: 'Procuração',
        link: '/teste.pdf'
    },
    {
        id: 2,
        name: 'Kauan BrTech',
        text: 'Compra e Venda',
        link: '/'
    },

];

const PageRPJ = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const routes = createRoutes();
    const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false)
    const [openModalCadastroRPJ, setOpenModalCadastroRPJ] = useState(false)
    const [openModalCadastroPartes, setOpenModalCadastroPartes] = useState(false)
    const [temp, setTemp] = useState(0)
    const handleOpenModalListFilePDF = (index) => {
        setTemp(index)
        setOpenModalListFilePDF(true)
    }
    const handleCloseModalListFilePDF = () => {
        setOpenModalListFilePDF(false)
    }
    const handleOpenModalCadastroRPJ = () => setOpenModalCadastroRPJ(true)
    const handleCloseModalCadastroRPJ = () => setOpenModalCadastroRPJ(false)

    const handleOpenModalPartes = () => setOpenModalCadastroPartes(true)
    const handleCloseModalPartes = () => setOpenModalCadastroPartes(false)
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
                RPJ
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: isSmallScreen ? 'center' : 'flex-start',
                    gap: '30px',
                    margin: '0 auto',
                    flexWrap: isSmallScreen ? 'nowrap' : 'wrap',
                    placeContent: 'center',
                    marginTop: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', placeContent: "center"}}>
                    <TextField
                        label="Buscar"
                        sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main' } }}
                        color="success"
                    />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            sx={{ width: isSmallScreen ? '100%' : 400}}
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
                <Box sx={{display: 'flex', width: 'auto', gap: '30px'}}>
                    <ButtonOpenModals onClick={handleOpenModalCadastroRPJ} />
                    <ButtonLixeira onClick={routes.goToPageLixeiraRPJ} />
                </Box>
            </Box>
            <DocList data={docs} sx={{ marginTop: isSmallScreen ? 2 : 0 }} onClick={handleOpenModalListFilePDF} />
            <ModalList data={docs} link={docs[temp].link} onClose={handleCloseModalListFilePDF} open={openModalListFilePDF} />

            <Drawer anchor='left' open={openModalCadastroRPJ} onClose={handleCloseModalCadastroRPJ}>
                <CadastroModalRPJ onClose={handleCloseModalCadastroRPJ} onClickPartes={handleOpenModalPartes} />
            </Drawer>
            <Drawer anchor='right' open={openModalCadastroPartes} onClose={handleCloseModalPartes} >
                <CadastroPartes onClose={handleCloseModalPartes} />
            </Drawer>
        </Box>
    );
};

export default PageRPJ;


