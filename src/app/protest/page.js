"use client"
import { Box, Drawer, TextField, Typography, Grid, Container } from '@mui/material'
import { Buttons } from '@/Components/Button/Button'
import { ButtonLixeira } from '@/Components/ButtonLixeira'
import { ButtonOpenModals } from '@/Components/ButtonOpenModals'
import Autocomplete from '@mui/material/Autocomplete'
import { CadastroProtesto } from '@/Components/Modals/ModalCadastroProtesto'
import { useEffect, useState } from 'react'
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes'
import CustomContainer from '@/Components/CustomContainer'
import withAuth from '@/utils/withAuth'
import { AuthProvider, useAuth } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import { DocList } from './components/TableProtest'
import SnackBar from '@/Components/SnackBar'
import ProtestService from '@/services/protest.service'
import Loading from '@/Components/loading'
import MenuOptionsFile from '@/Components/MenuPopUp'
import { useDispatch } from 'react-redux'
import { SET_ALERT } from '@/store/actions'
import ModalList from './components/ModalPDF'

const options = [
    { label: 'Apontamento' },
    { label: 'Apresentante' }
]

const protestSv = new ProtestService()

const PageProtesto = () => {
    const dispatch = useDispatch()
    const { permissions } = useAuth()

    const [data, setData] = useState([])
    const [dataFile, setDataFile] = useState([])
    const [notation, setNotation] = useState("")

    const [option, setOption] = useState({
        option: null,
        value: ""
    })

    const [isAdmin, setIsAdmin] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const [loading, setLoading] = useState(false)
    const [openModalCadastro, setOpenModalCadastro] = useState(false)
    const [openModalPartes, setOpenModalPartes] = useState(false)
    const [openModalListFile, setOpenModalListFile] = useState(false)

    const [isClient, setIsClient] = useState(false)

    /* -------------------- PopUp -------------------- */
    const handleOpenPopUp = (event) => setAnchorEl(event.currentTarget)
    const handleClosePopUp = () => setAnchorEl(null)

    /* -------------------- Modals -------------------- */
    const handleOpenModalPartes = () => setOpenModalPartes(true)
    const handleCloseModalPartes = () => setOpenModalPartes(false)

    const handleOpenModalCadastro = () => setOpenModalCadastro(true)
    const handleCloseModalCadastro = () => setOpenModalCadastro(false)

    const handleOpenModalFile = async () => {
        try {
            setOpenModalListFile(true)
            const data = await protestSv.getProtestByNotation(notation)
            setDataFile(data)
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
        }
    }

    const handleCloseModalFile = () => setOpenModalListFile(false)

    /* -------------------- Fetch -------------------- */
    const getAllFilesProtest = async () => {
        try {
            setLoading(true)
            const data = await protestSv.getAllProtests()
            setData(Object.values(data))

            dispatch({
                type: SET_ALERT,
                message: `Total de arquivos: ${Object.values(data).length}`,
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message,
                severity: "error",
                alertType: "file"
            })
        } finally {
            setLoading(false)
        }
    }

    const getProtestByNotation = async (value) => {
        try {
            setLoading(true)
            const data = await protestSv.getProtestByNotation(value.replace(/\D/g, ''))
            setData(Object.values(data))
        } finally {
            setLoading(false)
        }
    }

    const getProtestByPresenter = async (value) => {
        try {
            setLoading(true)
            const data = await protestSv.getProtestByPresenter(value.replace(/\D/g, ''))
            setData(Object.values(data))
        } finally {
            setLoading(false)
        }
    }

    /* -------------------- Search -------------------- */
    const handleSearchProtest = async () => {
        if (!option.option || !option.value) {
            dispatch({
                type: SET_ALERT,
                message: "Selecione o tipo de busca e informe um valor",
                severity: "warning",
                alertType: "file"
            })
            return
        }

        try {
            if (option.option === "Apontamento") {
                await getProtestByNotation(option.value)
            }

            if (option.option === "Apresentante") {
                await getProtestByPresenter(option.value)
            }
        } catch {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao buscar protestos",
                severity: "error",
                alertType: "file"
            })
        }
    }

    /* -------------------- Delete -------------------- */
    const handleDeleteByNotation = async () => {
        try {
            const response = await protestSv.deleteProtestByNotation(notation)
            dispatch({
                type: SET_ALERT,
                message: response.message,
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message,
                severity: "error",
                alertType: "file"
            })
        } finally {
            getAllFilesProtest()
        }
    }

    /* -------------------- Effects -------------------- */
    useEffect(() => {
        setIsClient(true)
        getAllFilesProtest()
        setIsAdmin(localStorage.getItem('isAdmin'))
    }, [])

    if (!isClient) return null
    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Protesto']}>
                <Box sx={{ width: '100%', height: '100vh', py: 15, px: 3, mb: 10 }}>
                    <Container maxWidth="xl" >
                        <Grid container spacing={3}>
                            <Grid item xs={12} textAlign="center">
                                <Typography fontSize={40} fontWeight="bold">
                                    Protestos
                                </Typography>
                            </Grid>

                            {/* FILTROS */}
                            <Grid item xs={12} lg={5}>
                                <TextField
                                    label="Buscar"
                                    value={option.value}
                                    fullWidth
                                    disabled={!option.option}
                                    onChange={(e) =>
                                        setOption((prev) => ({
                                            ...prev,
                                            value: e.target.value
                                        }))
                                    }
                                    color="success"
                                    helperText={
                                        !option.option
                                            ? "Selecione primeiro o tipo de busca"
                                            : ""
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} lg={4}>
                                <Autocomplete
                                    options={options}
                                    getOptionLabel={(opt) => opt.label}
                                    onChange={(e, value) =>
                                        setOption({
                                            option: value?.label || null,
                                            value: ""
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Buscar por" color="success" />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} lg={3}>
                                <Box display="flex" gap={2} justifyContent="center">
                                    <Buttons
                                        color="green"
                                        title="Buscar"
                                        onClick={handleSearchProtest}
                                        disabled={!option.option || !option.value}
                                    />

                                    {permissions[0]?.create_permission === 1 && (
                                        <ButtonOpenModals onClick={handleOpenModalCadastro} />
                                    )}

                                    {isAdmin === "1" && (
                                        <ButtonLixeira href="/protest/lixeira_protesto" />
                                    )}
                                </Box>
                            </Grid>

                            {/* LISTA */}
                            <Grid item xs={12}>
                                <DocList
                                    data={data}
                                    handleClick={handleOpenPopUp}
                                    setNotation={(e) => setNotation(e)}
                                />
                            </Grid>
                        </Grid>
                    </Container>

                    {/* MODAIS */}
                    <Drawer anchor="left" open={openModalCadastro} onClose={handleCloseModalCadastro}>
                        <CadastroProtesto
                            onClickPartes={handleOpenModalPartes}
                            onClose={handleCloseModalCadastro}
                        />
                    </Drawer>

                    <CadastroPartes open={openModalPartes} onClose={handleCloseModalPartes} />

                    <ModalList
                        open={openModalListFile}
                        onClose={handleCloseModalFile}
                        data={dataFile}
                        handleDeleteByNotation={handleDeleteByNotation}
                        notation={notation}
                        deletePerm={permissions[0]?.delete_permission}
                        editPerm={permissions[0]?.edit}
                    />

                    <MenuOptionsFile
                        handleDelete={handleDeleteByNotation}
                        handleOpenModalPDF={handleOpenModalFile}
                        anchorEl={anchorEl}
                        handleClose={handleClosePopUp}
                        type={notation}
                        deletePerm={permissions[0]?.delete_permission}
                        editPerm={permissions[0]?.edit}
                        open={open}
                    />
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageProtesto)
