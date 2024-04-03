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



const LixeiraOficio = () => {
    const [data, setData] = useState([])
    const [number, setNumber] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpenMenuTrash = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }
    const [loading, setLoading] = useState(false)
    const getAllCallingsInTrash = async () => {
        const { getAllCallingsInTrash } = new Calling()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const allData = await getAllCallingsInTrash(accessToken)
            console.log(allData.data)
            setData(Object.values(allData.data))
            return allData.data
        } catch (error) {
            console.error("Error ao pegar arquivos da lixeira!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const fetchCallingByCpfCnpj = async () => {
        const { getCallingByNumber } = new Calling()
        try {
            const accessToken = sessionStorage.getItem('accessToken')
            const { data } = await getCallingByNumber (number, accessToken)
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
        getAllCallingsInTrash()
    }, [])

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
                            {/* <Grid item xs={12} >
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
                    </Grid> */}
                            <Grid item xs={12} >
                                <DocList data={data} handleClick={handleOpenMenuTrash} setNumber={(e) => setNumber(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
                <SnackBar />
                <MenuOptionsFile 
                open={open}
                anchorEl={anchorEl} handleOpenFile={fetchCallingByCpfCnpj} 
                handleClose={handleCloseMenuTrash} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraOficio)
