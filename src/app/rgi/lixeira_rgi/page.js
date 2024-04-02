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




const LixeiraRGI = () => {
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState([]);
    const [prenotation, setPrenotation] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpenMenuTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }
    const getData = async () => {
        const { getTrash } = new RGI()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getTrash(accessToken)
            console.log(data)
            setRows(Object.values(data))
            return data
        } catch (error) {
            console.error("Error ao pegar arquivos!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleViewFileTrash = async () => {
        const { getByPrenotation } = new RGI()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getByPrenotation(prenotation, accessToken)
            handlePrintFile(data.file)
        } catch (error) {
            console.error("Erro ao buscar arquivo", error)
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
        getData()
    }, [])



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
                <MenuOptionsFile handleOpenFile={handleViewFileTrash} anchorEl={anchorEl} handleClose={handleCloseMenuTrash} open={open} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRGI)
