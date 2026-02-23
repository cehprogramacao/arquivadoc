"use client"
import {
    Box,
    Container,
    Drawer,
    TextField,
    Typography,
    Grid,
    Stack,
    Autocomplete,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    useMediaQuery,
    useTheme,
    Chip,
    Tooltip,
    Paper,
    Collapse,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Close,
    GetApp,
    Print,
    Edit,
    Delete,
    PictureAsPdf,
    Description,
    Visibility,
    FilterList,
    FilterListOff,
    Search,
    Clear
} from '@mui/icons-material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { DocListCivil } from './components/DocListCivil';
import { CadastroModalRegistroCivil } from '@/Components/Modals/ModalCadastroRegistroCivil';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegistroCivil from '@/services/registroCivil.service';
import { useDispatch } from 'react-redux';
import Loading from '@/Components/loading';
import MenuOptionsFile from '@/Components/MenuPopUp';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import withAuth from '@/utils/withAuth';
import { SET_ALERT } from '@/store/actions';
import Link from 'next/link';

const registroCivilSv = new RegistroCivil();

const GREEN = '#237117';
const DARK_GREEN = '#1a5511';

const PageRegistroCivil = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [filters, setFilters] = useState({
        nome: "",
        tipo: "",
        status: "",
        data_inicio: "",
        data_fim: "",
        livro: "",
        folha: "",
        termo: ""
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [tipos, setTipos] = useState([]);

    const [isAdmin, setIsAdmin] = useState("");
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { permissions } = useAuth();

    // PDF Viewer state
    const [openPdfViewer, setOpenPdfViewer] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfViewerLoading, setPdfViewerLoading] = useState(false);
    const [pdfViewerTitle, setPdfViewerTitle] = useState("");
    const [pdfViewerData, setPdfViewerData] = useState(null);

    const handleClickMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenModalPDF = async () => {
        if (!selectedId) return;
        try {
            setPdfViewerLoading(true);
            setOpenPdfViewer(true);
            setPdfViewerTitle("");
            setPdfBlobUrl(null);
            setPdfViewerData(null);

            const registroData = await registroCivilSv.getById(selectedId);
            setPdfViewerData(registroData);

            const tipoLabel = registroData.tipo_descricao || registroData.tipo || "Registro";
            setPdfViewerTitle(`${tipoLabel} - ${registroData.nome_principal || ""}`);

            if (registroData.file) {
                const cleanBase64 = registroData.file.replace(/^data:application\/pdf;base64,/, '');
                const byteCharacters = atob(cleanBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfBlobUrl(url);
            }
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao carregar o documento.",
                severity: "error",
                alertType: "file"
            });
            setOpenPdfViewer(false);
        } finally {
            setPdfViewerLoading(false);
        }
    };

    const closePdfViewer = () => {
        setOpenPdfViewer(false);
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
        }
        setPdfBlobUrl(null);
        setPdfViewerTitle("");
        setPdfViewerData(null);
    };

    const handlePrintFile = () => {
        if (pdfBlobUrl) {
            window.open(pdfBlobUrl, '_blank');
        }
    };

    const handleDeleteById = async () => {
        try {
            await registroCivilSv.deleteById(selectedId);
            dispatch({
                type: SET_ALERT,
                message: "Registro movido para lixeira!",
                severity: "success",
                alertType: "file"
            });
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message,
                severity: "error",
                alertType: "file"
            });
        } finally {
            getData();
        }
    };

    const handleFilterChange = (field) => (e) => {
        setFilters(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSearch = async () => {
        const hasAnyFilter = Object.values(filters).some(v => v !== "");
        if (!hasAnyFilter) {
            getData();
            return;
        }
        try {
            setLoading(true);
            const response = await registroCivilSv.search(filters);
            setData(Object.values(response));
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao buscar registros.",
                severity: "error",
                alertType: "file"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            nome: "",
            tipo: "",
            status: "",
            data_inicio: "",
            data_fim: "",
            livro: "",
            folha: "",
            termo: ""
        });
        getData();
    };

    const loadTipos = async () => {
        try {
            const response = await registroCivilSv.getAllTipos();
            setTipos(Array.isArray(response) ? response : Object.values(response));
        } catch (err) {
            console.error("Erro ao carregar tipos:", err);
        }
    };

    const getData = async () => {
        try {
            setLoading(true);
            const response = await registroCivilSv.getData();
            setData(Object.values(response));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
        loadTipos();
        setIsAdmin(localStorage.getItem('isAdmin'));
    }, []);

    const hasPermission = permissions?.some(p => p?.public_name === 'Registro Civil');
    const createPerm = permissions?.find(p => p?.public_name === 'Registro Civil')?.create_permission;
    const deletePerm = permissions?.find(p => p?.public_name === 'Registro Civil')?.delete_permission;
    const editPerm = permissions?.find(p => p?.public_name === 'Registro Civil')?.edit;

    if (loading) return <Loading />;

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Registro Civil']}>
                <Box sx={{ width: '100%', height: '100vh', py: 15 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            <Grid item xs={12} textAlign="center">
                                <Typography fontSize={40} fontWeight="bold" color="#000">
                                    Registro Civil
                                </Typography>
                            </Grid>

                            {/* Filtros principais */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Buscar por Nome"
                                    color="success"
                                    value={filters.nome}
                                    onChange={handleFilterChange("nome")}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth color="success">
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={filters.tipo}
                                        onChange={handleFilterChange("tipo")}
                                        label="Tipo"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        {tipos.map((t) => (
                                            <MenuItem key={t.id} value={t.nome}>{t.nome}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap">
                                    <Button
                                        variant="contained"
                                        startIcon={<Search />}
                                        onClick={handleSearch}
                                        sx={{
                                            bgcolor: GREEN,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            '&:hover': { bgcolor: DARK_GREEN }
                                        }}
                                    >
                                        Buscar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={showAdvancedFilters ? <FilterListOff /> : <FilterList />}
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                        sx={{
                                            color: GREEN,
                                            borderColor: GREEN,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            '&:hover': { borderColor: DARK_GREEN, bgcolor: 'rgba(35,113,23,0.04)' }
                                        }}
                                    >
                                        Filtros
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Clear />}
                                        onClick={handleClearFilters}
                                        sx={{
                                            color: '#666',
                                            borderColor: '#ccc',
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            '&:hover': { borderColor: '#999', bgcolor: '#f5f5f5' }
                                        }}
                                    >
                                        Limpar
                                    </Button>
                                    {createPerm === 1 &&
                                        <ButtonOpenModals onClick={handleOpenModal} />}
                                    {isAdmin === "1" &&
                                        <ButtonLixeira href="/registro-civil/lixeira_registro_civil" />}
                                </Stack>
                            </Grid>

                            {/* Filtros avançados */}
                            <Grid item xs={12}>
                                <Collapse in={showAdvancedFilters}>
                                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: GREEN }}>
                                            Filtros Avançados
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <FormControl fullWidth color="success" size="small">
                                                    <InputLabel>Status</InputLabel>
                                                    <Select
                                                        value={filters.status}
                                                        onChange={handleFilterChange("status")}
                                                        label="Status"
                                                    >
                                                        <MenuItem value="">Todos</MenuItem>
                                                        <MenuItem value="ativo">Ativo</MenuItem>
                                                        <MenuItem value="cancelado">Cancelado</MenuItem>
                                                        <MenuItem value="anulado">Anulado</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Data Início"
                                                    type="date"
                                                    color="success"
                                                    value={filters.data_inicio}
                                                    onChange={handleFilterChange("data_inicio")}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Data Fim"
                                                    type="date"
                                                    color="success"
                                                    value={filters.data_fim}
                                                    onChange={handleFilterChange("data_fim")}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Livro"
                                                    color="success"
                                                    value={filters.livro}
                                                    onChange={handleFilterChange("livro")}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Folha"
                                                    color="success"
                                                    value={filters.folha}
                                                    onChange={handleFilterChange("folha")}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Termo"
                                                    color="success"
                                                    value={filters.termo}
                                                    onChange={handleFilterChange("termo")}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Collapse>
                            </Grid>

                            <Grid item xs={12}>
                                <DocListCivil
                                    data={data}
                                    setSelectedId={setSelectedId}
                                    handleClick={handleClickMenu}
                                />
                            </Grid>
                        </Grid>
                    </Container>

                    <Drawer anchor="left" open={openModal} onClose={handleCloseModal}>
                        <CadastroModalRegistroCivil onClose={handleCloseModal} />
                    </Drawer>
                </Box>

                <MenuOptionsFile
                    anchorEl={anchorEl}
                    open={open}
                    handleClose={handleCloseMenu}
                    handleOpenModalPDF={handleOpenModalPDF}
                    type={selectedId}
                    handleDelete={handleDeleteById}
                    deletePerm={deletePerm}
                    editPerm={editPerm}
                />

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
                    {/* Header */}
                    <Box sx={{
                        background: `linear-gradient(135deg, ${GREEN} 0%, ${DARK_GREEN} 100%)`,
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                            <Avatar sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'rgba(255,255,255,0.15)'
                            }}>
                                <PictureAsPdf sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={700} color="#fff" sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {pdfViewerTitle || "Carregando..."}
                                </Typography>
                                {pdfViewerData && (
                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                        {pdfViewerData.livro && (
                                            <Chip
                                                label={`Livro ${pdfViewerData.livro}`}
                                                size="small"
                                                sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                            />
                                        )}
                                        {pdfViewerData.folha && (
                                            <Chip
                                                label={`Folha ${pdfViewerData.folha}`}
                                                size="small"
                                                sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                            />
                                        )}
                                        {pdfViewerData.termo && (
                                            <Chip
                                                label={`Termo ${pdfViewerData.termo}`}
                                                size="small"
                                                sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <IconButton onClick={closePdfViewer} sx={{ color: '#fff' }}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <DialogContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                        {/* PDF iframe */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    gap: 2,
                                    p: 4,
                                }}>
                                    <Description sx={{ fontSize: 64, color: '#e0e0e0' }} />
                                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                        Documento PDF nao disponivel para este registro.
                                    </Alert>
                                </Box>
                            )}
                        </Box>

                        {/* Action Panel */}
                        <Box sx={{
                            width: isMobile ? '100%' : '200px',
                            p: 2,
                            display: 'flex',
                            flexDirection: isMobile ? 'row' : 'column',
                            gap: 1.5,
                            justifyContent: isMobile ? 'center' : 'flex-start',
                            flexWrap: isMobile ? 'wrap' : 'nowrap',
                            borderLeft: isMobile ? 'none' : '1px solid #e5e7eb',
                            borderTop: isMobile ? '1px solid #e5e7eb' : 'none',
                        }}>
                            {/* View Details */}
                            <Tooltip title="Ver detalhes completos">
                                <Button
                                    variant="outlined"
                                    fullWidth={!isMobile}
                                    component={Link}
                                    href={`/registro-civil/${selectedId}`}
                                    startIcon={<Visibility />}
                                    sx={{
                                        color: GREEN,
                                        borderColor: GREEN,
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        minWidth: isMobile ? '130px' : 'auto',
                                        '&:hover': {
                                            borderColor: GREEN,
                                            bgcolor: 'rgba(35,113,23,0.04)'
                                        }
                                    }}
                                >
                                    Detalhes
                                </Button>
                            </Tooltip>

                            {/* Edit */}
                            {editPerm === 1 && (
                                <Tooltip title="Editar registro">
                                    <Button
                                        variant="outlined"
                                        fullWidth={!isMobile}
                                        component={Link}
                                        href={`/registro-civil/${selectedId}`}
                                        startIcon={<Edit />}
                                        sx={{
                                            color: '#ed6c02',
                                            borderColor: '#ed6c02',
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            minWidth: isMobile ? '130px' : 'auto',
                                            '&:hover': {
                                                borderColor: '#ed6c02',
                                                bgcolor: '#fff3e0'
                                            }
                                        }}
                                    >
                                        Editar
                                    </Button>
                                </Tooltip>
                            )}

                            {/* Print */}
                            <Tooltip title="Imprimir documento">
                                <Button
                                    variant="outlined"
                                    fullWidth={!isMobile}
                                    onClick={handlePrintFile}
                                    disabled={!pdfBlobUrl}
                                    startIcon={<Print />}
                                    sx={{
                                        color: '#0dcaf0',
                                        borderColor: '#0dcaf0',
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        minWidth: isMobile ? '130px' : 'auto',
                                        '&:hover': {
                                            borderColor: '#0dcaf0',
                                            bgcolor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    Imprimir
                                </Button>
                            </Tooltip>

                            {/* Delete */}
                            {deletePerm === 1 && (
                                <Tooltip title="Deletar registro">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth={!isMobile}
                                        onClick={() => {
                                            closePdfViewer();
                                            handleDeleteById();
                                        }}
                                        startIcon={<Delete />}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            minWidth: isMobile ? '130px' : 'auto',
                                            '&:hover': { bgcolor: '#ffebee' }
                                        }}
                                    >
                                        Deletar
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </DialogContent>

                    {/* Footer */}
                    <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e5e7eb' }}>
                        <Button
                            onClick={closePdfViewer}
                            sx={{ color: '#666', textTransform: 'none', borderRadius: 2 }}
                        >
                            Fechar
                        </Button>
                        {pdfBlobUrl && (
                            <Button
                                variant="contained"
                                startIcon={<GetApp />}
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = pdfBlobUrl;
                                    link.download = `${pdfViewerTitle || 'documento'}.pdf`;
                                    link.click();
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
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageRegistroCivil);
