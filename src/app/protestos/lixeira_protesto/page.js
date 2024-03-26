"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { LixeiraTable } from "./tableLixeira"
import CustomContainer from "@/Components/CustomContainer"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import Loading from "@/Components/loading"
import ProtestService from "@/services/protest.service"
import SnackBar from "@/Components/SnackBar"



const LixeiraProtestos = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        open: true,
        severity: "",
        type: "",
        text: ""
    })


    const getFetchingFilesFromTrash = async () => {
        const { getProtestFromTrash } = new ProtestService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getProtestFromTrash(accessToken)
            setAlert({
                open: true,
                severity: "success",
                type: "file",
                text: `Total de arquivos na lixera: ${Object.values(data).length}`
            })
            setData(Object.values(data))
        } catch (error) {
            setAlert({
                open: true,
                severity: "error",
                type: "file",
                text: error.msg
            })
            console.error("Erro ao buscar arquivos da lixeira!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getFetchingFilesFromTrash()
    }, [])



    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Protesto']} >
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    py: 15,
                    px: 3
                }}>
                    <CustomContainer>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                    <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                                        Lixeira
                                    </Typography>
                                </Box>
                            </Grid>
                            {/* <Grid item xs={12} >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={5} md={5} sm={6} >
                                        <TextField label="Buscar"
                                            fullWidth
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
                                            options={top100Films}
                                            fullWidth
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
                                    <Grid item xs={12} lg={2} md={2} sm={12}>
                                        <Box sx={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: "center",
                                            justifyContent: { lg: "flex-end", md: "flex-end", sm: "center", xs: "center" }
                                        }}>
                                            <Button variant="contained" onClick={handleBuscar} sx={{
                                                background: '#247117',
                                                px: 5,
                                                py: "15px",
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
                            <Grid item xs={12}>
                                <LixeiraTable data={data} />
                            </Grid>
                        </Grid>

                    </CustomContainer>
                </Box>
                <SnackBar data={alert} handleClose={() => setAlert({ ...alert, open: false })} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraProtestos)
