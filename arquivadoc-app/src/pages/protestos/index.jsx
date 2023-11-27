<<<<<<< HEAD
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
=======
import { Box, TextField, Typography, useMediaQuery, useTheme, Drawer } from '@mui/material';
>>>>>>> 8938b04acaebb9b127a65e8700f3835d423edf23
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { DocList } from '@/Components/List/DocList';
import Header from '@/Components/Header/Header';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import createRoutes from '@/routes/index.routes';
import Autocomplete from '@mui/material/Autocomplete';
<<<<<<< HEAD
import { CadastroProtesto } from '@/Components/Modals/ModalCadastroProtesto';
import { useState } from 'react';
import { CadastroPartes } from '@/Components/Modals/ModalCadastroPartes';
import ModalList from '@/Components/Modals/ModalList';
=======
import { useState } from 'react';
import { CadastroProtestosModal } from '@/Components/Modals/ModalCadastroProtesto';
import { CadastroPartes } from '@/Components/Modals/ModalcadastroPartes';
>>>>>>> 8938b04acaebb9b127a65e8700f3835d423edf23

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
<<<<<<< HEAD
=======
    const [open, setOpen] = useState(false)
    const [openPartes, setOpenPartes] = useState(false)

    const handleOpenModalCadastro = () => {
        setOpen(true)
    }
    const handleCloseModalCadastro = () => {
        setOpen(false)
    }
    const handleOpenModalPartes = () => {
        setOpenPartes(true)
    }
    const handleCloseModalPartes = () => {
        setOpenPartes(false)
    }

>>>>>>> 8938b04acaebb9b127a65e8700f3835d423edf23
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
<<<<<<< HEAD
                <Box sx={{display: 'flex', width: 'auto', gap: '30px'}}>
=======
                <Box sx={{ display: 'flex', width: 'auto', gap: '30px' }}>
>>>>>>> 8938b04acaebb9b127a65e8700f3835d423edf23
                    <ButtonOpenModals onClick={handleOpenModalCadastro} />
                    <ButtonLixeira onClick={routes.goToPageLixeiraProtestos} />
                </Box>
            </Box>

<<<<<<< HEAD
            <DocList data={docs} sx={{ marginTop: isSmallScreen ? 2 : 0 }} onClick={handleOpenModalFile} />
            <Drawer anchor='left' open={openModalCadastro} onClose={handleCloseModalCadastro} >
                <CadastroProtesto onClickPartes={handleOpenModalPartes} onClose={handleCloseModalCadastro} />
            </Drawer>
            <Drawer anchor='right' onClose={handleCloseModalPartes} open={openModalPartes}>
                <CadastroPartes onClose={handleCloseModalPartes} />
            </Drawer>
                <ModalList open={openModalListFile} onClose={handleCloseModalFile} data={docs} />
=======
            <DocList data={docs} sx={{ marginTop: isSmallScreen ? 2 : 0 }} />

            <Drawer anchor='left' open={open} onClose={handleCloseModalCadastro} >
                <CadastroProtestosModal onClickPartes={handleOpenModalPartes} onClose={handleCloseModalCadastro} />
            </Drawer>
            <Drawer anchor='right' open={openPartes} onClose={handleCloseModalPartes} >
                <CadastroPartes onClose={handleCloseModalPartes}  />
            </Drawer>
>>>>>>> 8938b04acaebb9b127a65e8700f3835d423edf23
        </Box>
    );
};

export default PageProtesto;
