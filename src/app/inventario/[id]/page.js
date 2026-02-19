"use client"

import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem as MuiMenuItem,
    alpha,
    IconButton,
    Tooltip,
    Avatar,
    Chip,
    Divider
} from '@mui/material'
import {
    Edit,
    SaveAlt,
    ShoppingCart,
    AttachMoney,
    Link as LinkIcon,
    CalendarToday,
    ArrowBack,
    Inventory2,
    Numbers
} from '@mui/icons-material'
import { Package, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import { showAlert } from '@/store/actions'
import { AuthProvider, useAuth } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'
import Loading from '@/Components/loading'
import InventarioService from '@/services/inventario.service'

const inventarioSv = new InventarioService()

const BLUE = '#2563eb'
const DARK_BLUE = '#1d4ed8'
const GREEN = '#247117'

const SETOR_TYPES = {
    recepcao_caixa: "Recepcao/Caixa",
    arquivo: "Arquivo",
    cozinha: "Cozinha",
    sala_rgi: "Sala de Trabalho - RGI",
    sala_notas: "Sala de Trabalho - Notas",
    sala_rtd_protesto_rpj: "Sala de Trabalho - RTD/PROTESTO/RPJ",
    sala_reuniao: "Sala de Reuniao",
    jardim: "Jardim",
    corredor: "Corredor",
    corredor_1_andar: "Corredor 1 Andar",
    sala_ti: "Sala do T.I",
    sala_dra: "Sala da DRA",
}

const initialFormState = {
    num_item: "",
    nome: "",
    item_description: "",
    qtd_total: "",
    valor_unit: "",
    valor_total: "",
    link_ref: "",
    date_purchase: "",
    setor_type: "",
}

const PageEditarItem = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const params = useParams()
    const { permissions } = useAuth()
    const id = params.id

    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState(initialFormState)
    const [itemName, setItemName] = useState('')

    const permIndex = permissions?.findIndex(p => p?.public_name === "Inventario")

    useEffect(() => {
        const loadItem = async () => {
            try {
                setLoading(true)
                const item = await inventarioSv.getItemById(id)
                setItemName(item.nome || '')
                setFormData({
                    num_item: item.num_item || "",
                    nome: item.nome || "",
                    item_description: item.item_description || "",
                    qtd_total: item.qtd_total || "",
                    valor_unit: item.valor_unit || "",
                    valor_total: item.valor_total || "",
                    link_ref: item.link_ref || "",
                    date_purchase: item.date_purchase ? item.date_purchase.split('T')[0] : "",
                    setor_type: item.setor_type || "",
                })
            } catch (error) {
                dispatch(showAlert(error.message, "error", "file"))
                router.push('/inventario')
            } finally {
                setLoading(false)
            }
        }
        if (id) loadItem()
    }, [id])

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => {
            const updated = { ...prev, [name]: value }
            if (name === "qtd_total" || name === "valor_unit") {
                const qtd = name === "qtd_total" ? Number(value) : Number(prev.qtd_total)
                const unit = name === "valor_unit" ? Number(value) : Number(prev.valor_unit)
                updated.valor_total = (qtd * unit).toFixed(2)
            }
            return updated
        })
    }

    const handleEdit = async () => {
        try {
            setLoading(true)
            await inventarioSv.updateItem(id, formData)
            dispatch(showAlert("Item atualizado com sucesso!", "success", "file"))
            router.push('/inventario')
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setLoading(false)
        }
    }

    if (permissions?.[permIndex]?.edit !== 1) {
        return (
            <AuthProvider>
                <PrivateRoute requiredPermissions={['Inventario']}>
                    <Box sx={{ minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" color="text.secondary">Voce nao tem permissao para editar itens.</Typography>
                    </Box>
                </PrivateRoute>
            </AuthProvider>
        )
    }

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Inventario']}>
                <Box sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(180deg, #eff6ff 0%, #fafafa 30%)",
                    py: { xs: 10, md: 12 },
                    px: { xs: 2, md: 3 }
                }}>
                    <Box sx={{ maxWidth: 960, mx: 'auto' }}>

                        {/* Breadcrumb */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, px: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: BLUE, cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                                onClick={() => router.push('/inventario')}
                            >
                                Inventario
                            </Typography>
                            <ChevronRight size={16} color="#999" />
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Editar {itemName ? `- ${itemName}` : 'Item'}
                            </Typography>
                        </Box>

                        {/* Hero Header */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                mb: 3,
                                border: '1px solid',
                                borderColor: alpha(BLUE, 0.15),
                                boxShadow: `0 20px 60px ${alpha(BLUE, 0.08)}`
                            }}
                        >
                            <Box sx={{
                                background: `linear-gradient(135deg, ${BLUE} 0%, #3b82f6 50%, ${DARK_BLUE} 100%)`,
                                color: '#fff',
                                px: { xs: 3, md: 4 },
                                py: { xs: 3, md: 4 },
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Decorative circles */}
                                <Box sx={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                                <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                                <Box sx={{ position: 'absolute', top: 20, right: 200, width: 60, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Avatar sx={{
                                            width: 56, height: 56,
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid rgba(255,255,255,0.2)'
                                        }}>
                                            <Edit sx={{ fontSize: 28 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                                                Editar Item
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                                                {itemName ? `Editando: ${itemName}` : 'Atualize os dados do item selecionado'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Tooltip title="Voltar para o inventario">
                                        <IconButton
                                            onClick={() => router.push('/inventario')}
                                            sx={{
                                                color: '#fff',
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                                            }}
                                        >
                                            <ArrowBack />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* Form Body */}
                            <Box sx={{ px: { xs: 3, md: 4 }, py: 4 }}>

                                {/* Section: Identificacao */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                        <Box sx={{
                                            width: 32, height: 32, borderRadius: 2,
                                            bgcolor: alpha(BLUE, 0.1),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Inventory2 sx={{ fontSize: 18, color: BLUE }} />
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="#1a1a1a">
                                            Identificacao do Item
                                        </Typography>
                                    </Box>

                                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fc', border: '1px solid #e4e8f0' }}>
                                        <Grid container spacing={2.5}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth label="Numero do Item" name="num_item"
                                                    value={formData.num_item} onChange={handleFormChange}
                                                    color="primary" type="number"
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><Numbers sx={{ color: BLUE, fontSize: 20 }} /></InputAdornment> }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    fullWidth label="Nome do Item" name="nome"
                                                    value={formData.nome} onChange={handleFormChange}
                                                    color="primary"
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><Package size={18} color={BLUE} /></InputAdornment> }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControl fullWidth color="primary">
                                                    <InputLabel>Setor</InputLabel>
                                                    <Select name="setor_type" value={formData.setor_type} onChange={handleFormChange} label="Setor">
                                                        {Object.entries(SETOR_TYPES).map(([key, label]) => (
                                                            <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="Descricao do Item" name="item_description"
                                                    value={formData.item_description} onChange={handleFormChange}
                                                    color="primary" multiline rows={3}
                                                    placeholder="Descreva detalhes sobre o item..."
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>

                                {/* Section: Valores */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                        <Box sx={{
                                            width: 32, height: 32, borderRadius: 2,
                                            bgcolor: alpha('#059669', 0.1),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <AttachMoney sx={{ fontSize: 18, color: '#059669' }} />
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="#1a1a1a">
                                            Quantidade e Valores
                                        </Typography>
                                    </Box>

                                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f7faf9', border: '1px solid #e0ede8' }}>
                                        <Grid container spacing={2.5}>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth label="Quantidade Total" name="qtd_total"
                                                    value={formData.qtd_total} onChange={handleFormChange}
                                                    color="success" type="number"
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><ShoppingCart sx={{ color: '#059669', fontSize: 20 }} /></InputAdornment> }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth label="Valor Unitario (R$)" name="valor_unit"
                                                    value={formData.valor_unit} onChange={handleFormChange}
                                                    color="success" type="number"
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#059669', fontSize: 20 }} /></InputAdornment> }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth label="Valor Total (R$)" name="valor_total"
                                                    value={formData.valor_total} onChange={handleFormChange}
                                                    color="success" type="number" disabled
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney sx={{ color: '#059669', fontSize: 20 }} /></InputAdornment> }}
                                                    sx={{ '& .MuiInputBase-root': { bgcolor: alpha('#059669', 0.04) } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>

                                {/* Section: Informacoes Adicionais */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                        <Box sx={{
                                            width: 32, height: 32, borderRadius: 2,
                                            bgcolor: alpha('#7c3aed', 0.1),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <LinkIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="#1a1a1a">
                                            Informacoes Adicionais
                                        </Typography>
                                    </Box>

                                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f9f7fc', border: '1px solid #e8e0f0' }}>
                                        <Grid container spacing={2.5}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Link de Referencia" name="link_ref"
                                                    value={formData.link_ref} onChange={handleFormChange}
                                                    color="secondary" placeholder="https://..."
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment> }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Data de Compra" name="date_purchase"
                                                    value={formData.date_purchase} onChange={handleFormChange}
                                                    color="secondary" type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday sx={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment> }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Actions */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        onClick={() => router.push('/inventario')}
                                        startIcon={<ArrowBack />}
                                        sx={{
                                            color: '#666',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2.5,
                                            px: 3,
                                            py: 1.2,
                                            '&:hover': { bgcolor: '#f5f5f5' }
                                        }}
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleEdit}
                                        startIcon={<SaveAlt />}
                                        size="large"
                                        sx={{
                                            bgcolor: BLUE,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            borderRadius: 2.5,
                                            px: 5,
                                            py: 1.5,
                                            fontSize: '0.95rem',
                                            boxShadow: `0 8px 24px ${alpha(BLUE, 0.35)}`,
                                            '&:hover': {
                                                bgcolor: DARK_BLUE,
                                                boxShadow: `0 12px 32px ${alpha(BLUE, 0.45)}`,
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Salvar Alteracoes
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageEditarItem)
