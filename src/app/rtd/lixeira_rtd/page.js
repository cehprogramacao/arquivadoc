"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from 'react-redux'
import { showAlert } from "@/store/actions"
import SnackBar from "@/Components/SnackBar"
import CustomContainer from "@/Components/CustomContainer"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"
import RTDService from "@/services/rtd.service"
import { DocList } from "./tableLixeira"


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
    const [isAdmin,setIsAdmin] = useState("")

    const handleCloseMenuOptionsTrash = () => {
        setAnchorEl(null)
    }

    const getAllFilesInTrash = async () => {
        const { getAllRTDInTrash } = new RTDService()

        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getAllRTDInTrash(accessToken)
            if (Object.values(data).length === 0) {
                dispatch(showAlert("Sem arquivos na lixeira!", "success", "file"))
                return false
            }
            dispatch(showAlert(`Total de arquivos na lixeira: ${Object.values(data).length}`, "success", "file"))
            setData(Object.values(data))
        } catch (error) {
            dispatch(showAlert(error.message, "success", "file"))
            console.error("Erro ao buscar arquivos da lixeira", error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }


    const handleRestoreRtdFromTrash = async () => {
        const { restoreRtdFromTrash } = new RTDService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await restoreRtdFromTrash(notation,accessToken )
            dispatch(showAlert(data.message, "success", "file"))
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
            console.error("Error ao restaurar arquivo", error)
            throw error;
        }
    }

    
    useEffect(() => {
        getAllFilesInTrash()
    }, [])

    const handleDeleteFileRtdByNotation = async () => {
        const { deleteRTDByNotation } = new RTDService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await deleteRTDByNotation(accessToken, notation)
            dispatch(showAlert(data.message, "success", "file"))
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch(showAlert(error?.message ? error.message : "Erro ao excluir arquivo!", "error", "file"))
            throw error;
        }
        finally {
            getAllFilesInTrash()
        }
    }


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
                    <SnackBar />
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
