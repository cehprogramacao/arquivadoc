"use client"
import CustomContainer from "@/Components/CustomContainer"
import SnackBar from "@/Components/SnackBar"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import Customer from "@/services/customer.service"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"
import { Box, Button, Container, Grid, TextField } from "@mui/material"
import { useState } from "react"


const PageToUpdate = ({ params }) => {

    const [data, setData] = useState({
        box: "",
        file_url: ""
    })
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        open: false,
        type: "file",
        severity: "",
        text: ""
    })
    const handleChangeToUpdate = (e) => {
        const files = e.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")
                setData((prev) => ({ ...prev, file_url: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const handleToUpdate = async () => {
        const { putTermLGDP } = new Customer()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const putTerm = await putTermLGDP(params.cpfcnpj, data, accessToken)
            setAlert({ open: true, text: putTerm.data.message, severity: "success", type: "file" })
            return putTerm.data
        } catch (error) {
            setAlert({ open: true, text: error.msg, severity: "error", type: "file" })
            console.error("Erro ao editar termo!")
            throw error;

        }
        finally {
            setLoading(false)
        }
    }

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
                {loading ? <Loading />
                    :
                    <Box sx={{
                        width: "100%",
                        height: '100vh',
                        py: 15,
                        px: 2
                    }}>
                        <CustomContainer >
                            <Container maxWidth="sm">
                                <Grid container alignItems="center" justifyContent="center" spacing={3}>
                                    <Grid item xs={12} >
                                        <TextField
                                            id=""
                                            name="box"
                                            type="number"
                                            label="Caixa"
                                            color="success"
                                            value={data.box}
                                            onChange={(e) => setData({ ...data, box: e.target.value })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <TextField
                                            id=""
                                            name="box"
                                            type="file"
                                            onChange={handleChangeToUpdate}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}>
                                            <Button variant="contained" LinkComponent={"a"} href="/termos" color="success" onClick={handleToUpdate}>
                                                Voltar
                                            </Button>
                                            <Button variant="contained" color="success" onClick={handleToUpdate}>
                                                Atualizar
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Container>
                        </CustomContainer>
                    </Box>
                }
                <SnackBar data={alert} handleClose={() => setAlert({ ...alert, open: false })} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageToUpdate)