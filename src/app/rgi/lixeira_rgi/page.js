"use client"
import { Autocomplete, Box, Button, TextField, Typography, useMediaQuery, useTheme, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { DocList, LixeiraTable } from "./tableLixeira"
import CustomContainer from "@/Components/CustomContainer"
import RGI from "@/services/rgi.service"
import Loading from "@/Components/loading"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"



const rgiSv = new RGI()
const LixeiraRGI = () => {
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState([]);
    const [prenotation, setPrenotation] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const open = Boolean(anchorEl)
    const handleOpenMenuTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }
    const getData = async () => {
        try {
            setLoading(true)
            const data = await rgiSv.getTrash()
            console.log(data)
            dispatch({type: SET_ALERT, message: "Dados carregados com sucesso!", severity: "success", context: "file"})
            setRows(Object.values(data))
            return data
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao carregar dados!", severity: "error", context: "file"})
            console.error("Error ao pegar arquivos!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleRestoreFromTrash = async () => {
        try {
            const data = await rgiSv.restoreRgiFromTrash(prenotation)
            dispatch({type: SET_ALERT, message: "Arquivo restaurado com sucesso!", severity: "success", context: "file"})
            return data
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao restaurar arquivo!", severity: "error", context: "file"})
            console.error("Erro ao buscar arquivo", error)
            throw error;
        }
    }


    useEffect(() => {
        getData()
    }, [])

    const handleDeleteByPrenotation = async () => {
        try {
            const response = await rgiSv.deleteByPrenotation(prenotation)
            dispatch({type: SET_ALERT, message: "Arquivo deletado com sucesso!", severity: "success", context: "file"})
        } catch (error) {
            console.error("Error ao deletar arquivo rgi!", error)
            dispatch({type: SET_ALERT, message: "Erro ao deletar arquivo!", severity: "error", context: "file"})
            throw error;
        }
        finally {
            getData()
        }
    }


    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RGI']}>

                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    py: 14,
                    px: 4
                }}>
                    <CustomContainer >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    width: "100%",
                                    justifyContent: "center",
                                    display: "flex"
                                }}>
                                    <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"} >
                                        Lixeira
                                    </Typography>
                                </Box>
                            </Grid>
                            {/* <Grid item xs={12} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={5} md={5} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Buscar"
                                                sx={{ '& input': { color: 'success.main' } }}
                                                color="success"
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={5} md={5} sm={6}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={top100Films}
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
                                        <Grid item xs={12} lg={2} md={12} sm={12}>
                                            <Box sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                                <Button variant="contained" sx={{
                                                    background: '#247117',
                                                    padding: '14px 10px',
                                                    ":hover": {
                                                        background: '#247117'
                                                    }
                                                }}>
                                                    BUSCAR
                                                </Button>

                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid> */}
                            <Grid item xs={12} >
                                <DocList setPrenotation={(e) => setPrenotation(e)} data={rows} handleClick={handleOpenMenuTrash} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
                <MenuOptionsFile handleRestoreFromTrash={handleRestoreFromTrash}
                handleDeleteFromTrash={handleDeleteByPrenotation} 
                anchorEl={anchorEl} handleClose={handleCloseMenuTrash} open={open} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRGI)
