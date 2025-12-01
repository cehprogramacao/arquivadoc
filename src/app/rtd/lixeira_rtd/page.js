"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { SET_ALERT, showAlert } from "@/store/actions"
import SnackBar from "@/Components/SnackBar"
import CustomContainer from "@/Components/CustomContainer"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"
import RTDService from "@/services/rtd.service"
import { DocList } from "./tableLixeira"

const rtdSv = new RTDService()
const LixeiraRTD = () => {
    const dispatch = useDispatch()
    const [notation, setNotation] = useState("")
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpenMenuOptionsTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const [isAdmin, setIsAdmin] = useState("")

    const handleCloseMenuOptionsTrash = () => {
        setAnchorEl(null)
    }
    
    const getAllFilesInTrash = async () => {

        try {
            setLoading(true)
            const data = await rtdSv.getAllRTDInTrash()
            if (Object.values(data).length === 0) {
                dispatch({type: SET_ALERT, message: "Nenhum arquivo encontrado na lixeira!", severity: "info", typeAlert: "file"})
                return false
            }
            dispatch({type: SET_ALERT, message: "Arquivos encontrados na lixeira!", severity: "success", typeAlert: "file"})
            setData(Object.values(data))
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.message, severity: "error", typeAlert: "file"})
            console.error("Erro ao buscar arquivos da lixeira", error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }


    const handleRestoreRtdFromTrash = async () => {
        try {
            const data = await rtdSv.restoreRtdFromTrash(notation)
            dispatch({type: SET_ALERT, message: data.message, severity: "success", typeAlert: "file"})
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.message, severity: "error", typeAlert: "file"})
            console.error("Error ao restaurar arquivo", error)
            throw error;
        }
    }


    useEffect(() => {
        getAllFilesInTrash()
    }, [])

    const handleDeleteFileRtdByNotation = async () => {
        try {
            const data = await rtdSv.deleteRTDByNotation(notation)
            dispatch({type: SET_ALERT, message: data.message, severity: "success", typeAlert: "file"})
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch({type: SET_ALERT, message: error.message, severity: "error", typeAlert: "file"})
            throw error;
        }
        finally {
            getAllFilesInTrash()
        }
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RTD']}>
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    px: 2,
                    py: 15
                }}>
                    <CustomContainer>
                        <Grid container spacing={2}>
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
                                <DocList data={data} handleClick={handleOpenMenuOptionsTrash} setNotation={(e) => setNotation(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <MenuOptionsFile
                        open={open}
                        anchorEl={anchorEl}
                        handleClose={handleCloseMenuOptionsTrash}
                        handleDeleteFromTrash={handleDeleteFileRtdByNotation}
                        handleRestoreFromTrash={handleRestoreRtdFromTrash}
                    />
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRTD)
