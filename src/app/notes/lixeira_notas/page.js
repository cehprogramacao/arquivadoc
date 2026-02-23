"use client"
import { Box, Button, Typography, Container, Paper } from "@mui/material"
import { ArrowBack, DeleteOutline } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import Loading from "@/Components/loading"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import NoteService from "@/services/notes.service"
import { DocList } from "./TableTrash"

const noteSv = new NoteService()

const LixeiraNotas = () => {
    const [data, setData] = useState([])
    const [number, setNumber] = useState(0)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const router = useRouter()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const getFetchingFilesFromTrash = async () => {
        try {
            setLoading(true)
            const data = await noteSv.getNotesInTrash()
            dispatch({ type: SET_ALERT, message: "Arquivos da lixeira carregados com sucesso!", severity: "success", alertType: "file" })
            setData(Object.values(data))
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "file" })
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

    const handleRestoreNotesByTrash = async () => {
        try {
            const data = await noteSv.restoreNotesFromTrash(number)
            console.log(data)
            dispatch({ type: SET_ALERT, message: "Arquivo restaurado com sucesso!", severity: "success", alertType: "file" })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "file" })
            console.error("Error restaurar arquivo", error)
            throw error;
        }
    }

    const handleDeleteByNumber = async () => {
        try {
            const response = await noteSv.deleteNoteByNumber(number)
            dispatch({ type: SET_ALERT, message: "Arquivo deletado com sucesso!", severity: "success", alertType: "file" })
            console.log(response)
            return response
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "file" })
            console.error("Error ao deletar arquivo de notas!", error)
            throw error;
        }
        finally {
            getFetchingFilesFromTrash()
        }
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Notas']}>
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
                                        Lixeira - Notas
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
                                <DocList data={data} handleClick={handleClick} setNumber={(e) => setNumber(e)} />
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
                    anchorEl={anchorEl}
                    open={open} handleClose={handleClose}
                    handleRestoreFromTrash={handleRestoreNotesByTrash}
                    handleDeleteFromTrash={handleDeleteByNumber}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraNotas)
