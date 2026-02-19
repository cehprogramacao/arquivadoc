"use client"

import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    Avatar,
    alpha,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem as MuiMenuItem,
    InputAdornment,
    Divider,
    Menu,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from '@mui/material'
import {
    Add,
    Search,
    PictureAsPdf,
    TableChart,
    Edit,
    Delete,
    Inventory2,
    FilterList,
    Close,
    Refresh,
    MoreVert,
    AttachMoney,
    ShoppingCart,
    Category,
    Visibility,
    Link as LinkIcon,
    CalendarToday,
    Description,
    FolderOpen,
    History,
    GetApp
} from '@mui/icons-material'
import {
    Package,
    Warehouse,
    Download
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { SET_ALERT, showAlert } from '@/store/actions'
import { AuthProvider, useAuth } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'
import Loading from '@/Components/loading'
import InventarioService from '@/services/inventario.service'

const inventarioSv = new InventarioService()

const GREEN = '#247117'
const DARK_GREEN = '#1a5c0f'
const LIGHT_GREEN = '#e8f5e3'

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

const SETOR_COLORS = {
    recepcao_caixa: "#2563eb",
    arquivo: "#7c3aed",
    cozinha: "#ea580c",
    sala_rgi: "#059669",
    sala_notas: "#d97706",
    sala_rtd_protesto_rpj: "#dc2626",
    sala_reuniao: "#0891b2",
    jardim: "#16a34a",
    corredor: "#6366f1",
    corredor_1_andar: "#8b5cf6",
    sala_ti: "#0284c7",
    sala_dra: "#be185d",
}

const PageInventario = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { permissions } = useAuth()

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterSetor, setFilterSetor] = useState("todos")

    // Pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Dialog states
    const [openDelete, setOpenDelete] = useState(false)
    const [openExport, setOpenExport] = useState(false)
    const [openPreview, setOpenPreview] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [previewItem, setPreviewItem] = useState(null)
    const [exportSetor, setExportSetor] = useState("todos")
    const [exportLoading, setExportLoading] = useState(false)

    // Menu
    const [anchorEl, setAnchorEl] = useState(null)
    const [menuItem, setMenuItem] = useState(null)

    // Files section
    const [filesData, setFilesData] = useState([])
    const [filesLoading, setFilesLoading] = useState(false)
    const [fileFilterSetor, setFileFilterSetor] = useState("todos")
    const [fileFilterType, setFileFilterType] = useState("todos")
    const [fileFilterDateFrom, setFileFilterDateFrom] = useState("")
    const [fileFilterDateTo, setFileFilterDateTo] = useState("")
    const [openPdfViewer, setOpenPdfViewer] = useState(false)
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
    const [pdfViewerTitle, setPdfViewerTitle] = useState("")
    const [pdfViewerLoading, setPdfViewerLoading] = useState(false)
    const [openDeleteFile, setOpenDeleteFile] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    // Permission index for inventario
    const permIndex = permissions?.findIndex(p => p?.public_name === "Inventario")

    /* ===================== DATA ===================== */

    const getData = async () => {
        try {
            setLoading(true)
            const response = await inventarioSv.getAllItems()
            const items = Object.values(response)
            setData(items)
            setFilteredData(items)
            dispatch({
                type: SET_ALERT,
                message: `Foram encontrados ${items.length} itens no inventario`,
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setLoading(false)
        }
    }

    const getFilesData = async () => {
        try {
            setFilesLoading(true)
            const setor = fileFilterSetor !== "todos" ? fileFilterSetor : ""
            const fileType = fileFilterType !== "todos" ? fileFilterType : ""
            const response = await inventarioSv.getFiles(setor, fileType, fileFilterDateFrom, fileFilterDateTo)
            setFilesData(Array.isArray(response) ? response : [])
        } catch (error) {
            console.log("Erro ao buscar arquivos:", error)
        } finally {
            setFilesLoading(false)
        }
    }

    useEffect(() => {
        getData()
        getFilesData()
    }, [])

    /* ===================== FILTERS ===================== */

    useEffect(() => {
        let filtered = [...data]

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(item =>
                (item.nome && item.nome.toLowerCase().includes(term)) ||
                (item.num_item && String(item.num_item).includes(term)) ||
                (item.item_description && item.item_description.toLowerCase().includes(term))
            )
        }

        if (filterSetor !== "todos") {
            filtered = filtered.filter(item => item.setor_type === filterSetor)
        }

        setFilteredData(filtered)
        setPage(0)
    }, [searchTerm, filterSetor, data])

    useEffect(() => {
        getFilesData()
    }, [fileFilterSetor, fileFilterType, fileFilterDateFrom, fileFilterDateTo])

    /* ===================== FILES ACTIONS ===================== */

    const handleViewPdf = async (file) => {
        try {
            setPdfViewerLoading(true)
            setOpenPdfViewer(true)
            setPdfViewerTitle(getFileName(file.file_url_inventario))
            const response = await inventarioSv.getFileContent(file.id)
            const byteCharacters = atob(response.file)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            setPdfBlobUrl(url)
        } catch (error) {
            dispatch(showAlert("Erro ao carregar o PDF.", "error", "file"))
            setOpenPdfViewer(false)
        } finally {
            setPdfViewerLoading(false)
        }
    }

    const handleDownloadFile = async (file) => {
        try {
            const response = await inventarioSv.getFileContent(file.id)
            const byteCharacters = atob(response.file)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const mimeType = file.file_type === 'pdf'
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            const blob = new Blob([byteArray], { type: mimeType })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = response.fileName
            link.click()
            URL.revokeObjectURL(url)
            dispatch(showAlert("Download iniciado!", "success", "file"))
        } catch (error) {
            dispatch(showAlert("Erro ao baixar o arquivo.", "error", "file"))
        }
    }

    const handleDeleteFile = async () => {
        try {
            await inventarioSv.deleteFile(selectedFile.id)
            dispatch(showAlert("Arquivo excluido com sucesso!", "success", "file"))
            setOpenDeleteFile(false)
            setSelectedFile(null)
            getFilesData()
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        }
    }

    const closePdfViewer = () => {
        setOpenPdfViewer(false)
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl)
            setPdfBlobUrl(null)
        }
    }

    const getFileName = (filePath) => {
        if (!filePath) return 'Sem nome'
        return filePath.split('\\').pop().split('/').pop()
    }

    /* ===================== CRUD ===================== */

    const handleDelete = async () => {
        try {
            setLoading(true)
            await inventarioSv.deleteItem(selectedItem.id)
            dispatch(showAlert("Item excluido com sucesso!", "success", "file"))
            setOpenDelete(false)
            setSelectedItem(null)
            getData()
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setLoading(false)
        }
    }

    const openDeleteDialog = (item) => {
        setSelectedItem(item)
        setOpenDelete(true)
        setAnchorEl(null)
    }

    const openPreviewDialog = (item) => {
        setPreviewItem(item)
        setOpenPreview(true)
        setAnchorEl(null)
    }

    /* ===================== EXPORT ===================== */

    const handleGeneratePDF = async () => {
        try {
            setExportLoading(true)
            const response = await inventarioSv.generatePDF(exportSetor)

            const byteCharacters = atob(response.file)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = response.fileName
            link.click()
            URL.revokeObjectURL(url)

            dispatch(showAlert(response.message, "success", "file"))
            getFilesData()
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setExportLoading(false)
        }
    }

    const handleGenerateExcel = async () => {
        try {
            setExportLoading(true)
            const response = await inventarioSv.generateExcel(exportSetor)

            const byteCharacters = atob(response.file)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = response.fileName
            link.click()
            URL.revokeObjectURL(url)

            dispatch(showAlert(response.message, "success", "file"))
            getFilesData()
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
        } finally {
            setExportLoading(false)
        }
    }

    /* ===================== STATS ===================== */

    const totalItems = data.length
    const totalQtd = data.reduce((acc, item) => acc + (Number(item.qtd_total) || 0), 0)
    const totalValue = data.reduce((acc, item) => acc + (Number(item.valor_total) || 0), 0)
    const totalSetores = [...new Set(data.map(item => item.setor_type).filter(Boolean))].length

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Inventario']}>
                <Box sx={{
                    minHeight: "100vh",
                    background: "#fafafa",
                    py: { xs: 10, md: 12 },
                    px: { xs: 2, md: 3 }
                }}>
                    {/* ========== HEADER ========== */}
                    <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 4
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Box sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 8px 24px ${alpha(GREEN, 0.3)}`
                                }}>
                                    <Warehouse size={30} color="#fff" />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{ color: '#1a1a1a', fontSize: { xs: '1.5rem', md: '2rem' } }}
                                    >
                                        Inventario Patrimonial
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Gestao completa do patrimonio da empresa
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Tooltip title="Atualizar">
                                    <IconButton
                                        onClick={getData}
                                        sx={{
                                            bgcolor: alpha(GREEN, 0.1),
                                            '&:hover': { bgcolor: alpha(GREEN, 0.15) }
                                        }}
                                    >
                                        <Refresh sx={{ color: GREEN }} />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    variant="outlined"
                                    startIcon={<Download size={18} />}
                                    onClick={() => setOpenExport(true)}
                                    sx={{
                                        borderColor: GREEN,
                                        color: GREEN,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: DARK_GREEN,
                                            bgcolor: alpha(GREEN, 0.05)
                                        }
                                    }}
                                >
                                    Exportar
                                </Button>
                                {permissions?.[permIndex]?.create_permission === 1 && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => router.push('/inventario/novo')}
                                        sx={{
                                            bgcolor: GREEN,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            boxShadow: `0 4px 14px ${alpha(GREEN, 0.4)}`,
                                            '&:hover': {
                                                bgcolor: DARK_GREEN,
                                                boxShadow: `0 6px 20px ${alpha(GREEN, 0.5)}`
                                            }
                                        }}
                                    >
                                        Novo Item
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {/* ========== STATS CARDS ========== */}
                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            <Grid item xs={6} sm={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                                        color: '#fff',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'absolute', top: -20, right: -20,
                                        width: 80, height: 80,
                                        background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
                                    }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Inventory2 sx={{ fontSize: 20, opacity: 0.9 }} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Itens</Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight={700}>{totalItems}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5, borderRadius: 3,
                                        border: '1px solid #e5e7eb', bgcolor: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <ShoppingCart sx={{ fontSize: 20, color: '#2563eb' }} />
                                        <Typography variant="body2" color="text.secondary">Quantidade</Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight={700} color="#2563eb">{totalQtd}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5, borderRadius: 3,
                                        border: '1px solid #e5e7eb', bgcolor: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AttachMoney sx={{ fontSize: 20, color: '#059669' }} />
                                        <Typography variant="body2" color="text.secondary">Valor Total</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight={700} color="#059669">
                                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5, borderRadius: 3,
                                        border: '1px solid #e5e7eb', bgcolor: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Category sx={{ fontSize: 20, color: '#7c3aed' }} />
                                        <Typography variant="body2" color="text.secondary">Setores</Typography>
                                    </Box>
                                    <Typography variant="h4" fontWeight={700} color="#7c3aed">{totalSetores}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* ========== FILTERS ========== */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 3,
                                border: '1px solid #e5e7eb',
                                mb: 3,
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            <TextField
                                placeholder="Buscar por nome, numero ou descricao..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                color="success"
                                size="small"
                                sx={{ flex: 1, minWidth: 250 }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search sx={{ color: '#999' }} /></InputAdornment>
                                }}
                            />
                            <FormControl size="small" color="success" sx={{ minWidth: 220 }}>
                                <InputLabel>Filtrar por Setor</InputLabel>
                                <Select
                                    value={filterSetor}
                                    onChange={(e) => setFilterSetor(e.target.value)}
                                    label="Filtrar por Setor"
                                    startAdornment={<InputAdornment position="start"><FilterList sx={{ color: '#999', fontSize: 20 }} /></InputAdornment>}
                                >
                                    <MuiMenuItem value="todos">Todos os Setores</MuiMenuItem>
                                    {Object.entries(SETOR_TYPES).map(([key, label]) => (
                                        <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Chip
                                label={`${filteredData.length} resultado(s)`}
                                size="small"
                                sx={{
                                    bgcolor: alpha(GREEN, 0.1),
                                    color: GREEN,
                                    fontWeight: 600
                                }}
                            />
                        </Paper>

                        {/* ========== TABLE ========== */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden'
                            }}
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: GREEN }}>
                                            {['#', 'N. Item', 'Nome', 'Descricao', 'Setor', 'Qtd', 'Valor Unit.', 'Valor Total', 'Data Compra', 'Acoes'].map((header) => (
                                                <TableCell
                                                    key={header}
                                                    sx={{
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                        borderBottom: 'none',
                                                        py: 2
                                                    }}
                                                    align={['Qtd', 'Valor Unit.', 'Valor Total', 'Acoes'].includes(header) ? 'center' : 'left'}
                                                >
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 1.5
                                                    }}>
                                                        <Avatar sx={{
                                                            width: 64, height: 64,
                                                            bgcolor: alpha(GREEN, 0.1)
                                                        }}>
                                                            <Package size={32} color={GREEN} />
                                                        </Avatar>
                                                        <Typography variant="h6" color="text.secondary">
                                                            Nenhum item encontrado
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Cadastre um novo item para comecar
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredData
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((item, index) => {
                                                    const setorColor = SETOR_COLORS[item.setor_type] || GREEN

                                                    return (
                                                        <TableRow
                                                            key={item.id}
                                                            hover
                                                            sx={{
                                                                bgcolor: index % 2 === 0 ? '#fff' : LIGHT_GREEN,
                                                                '&:hover': {
                                                                    bgcolor: alpha(GREEN, 0.06),
                                                                },
                                                                transition: 'background-color 0.2s ease'
                                                            }}
                                                        >
                                                            <TableCell sx={{ fontWeight: 600, color: '#666', width: 50 }}>
                                                                {page * rowsPerPage + index + 1}
                                                            </TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>
                                                                {item.num_item}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <Avatar sx={{
                                                                        width: 36, height: 36,
                                                                        bgcolor: alpha(setorColor, 0.1),
                                                                        color: setorColor
                                                                    }}>
                                                                        <Package size={16} />
                                                                    </Avatar>
                                                                    <Typography variant="body2" fontWeight={600}>
                                                                        {item.nome}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" color="text.secondary" sx={{
                                                                    maxWidth: 200,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    {item.item_description || '-'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={SETOR_TYPES[item.setor_type] || item.setor_type || '-'}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: alpha(setorColor, 0.1),
                                                                        color: setorColor,
                                                                        fontWeight: 600,
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={item.qtd_total || 0}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: alpha('#2563eb', 0.1),
                                                                        color: '#2563eb',
                                                                        fontWeight: 700,
                                                                        minWidth: 40
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    R$ {Number(item.valor_unit || 0).toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" fontWeight={700} color={GREEN}>
                                                                    R$ {Number(item.valor_total || 0).toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {item.date_purchase
                                                                        ? new Date(item.date_purchase).toLocaleDateString('pt-BR')
                                                                        : '-'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        setAnchorEl(e.currentTarget)
                                                                        setMenuItem(item)
                                                                    }}
                                                                >
                                                                    <MoreVert sx={{ fontSize: 20 }} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredData.length}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10))
                                    setPage(0)
                                }}
                                labelRowsPerPage="Itens por pagina:"
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                            />
                        </Paper>
                    </Box>

                    {/* ========== CONTEXT MENU ========== */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                minWidth: 180
                            }
                        }}
                    >
                        <MuiMenuItem onClick={() => menuItem && openPreviewDialog(menuItem)}>
                            <ListItemIcon><Visibility sx={{ color: '#7c3aed', fontSize: 20 }} /></ListItemIcon>
                            <ListItemText>Visualizar</ListItemText>
                        </MuiMenuItem>
                        {permissions?.[permIndex]?.edit === 1 && (
                            <MuiMenuItem onClick={() => {
                                if (menuItem) {
                                    setAnchorEl(null)
                                    router.push(`/inventario/${menuItem.id}`)
                                }
                            }}>
                                <ListItemIcon><Edit sx={{ color: '#2563eb', fontSize: 20 }} /></ListItemIcon>
                                <ListItemText>Editar</ListItemText>
                            </MuiMenuItem>
                        )}
                        {permissions?.[permIndex]?.delete_permission === 1 && (
                            <MuiMenuItem onClick={() => menuItem && openDeleteDialog(menuItem)}>
                                <ListItemIcon><Delete sx={{ color: '#dc2626', fontSize: 20 }} /></ListItemIcon>
                                <ListItemText>Excluir</ListItemText>
                            </MuiMenuItem>
                        )}
                    </Menu>

                    {/* ========== PREVIEW DIALOG ========== */}
                    <Dialog
                        open={openPreview}
                        onClose={() => setOpenPreview(false)}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
                                maxHeight: '90vh'
                            }
                        }}
                    >
                        {previewItem && (
                            <>
                                <Box sx={{
                                    background: `#247117`,
                                    color: '#fff',
                                    px: { xs: 3, md: 4 },
                                    py: 2,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '120px'
                                }}>
                                    <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                                    <Box sx={{ position: 'absolute', bottom: -40, right: 60, width: 150, height: 150, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                            <Avatar sx={{
                                                width: 52, height: 52,
                                                bgcolor: 'rgba(255,255,255,0.15)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid rgba(255,255,255,0.2)'
                                            }}>
                                                <Package size={26} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                                                    {previewItem.nome || 'Sem nome'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                                                    <Chip
                                                        label={`#${previewItem.num_item || '-'}`}
                                                        size="small"
                                                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}
                                                    />
                                                    <Chip
                                                        label={SETOR_TYPES[previewItem.setor_type] || 'Sem setor'}
                                                        size="small"
                                                        sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.7rem' }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            onClick={() => setOpenPreview(false)}
                                            sx={{
                                                color: '#fff',
                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <DialogContent sx={{ p: 0 }}>
                                    {/* Cards de informacoes */}
                                    <Box sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
                                        <Grid container spacing={2}>
                                            {/* Quantidade */}
                                            <Grid item xs={6} sm={3}>
                                                <Paper elevation={0} sx={{
                                                    p: 2, borderRadius: 3,
                                                    border: '1px solid #e5e7eb',
                                                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                                    textAlign: 'center',
                                                    transition: 'transform 0.2s ease',
                                                    '&:hover': { transform: 'translateY(-2px)' }
                                                }}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: 2, mx: 'auto', mb: 1,
                                                        bgcolor: alpha('#2563eb', 0.1),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <ShoppingCart sx={{ fontSize: 18, color: '#2563eb' }} />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                                                        Quantidade
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight={800} color="#2563eb" sx={{ mt: 0.5 }}>
                                                        {previewItem.qtd_total || 0}
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            {/* Valor Unitario */}
                                            <Grid item xs={6} sm={3}>
                                                <Paper elevation={0} sx={{
                                                    p: 2, borderRadius: 3,
                                                    border: '1px solid #e5e7eb',
                                                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                                    textAlign: 'center',
                                                    transition: 'transform 0.2s ease',
                                                    '&:hover': { transform: 'translateY(-2px)' }
                                                }}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: 2, mx: 'auto', mb: 1,
                                                        bgcolor: alpha('#059669', 0.1),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <AttachMoney sx={{ fontSize: 18, color: '#059669' }} />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                                                        Valor Unit.
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={800} color="#059669" sx={{ mt: 0.5 }}>
                                                        R$ {Number(previewItem.valor_unit || 0).toFixed(2)}
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            {/* Valor Total */}
                                            <Grid item xs={6} sm={3}>
                                                <Paper elevation={0} sx={{
                                                    p: 2, borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: alpha(GREEN, 0.2),
                                                    background: `linear-gradient(135deg, ${alpha(GREEN, 0.05)} 0%, ${alpha(GREEN, 0.1)} 100%)`,
                                                    textAlign: 'center',
                                                    transition: 'transform 0.2s ease',
                                                    '&:hover': { transform: 'translateY(-2px)' }
                                                }}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: 2, mx: 'auto', mb: 1,
                                                        bgcolor: alpha(GREEN, 0.15),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <AttachMoney sx={{ fontSize: 18, color: GREEN }} />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                                                        Valor Total
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={800} color={GREEN} sx={{ mt: 0.5 }}>
                                                        R$ {Number(previewItem.valor_total || 0).toFixed(2)}
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            {/* Data Compra */}
                                            <Grid item xs={6} sm={3}>
                                                <Paper elevation={0} sx={{
                                                    p: 2, borderRadius: 3,
                                                    border: '1px solid #e5e7eb',
                                                    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                                                    textAlign: 'center',
                                                    transition: 'transform 0.2s ease',
                                                    '&:hover': { transform: 'translateY(-2px)' }
                                                }}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: 2, mx: 'auto', mb: 1,
                                                        bgcolor: alpha('#7c3aed', 0.1),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <CalendarToday sx={{ fontSize: 16, color: '#7c3aed' }} />
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                                                        Data Compra
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight={700} color="#7c3aed" sx={{ mt: 0.5 }}>
                                                        {previewItem.date_purchase
                                                            ? new Date(previewItem.date_purchase).toLocaleDateString('pt-BR')
                                                            : '-'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        {/* Descricao */}
                                        {previewItem.item_description && (
                                            <Paper elevation={0} sx={{
                                                p: 2.5, mt: 2, borderRadius: 3,
                                                border: '1px solid #e5e7eb', bgcolor: '#fafafa'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Description sx={{ fontSize: 18, color: '#666' }} />
                                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Descricao
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                                    {previewItem.item_description}
                                                </Typography>
                                            </Paper>
                                        )}

                                        {/* Link de referencia clicavel */}
                                        {previewItem.link_ref && (
                                            <Paper
                                                elevation={0}
                                                onClick={() => window.open(previewItem.link_ref, '_blank')}
                                                sx={{
                                                    p: 2, mt: 2, borderRadius: 3,
                                                    border: '1px solid',
                                                    borderColor: alpha('#2563eb', 0.2),
                                                    bgcolor: alpha('#2563eb', 0.03),
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: 2,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: alpha('#2563eb', 0.06),
                                                        borderColor: alpha('#2563eb', 0.3),
                                                        transform: 'translateY(-1px)'
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    width: 36, height: 36, borderRadius: 2,
                                                    bgcolor: alpha('#2563eb', 0.1),
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <LinkIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                                                </Box>
                                                <Box sx={{ overflow: 'hidden' }}>
                                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Link de Referencia
                                                    </Typography>
                                                    <Typography variant="body2" color="#2563eb" fontWeight={600} sx={{
                                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                    }}>
                                                        {previewItem.link_ref}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        )}
                                    </Box>

                                    <Divider />

                                    {/* Iframe do link de referencia */}
                                    <Box sx={{ px: { xs: 3, md: 4 }, py: 3, bgcolor: '#f9fafb' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <Box sx={{
                                                width: 32, height: 32, borderRadius: 2,
                                                bgcolor: alpha('#7c3aed', 0.1),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Visibility sx={{ fontSize: 18, color: '#7c3aed' }} />
                                            </Box>
                                            <Typography variant="subtitle1" fontWeight={700} color="#1a1a1a">
                                                Preview do Link
                                            </Typography>
                                        </Box>

                                        {previewItem.link_ref ? (
                                            <Box sx={{
                                                border: '2px solid #e5e7eb',
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                height: 420,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                                bgcolor: '#fff'
                                            }}>
                                                <iframe
                                                    src={previewItem.link_ref}
                                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                                    title="Preview do produto"
                                                    sandbox="allow-scripts allow-same-origin allow-popups"
                                                />
                                            </Box>
                                        ) : (
                                            <Paper elevation={0} sx={{
                                                border: '2px dashed #d1d5db',
                                                borderRadius: 3,
                                                p: 5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 2,
                                                bgcolor: '#fff'
                                            }}>
                                                <Avatar sx={{
                                                    width: 64, height: 64,
                                                    bgcolor: alpha('#9ca3af', 0.1)
                                                }}>
                                                    <LinkIcon sx={{ color: '#9ca3af', fontSize: 32 }} />
                                                </Avatar>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h6" color="text.secondary" fontWeight={700} sx={{ mb: 0.5 }}>
                                                        Sem link de referencia
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Este item nao possui um link de referencia cadastrado.
                                                        Edite o item para adicionar um link.
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        )}
                                    </Box>
                                </DialogContent>
                            </>
                        )}
                    </Dialog>

                    {/* ========== DELETE DIALOG ========== */}
                    <Dialog
                        open={openDelete}
                        onClose={() => setOpenDelete(false)}
                        maxWidth="xs"
                        fullWidth
                        PaperProps={{ sx: { borderRadius: 3 } }}
                    >
                        <DialogTitle sx={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Delete />
                            <Typography variant="h6" fontWeight={700}>Confirmar Exclusao</Typography>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, mt: 1 }}>
                            <Typography>
                                Tem certeza que deseja excluir o item{' '}
                                <strong>{selectedItem?.nome}</strong>?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Esta acao nao pode ser desfeita.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button onClick={() => setOpenDelete(false)} sx={{ color: '#666', textTransform: 'none' }}>
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleDelete}
                                sx={{
                                    bgcolor: '#dc2626',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: '#b91c1c' }
                                }}
                            >
                                Excluir
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ========== EXPORT DIALOG ========== */}
                    <Dialog
                        open={openExport}
                        onClose={() => setOpenExport(false)}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{ sx: { borderRadius: 3 } }}
                    >
                        <DialogTitle sx={{
                            background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Download size={22} />
                                <Typography variant="h6" fontWeight={700}>Exportar Inventario</Typography>
                            </Box>
                            <IconButton onClick={() => setOpenExport(false)} sx={{ color: '#fff' }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Selecione o setor e o formato de exportacao. O arquivo sera salvo
                                automaticamente na pasta do setor selecionado.
                            </Typography>

                            <FormControl fullWidth color="success" sx={{ mb: 3 }}>
                                <InputLabel>Setor</InputLabel>
                                <Select
                                    value={exportSetor}
                                    onChange={(e) => setExportSetor(e.target.value)}
                                    label="Setor"
                                >
                                    <MuiMenuItem value="todos">Todos os Setores</MuiMenuItem>
                                    {Object.entries(SETOR_TYPES).map(([key, label]) => (
                                        <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            border: '2px solid',
                                            borderColor: '#e5e7eb',
                                            borderRadius: 3,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#dc2626',
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 24px ${alpha('#dc2626', 0.15)}`
                                            }
                                        }}
                                        onClick={handleGeneratePDF}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            py: 3
                                        }}>
                                            <Avatar sx={{
                                                width: 56, height: 56,
                                                bgcolor: alpha('#dc2626', 0.1)
                                            }}>
                                                <PictureAsPdf sx={{ color: '#dc2626', fontSize: 28 }} />
                                            </Avatar>
                                            <Typography variant="h6" fontWeight={700} color="#dc2626">
                                                PDF
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" textAlign="center">
                                                Gerar relatorio em PDF
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={6}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            border: '2px solid',
                                            borderColor: '#e5e7eb',
                                            borderRadius: 3,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#059669',
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 24px ${alpha('#059669', 0.15)}`
                                            }
                                        }}
                                        onClick={handleGenerateExcel}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            py: 3
                                        }}>
                                            <Avatar sx={{
                                                width: 56, height: 56,
                                                bgcolor: alpha('#059669', 0.1)
                                            }}>
                                                <TableChart sx={{ color: '#059669', fontSize: 28 }} />
                                            </Avatar>
                                            <Typography variant="h6" fontWeight={700} color="#059669">
                                                Excel
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" textAlign="center">
                                                Gerar planilha Excel
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {exportLoading && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" color={GREEN} fontWeight={600}>
                                        Gerando arquivo...
                                    </Typography>
                                </Box>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* ========== HISTORICO DE ARQUIVOS ========== */}
                    <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header */}
                            <Box sx={{
                                background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                                px: 3,
                                py: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{
                                        width: 42, height: 42,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <History sx={{ fontSize: 22 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700} color="#fff">
                                            Historico de Arquivos
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                            PDFs e planilhas gerados pelo inventario
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    label={`${filesData.length} arquivo(s)`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        color: '#fff',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>

                            {/* Filters */}
                            <Box sx={{
                                px: 3,
                                py: 2,
                                bgcolor: '#f9fafb',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                    <InputLabel>Setor</InputLabel>
                                    <Select
                                        value={fileFilterSetor}
                                        onChange={(e) => setFileFilterSetor(e.target.value)}
                                        label="Setor"
                                    >
                                        <MuiMenuItem value="todos">Todos os Setores</MuiMenuItem>
                                        {Object.entries(SETOR_TYPES).map(([key, label]) => (
                                            <MuiMenuItem key={key} value={key}>{label}</MuiMenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={fileFilterType}
                                        onChange={(e) => setFileFilterType(e.target.value)}
                                        label="Tipo"
                                    >
                                        <MuiMenuItem value="todos">Todos</MuiMenuItem>
                                        <MuiMenuItem value="pdf">PDF</MuiMenuItem>
                                        <MuiMenuItem value="xlsx">Excel</MuiMenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    type="date"
                                    size="small"
                                    label="Data de"
                                    value={fileFilterDateFrom}
                                    onChange={(e) => setFileFilterDateFrom(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minWidth: 150 }}
                                />

                                <TextField
                                    type="date"
                                    size="small"
                                    label="Data ate"
                                    value={fileFilterDateTo}
                                    onChange={(e) => setFileFilterDateTo(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minWidth: 150 }}
                                />

                                {(fileFilterSetor !== "todos" || fileFilterType !== "todos" || fileFilterDateFrom || fileFilterDateTo) && (
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            setFileFilterSetor("todos")
                                            setFileFilterType("todos")
                                            setFileFilterDateFrom("")
                                            setFileFilterDateTo("")
                                        }}
                                        sx={{ color: GREEN, textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Limpar filtros
                                    </Button>
                                )}
                            </Box>

                            {/* Files Table */}
                            {filesLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                    <CircularProgress sx={{ color: GREEN }} />
                                </Box>
                            ) : filesData.length === 0 ? (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    py: 6
                                }}>
                                    <Avatar sx={{
                                        width: 64, height: 64,
                                        bgcolor: alpha(GREEN, 0.1)
                                    }}>
                                        <FolderOpen sx={{ fontSize: 32, color: GREEN }} />
                                    </Avatar>
                                    <Typography variant="h6" color="text.secondary">
                                        Nenhum arquivo gerado
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gere um PDF ou Excel para visualizar aqui
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                                                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem' }}>Nome do Arquivo</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem' }} align="center">Tipo</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem' }}>Setor</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem' }}>Data de Geracao</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem' }} align="center">Acoes</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filesData.map((file, index) => (
                                                <TableRow
                                                    key={file.id}
                                                    hover
                                                    sx={{
                                                        bgcolor: index % 2 === 0 ? '#fff' : LIGHT_GREEN,
                                                        '&:hover': { bgcolor: alpha(GREEN, 0.06) },
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar sx={{
                                                                width: 36, height: 36,
                                                                bgcolor: file.file_type === 'pdf'
                                                                    ? alpha('#dc2626', 0.1)
                                                                    : alpha('#059669', 0.1)
                                                            }}>
                                                                {file.file_type === 'pdf'
                                                                    ? <PictureAsPdf sx={{ fontSize: 18, color: '#dc2626' }} />
                                                                    : <TableChart sx={{ fontSize: 18, color: '#059669' }} />
                                                                }
                                                            </Avatar>
                                                            <Typography variant="body2" fontWeight={600} sx={{
                                                                maxWidth: 300,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}>
                                                                {getFileName(file.file_url_inventario)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={file.file_type === 'pdf' ? 'PDF' : 'Excel'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: file.file_type === 'pdf'
                                                                    ? alpha('#dc2626', 0.1)
                                                                    : alpha('#059669', 0.1),
                                                                color: file.file_type === 'pdf' ? '#dc2626' : '#059669',
                                                                fontWeight: 700,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={file.setor_type === 'todos'
                                                                ? 'Todos'
                                                                : (SETOR_TYPES[file.setor_type] || file.setor_type)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(SETOR_COLORS[file.setor_type] || GREEN, 0.1),
                                                                color: SETOR_COLORS[file.setor_type] || GREEN,
                                                                fontWeight: 600,
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {file.created_at
                                                                ? new Date(file.created_at).toLocaleDateString('pt-BR') + ' ' +
                                                                  new Date(file.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                                                : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                            {file.file_type === 'pdf' && (
                                                                <Tooltip title="Visualizar PDF">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleViewPdf(file)}
                                                                        sx={{
                                                                            bgcolor: alpha(GREEN, 0.1),
                                                                            '&:hover': { bgcolor: alpha(GREEN, 0.2) }
                                                                        }}
                                                                    >
                                                                        <Visibility sx={{ fontSize: 18, color: GREEN }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            <Tooltip title="Baixar">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDownloadFile(file)}
                                                                    sx={{
                                                                        bgcolor: alpha('#2563eb', 0.1),
                                                                        '&:hover': { bgcolor: alpha('#2563eb', 0.2) }
                                                                    }}
                                                                >
                                                                    <GetApp sx={{ fontSize: 18, color: '#2563eb' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            {permissions?.[permIndex]?.delete_permission === 1 && (
                                                                <Tooltip title="Excluir arquivo">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setSelectedFile(file)
                                                                            setOpenDeleteFile(true)
                                                                        }}
                                                                        sx={{
                                                                            bgcolor: alpha('#dc2626', 0.1),
                                                                            '&:hover': { bgcolor: alpha('#dc2626', 0.2) }
                                                                        }}
                                                                    >
                                                                        <Delete sx={{ fontSize: 18, color: '#dc2626' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Box>

                    {/* ========== PDF VIEWER DIALOG ========== */}
                    <Dialog
                        open={openPdfViewer}
                        onClose={closePdfViewer}
                        maxWidth="lg"
                        fullWidth
                        PaperProps={{
                            sx: {
                                borderRadius: 4,
                                overflow: 'hidden',
                                height: '90vh',
                                maxHeight: '90vh'
                            }
                        }}
                    >
                        <Box sx={{
                            background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                            px: 3,
                            py: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{
                                    width: 40, height: 40,
                                    bgcolor: 'rgba(255,255,255,0.15)'
                                }}>
                                    <PictureAsPdf sx={{ fontSize: 20 }} />
                                </Avatar>
                                <Typography variant="h6" fontWeight={700} color="#fff" sx={{
                                    maxWidth: 500,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {pdfViewerTitle}
                                </Typography>
                            </Box>
                            <IconButton onClick={closePdfViewer} sx={{ color: '#fff' }}>
                                <Close />
                            </IconButton>
                        </Box>
                        <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {pdfViewerLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <CircularProgress sx={{ color: GREEN }} />
                                </Box>
                            ) : pdfBlobUrl ? (
                                <iframe
                                    src={pdfBlobUrl}
                                    style={{ width: '100%', flex: 1, border: 'none' }}
                                    title="Visualizador de PDF"
                                />
                            ) : null}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e5e7eb' }}>
                            <Button
                                onClick={closePdfViewer}
                                sx={{ color: '#666', textTransform: 'none' }}
                            >
                                Fechar
                            </Button>
                            {pdfBlobUrl && (
                                <Button
                                    variant="contained"
                                    startIcon={<GetApp />}
                                    onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = pdfBlobUrl
                                        link.download = pdfViewerTitle
                                        link.click()
                                    }}
                                    sx={{
                                        bgcolor: GREEN,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: DARK_GREEN }
                                    }}
                                >
                                    Baixar PDF
                                </Button>
                            )}
                        </DialogActions>
                    </Dialog>

                    {/* ========== DELETE FILE DIALOG ========== */}
                    <Dialog
                        open={openDeleteFile}
                        onClose={() => setOpenDeleteFile(false)}
                        maxWidth="xs"
                        fullWidth
                        PaperProps={{ sx: { borderRadius: 3 } }}
                    >
                        <DialogTitle sx={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Delete />
                            <Typography variant="h6" fontWeight={700}>Excluir Arquivo</Typography>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 3, mt: 1 }}>
                            <Typography>
                                Tem certeza que deseja excluir o arquivo{' '}
                                <strong>{selectedFile ? getFileName(selectedFile.file_url_inventario) : ''}</strong>?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                O arquivo sera removido permanentemente do servidor.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <Button onClick={() => setOpenDeleteFile(false)} sx={{ color: '#666', textTransform: 'none' }}>
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleDeleteFile}
                                sx={{
                                    bgcolor: '#dc2626',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: '#b91c1c' }
                                }}
                            >
                                Excluir
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageInventario)
