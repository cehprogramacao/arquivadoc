"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme, Grid } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import Autocomplete from '@mui/material/Autocomplete';
import { CadastroProtesto } from '@/Components/Modals/ModalCadastroProtesto';
import { useEffect, useState } from 'react';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import CustomContainer from '@/Components/CustomContainer';
import { width } from '@mui/system';
import withAuth from '@/utils/withAuth';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import { DocList } from './components/TableProtest';
import SnackBar from '@/Components/SnackBar';
import ProtestService from '@/services/protest.service';
import Loading from '@/Components/loading';
import MenuOptionsFile from '@/Components/MenuPopUp';
import { useDispatch } from 'react-redux';
import { showAlert } from '@/store/actions';
import ModalList from './components/ModalPDF';

const options = [
    { label: 'Apontamento' },
    { label: 'Apresentante' }
]
const PageProtesto = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const { permissions } = useAuth()
    const [dataFile, setDataFile] = useState([])
    const [notation, setNotation] = useState("")
    const [option, setOption] = useState({
        option: "",
        value: ""
    })
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpenPopUp = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClosePopUp = () => {
        setAnchorEl(null)
    }
    const [loading, setLoading] = useState()
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
    const handleOpenModalFile = async () => {
        const { getProtestByNotation } = new ProtestService()
        try {
            setOpenModalListFile(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getProtestByNotation(notation, accessToken)
            console.log(data)
            setDataFile(data)
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
            throw error;
        }
    }
    const handleCloseModalFile = () => {
        setOpenModalListFile(false)
    }

    const getAllFilesProtest = async () => {
        const { getAllProtests } = new ProtestService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getAllProtests(accessToken)

            dispatch(showAlert(`Total de arquivos: ${Object.values(data).length}`, "success", "file"))
            console.log(data)
            setData(Object.values(data))
        } catch (error) {
            dispatch(showAlert(error.msg, "error", "file"))
            console.error("Erro ao listar todos os arquivos!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleDeleteByNotation = async () => {
        const { deleteProtestByNotation } = new ProtestService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await deleteProtestByNotation(notation, accessToken)
            console.log(response.data)
            dispatch(showAlert(response.data.message, 'success', 'file'))
            return response.data
        } catch (error) {
            dispatch(showAlert(error.msg, "error", "file"))
            console.error("Error ao deletar arquivo rgi!", error)
            throw error;
        }
        finally {
            getAllFilesProtest()
        }
    }

    const getProtestByNotation = async (value, accessToken) => {
        const { getProtestByNotation } = new ProtestService()
        let newData = []
        try {
            setLoading(true)
            const { data } = await getProtestByNotation(value, accessToken)
            console.log(data)
            newData.push(data)
            setData(newData)
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    const getProtestByPresenter = async (value, accessToken) => {
        const { getProtestByPresenter } = new ProtestService()
        let newData = []
        try {
            setLoading(true)
            const { data } = await getProtestByPresenter(value, accessToken)
            console.log(data)

            setData(Object.values(data))
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleSearchProtest = async () => {
        const accessToken = sessionStorage.getItem("accessToken")
        if (option.value && option.value) {
            try {
                if (option.option === 'Apontamento') {
                    await getProtestByNotation(option.value, accessToken)
                }
                else if (option.option === 'Apresentante') {
                    await getProtestByPresenter(option.value, accessToken)
                }

            } catch (error) {
                console.error("Erro ao buscar arquivo!", error)
                throw new Error("Erro ao buscar arquivo!")
            }
        }
        else {
            console.error("Campos vazios!")
            throw new Error('Campos Vazios!')
        }
    }
    useEffect(() => {
        getAllFilesProtest()
    }, [])

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Protesto']}>
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
                                            onChange={(e, value) => setOption({ ...option, option: value.label })}
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
                                            <Buttons color={'green'} title={'Buscar'} onClick={handleSearchProtest} />
                                            {permissions[0]?.create_permission === 1 && (
                                                <ButtonOpenModals onClick={handleOpenModalCadastro} />
                                            )}
                                            <ButtonLixeira href={"/protest/lixeira_protesto"} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <DocList data={data} handleClick={handleOpenPopUp} setNotation={(e) => setNotation(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <Drawer anchor='left' open={openModalCadastro} onClose={handleCloseModalCadastro} >
                        <CadastroProtesto onClickPartes={handleOpenModalPartes} onClose={handleCloseModalCadastro} />
                    </Drawer>

                    <CadastroPartes open={openModalPartes} onClose={handleCloseModalPartes} />
                    <ModalList
                        open={openModalListFile}
                        onClose={handleCloseModalFile}
                        data={dataFile}
                        handleDeleteByNotation={handleDeleteByNotation}
                        notation={notation}

                        deletePerm={permissions[0]?.delete_permission} editPerm={permissions[0]?.edit}
                    />
                </Box>
                <SnackBar />
                <MenuOptionsFile
                    handleDelete={handleDeleteByNotation}
                    handleOpenModalPDF={handleOpenModalFile}
                    anchorEl={anchorEl}
                    handleClose={handleClosePopUp}
                    type={notation}
                    deletePerm={permissions[0]?.delete_permission}
                    editPerm={permissions[0]?.edit}
                    open={open} />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageProtesto);
