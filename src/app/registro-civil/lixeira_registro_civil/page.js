"use client"
import { Box, Button, Typography, Container, Paper } from "@mui/material"
import { ArrowBack, DeleteOutline } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DocListCivil } from "../components/DocListCivil"
import RegistroCivil from "@/services/registroCivil.service"
import Loading from "@/Components/loading"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"

const registroCivilSv = new RegistroCivil()

const LixeiraRegistroCivil = () => {
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const open = Boolean(anchorEl)
    const router = useRouter()

    const handleOpenMenuTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }

    const getData = async () => {
        try {
            setLoading(true)
            const data = await registroCivilSv.getTrash()
            dispatch({ type: SET_ALERT, message: "Dados carregados com sucesso!", severity: "success", context: "file" })
            setRows(Object.values(data))
        } catch (error) {
            dispatch({ type: SET_ALERT, message: "Erro ao carregar dados!", severity: "error", context: "file" })
            console.error("Erro ao pegar arquivos!", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRestoreFromTrash = async () => {
        try {
            await registroCivilSv.restoreById(selectedId)
            dispatch({ type: SET_ALERT, message: "Arquivo restaurado com sucesso!", severity: "success", context: "file" })
            getData()
        } catch (error) {
            dispatch({ type: SET_ALERT, message: "Erro ao restaurar arquivo!", severity: "error", context: "file" })
            console.error("Erro ao restaurar arquivo", error)
        }
    }

    const handleDeleteFromTrash = async () => {
        try {
            await registroCivilSv.dropReal(selectedId)
            dispatch({ type: SET_ALERT, message: "Arquivo deletado com sucesso!", severity: "success", context: "file" })
            getData()
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error)
            dispatch({ type: SET_ALERT, message: "Erro ao deletar arquivo!", severity: "error", context: "file" })
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Registro Civil']}>
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
                                        Lixeira - Registro Civil
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {rows?.length || 0} {rows?.length === 1 ? 'item encontrado' : 'itens encontrados'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Content */}
                        <Paper elevation={0} sx={{
                            borderRadius: 3, border: '1px solid #e5e7eb',
                            overflow: 'hidden', bgcolor: '#fff'
                        }}>
                            {rows && rows.length > 0 ? (
                                <DocListCivil
                                    setSelectedId={(e) => setSelectedId(e)}
                                    data={rows}
                                    handleClick={handleOpenMenuTrash}
                                />
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
                    handleRestoreFromTrash={handleRestoreFromTrash}
                    handleDeleteFromTrash={handleDeleteFromTrash}
                    anchorEl={anchorEl}
                    handleClose={handleCloseMenuTrash}
                    open={open}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraRegistroCivil)
