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

import { MailOutline, Search } from '@mui/icons-material'

import Loading from '@/Components/loading'
import { ButtonLixeira } from '@/Components/ButtonLixeira'
import { ButtonOpenModals } from '@/Components/ButtonOpenModals'
import { CadastroOficio } from '@/Components/Modals/ModalCadastroOficio'
import { DocCalling } from './components/DocCalling'
import MenuOptionsFile from '@/Components/MenuPopUp'
import ModalCalling from './components/modalCalling'

import Calling from '@/services/calling.service'
import { AuthProvider, useAuth } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'

import { SET_ALERT, showAlert } from '@/store/actions'

const labels = [
    { label: 'Número' },
    { label: 'Entidade' }
]

const callingSv = new Calling()

const PageOficio = () => {
    const dispatch = useDispatch()
    const { permissions } = useAuth()

    const [loading, setLoading] = useState(false)
    const [callingData, setCallingData] = useState([])
    const [number, setNumber] = useState("")

    const [open, setOpen] = useState(false)
    const [openPDF, setOpenPDF] = useState(false)

    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl)

    const [dataFile, setDataFile] = useState([])
    const [isAdmin, setIsAdmin] = useState("")

    const [selectOption, setSelectOption] = useState({
        option: null,
        value: ""
    })

    /* ===================== DATA ===================== */

    const getCallingData = async () => {
        try {
            setLoading(true)
            const data = await callingSv.getAllCallings()
            setCallingData(Object.values(data))
            dispatch({
                type: SET_ALERT,
                message: `Foram encontrados ${Object.values(data).length} arquivos`,
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCallingData()
        setIsAdmin(localStorage.getItem("isAdmin"))
    }, [])

    /* ===================== FILTER ===================== */

    const handleFilterByNumberOrEntity = async () => {
        if (!selectOption.option || !selectOption.value) {
            dispatch({
                type: SET_ALERT,
                message: "Selecione o tipo de busca e informe um valor",
                severity: "warning",
                alertType: "file"
            })
            return
        }

        try {
            setLoading(true)
            let response

            if (selectOption.option.label === "Número") {
                response = await callingSv.getCallingByNumber(selectOption.value)
            }

            if (selectOption.option.label === "Entidade") {
                response = await callingSv.getCallingByEntity(selectOption.value)
            }

            setCallingData(Array.isArray(response) ? response : Object.values(response))

            dispatch({
                type: SET_ALERT,
                message: "Filtro aplicado com sucesso",
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setLoading(false)
        }
    }

    /* Reset automático */
    useEffect(() => {
        if (selectOption.option && selectOption.value === "") {
            getCallingData()
        }
    }, [selectOption.value])

    /* ===================== MENU / MODALS ===================== */

    const handleClickMenu = (event) => setAnchorEl(event.currentTarget)
    const handleCloseMenu = () => setAnchorEl(null)

    const handleOpenModalPDF = async () => {
        try {
            setOpenPDF(true)
            const response = await callingSv.getCallingByNumber(number)
            setDataFile(response)
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        }
    }

    const handleDeleteByNumber = async () => {
        try {
            setLoading(true)
            const response = await callingSv.deleteCallingByNumber(number)
            dispatch(showAlert(response.message, "success", "file"))
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setLoading(false)
            getCallingData()
        }
    }

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Ofícios']}>
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
                                <MailOutline sx={{ color: '#fff', fontSize: 30 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>
                                    Ofício
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {callingData.length} registros encontrados
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Search */}
                        <Paper
                            elevation={0}
                            sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3, bgcolor: '#fff' }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label={
                                            selectOption.option
                                                ? `Buscar por ${selectOption.option.label}`
                                                : "Selecione o tipo de busca"
                                        }
                                        disabled={!selectOption.option}
                                        type={selectOption.option?.label === "Número" ? "number" : "text"}
                                        value={selectOption.value}
                                        onChange={(e) =>
                                            setSelectOption((state) => ({
                                                ...state,
                                                value: e.target.value
                                            }))
                                        }
                                        color="success"
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        size="small"
                                        options={labels}
                                        getOptionLabel={(option) => option.label}
                                        value={selectOption.option}
                                        onChange={(e, value) =>
                                            setSelectOption({ option: value, value: "" })
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Buscar Por" color="success" />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                        <Button
                                            variant="contained"
                                            startIcon={<Search />}
                                            onClick={handleFilterByNumberOrEntity}
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
                                        {permissions[4]?.create_permission === 1 && (
                                            <ButtonOpenModals onClick={() => setOpen(true)} />
                                        )}
                                        {isAdmin === "1" && (
                                            <ButtonLixeira href="/calling/lixeira_oficios" />
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
                            <DocCalling
                                data={callingData}
                                setNumber={setNumber}
                                handleClick={handleClickMenu}
                            />
                        </Paper>
                    </Container>
                </Box>

                {/* MODAIS */}
                <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                    <CadastroOficio getData={getCallingData} onClose={() => setOpen(false)} />
                </Drawer>

                <MenuOptionsFile
                    open={openMenu}
                    anchorEl={anchorEl}
                    handleClose={handleCloseMenu}
                    handleOpenModalPDF={handleOpenModalPDF}
                    handleDelete={handleDeleteByNumber}
                    type={number}
                    deletePerm={permissions[4]?.delete_permission}
                    editPerm={permissions[4]?.edit}
                />

                <ModalCalling
                    open={openPDF}
                    onClose={() => setOpenPDF(false)}
                    data={dataFile}
                    number={number}
                    deletePerm={permissions[4]?.delete_permission}
                    editPerm={permissions[4]?.edit}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageOficio)
