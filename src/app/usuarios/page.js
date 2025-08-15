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
import { SET_ALERT, showAlert } from "@/store/actions"

const userSv = new User();
const PageUsuarios = () => {
    const dispatch = useDispatch()
    const [dataRows, setDataRows] = useState([])
    const [filter, setFilter] = useState({
        userId: "",
        option: ""
    })
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;
    const [loading, setLoading] = useState(false)
    const getUsers = async () => {

        try {
            setLoading(true)

            const response = await userSv.getUsers()
            console.log(response, '788812akaakak');
            setDataRows(response)
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

    const labels = [
        {
            id: 1,
            label: 'ID'
        },
    ];

    const handleDeleteByID = async (userId) => {
        try {
            setLoading(true)
            const response = await userSv.deleteUser(userId)
            dispatch({ type: SET_ALERT, message: 'Documento deletado com sucesso!', alertType: 'user', severity: 'success' })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: 'Erro ao deletar documento!', alertType: 'user', severity: 'error' })
            console.error("Erro ao excluir usuário!", error)
            throw error;
        }
        finally {
            setLoading(false)
            getUsers()
        }
    }


    const handleSetAdmin = async (userId) => {
        try {
            setLoading(true);
            await userSv.setAdmin(userId);
            dispatch({
                type: SET_ALERT,
                message: 'Novo administrador definido!',
                alertType: 'user',
                severity: "success"
            });
            getUsers();
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: 'Erro ao adicionar novo administrador!',
                alertType: 'user',
                severity: "error"
            });
            console.error("Erro ao tornar admin", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsetAdmin = async (userId) => {
        try {
            setLoading(true);
            await userSv.unsetAdmin(userId);
            dispatch({
                type: SET_ALERT,
                message: "Administrador desabilitado com sucesso!",
                alertType: 'user',
                severity: 'success'
            });
            getUsers();
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao desabilitar administrador",
                alertType: 'user',
                severity: 'error'
            });
            console.error("Erro ao remover admin", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnable = async (userId) => {
        try {
            setLoading(true);
            await enableUser(userId);
            dispatch({
                type: SET_ALERT,
                message: "Usuário habilitado com sucesso!",
                alertType: 'user',
                severity: 'success'
            });
            getUsers();
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message || "Erro ao habilitar usuário",
                alertType: 'user',
                severity: 'error'
            });
            console.error("Erro ao habilitar usuário", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDisabled = async (userId) => {
        try {
            setLoading(true);
            const response = await disableUser(userId);
            dispatch({
                type: SET_ALERT,
                message: "Usuário desabilitado com sucesso!",
                alertType: 'user',
                severity: 'success'
            });
            getUsers();
            return response.data;
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message || "Erro ao desabilitar usuário",
                alertType: 'user',
                severity: 'error'
            });
            console.error("Erro ao desabilitar usuário", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterById = async () => {
        try {
            setLoading(true);
            const data = await getUserById(filter.userId);
            dispatch({
                type: SET_ALERT,
                message: "Usuário encontrado com sucesso!",
                alertType: 'user',
                severity: 'success'
            });
            setDataRows(Object.values(data.user));
            return data;
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message || "Erro ao filtrar usuário",
                alertType: 'user',
                severity: 'error'
            });
            console.error("Erro ao filtrar usuário!", error);
        } finally {
            setLoading(false);
        }
    };


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
                                        options={labels}
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
        </AuthProvider>
    )
}

export default withAuth(withIsAdmin(PageUsuarios))