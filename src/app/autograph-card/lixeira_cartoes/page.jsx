"use client"
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    alpha,
    Container
} from "@mui/material"
import { useState, useEffect } from "react"
import CustomContainer from "@/Components/CustomContainer"
import withAuth from "@/utils/withAuth"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { DocList } from "./TableTrash"
import MenuOptionsFile from "@/Components/ModalOptionsTrash"
import Loading from "@/Components/loading"
import Customer from "@/services/customer.service"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"
import { ArrowLeft, Trash2 } from "lucide-react"

const customerSv = new Customer()

const LixeiraCartoes = () => {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [presenter, setPresenter] = useState("")
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [loading, setLoading] = useState(false)

    const handleOpenMenuTrash = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenuTrash = () => {
        setAnchorEl(null)
    }

    const getAllFilesTrash = async () => {
        try {
            setLoading(true)
            const response = await customerSv.getAutographCardsTrash()
            setData(response || [])
        } catch (error) {
            console.error("Erro ao buscar arquivos da lixeira!", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRestoreFromTrash = async () => {
        try {
            setLoading(true)
            await customerSv.restoreAutographCard(presenter)
            dispatch({ type: SET_ALERT, message: "Cartao restaurado com sucesso!", severity: "success", alertType: "file" })
            getAllFilesTrash()
        } catch (error) {
            dispatch({ type: SET_ALERT, message: "Erro ao restaurar cartao!", severity: "error", alertType: "file" })
            console.error("Erro ao restaurar!", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteFromTrash = async () => {
        try {
            setLoading(true)
            await customerSv.deleteAutographCardPermanently(presenter)
            dispatch({ type: SET_ALERT, message: "Cartao deletado permanentemente!", severity: "success", alertType: "file" })
            getAllFilesTrash()
        } catch (error) {
            dispatch({ type: SET_ALERT, message: "Erro ao deletar cartao!", severity: "error", alertType: "file" })
            console.error("Erro ao deletar!", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllFilesTrash()
    }, [])

    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
                <Box
                    sx={{
                        width: '100%',
                        minHeight: '100vh',
                        backgroundColor: '#f5f5f5',
                        py: { xs: 12, md: 14 },
                        px: { xs: 2, md: 4 }
                    }}
                >
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 4,
                                flexWrap: 'wrap',
                                gap: 2
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
                                    }}
                                >
                                    <Trash2 size={28} color="#fff" />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        color="text.primary"
                                    >
                                        Lixeira
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cartoes de autografo excluidos
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                href="/autograph-card"
                                variant="outlined"
                                startIcon={<ArrowLeft size={18} />}
                                sx={{
                                    borderColor: '#237117',
                                    color: '#237117',
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        borderColor: '#1a5511',
                                        backgroundColor: alpha('#237117', 0.04)
                                    }
                                }}
                            >
                                Voltar
                            </Button>
                        </Box>

                        {/* Tabela */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                overflow: 'hidden',
                                backgroundColor: '#fff'
                            }}
                        >
                            {data.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 8,
                                        color: 'text.secondary'
                                    }}
                                >
                                    <Trash2 size={64} color="#ccc" />
                                    <Typography variant="h6" sx={{ mt: 2, color: '#999' }}>
                                        Lixeira vazia
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Nenhum cartao de autografo na lixeira
                                    </Typography>
                                </Box>
                            ) : (
                                <DocList
                                    data={data}
                                    handleClick={handleOpenMenuTrash}
                                    setPresenter={(e) => setPresenter(e)}
                                />
                            )}
                        </Paper>
                    </Container>
                </Box>

                <MenuOptionsFile
                    open={open}
                    anchorEl={anchorEl}
                    handleClose={handleCloseMenuTrash}
                    handleRestoreFromTrash={handleRestoreFromTrash}
                    handleDeleteFromTrash={handleDeleteFromTrash}
                />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(LixeiraCartoes)
