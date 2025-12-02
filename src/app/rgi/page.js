"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Stack, Grid } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import ModalList from '@/Components/Modals/ModalList';
import { useEffect, useState } from 'react';
import { CadastroModalRGI } from '@/Components/Modals/ModalCadastroRGI';
import CustomContainer from '@/Components/CustomContainer';
import RGI from '@/services/rgi.service';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/Components/loading';
import SnackBar from '@/Components/SnackBar';
import MenuOptionsFile from '@/Components/MenuPopUp';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import withAuth from '@/utils/withAuth';
import { SET_ALERT, showAlert } from '@/store/actions';

const optionsFilter = [
    { label: 'Prenotação' },
    { label: 'Apresentante' },
];


const rgiSv = new RGI();
const PageRGI = () => {
    const dispatch = useDispatch()
    const payload = useSelector(state => state.login)
    const [value, setValue] = useState({
        option: "",
        value: ""
    })
    const [isAdmin, setIsAdmin] = useState("")
    const [loading, setLoading] = useState(false)
    const [openModalRGI, setOpenModalRGI] = useState(false)
    const [data, setData] = useState([])
    const [openFilterModalPDF, setOpenFilterModalPDF] = useState(false)
    const [prenotation, setPrenotation] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { permissions } = useAuth()
    const [openPDF, setOpenPDF] = useState(false)
    const [dataFile, setDataFile] = useState([])


    const handleOpenModalPDF = async () => {
        try {
            setOpenPDF(true)
            const response = await rgiSv.getByPrenotation(prenotation)
            console.log(response, 'PDFF')
            setDataFile(response)
            return response
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


    const handleDeleteByPrenotation = async () => {
        try {
            const response = await rgiSv.deleteByPrenotation(prenotation)
            dispatch({type: SET_ALERT, message: "Prenotação deletada com sucesso!", severity: "success", alertType: "file"})
            return response
        } catch (error) {
            console.error("Error ao deletar arquivo rgi!", error)
            dispatch({type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file"})
            throw error;
        }
        finally {
            getDataRGI()
        }
    }

    const handlePresenterFilter = async (value) => {
        console.log('Filtrando por Apresentante com valor:', value);
        let newData = [];
        try {
            setLoading(true);
            const response = await rgiSv.getByPresenter(value.replace(/[^\d]+/g, ''));
            setData(Object.values(response));
            dispatch({type: SET_ALERT, message: response ? `Dados filtrados por Apresentante com sucesso! ` : 'Documento inexistente!', severity: "success", alertType: "file"})
            return response
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file"})
            console.error("Erro ao filtrar por Apresentante", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handlePrenotationFilter = async (value) => {
        console.log('Filtrando por Prenotação com valor:', value);
        let newData = [];
        try {
            setLoading(true);
            const response = await rgiSv.getByPrenotation(Number(value));
            setData(Object.values(response));
            return response
        } catch (error) {
            console.error("Erro ao filtrar por Prenotação", error);
        } finally {
            setLoading(false);
        }
    };
    const handleFilter = async () => {
        console.log('Iniciando filtragem com valor:', value);

        if (value.option && value.value) {
            console.log('Opção selecionada:', value.option.label);

            try {
                if (value.option.label === "Prenotação") {
                    await handlePrenotationFilter(value.value);
                } else if (value.option.label === "Apresentante") {
                    await handlePresenterFilter(value.value);
                }

            } catch (error) {
                console.error("Erro ao filtrar", error);
            }
        } else {
            console.error("Opção ou valor não definidos.");
        }
    }
    const getDataRGI = async () => {
        try {
            setLoading(true)
            const response = await rgiSv.getData()
            setData(Object.values(response))
            dispatch({type: SET_ALERT, message: `Dados carregados com sucesso! `, severity: "success", alertType: "file"})
        } catch (error) {
            dispatch()
            console.error("error listing all rgi files", error)
            dispatch({type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file"})
            throw error;
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        getDataRGI()
        const isAdminUser = localStorage.getItem('isAdmin')
        setIsAdmin(isAdminUser)
    }, [])

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RGI']}>

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
                                            {isAdmin === "1" && <ButtonLixeira href={"/rgi/lixeira_rgi"} />}
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
                        <CadastroModalRGI onClose={handleCloseModalRGI} />
                    </Drawer>
                </Box>
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
                    handleDeleteByPrenotation={handleDeleteByPrenotation}
                />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageRGI);
