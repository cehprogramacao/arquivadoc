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
import { useSelector } from 'react-redux';
import Loading from '@/Components/loading';
import SnackBar from '@/Components/SnackBar';
import MenuOptionsFile from '@/Components/MenuPopUp';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';

const optionsFilter = [
    { label: 'Prenotação' },
    { label: 'Apresentante' },
];

const PageRGI = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const payload = useSelector(state => state.login)
    const [value, setValue] = useState({
        option: "",
        value: ""
    })
    const [loading, setLoading] = useState(false)
    const [openModalRGI, setOpenModalRGI] = useState(false)
    const [data, setData] = useState([])
    const [openFilterModalPDF, setOpenFilterModalPDF] = useState(false)
    const [openModalPartes, setOpenModalPartes] = useState(false)
    const [prenotation, setPrenotation] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { permissions } = useAuth()
    const [openPDF, setOpenPDF] = useState(false)
    const [dataFile, setDataFile] = useState([])

    const handleOpenModalPDF = async () => {
        const { getByPrenotation } = new RGI()
        try {
            setOpenPDF(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getByPrenotation(prenotation, accessToken)
            console.log(response.data, 'PDFF')
            setDataFile(response.data)
            return response.data
        } catch (error) {
            console.error("Erro ao listar dados!", error)
            throw error;
        }
    }

    const handleCloseModalPDF = async () => {
        setOpenPDF(false)
    }

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleOpenModalRGI = () => setOpenModalRGI(true)
    const handleCloseModalRGI = () => setOpenModalRGI(false)
    const handleOpenModalPartes = () => setOpenModalPartes(true)
    const handleCloseModalPartes = () => setOpenModalPartes(false)

    // Função para tratar o filtro de Prenotação
    const handlePrenotationFilter = async (value, accessToken) => {
        console.log('Filtrando por Prenotação com valor:', value);
        const { getByPrenotation } = new RGI();
        let newData = [];
        try {
            setLoading(true);
            const response = await getByPrenotation(value, accessToken);
            console.log('Resposta da Prenotação:', response.data);
            setOpenFilterModalPDF(!openFilterModalPDF)
            console.log(data, 9090)
            newData.push(response.data)
            setData(newData)
            return response
        } catch (error) {
            console.error("Erro ao filtrar por Prenotação", error);
        } finally {
            setLoading(false);
        }
    };
    const [alert, setAlert] = useState({
        open: false,
        text: '',
        type: '',
        severity: ''
    });
    const handleCloseSnackBar = () => {
        setAlert({ ...alert, open: false })
    }
    console.log(data, 9090)

    // Função para tratar o filtro de Apresentante
    const handlePresenterFilter = async (value, accessToken) => {
        console.log('Filtrando por Apresentante com valor:', value);
        const { getByPresenter } = new RGI();
        let newData = [];
        try {
            setLoading(true);
            const response = await getByPresenter(value, accessToken);
            console.log('Resposta do Apresentante:', response.data);
            setOpenFilterModalPDF(!openFilterModalPDF)
            newData.push(response.data)
            setData(newData)
            return response.data
        } catch (error) {
            console.error("Erro ao filtrar por Apresentante", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteByPrenotation = async () => {
        const { deleteByPrenotation } = new RGI()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await deleteByPrenotation(prenotation, accessToken)
            console.log(response.data)
            window.location.reload()
            return response.data
        } catch (error) {
            console.error("Error ao deletar arquivo rgi!", error)
            throw error;
        }
    }
    const handleFilter = async () => {
        console.log('Iniciando filtragem com valor:', value);

        const accessToken = sessionStorage.getItem("accessToken");
        console.log('AccessToken:', accessToken);

        if (value.option && value.value) {
            console.log('Opção selecionada:', value.option.label);

            try {
                if (value.option.label === "Prenotação") {
                    await handlePrenotationFilter(value.value, accessToken);
                } else if (value.option.label === "Apresentante") {
                    await handlePresenterFilter(value.value, accessToken);
                }

            } catch (error) {
                console.error("Erro ao filtrar", error);
            }
        } else {
            console.error("Opção ou valor não definidos.");
        }
    }
    const getDataRGI = async () => {
        const { getData } = new RGI()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getData(accessToken)
            console.log(response.data, 'Kauannnnnnnnnnnnnnnn')
            setData(Object.values(response.data))
            setAlert({ ...alert, open: true, text: `Total de arquivos:${Object.values(response.data).length}`, type: "file", severity: "success" })
            return response.data
        } catch (error) {
            console.error("error listing all rgi files", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        getDataRGI()
        console.log(payload, '2002010kkkakakkakakakak')

    }, [])
    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RGI']}>
                {loading ? <Loading />
                    :
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
                                                value={value.value}
                                                onChange={(e) => setValue({ ...value, value: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={6} sm={6}>
                                            <Autocomplete
                                                disablePortal
                                                value={value.option}
                                                getOptionLabel={(option) => option.label || ""}
                                                onChange={(e, newValue) => setValue({ ...value, option: newValue })}
                                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                                id="combo-box-demo"
                                                options={optionsFilter}
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Buscar Por"
                                                        color="success"
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                color: '#237117',
                                                            },
                                                            '& label.Mui-focused': {
                                                                color: '#237117',
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#237117',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />

                                        </Grid>
                                        <Grid item xs={12} lg={4} md={12} sm={12}>
                                            <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", alignItems: "center", gap: '30px' }}>
                                                <Buttons color={'green'} title={'Buscar'} onClick={handleFilter} />
                                                {permissions[1]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpenModalRGI} />}
                                                <ButtonLixeira href={"/rgi/lixeira_rgi"} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} >
                                    <DocList data={data} setPrenotation={(prenotation) => setPrenotation(prenotation)} handleClick={handleClickMenu} />
                                </Grid>
                            </Grid>
                        </CustomContainer>

                        {/* {openFilterModalPDF && <ModalList onClose={handleClose} data={data} open={open} />} */}
                        <Drawer anchor='left' open={openModalRGI} onClose={handleCloseModalRGI} >
                            <CadastroModalRGI onClose={handleCloseModalRGI} onClickPartes={handleOpenModalPartes} />
                        </Drawer>
                        <Drawer open={openModalPartes} onClose={handleCloseModalPartes} anchor='right' >
                            <CadastroPartes onClose={handleCloseModalPartes} />
                        </Drawer>
                    </Box>
                }
                <SnackBar data={alert} handleClose={handleCloseSnackBar} />
                <MenuOptionsFile
                    anchorEl={anchorEl}
                    data={data}
                    open={open}
                    handleClose={handleCloseMenu}
                    handleOpenModalPDF={handleOpenModalPDF}
                    type={prenotation}
                    handleDelete={handleDeleteByPrenotation}
                    deletePerm={permissions[1]?.delete_permission}
                    editPerm={permissions[1]?.edit}
                />
                <ModalList
                    data={dataFile}
                    onClose={handleCloseModalPDF}
                    open={openPDF}
                    prenotation={prenotation}
                    deletePerm={permissions[1]?.delete_permission}
                    editPerm={permissions[1]?.edit}
                />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default PageRGI;
