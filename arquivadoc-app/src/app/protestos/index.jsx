import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { DocList } from '@/Components/List/DocList';
import Header from '@/Components/Header/Header';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';
import Autocomplete from '@mui/material/Autocomplete';
import { CadastroProtesto } from '@/Components/Modals/ModalCadastroProtesto';
import { useState } from 'react';
import { CadastroPartes } from '@/Components/Modals/ModalCadastroPartes';
import ModalList from '@/Components/Modals/ModalList';

const top100Films = [
    { label: 'Número' },
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
    const routes = createRoutes();

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
                Protestos
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', placeContent: "center" }}>
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
                <Box sx={{display: 'flex', width: 'auto', gap: '30px'}}>
                    <ButtonOpenModals onClick={handleOpenModalCadastro} />
                    <ButtonLixeira onClick={routes.goToPageLixeiraProtestos} />
                </Box>
            </Box>

            <DocList data={docs} sx={{ marginTop: isSmallScreen ? 2 : 0 }} onClick={handleOpenModalFile} />
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
