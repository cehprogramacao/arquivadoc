"use client"
import { Box, Button, Typography, Container, Paper } from "@mui/material"
import { ArrowBack, DeleteOutline } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Calling from "@/services/calling.service"
import Loading from "@/Components/loading"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { DocList } from "./tableLixeira"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"

const callingSv = new Calling()

const LixeiraOficio = () => {
    const [data, setData] = useState([])
    const [number, setNumber] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const open = Boolean(anchorEl)
    const router = useRouter()

    const handleOpenMenuTrash = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }

    const [loading, setLoading] = useState(false)

    const getAllCallingsInTrash = async () => {
        try {
            setLoading(true)
            const allData = await callingSv.getAllCallingsInTrash()
            setData(Object.values(allData))
            dispatch({ type: SET_ALERT, message: `Total de arquivos na lixeira: ${allData.lenght}`, severity: "success", alertType: "file" })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "file" })
            console.error("Error ao pegar arquivos da lixeira!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleRestoreCallingByTrash = async () => {
        try {
            setLoading(true)
            const data = await callingSv.restoreCallingFromTrash(number)
            dispatch({ type: SET_ALERT, message: data.message, severity: "success", alertType: "file" })
            return data
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file" })
            console.error("Erro ao restaurar arquivo", error)
            throw error;
        }
        finally {
            getAllCallingsInTrash()
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCallingsInTrash()
    }, [])

    const handleDeleteByNumber = async () => {
        try {
            setLoading(true)
            const response = await callingSv.deleteCallingByNumber(number)
            dispatch({ type: SET_ALERT, message: response.message, severity: "success", alertType: "file" })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.msg || error.message, severity: "error", alertType: "file" })
            console.error("Error ao deletar arquivo rgi!", error)
            throw error;
        }
        finally {
            setLoading(false)
            getAllCallingsInTrash()
        }
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Ofícios']}>
                <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f7fa', pt: 12, pb: 6, px: 2 }}>
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => router.back()}
                                sx={{ mb: 2, color: '#666', textTransform: 'none', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                            >
                                Voltar
                            </Button>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 3,
                                    background: 'linear-gradient(135deg, #ef5350 0%, #c62828 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(239,83,80,0.3)'
                                }}>
                                    <DeleteOutline sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} color="#1a1a1a">
                                        Lixeira - Oficios
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {data?.length || 0} {data?.length === 1 ? 'item encontrado' : 'itens encontrados'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Content */}
                        <Paper elevation={0} sx={{
                            borderRadius: 3, border: '1px solid #e5e7eb',
                            overflow: 'hidden', bgcolor: '#fff'
                        }}>
                            {data && data.length > 0 ? (
                                <DocList data={data} handleClick={handleOpenMenuTrash} setNumber={(e) => setNumber(e)} />
                            ) : (
                                <Box sx={{
                                    py: 10, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 2
                                }}>
                                    <DeleteOutline sx={{ fontSize: 64, color: '#e0e0e0' }} />
                                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                        A lixeira esta vazia
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        Itens excluidos aparecerao aqui
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Container>
                </Box>

                <MenuOptionsFile
                    open={open}
                    anchorEl={anchorEl}
                    handleClose={handleCloseMenuTrash}
                    handleRestoreFromTrash={handleRestoreCallingByTrash}
                    handleDeleteFromTrash={handleDeleteByNumber}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraOficio)
