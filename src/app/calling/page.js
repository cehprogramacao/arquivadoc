"use client"

import {
    Box,
    Drawer,
    TextField,
    Typography,
    Grid,
    Autocomplete
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import CustomContainer from '@/Components/CustomContainer'
import Loading from '@/Components/loading'
import { Buttons } from '@/Components/Button/Button'
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
                <Box sx={{ width: "100%", height: "100vh", py: 13, px: 2 }}>
                    <CustomContainer>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography align="center" fontSize={40} fontWeight="bold">
                                    Ofício
                                </Typography>
                            </Grid>

                            {/* FILTROS */}
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={5}>
                                        <TextField
                                            fullWidth
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
                                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                                            <Buttons title="Buscar" color="green" onClick={handleFilterByNumberOrEntity} />
                                            {permissions[4]?.create_permission === 1 && (
                                                <ButtonOpenModals onClick={() => setOpen(true)} />
                                            )}
                                            {isAdmin === "1" && (
                                                <ButtonLixeira href="/calling/lixeira_oficios" />
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* LISTA */}
                            <Grid item xs={12}>
                                <DocCalling
                                    data={callingData}
                                    setNumber={setNumber}
                                    handleClick={handleClickMenu}
                                />
                            </Grid>
                        </Grid>
                    </CustomContainer>
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
