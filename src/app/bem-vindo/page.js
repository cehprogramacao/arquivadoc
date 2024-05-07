"use client"
import Loading from "@/Components/loading"
import { AuthProvider, useAuth } from "@/context"
import User from "@/services/user.service"
import withAuth from "@/utils/withAuth"
import { Box, Button, Container, Grid, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"


const welcomeFontParams = {
    fontSize: { lg: '3rem', md: "2.80rem", sm: "2.60rem", xs: "2rem" },
    lineHeight: { lg: '3.3rem', md: '3rem', sm: '3rem', xs: '2.3rem' }
}

const routes = ['protest', 'rgi', 'rtd', 'rpj', 'calling', 'customers', 'notes']

const Welcome = () => {
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState("")
    const getUser = async () => {
        const { getUser } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getUser(accessToken)
            setUserName(`Bem-vindo ${data.user[0]?.name}`)
            setPermissions(data.permissions)
            return data
        } catch (error) {
            console.error("Erro ao buscar usuário!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUser()

    }, [])


    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                width: "100%",
                height: "100vh",
                px: 3
            }}>
                <Container fixed maxWidth={"md"} sx={{ py: { lg: 15, md: 14, sm: 15, xs: 16 } }}>
                    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
                        <Grid item xs={12} >
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Typography sx={{
                                    ...welcomeFontParams,
                                    textAlign: "center"
                                }} >
                                    {userName}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item container xs={12} spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Typography fontSize={16}>
                                        Escolha uma categoria
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item container spacing={2} justifyContent={"center"} alignItems={"center"}>
                                {permissions.map((item, index) => (
                                    item.view === 1 && (
                                        <Grid item lg={4} md={4} sm={6} xs={6} key={index}>
                                            <Link
                                                href={`/${routes[index]}`}
                                            >
                                                <Button

                                                    sx={{
                                                        width: "100%",
                                                        bgcolor: "#247117",
                                                        color: "#fff",
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}
                                                    variant="contained"
                                                >
                                                    {item.public_name}
                                                </Button>
                                            </Link>
                                        </Grid>
                                    )
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Welcome)