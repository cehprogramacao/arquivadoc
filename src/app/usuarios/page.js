"use client"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { Buttons } from "@/Components/Button/Button"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import Link from "next/link"
import withIsAdmin from "@/utils/isAdmin"
import CustomContainer from "@/Components/CustomContainer"
import User from "@/services/user.service"
import TableComponente, { UserTable } from "./tableUser"
import Loading from "@/Components/loading"
import SnackBar from "@/Components/SnackBar"
import { AuthProvider } from "@/context"
import withAuth from "@/utils/withAuth"
import { useDispatch } from "react-redux"
import { showAlert } from "@/store/actions"


const PageUsuarios = () => {
    const dispatch = useDispatch()
    const [dataRows, setDataRows] = useState([])
    const [filter, setFilter] = useState({
        userId: "",
        option: ""
    })
    const [loading, setLoading] = useState(false)
    const getUsers = async () => {
        const user = new User();
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken");
            const response = await user.getUsers(accessToken)
            console.log(response.data, '788812akaakak');
            setDataRows(response.data)
        } catch (error) {
            console.error("Erro ao listar usuários!", error);
            throw error;
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getUsers()
    }, []);

    const top100Films = [
        {
            id: 1,
            label: 'ID'
        },
    ];

    const handleDeleteByID = async (userId) => {
        const { deleteUser } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await deleteUser(userId, accessToken)
            dispatch(showAlert(response.data.message, "success", "user"))
            return response.data
        } catch (error) {
            dispatch(showAlert(error.message, "error", "user"))
            console.error("Erro ao excluir usuário!", error)
            throw error;
        }
        finally {
            setLoading(false)
            getUsers()
        }   
    }
    

    const handleSetAdmin = async (userId) => {
        const { setAdmin } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await setAdmin(userId, accessToken)
            dispatch(showAlert(response.data.message, "success", "user"))
            console.log(response.data, '77777')
            getUsers()
            return response.data
        } catch (error) {
            dispatch(showAlert(error.message, "error", "user"))
            console.error("Erro ao tornar admin", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleUnsetAdmin = async (userId) => {
        const { unsetAdmin } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await unsetAdmin(userId, accessToken)
            dispatch(showAlert(response.data.message, "success", "user"))
            console.log(response.data, '77777')
            getUsers()
            return response.data
        } catch (error) {
            dispatch(showAlert(error.message, "error", "user"))
            console.error("Erro ao tornar usuário", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleEnable = async (userId) => {
        const { enableUser } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await enableUser(userId, accessToken)
            dispatch(showAlert(response.data.message, "success", "user"))
            getUsers()
            return response.data
        } catch (error) {
            dispatch(showAlert(error.message, "error", "user"))
            console.error("Erro ao habilitar usuário", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    const handleDisabled = async (userId) => {
        const { disableUser } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await disableUser(userId, accessToken)
            dispatch(showAlert(response.data.message, "success", "user"))
            console.log(response.data, '77777')
            getUsers()
            return response.data
        } catch (error) {
            dispatch(showAlert(error.message, "error", "user"))
            console.error("Erro ao desabilitar usuário", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    const handleFilterById = async () => {
        const { getUserById } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getUserById(filter.userId, accessToken)
            dispatch(showAlert(response.data.message, "success", "user"))
            console.log(data.user[0].email)
            setDataRows(data.user)
            return data
        } catch (error) {
            dispatch(showAlert(error.message, "error", "user"))
            console.error("Erro ao filter usuário!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                py: 12,
                px: 3
            }}>
                <CustomContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <Box sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography fontSize={30} fontWeight={'bold'} color={"black"}>
                                    Usuários
                                </Typography>

                            </Box>
                        </Grid>
                        <Grid item xs={12} >
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={5} md={5} sm={6}>
                                    <TextField label="Buscar"
                                        fullWidth
                                        value={filter.userId}
                                        onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
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
                                        fullWidth
                                        // value={filter.option}
                                        autoHighlight
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                color="success"
                                                label="Buscar Por"
                                                onChange={(e, newValue) => setFilter({ ...filter, option: newValue.label })}
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
                                        display: 'flex',
                                        width: '100%',
                                        gap: "10px",
                                        justifyContent: "center"
                                    }}>
                                        <Buttons color={'green'} title={'Buscar'} onClick={handleFilterById} />
                                        <Link href={"/addUser"}>
                                            <ButtonOpenModals />
                                        </Link>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} >
                            <TableComponente
                                data={dataRows}
                                handleDeleteByID={handleDeleteByID}
                                handleSetAdmin={handleSetAdmin}
                                handleUnsetAdmin={handleUnsetAdmin}
                                handleEnable={handleEnable}
                                handleDisabled={handleDisabled}
                            />
                        </Grid>
                    </Grid>
                </CustomContainer>
            </Box>
            <SnackBar />
        </AuthProvider>
    )
}

export default withAuth(withIsAdmin(PageUsuarios))