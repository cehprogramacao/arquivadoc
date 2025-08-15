"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Grid } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { showAlert } from '@/store/actions';
import Loading from '@/Components/loading';
import withAuth from '@/utils/withAuth';
import CustomContainer from '@/Components/CustomContainer';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import SnackBar from '@/Components/SnackBar';
import MenuOptionsFile from '@/Components/MenuPopUp';
import RTDService from '@/services/rtd.service';
import ModalList from './components/ModalPDF';
import { DocList } from './components/TableRTD';
import { CadastroModalRTD } from '@/Components/Modals/ModalCadastroRTD';
const options = [
    {
        label: 'Apresentante'
    },
    {
        label: 'Notação'
    },

];


const rtdSv = new RTDService();

const PageRTD = () => {
    const dispatch = useDispatch()
    const { permissions } = useAuth()
    const [notation, setNotation] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const [dataFile, setDataFile] = useState([])
    const open = Boolean(anchorEl)
    const handleOpenMenuOptions = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseMenuOptions = () => {
        setAnchorEl(null)
    }
    const [data, setData] = useState([])
    const [option, setOption] = useState({
        option: "",
        value: ""
    })

    const [loading, setLoading] = useState(false)
    const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false)
    const [openModalCadastroRTD, setOpenModalCadastroRTD] = useState(false)


    const handleOpenModalListFilePDF = async () => {
        try {
            setOpenModalListFilePDF(true)
            const data = await rtdSv.getRTDByNotation(notation)
            setDataFile(data)
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
            throw error;
        }
    }

    const handleCloseModalListFilePDF = () => {
        setOpenModalListFilePDF(false)
    }
    const handleOpenModalCadastroRTD = () => setOpenModalCadastroRTD(true)
    const handleCloseModalCadastroRTD = () => setOpenModalCadastroRTD(false)
    const [isAdmin, setIsAdmin] = useState("")


    const getAllFilesRTD = async () => {
        try {
            setLoading(true)
            const data = await rtdSv.getAllRTD(accessToken)
            dispatch({type: SET_ALERT, message: "Arquivos carregados com sucesso!", severity: "success", alertType: "file"})
            setData(Object.values(data))
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao buscar todos os arquivos!", severity: "error", alertType: "file"})
            console.error("Error ao buscar todos os arquivos", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }


    const fetchAllFilesByNotation = async (notation) => {
        let newData = []
        try {
            const data = await rtdSv.getRTDByNotation(notation)
            if (Object.values(data).length === 0) {
                dispatch({type: SET_ALERT, message: "Nenhum arquivo encontrado com a notação informada!", severity: "success", alertType: "file"})
                setData([])
                return false
            }
            setData(Object.values(data));
            return data
        } catch (error) {
            console.error("Erro ao buscar arquivo!", error)
            dispatch({type: SET_ALERT, message: error.msg, severity: "error", alertType: "file"})
            throw error;
        }
    }
    const fetchAllFilesByPresenter = async (presenter) => {
        let newData = []
        try {
            const data = await rtdSv.getRTDByPresenter(presenter)
            if (Object.values(data).length === 0) {
                dispatch({type: SET_ALERT, message: "Nenhum arquivo encontrado com o apresentante informado!", severity: "success", alertType: "file"})
                setData([])
                return false
            }
            setData(Object.values(data));
            return data
        } catch (error) {
            console.error("Erro ao buscar arquivo!", error)
            dispatch({type: SET_ALERT, message: error.msg, severity: "error", alertType: "file"})
            throw error;
        }
    }

    const handleFetchFileByNotationOrPresenter = async () => {
        if (option.option && option.value) {
            try {
                if (option.option === 'Notação') {
                    await fetchAllFilesByNotation(option.value)
                }
                if (option.option === 'Apresentante') {
                    await fetchAllFilesByPresenter(option.value)
                }
            } catch (error) {
                console.log("Erro ao buscar arquivo!", error)
                throw error;
            }
        }
        else {
            dispatch({type: SET_ALERT, message: "Campos vazios!", severity: "error", alertType: "file"})
            console.error("Campos vazios!")
        }
    }
    const handleDeleteFileRtdByNotation = async () => {
        try {
            const data = await rtdSv.deleteRTDByNotation(notation)
            dispatch({type: SET_ALERT, message: "Arquivo deletado com sucesso!", severity: "success", alertType: "file"})
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch({type: SET_ALERT, message: "Erro ao deletar arquivo!", severity: "error", alertType: "file"})
            throw error;
        }
        finally {
            getAllFilesRTD()
        }
    }
    useEffect(() => {
        getAllFilesRTD()
        const isAdminUser = sessionStorage.getItem("isAdmin")
        setIsAdmin(isAdminUser)
    }, [])


    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RPJ']} >
                <Box
                    sx={{
                        width: '100%',
                        height: '100vh',
                        py: 15,
                        px: 2
                    }}
                >
                    <CustomContainer >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                        RTD
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={5} md={6} sm={6}>
                                        <TextField
                                            label="Buscar"
                                            value={option.value}
                                            fullWidth
                                            onChange={(e) => setOption({ ...option, value: e.target.value })}
                                            sx={{ '& input': { color: 'success.main' } }}
                                            color="success"
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={4} md={6} sm={6}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={options}
                                            getOptionLabel={(option) => option.label}
                                            onChange={(e, value) => setOption({ ...option, option: value.label || null })}
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
                                            <Buttons color={'green'} title={'Buscar'} onClick={handleFetchFileByNotationOrPresenter} />
                                            {permissions[2]?.create_permission === 1 && (
                                                <ButtonOpenModals onClick={handleOpenModalCadastroRTD} />
                                            )}
                                            {isAdmin === "1" && <ButtonLixeira href={"/rpj/lixeira_rpj"} />}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <DocList data={data} handleClick={handleOpenMenuOptions} setNotation={(e) => setNotation(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>

                    <ModalList
                        data={dataFile}
                        notation={notation}
                        open={openModalListFilePDF}
                        onClose={handleCloseModalListFilePDF}
                        deletePerm={permissions[2]?.delete_permission}
                        editPerm={permissions[2]?.edit}
                        handleDeleteByNotation={handleDeleteFileRtdByNotation}
                    />
                    <Drawer anchor='left' open={openModalCadastroRTD} onClose={handleCloseModalCadastroRTD}>
                        <CadastroModalRTD onClose={handleCloseModalCadastroRTD} getData={getAllFilesRTD} />
                    </Drawer>
                </Box>

                <MenuOptionsFile
                    deletePerm={permissions[2]?.delete_permission}
                    editPerm={permissions[2]?.edit}
                    open={open}
                    anchorEl={anchorEl}
                    type={notation}
                    handleClose={handleCloseMenuOptions}
                    handleOpenModalPDF={handleOpenModalListFilePDF}
                    handleDelete={handleDeleteFileRtdByNotation}
                />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default PageRTD