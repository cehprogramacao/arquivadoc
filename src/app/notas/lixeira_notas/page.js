"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import CustomContainer from "@/Components/CustomContainer"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import Loading from "@/Components/loading"
import ProtestService from "@/services/protest.service"
import SnackBar from "@/Components/SnackBar"
import { useDispatch } from "react-redux"
import { showAlert } from "@/store/actions"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import NoteService from "@/services/notes.service"
import { DocList } from "./TableTrash"



const LixeiraProtestos = () => {
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const getFetchingFilesFromTrash = async () => {
        const { getNotesInTrash } = new NoteService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getNotesInTrash(accessToken)
            dispatch(showAlert(`Total de arquivos na lixera: ${Object.values(data).length}`, "success", "file"))
            setData(Object.values(data))
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
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
            <PrivateRoute requiredPermissions={['Notas']} >
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
                        
                            <Grid item xs={12}>
                                <DocList data={data} handleClick={handleClick} />
                            </Grid>
                        </Grid>

                    </CustomContainer>
                </Box>
                <SnackBar />
                <MenuOptionsFile anchorEl={anchorEl} open={open} handleClose={handleClose} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraProtestos)
