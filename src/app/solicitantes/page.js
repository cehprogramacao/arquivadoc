"use client"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { Buttons } from "@/Components/Button/Button"
import { UserTable } from "./tableSolic/table"
import { CadastroSolicitantes } from "@/Components/Modals/ModalCadastroSolic"
import CustomContainer from "@/Components/CustomContainer"
import SnackBar from "@/Components/SnackBar"
import Loading from "@/Components/loading"
import NoteService from "@/services/notes.service"



const PageSolicitantes = () => {
    const [data, setData] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        text: "",
        type: "",
        severity: ""
    })
    const [loading, setLoading] = useState(false)


    const [open, setOpen] = useState(false)
    const handleOpenModal = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)


    const getAllNoteTags = async () => {
        const { getAllNoteTags } = new NoteService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const allData = await getAllNoteTags(accessToken)
            setAlert({open: true, severity: "success", text: `Solicitantes: ${Object.values(allData.data).length}`})
            setData(Object.values(allData.data))
            return allData.data
        } catch (error) {
            setAlert({open: true, severity: "error", text: error.msg})
            console.error("error when searching all notes tags", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllNoteTags()
    }, [])


    return (
        <>
            {loading ? <Loading />
                :
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    px: 3,
                    py: 12
                }}>
                    <CustomContainer >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={40} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                                        Solicitantes
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container >
                                    {/* <Grid item xs={12} lg={5} md={5} sm={6}>
                                <TextField label="Buscar"
                                    sx={{
                                        '& input': {
                                            color: 'success.main',
                                        },
                                    }} color="success" />
                            </Grid>
                            <Grid item xs={12} lg={5} md={5} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={top100Films}
                                    sx={{ width: isSmallScreen ? '100%' : 400 }}
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
                            </Grid> */}
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: "flex-end"
                                        }}>
                                            {/* <Buttons color={'green'} title={'Buscar'} /> */}
                                            <ButtonOpenModals onClick={handleOpenModal} />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <UserTable data={data} />
                            </Grid>
                        </Grid>
                    </CustomContainer>

                    <Drawer anchor="left" open={open} onClose={handleCloseModal}>
                        <CadastroSolicitantes onClose={handleCloseModal} getTag={getAllNoteTags} />
                    </Drawer>
                    <SnackBar data={alert} handleClose={() => setAlert({ ...alert, open: false })} />
                </Box>
            }
        </>
    )
}

export default PageSolicitantes