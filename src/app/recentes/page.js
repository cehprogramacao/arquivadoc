"use client"
import All from "@/services/all.service"
import withAuth from "@/utils/withAuth"
import {
    Box,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Avatar,
    Typography,
    Chip,
    alpha,
    Paper,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { useEffect, useState } from "react"
import Loading from "../loading"
import { AuthProvider, useAuth } from "@/context"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"
import {
    FileText,
    Folder,
    Clock,
    User,
    CreditCard,
    ChevronRight,
    BarChart3,
    PieChart as PieChartIcon,
    RefreshCw,
    ArrowRight,
    TrendingUp,
    Activity
} from "lucide-react"

const allSv = new All()

const sectionColors = {
    'Protesto': '#dc2626',
    'RGI': '#2563eb',
    'RTD': '#7c3aed',
    'RPJ': '#059669',
    'Oficios': '#d97706',
    'Notas': '#ea580c',
    'Inventario': '#247117',
    'Registro Civil': '#8E24AA'
}

const sectionModules = {
    'Protesto': 'notas',
    'RGI': 'notas',
    'RTD': 'notas',
    'RPJ': 'notas',
    'Oficios': 'notas',
    'Notas': 'notas',
    'Inventario': 'shared',
    'Registro Civil': 'registro_civil'
}

const Recentes = () => {
    const { permissions, cargoServentia } = useAuth()
    const [data, setData] = useState({})
    const [countRecentsFile, setCountRecentsFile] = useState(0)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [isClient, setIsClient] = useState(false)

    const isSectionVisible = (sectionKey) => {
        const cargo = cargoServentia || localStorage.getItem('cargoServentia') || 'geral'
        const mod = sectionModules[sectionKey]
        if (!mod || mod === 'shared' || cargo === 'geral') return true
        if (mod === 'notas' && cargo === 'registro_imoveis') return true
        if (mod === 'registro_civil' && cargo === 'registro_civil') return true
        return false
    }

    const getAllRecents = async () => {
        try {
            setLoading(true)
            const response = await allSv.getAllRecents()
            setData(response)
            countRecentsFiles(response)
        } catch (error) {
            console.error("Erro ao buscar dados de recentes!", error)
        } finally {
            setLoading(false)
        }
    }

    const countRecentsFiles = (dataObject) => {
        let totalCount = 0
        for (const key in dataObject) {
            const value = dataObject[key]
            if (Array.isArray(value)) {
                totalCount += value.length
            } else if (typeof value === 'object' && value !== null) {
                totalCount += Object.keys(value).length
            }
        }
        setCountRecentsFile(totalCount)
    }

    const prepareChartData = () => {
        const chartData = []
        const sectionMap = {
            0: 'Protesto',
            1: 'RGI',
            2: 'RTD',
            3: 'RPJ',
            4: 'Oficios',
            6: 'Notas'
        }

        permissions.forEach((permission, index) => {
            const sectionKey = sectionMap[index]
            if (permission.view === 1 && sectionKey && data[sectionKey] && isSectionVisible(sectionKey)) {
                const count = Array.isArray(data[sectionKey])
                    ? data[sectionKey].length
                    : Object.keys(data[sectionKey]).length

                if (count > 0) {
                    chartData.push({
                        name: permission.public_name,
                        value: count,
                        color: sectionColors[sectionKey] || '#237117'
                    })
                }
            }
        })

        // Inventario (dynamic permission index)
        const invPerm = permissions.find(p => p?.public_name === 'Inventario')
        if (invPerm?.view === 1 && data['Inventario'] && isSectionVisible('Inventario')) {
            const count = Array.isArray(data['Inventario'])
                ? data['Inventario'].length
                : Object.keys(data['Inventario']).length
            if (count > 0) {
                chartData.push({
                    name: 'Inventario',
                    value: count,
                    color: sectionColors['Inventario']
                })
            }
        }

        // Registro Civil (dynamic permission index)
        const rcPerm = permissions.find(p => p?.public_name === 'Registro Civil')
        if (rcPerm?.view === 1 && data['Registro Civil'] && isSectionVisible('Registro Civil')) {
            const count = Array.isArray(data['Registro Civil'])
                ? data['Registro Civil'].length
                : Object.keys(data['Registro Civil']).length
            if (count > 0) {
                chartData.push({
                    name: 'Registro Civil',
                    value: count,
                    color: sectionColors['Registro Civil']
                })
            }
        }

        return chartData
    }

    const chartData = prepareChartData()

    const onlyNumbers = (value = "") => String(value).replace(/\D/g, "")

    const applyCpfCnpjMask = (value = "") => {
        const numbers = onlyNumbers(value)
        if (numbers.length <= 11) {
            return numbers
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1-$2")
                .slice(0, 14)
        }
        return numbers
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18)
    }

    const renderDocumentSection = (sectionKey, permissionIndex, linkPath) => {
        if (
            permissions[permissionIndex]?.view !== 1 ||
            !(sectionKey in data) ||
            typeof data[sectionKey] !== 'object' ||
            Object.keys(data[sectionKey]).length === 0 ||
            !isSectionVisible(sectionKey)
        ) {
            return null
        }

        const color = sectionColors[sectionKey] || '#237117'
        const items = Object.values(data[sectionKey])

        return (
            <Paper
                key={sectionKey}
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: '#e5e7eb',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: color,
                        boxShadow: `0 8px 30px ${alpha(color, 0.12)}`
                    }
                }}
            >
                {/* Section Header */}
                <Box sx={{
                    px: 3,
                    py: 2,
                    background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.85)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Folder size={22} color="#fff" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700} color="#fff">
                                {permissions[permissionIndex]?.public_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                {items.length} documento(s) recente(s)
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={items.length}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.25)',
                            color: '#fff',
                            fontWeight: 700,
                            minWidth: 40
                        }}
                    />
                </Box>

                {/* Documents Grid */}
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        {items.slice(0, 8).map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: color,
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 6px 20px ${alpha(color, 0.15)}`
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha(color, 0.1),
                                                    color: color,
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                <FileText size={18} />
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={600}
                                                    sx={{
                                                        mb: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {item.presenterName || item.entityName || item.nome_principal || "Documento"}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CreditCard size={12} color="#666" />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {applyCpfCnpjMask(item.presenterDocument) || item.box || item.tipo_descricao || "-"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {items.length > 8 && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                +{items.length - 8} documento(s) adicional(is)
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            component={Link}
                            href={linkPath}
                            endIcon={<ArrowRight size={16} />}
                            sx={{
                                bgcolor: color,
                                color: '#fff',
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: alpha(color, 0.9),
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            Ver todos
                        </Button>
                    </Box>
                </Box>
            </Paper>
        )
    }

    useEffect(() => {
        getAllRecents()
    }, [])

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                minHeight: "100vh",
                background: "#fafafa",
                py: { xs: 10, md: 12 },
                px: 2
            }}>
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box sx={{ mb: 5 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 4
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #237117 0%, #1a5511 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(35, 113, 23, 0.25)'
                                }}>
                                    <Clock size={28} color="#fff" />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{ color: '#1a1a1a', fontSize: { xs: '1.5rem', md: '2rem' } }}
                                    >
                                        Documentos Recentes
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {countRecentsFile} arquivo(s) acessado(s) recentemente
                                    </Typography>
                                </Box>
                            </Box>

                            <Tooltip title="Atualizar">
                                <IconButton
                                    onClick={getAllRecents}
                                    sx={{
                                        bgcolor: alpha('#237117', 0.1),
                                        '&:hover': { bgcolor: alpha('#237117', 0.15) }
                                    }}
                                >
                                    <RefreshCw size={20} color="#237117" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #237117 0%, #1a5511 100%)',
                                        color: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <FileText size={18} />
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Total de Arquivos
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight={700}>
                                        {countRecentsFile}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid #e5e7eb',
                                        bgcolor: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Activity size={18} color="#237117" />
                                        <Typography variant="body2" color="text.secondary">
                                            Secoes Ativas
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight={700} color="#237117">
                                        {permissions.filter(p => p.view === 1).length}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid #e5e7eb',
                                        bgcolor: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <TrendingUp size={18} color="#2563eb" />
                                        <Typography variant="body2" color="text.secondary">
                                            Categorias
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" fontWeight={700} color="#2563eb">
                                        {chartData.length}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: '1px solid #e5e7eb',
                                        bgcolor: '#fff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Clock size={18} color="#7c3aed" />
                                        <Typography variant="body2" color="text.secondary">
                                            Ultima Atualizacao
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} color="#7c3aed">
                                        Agora
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Charts */}
                        {chartData.length > 0 && (
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} lg={7}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: '1px solid #e5e7eb',
                                            bgcolor: '#fff',
                                            height: 350
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <BarChart3 size={20} color="#237117" />
                                            <Typography variant="h6" fontWeight={600}>
                                                Distribuicao por Secao
                                            </Typography>
                                        </Box>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 11, fill: '#666' }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={80}
                                                />
                                                <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} lg={5}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            border: '1px solid #e5e7eb',
                                            bgcolor: '#fff',
                                            height: 350
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <PieChartIcon size={20} color="#7c3aed" />
                                            <Typography variant="h6" fontWeight={600}>
                                                Proporcao dos Documentos
                                            </Typography>
                                        </Box>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Legend
                                                    wrapperStyle={{ fontSize: '12px' }}
                                                    iconType="circle"
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Box>

                    {/* Document Sections */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: alpha('#237117', 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Folder size={20} color="#237117" />
                            </Box>
                            <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                                Por Categoria
                            </Typography>
                        </Box>

                        {renderDocumentSection("Notas", 6, "/notes")}
                        {renderDocumentSection("Protesto", 0, "/protest")}
                        {renderDocumentSection("Oficios", 4, "/calling")}
                        {renderDocumentSection("RGI", 1, "/rgi")}
                        {renderDocumentSection("RTD", 2, "/rtd")}
                        {renderDocumentSection("RPJ", 3, "/rpj")}
                        {(() => {
                            const invIdx = permissions.findIndex(p => p?.public_name === 'Inventario')
                            if (invIdx >= 0) return renderDocumentSection("Inventario", invIdx, "/inventario")
                            return null
                        })()}
                        {(() => {
                            const rcIdx = permissions.findIndex(p => p?.public_name === 'Registro Civil')
                            if (rcIdx >= 0) return renderDocumentSection("Registro Civil", rcIdx, "/registro-civil")
                            return null
                        })()}

                        {countRecentsFile === 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 6,
                                    borderRadius: 3,
                                    border: '1px solid #e5e7eb',
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: alpha('#237117', 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2
                                }}>
                                    <FileText size={40} color="#237117" />
                                </Box>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Nenhum documento recente
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Os documentos acessados recentemente aparecerao aqui.
                                </Typography>
                            </Paper>
                        )}
                    </Box>

                    {/* Footer */}
                    <Box sx={{
                        mt: 6,
                        pt: 4,
                        borderTop: '1px solid #e5e7eb',
                        textAlign: 'center'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            ArquivaDoc - Sistema de Gestao de Documentos
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Recentes)
