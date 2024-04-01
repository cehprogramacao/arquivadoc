"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { DocList } from "./tableLixeira"
import { useSelector, useDispatch } from 'react-redux'
import RPJService from "@/services/rpj.service"
import { showAlert } from "@/store/actions"
import SnackBar from "@/Components/SnackBar"
import CustomContainer from "@/Components/CustomContainer"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"
import RTDService from "@/services/rtd.service"


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


    const handleOpenFilePDF = async () => {
        const { getRPJByNotation } = new RTDService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getRPJByNotation(accessToken, notation)
            handlePrintFile(data.file)
        } catch (error) {
            console.error("Error ao lista dados por número", error)
            throw error;
        }
    }

    const handlePrintFile = (file) => {
        const base64Data = file;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Criar uma URL do Blob e abrir em uma nova janela
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    }
    useEffect(() => {
        getAllFilesInTrash()
    }, [])


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
                            <Grid item xs={12} >]
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
                    <MenuOptionsFile open={open} anchorEl={anchorEl} handleClose={handleCloseMenuOptionsTrash} handleOpenFile={handleOpenFilePDF} />
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRPJ)
