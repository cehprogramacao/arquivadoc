"use client"

import {
    Box,
    Button,
    Drawer,
    TextField,
    Typography,
    Grid,
    Paper,
    InputAdornment,
    Chip,
    alpha,
    IconButton,
    Tooltip,
    Container
} from "@mui/material"
import {
    Search as SearchIcon,
    Add as AddIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
    PersonAdd as PersonAddIcon
} from "@mui/icons-material"
import { useEffect, useState, useMemo, useCallback } from "react"
import { UserTable } from "./tableSolic/table"
import { CadastroSolicitantes } from "@/Components/Modals/ModalCadastroSolic"
import CustomContainer from "@/Components/CustomContainer"
import Loading from "@/Components/loading"
import NoteService from "@/services/notes.service"
import { useAuth } from "@/context"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"

const noteSv = new NoteService()

// ============================================================================
// ESTILOS
// ============================================================================
const STYLES = {
    pageContainer: {
        width: '100%',
        minHeight: '100vh',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 10, sm: 12 },
        backgroundColor: '#f5f5f5'
    },

    header: {
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2
    },

    title: {
        fontSize: { xs: 28, sm: 36, md: 40 },
        fontWeight: 700,
        color: '#237117',
        display: 'flex',
        alignItems: 'center',
        gap: 2
    },

    statsChip: {
        fontSize: 14,
        fontWeight: 600,
        height: 32,
        px: 2
    },

    filterCard: {
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        backgroundColor: '#fff'
    },

    searchField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 2px 8px rgba(35, 113, 23, 0.1)',
            },
            '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(35, 113, 23, 0.15)',
            }
        }
    },

    addButton: {
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: 15,
        px: 3,
        py: 1.5,
        background: 'linear-gradient(135deg, #237117 0%, #2d8a1f 100%)',
        boxShadow: '0 4px 12px rgba(35, 113, 23, 0.3)',
        '&:hover': {
            background: 'linear-gradient(135deg, #1a5c0f 0%, #237117 100%)',
            boxShadow: '0 6px 16px rgba(35, 113, 23, 0.4)',
            transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease'
    },

    clearButton: {
        color: '#666',
        '&:hover': {
            backgroundColor: alpha('#EA1010', 0.1),
            color: '#EA1010'
        }
    }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const PageSolicitantes = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [isClient, setIsClient] = useState(false)

    const dispatch = useDispatch()
    const { permissions } = useAuth()

    // Verifica se é cliente (SSR fix)
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Busca todos os solicitantes
    const getAllNoteTags = useCallback(async () => {
        try {
            setLoading(true)
            const allData = await noteSv.getAllNoteTags()
            const dataArray = Object.values(allData)
            setData(dataArray)
            setFilteredData(dataArray)
            
            dispatch({
                type: SET_ALERT,
                message: `${dataArray.length} solicitante(s) encontrado(s)`,
                severity: "success",
            })
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: `Erro ao buscar solicitantes: ${error.message}`,
                severity: "error",
            })
            console.error("Erro ao buscar solicitantes:", error)
        } finally {
            setLoading(false)
        }
    }, [dispatch])

    // Deleta solicitante por ID
    const handleDeleteTagById = useCallback(async (tagId) => {
        try {
            setLoading(true)
            const result = await noteSv.deleteNoteTag(tagId)
            dispatch({
                type: SET_ALERT,
                severity: "success",
                message: result.message || "Solicitante excluído com sucesso"
            })
            await getAllNoteTags()
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                severity: "error",
                message: `Erro ao excluir solicitante: ${error.message}`
            })
            console.error('Erro ao excluir solicitante:', error)
        } finally {
            setLoading(false)
        }
    }, [dispatch, getAllNoteTags])

    // Filtra dados baseado no termo de busca
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(data)
            return
        }

        const term = searchTerm.toLowerCase()
        const filtered = data.filter((item) =>
            item.name?.toLowerCase().includes(term) ||
            item.id?.toString().includes(term)
        )
        setFilteredData(filtered)
    }, [searchTerm, data])

    // Carrega dados iniciais
    useEffect(() => {
        if (isClient) {
            getAllNoteTags()
        }
    }, [isClient, getAllNoteTags])

    // Handlers
    const handleOpenModal = useCallback(() => setOpen(true), [])
    const handleCloseModal = useCallback(() => setOpen(false), [])
    const handleClearSearch = useCallback(() => setSearchTerm(""), [])

    // Stats memoizados
    const stats = useMemo(() => ({
        total: data.length,
        filtered: filteredData.length,
        isFiltering: searchTerm.trim() !== ""
    }), [data.length, filteredData.length, searchTerm])

    if (!isClient) return null

    return (
        <>
            {loading && <Loading />}
            
            <Box sx={STYLES.pageContainer}>
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box sx={STYLES.header}>
                        <Box>
                            <Typography sx={STYLES.title}>
                                <PersonAddIcon sx={{ fontSize: 40 }} />
                                Solicitantes
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip
                                    label={`Total: ${stats.total}`}
                                    color="primary"
                                    size="small"
                                    sx={STYLES.statsChip}
                                />
                                {stats.isFiltering && (
                                    <Chip
                                        label={`Filtrados: ${stats.filtered}`}
                                        color="secondary"
                                        size="small"
                                        sx={STYLES.statsChip}
                                    />
                                )}
                            </Box>
                        </Box>

                        {permissions[5]?.create_permission === 1 && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenModal}
                                sx={STYLES.addButton}
                            >
                                Novo Solicitante
                            </Button>
                        )}
                    </Box>

                    {/* Filtros */}
                    <Paper sx={STYLES.filterCard}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <FilterIcon sx={{ color: '#237117' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#237117' }}>
                                        Filtros de Busca
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={10}>
                                <TextField
                                    fullWidth
                                    placeholder="Buscar por nome ou ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={STYLES.searchField}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#237117' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchTerm && (
                                            <InputAdornment position="end">
                                                <Tooltip title="Limpar busca">
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleClearSearch}
                                                        sx={STYLES.clearButton}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleClearSearch}
                                    disabled={!searchTerm}
                                    sx={{
                                        height: 56,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: '#237117',
                                        borderColor: '#237117',
                                        '&:hover': {
                                            borderColor: '#1a5c0f',
                                            backgroundColor: alpha('#237117', 0.04)
                                        }
                                    }}
                                >
                                    Limpar
                                </Button>
                            </Grid>

                            {stats.isFiltering && (
                                <Grid item xs={12}>
                                    <Box sx={{
                                        p: 2,
                                        backgroundColor: alpha('#237117', 0.05),
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <SearchIcon sx={{ color: '#237117', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ color: '#237117', fontWeight: 500 }}>
                                            Mostrando {stats.filtered} de {stats.total} solicitante(s)
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>

                    {/* Tabela */}
                    <UserTable
                        data={filteredData}
                        onClick={handleDeleteTagById}
                        emptyMessage={
                            stats.isFiltering
                                ? "Nenhum solicitante encontrado com os filtros aplicados"
                                : "Nenhum solicitante cadastrado"
                        }
                    />
                </Container>

                <Drawer
                    anchor="right"
                    open={open}
                    onClose={handleCloseModal}
                    PaperProps={{
                        sx: {
                            width: { xs: '100%', sm: 400 },
                            borderRadius: '16px 0 0 16px'
                        }
                    }}
                >
                    <CadastroSolicitantes
                        onClose={handleCloseModal}
                        getTag={getAllNoteTags}
                    />
                </Drawer>
            </Box>
        </>
    )
}

export default PageSolicitante