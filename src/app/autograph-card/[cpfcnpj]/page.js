"use client"
import Loading from '@/Components/loading'
import { AuthProvider } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CustomContainer from '@/Components/CustomContainer'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useDispatch } from 'react-redux'
import { showAlert } from '@/store/actions'
import RPJService from '@/services/rpj.service'
import SnackBar from '@/Components/SnackBar'
import { useRouter } from 'next/navigation'


const UpdateFileAutographCard = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        box: 0,
        card_file_url: "",
        doc_file_url: "",
        cpf_file_url: "",
        comp_resid_file_url: ""
    })

    const handleChangeFileUrl = (name, event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")[1]
                setData(state => ({ ...state, [name]: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const handleUpdateAutographCard = async () => {
        const { updateRPJByNotation } = new RPJService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await updateRPJByNotation(accessToken, params.cpfcnpj, data)
            dispatch(showAlert(response.data.message, "success", "file"))
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
            console.error("Erro ao atualizar arquivo", error)
            throw error;
        }
        finally {
            setLoading(false)
            router.push("/autograph-card")
        }
    }
    

    return loading ? <Loading /> : (
        <AuthProvider >
            <PrivateRoute requiredPermissions={['Cadastros']} >
                <Box sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    px: 2,
                    py: 15,
                    justifyContent: "center"
                }}>
                    <Container maxWidth="sm">
                        <CustomContainer>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        id="box"
                                        name="box"
                                        label="Caixa"
                                        value={data.box}
                                        onChange={(e) => setData(state => ({...state, box: e.target.value}))}
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        type='file'
                                        onChange={(e) => handleChangeFileUrl("card_file_url", e)}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        type='file'
                                        onChange={(e) => handleChangeFileUrl("doc_file_url", e)}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        type='file'
                                        onChange={(e) => handleChangeFileUrl("cpf_file_url", e)}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        fullWidth
                                        type='file'
                                        onChange={(e) => handleChangeFileUrl("comp_resid_file_url", e)}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <Box sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <Button LinkComponent={"a"} href='/autograph-card' variant="contained" color="success">
                                            Voltar
                                        </Button>
                                        <Button onClick={handleUpdateAutographCard} variant="contained" color="success">
                                            Atualizar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CustomContainer>
                    </Container>
                </Box>
                <SnackBar />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(UpdateFileAutographCard);
