"use client"

import {
    Box,
    Container,
    Drawer,
    TextField,
    Typography,
    Grid,
    Autocomplete,
    Paper,
    Stack,
    Button
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Gavel, Search } from '@mui/icons-material'

import { ButtonLixeira } from '@/Components/ButtonLixeira'
import { ButtonOpenModals } from '@/Components/ButtonOpenModals'
import { CadastroProtesto } from '@/Components/Modals/ModalCadastroProtesto'
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes'
import { DocList } from './components/TableProtest'
import ModalList from './components/ModalPDF'
import MenuOptionsFile from '@/Components/MenuPopUp'
import Loading from '@/Components/loading'

import ProtestService from '@/services/protest.service'
import { AuthProvider, useAuth } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'

import { SET_ALERT } from '@/store/actions'

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
                <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f7fa', pt: 12, pb: 6, px: 2 }}>
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #237117 0%, #2e9e1f 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(35,113,23,0.3)'
                                }}
                            >
                                <Gavel sx={{ color: '#fff', fontSize: 30 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>
                                    Protestos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {data.length} registros encontrados
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Search */}
                        <Paper
                            elevation={0}
                            sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3, bgcolor: '#fff' }}
                        >
                            <Grid container spacing={2} alignItems="flex-start">
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Buscar"
                                        value={option.value}
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

                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        size="small"
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

                                <Grid item xs={12} md={3}>
                                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                        <Button
                                            variant="contained"
                                            startIcon={<Search />}
                                            onClick={handleSearchProtest}
                                            disabled={!option.option || !option.value}
                                            sx={{
                                                bgcolor: '#237117',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: '#1a5511' }
                                            }}
                                        >
                                            Buscar
                                        </Button>
                                        {permissions[0]?.create_permission === 1 && (
                                            <ButtonOpenModals onClick={handleOpenModalCadastro} />
                                        )}
                                        {isAdmin === "1" && (
                                            <ButtonLixeira href="/protest/lixeira_protesto" />
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Table */}
                        <Paper
                            elevation={0}
                            sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden', bgcolor: '#fff' }}
                        >
                            <DocList
                                data={data}
                                handleClick={handleOpenPopUp}
                                setNotation={(e) => setNotation(e)}
                            />
                        </Paper>
                    </Container>
                </Box>

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
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageProtesto)
