"use client"
import Header from "@/Components/Header/Header"

import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { LixeiraTable } from "./tableLixeira"
import CustomContainer from "@/Components/CustomContainer"
import Calling from "@/services/calling.service"
import Loading from "@/Components/loading"
import SnackBar from "@/Components/SnackBar"



const LixeiraOficio = () => {
    const [data, setData] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        text: "",
        type: "",
        severity: ""
    })
    const [loading, setLoading] = useState(false)
    const getAllCallingsInTrash = async () => {
        const { getAllCallingsInTrash } = new Calling()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const allData = await getAllCallingsInTrash(accessToken)
            console.log(allData.data)
            setAlert({ open: true, text: `Arquivos na lixeira: ${Object.values(allData.data).length}`, type: "file", severity: "success" })
            setData(Object.values(allData.data))
            return allData.data
        } catch (error) {
            setAlert({ open: true, text: error.msg, type: "file", severity: "error" })
            console.error("Error ao pegar arquivos da lixeira!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCallingsInTrash()
    }, [])

    return (
        <>
            {loading ?
                <Loading />
                :
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
                                <LixeiraTable data={data} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
            }
            <SnackBar data={alert} handleClose={() => setAlert({...alert, open: false})}/>
        </>
    )
}

export default LixeiraOficio
