"use client"
import { Box, Button, Typography, Container, Paper } from "@mui/material"
import { ArrowBack, DeleteOutline } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from 'react-redux'
import { SET_ALERT } from "@/store/actions"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"
import RTDService from "@/services/rtd.service"
import { DocList } from "./tableLixeira"

const rtdSv = new RTDService()
const LixeiraRTD = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [notation, setNotation] = useState("")
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpenMenuOptionsTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const [isAdmin, setIsAdmin] = useState("")

    const handleCloseMenuOptionsTrash = () => {
        setAnchorEl(null)
    }

    const getAllFilesInTrash = async () => {

        try {
            setLoading(true)
            const data = await rtdSv.getAllRTDInTrash()
            if (Object.values(data).length === 0) {
                dispatch({type: SET_ALERT, message: "Nenhum arquivo encontrado na lixeira!", severity: "info", typeAlert: "file"})
                return false
            }
            dispatch({type: SET_ALERT, message: "Arquivos encontrados na lixeira!", severity: "success", typeAlert: "file"})
            setData(Object.values(data))
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.message, severity: "error", typeAlert: "file"})
            console.error("Erro ao buscar arquivos da lixeira", error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }


    const handleRestoreRtdFromTrash = async () => {
        try {
            const data = await rtdSv.restoreRtdFromTrash(notation)
            dispatch({type: SET_ALERT, message: data.message, severity: "success", typeAlert: "file"})
        } catch (error) {
            dispatch({type: SET_ALERT, message: error.message, severity: "error", typeAlert: "file"})
            console.error("Error ao restaurar arquivo", error)
            throw error;
        }
    }


    useEffect(() => {
        getAllFilesInTrash()
    }, [])

    const handleDeleteFileRtdByNotation = async () => {
        try {
            const data = await rtdSv.deleteRTDByNotation(notation)
            dispatch({type: SET_ALERT, message: data.message, severity: "success", typeAlert: "file"})
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch({type: SET_ALERT, message: error.message, severity: "error", typeAlert: "file"})
            throw error;
        }
        finally {
            getAllFilesInTrash()
        }
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RTD']}>
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
                                        Lixeira - RTD
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
                                <DocList data={data} handleClick={handleOpenMenuOptionsTrash} setNotation={(e) => setNotation(e)} />
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
                    handleClose={handleCloseMenuOptionsTrash}
                    handleDeleteFromTrash={handleDeleteFileRtdByNotation}
                    handleRestoreFromTrash={handleRestoreRtdFromTrash}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRTD)
