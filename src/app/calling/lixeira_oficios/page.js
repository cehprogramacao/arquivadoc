"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import CustomContainer from "@/Components/CustomContainer"
import Calling from "@/services/calling.service"
import Loading from "@/Components/loading"
import SnackBar from "@/Components/SnackBar"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { DocList } from "./tableLixeira"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"


const callingSv = new Calling()
const LixeiraOficio = () => {
    const [data, setData] = useState([])
    const [number, setNumber] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const open = Boolean(anchorEl)
    const handleOpenMenuTrash = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }
    const [loading, setLoading] = useState(false)
    const getAllCallingsInTrash = async () => {
        try {
            setLoading(true)
            const allData = await callingSv.getAllCallingsInTrash()
            setData(Object.values(allData))
            dispatch({ type: SET_ALERT, message: `Total de arquivos na lixeira: ${allData.lenght}`, severity: "success", alertType: "file" })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "file" })
            console.error("Error ao pegar arquivos da lixeira!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleRestoreCallingByTrash = async () => {
        try {
            setLoading(true)
            const data = await callingSv.restoreCallingFromTrash(number)
            dispatch({ type: SET_ALERT, message: data.message, severity: "success", alertType: "file" })
            return data
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file" })
            console.error("Erro ao restaurar arquivo", error)
            throw error;
        }
        finally {
            getAllCallingsInTrash()
            setLoading(false)
        }
    }



    useEffect(() => {
        getAllCallingsInTrash()
    }, [])

    const handleDeleteByNumber = async () => {
        try {
            setLoading(true)
            const response = await callingSv.deleteCallingByNumber(number)
            dispatch({ type: SET_ALERT, message: response.message, severity: "success", alertType: "file" })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file" })
            console.error("Error ao deletar arquivo rgi!", error)
            throw error;
        }
        finally {
            setLoading(false)
            getAllCallingsInTrash()
        }
    }


    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Ofícios']}>
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    py: 12,
                    px: 2
                }}>
                    <CustomContainer >
                        <Grid container >
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"} >
                                        Lixeira
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={5} md={5} sm={6} >
                                        <TextField
                                            fullWidth
                                            label="Buscar"
                                            sx={{
                                                '& input': {
                                                    color: 'success.main',
                                                },
                                            }} color="success" />
                                    </Grid>
                                    <Grid item xs={12} lg={5} md={5} sm={6} >
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            fullWidth
                                            options={top100Films}
                                            autoHighlight
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    color="success"
                                                    label="Buscar Por"
                                                    onChange={(e) => {
                                                        const selected = top100Films.find(
                                                            (item) => item.label === e.target.value
                                                        );
                                                        setSelect(selected)
                                                    }}
                                                    sx={{
                                                        color: "#237117",
                                                        "& input": {
                                                            color: "success.main",
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={2} md={2} sm={12} >
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-end"
                                        }}>
                                            <Button variant="contained" onClick={handleBuscar} sx={{
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
                            </Grid>
                            <Grid item xs={12} >
                                <DocList data={data} handleClick={handleOpenMenuTrash} setNumber={(e) => setNumber(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
                <MenuOptionsFile
                    open={open}
                    anchorEl={anchorEl}
                    handleClose={handleCloseMenuTrash}
                    handleRestoreFromTrash={handleRestoreCallingByTrash}
                    handleDeleteFromTrash={handleDeleteByNumber}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraOficio)
