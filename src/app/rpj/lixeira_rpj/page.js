"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { DocList } from "./tableLixeira"
import { useSelector, useDispatch } from 'react-redux'
import RPJService from "@/services/rpj.service"
import { SET_ALERT, showAlert } from "@/store/actions"
import SnackBar from "@/Components/SnackBar"
import CustomContainer from "@/Components/CustomContainer"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"

const rpjService = new RPJService()
const LixeiraRPJ = () => {
    const dispatch = useDispatch()
    const [notation, setNotation] = useState("")
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpenMenuOptionsTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenuOptionsTrash = () => {
        setAnchorEl(null)
    }

    
    const getAllFilesInTrash = async () => {

        try {
            setLoading(true)
            const data = await rpjService.getAllRPJInTrash()
            dispatch({type: SET_ALERT, message: "Arquivos da lixeira carregados com sucesso!", severity: "success", alertType: "file"})
            setData(Object.values(data))
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao buscar arquivos da lixeira!", severity: "error", alertType: "file"})
            console.error("Erro ao buscar arquivos da lixeira", error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }


    const handleRestoreFromTrash = async () => {
        try {
            const data = await rpjService.restoreRpjFromTrash(notation)
            dispatch({type: SET_ALERT, message: "Arquivo restaurado com sucesso!", severity: "success", alertType: "file"})
            return data
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao restaurar arquivo!", severity: "error", alertType: "file"})
            console.error("Error ao lista dados por número", error)
            throw error;
        }
    }


    useEffect(() => {
        getAllFilesInTrash()
    }, [])

    const handleDeleteFileRpjByNotation = async () => {
        try {
            const data = await rpjService.deleteRPJByNotation(notation)
            dispatch({type: SET_ALERT, message: "Arquivo deletado com sucesso!", severity: "success", alertType: "file"})
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch({type: SET_ALERT, message: "Erro ao deletar arquivo!", severity: "error", alertType: "file"})
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
            <PrivateRoute requiredPermissions={['RPJ']}>
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
                        handleDeleteFromTrash={handleDeleteFileRpjByNotation}
                        handleRestoreFromTrash={handleRestoreFromTrash}
                    />
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRPJ)
