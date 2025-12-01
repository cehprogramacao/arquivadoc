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
import withAuth from "@/utils/withAuth"
import { useAuth } from "@/context"
import { useDispatch } from "react-redux"
import { HIDE_ALERT, SET_ALERT, SHOW_ALERT } from "@/store/actions"


const noteSv = new NoteService()
const PageSolicitantes = () => {
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { permissions } = useAuth()
    const [open, setOpen] = useState(false)
    const handleOpenModal = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)


    const getAllNoteTags = async () => {
        try {
            setLoading(true)

            const allData = await noteSv.getAllNoteTags()
            // dispatch({type: SET_ALERT,  message: `Solicitantes: ${Object.values(allData).length}`, severity: "success",})
            setData(Object.values(allData))
        } catch (error) {
            // dispatch({type: SET_ALERT, message: `Erro ao buscar solicitantes: ${error.message}`, severity: "error", })
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

    const handleDeleteTagById = async (tagId) => {
        try {
            setLoading(true)
            const data = await noteSv.deleteNoteTag(tagId)
            dispatch({ type: SET_ALERT, severity: "success", message: data.message })
        } catch (error) {
            dispatch({ type: SET_ALERT, severity: "error", message: `Erro ao deletar solicitante: ${error.message}` })
            console.error('Erro ao deletar solicitante', error)
            throw error;
        }
        finally {
            setLoading(false)
            getAllNoteTags()
        }
    }
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

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
                                    <Grid item xs={12} lg={5} md={5} sm={6}>
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
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: "flex-end"
                                        }}>
                                            {/* <Buttons color={'green'} title={'Buscar'} /> */}
                                            {permissions[5]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpenModal} />}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <UserTable data={data} onClick={(tagId) => handleDeleteTagById(tagId)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>

                    <Drawer anchor="left" open={open} onClose={handleCloseModal}>
                        <CadastroSolicitantes onClose={handleCloseModal} getTag={getAllNoteTags} />
                    </Drawer>
                </Box>
            }
        </>
    )
}

export default PageSolicitantes