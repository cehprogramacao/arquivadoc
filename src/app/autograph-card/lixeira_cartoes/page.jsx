"use client"
import { Autocomplete, Box, Button, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import CustomContainer from "@/Components/CustomContainer"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { DocList } from "./TableTrash"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"



const LixeiraCartoes = () => {
    const [data, setData] = useState([]) 
    const [presenter, setPresenter] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [loading, setLoading] = useState(false)
    
    const handleOpenMenuTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }

    const getAllFilesTrash = async () => {
        try {
            
        } catch (error) {
            
        }
    }

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={'Cadastros'}>
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    py: 13,
                    px: 5
                }}>
                    <CustomContainer >
                        <Grid container spacing={2} >
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}
                                >
                                    <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                                        Lixeira
                                    </Typography>
                                </Box>
                            </Grid>
                            {/* <Grid item xs={12} >
                                <Grid container spacing={3}>
                                    <Grid item lg={5} md={6} sm={6} xs={12} >
                                        <TextField label="Buscar"
                                            fullWidth
                                            sx={{
                                                '& input': {
                                                    color: 'success.main',
                                                },
                                            }} color="success" />
                                    </Grid>
                                    <Grid item lg={5} md={6} sm={6} xs={12} >
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
                                    <Grid item lg={2} md={12} sm={12} xs={12} >
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center"
                                        }} >
                                            <Button variant="contained" sx={{
                                                background: '#247117',
                                                width: 'max-content',
                                                padding: '14px 28px',
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
                                <DocList data={data} handleClick={handleOpenMenuTrash} 
                                setPresenter={(e) => setPresenter(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>

                </Box>
                <MenuOptionsFile open={open} anchorEl={anchorEl} handleClose={handleCloseMenuTrash}  />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraCartoes)
