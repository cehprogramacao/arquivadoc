"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Stack, Grid } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { CadastroModalRPJ } from '@/Components/Modals/ModalCadastroRPJ';
import { useDispatch } from 'react-redux'
import RPJService from '@/services/rpj.service';
import { showAlert } from '@/store/actions';
import Loading from '@/Components/loading';
import withAuth from '@/utils/withAuth';
import CustomContainer from '@/Components/CustomContainer';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import { DocList } from './components/TableRPJ';
import SnackBar from '@/Components/SnackBar';
import MenuOptionsFile from '@/Components/MenuPopUp';
import ModalList from './components/ModalPDF';
const options = [
    {
        label: 'Apresentante'
    },
    {
        label: 'Notação'
    },

];



const PageRPJ = () => {
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
    const [openModalCadastroRPJ, setOpenModalCadastroRPJ] = useState(false)
    const [isAdmin, setIsAdmin] = useState("")

    const handleOpenModalListFilePDF = async () => {
        const { getRPJByNotation } = new RPJService()
        try {
            setOpenModalListFilePDF(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getRPJByNotation(accessToken, notation)
            setDataFile(data)
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
            throw error;
        }
    }

    const handleCloseModalListFilePDF = () => {
        setOpenModalListFilePDF(false)
    }
    const handleOpenModalCadastroRPJ = () => setOpenModalCadastroRPJ(true)
    const handleCloseModalCadastroRPJ = () => setOpenModalCadastroRPJ(false)

    

    const getAllFilesRPJ = async () => {
        const { getAllRPJ } = new RPJService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getAllRPJ(accessToken)
            dispatch(showAlert(`Total de arquivos: ${Object.values(data).length}`, "success", "file"))
            setData(Object.values(data))
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
            console.error("Error ao buscar todos os arquivos", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }


    const fetchAllFilesByNotation = async (notation, accessToken) => {
        const { getRPJByNotation } = new RPJService()
        let newData = []
        try {
            const { data } = await getRPJByNotation(accessToken, notation)
            if (Object.values(data).length === 0) {
                dispatch(showAlert("Nenhum arquivo com notação", "success", "file"))
                return false
            }
            newData.push(data)
            setData(newData)
        } catch (error) {
            console.error("Erro ao buscar arquivo!", error)
            dispatch(showAlert(error.msg, "error", "file"))
            throw error;
        }
    }
    const fetchAllFilesByPresenter = async (presenter, accessToken) => {
        const { getRPJByPresenter } = new RPJService()
        let newData = []
        try {
            const { data } = await getRPJByPresenter(accessToken, presenter)
            if (Object.values(data).length === 0) {
                dispatch(showAlert("Nenhum arquivo com esse apresentante", "success", "file"))
                return false
            }
            newData.push(data)
            setData(newData)
        } catch (error) {
            console.error("Erro ao buscar arquivo!", error)
            dispatch(showAlert(error.msg, "error", "file"))
            throw error;
        }
    }

    const handleFetchFileByNotationOrPresenter = async () => {
        const accessToken = sessionStorage.getItem("accessToken")
        if (option.option && option.value) {
            try {
                if (option.option === 'Notação') {
                    await fetchAllFilesByNotation(option.value, accessToken)
                }
                if (option.option === 'Apresentante') {
                    await fetchAllFilesByPresenter(option.value, accessToken)
                }
            } catch (error) {
                console.log("Erro ao buscar arquivo!", error)
                throw error;
            }
        }
        else {
            dispatch(showAlert("Campos vazios!", "error", "file"))
            console.error("Campos vazios!")
        }
    }
    const handleDeleteFileRpjByNotation = async () => {
        const { deleteRPJByNotation } = new RPJService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await deleteRPJByNotation(accessToken, notation)
            dispatch(showAlert(data.message, "success", "file"))
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch(showAlert(error?.message ? error.message : "Erro ao excluir arquivo!", "error", "file"))
            throw error;
        }
        finally {
            getAllFilesRPJ()
        }
    }
    useEffect(() => {
        const isAdminUser = sessionStorage.getItem("isAdmin")
        setIsAdmin(isAdminUser)
        getAllFilesRPJ()
    }, [])


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
                                        RPJ
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
                                            {permissions[3]?.create_permission === 1 && (
                                                <ButtonOpenModals onClick={handleOpenModalCadastroRPJ} />
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
                        deletePerm={permissions[3]?.delete_permission}
                        editPerm={permissions[3]?.edit}
                        handleDeleteByNotation={handleDeleteFileRpjByNotation}
                    />
                    <Drawer anchor='left' open={openModalCadastroRPJ} onClose={handleCloseModalCadastroRPJ}>
                        <CadastroModalRPJ onClose={handleCloseModalCadastroRPJ} getData={getAllFilesRPJ} />
                    </Drawer>
                </Box>
                <SnackBar />
                <MenuOptionsFile
                    deletePerm={permissions[3]?.delete_permission}
                    editPerm={permissions[3]?.edit}
                    open={open}
                    anchorEl={anchorEl}
                    type={notation}
                    handleClose={handleCloseMenuOptions}
                    handleOpenModalPDF={handleOpenModalListFilePDF}
                    handleDelete={handleDeleteFileRpjByNotation}
                />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageRPJ);