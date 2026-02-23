"use client"
import { Box, Container, TextField, Typography, Grid, Paper, Stack, Button } from "@mui/material"
import { PeopleOutline, Search } from "@mui/icons-material"
import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import Link from "next/link"
import withIsAdmin from "@/utils/isAdmin"
import User from "@/services/user.service"
import TableComponente, { UserTable } from "./tableUser"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import withAuth from "@/utils/withAuth"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"

const userSv = new User();
const PageUsuarios = () => {
    const [loading, setLoading] = useState(false)

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
            const data = await userSv.getUserById(filter.userId);
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
                minHeight: '100vh',
                bgcolor: '#f5f7fa',
                pt: 12,
                pb: 6,
                px: 2
            }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{
                                width: 56, height: 56, borderRadius: 3,
                                background: 'linear-gradient(135deg, #237117 0%, #1a5511 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(35,113,23,0.3)'
                            }}>
                                <PeopleOutline sx={{ color: '#fff', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="#1a1a1a">
                                    Usuários
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {dataRows?.length || 0} {dataRows?.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Search Section */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3, bgcolor: '#fff' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField
                                    label="Buscar"
                                    fullWidth
                                    size="small"
                                    value={filter.userId}
                                    onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
                                    color="success"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    disablePortal
                                    options={labels}
                                    fullWidth
                                    size="small"
                                    autoHighlight
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            color="success"
                                            label="Buscar Por"
                                            onChange={(e, newValue) => setFilter({ ...filter, option: newValue.label })}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        startIcon={<Search />}
                                        onClick={handleFilterById}
                                        sx={{
                                            bgcolor: '#237117',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            '&:hover': { bgcolor: '#1a5511' }
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                    <Link href={"/new-user"}>
                                        <ButtonOpenModals />
                                    </Link>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Table */}
                    <Paper elevation={0} sx={{
                        borderRadius: 3,
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        bgcolor: '#fff'
                    }}>
                        <TableComponente
                            data={dataRows}
                            handleDeleteByID={handleDeleteByID}
                            handleSetAdmin={handleSetAdmin}
                            handleUnsetAdmin={handleUnsetAdmin}
                            handleEnable={handleEnable}
                            handleDisabled={handleDisabled}
                        />
                    </Paper>
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(withIsAdmin(PageUsuarios))
