"use client"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import User from "@/services/user.service"
import withAuth from "@/utils/withAuth"
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Avatar,
    alpha,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    CardActionArea,
    Divider,
    Stack
} from "@mui/material"
import {
    Gavel as ProtestIcon,
    AccountBalance as RGIIcon,
    Description as RTDIcon,
    Business as RPJIcon,
    Email as CallingIcon,
    People as CustomersIcon,
    StickyNote2 as NotesIcon,
    Schedule as RecentesIcon,
    Description as TermosIcon,
    CreditCard as AutografoIcon,
    PersonSearch as SolicitantesIcon,
    Refresh,
    TrendingUp,
    Security,
    Speed
} from "@mui/icons-material"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const routes = ['protest', 'rgi', 'rtd', 'rpj', 'calling', 'customers', 'notes', 'recentes', 'termos', 'autograph-card', 'solicitantes']

const categoryIcons = [
    ProtestIcon,
    RGIIcon,
    RTDIcon,
    RPJIcon,
    CallingIcon,
    CustomersIcon,
    NotesIcon,
    RecentesIcon,
    TermosIcon,
    AutografoIcon,
    SolicitantesIcon
]

const categoryDescriptions = [
    'Gestao de protestos e documentos',
    'Registro Geral de Imoveis',
    'Registro de Titulos e Documentos',
    'Registro de Pessoas Juridicas',
    'Controle de oficios e comunicacoes',
    'Cadastro e gestao de clientes',
    'Anotacoes e observacoes',
    'Acesso rapido aos documentos recentes',
    'Termos e documentacao',
    'Gestao de cartoes de autografo',
    'Cadastro de solicitantes'
]

const categoryColors = [
    '#dc2626',
    '#2563eb',
    '#7c3aed',
    '#059669',
    '#d97706',
    '#0891b2',
    '#ea580c',
    '#6366f1',
    '#0d9488',
    '#1d4ed8',
    '#f97316'
]

const userSv = new User()

const Welcome = () => {
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state.login.data)

    const getUser = async () => {
        try {
            setLoading(true)
            const data = await userSv.getUser()
            const permissionsArray = Array.isArray(data?.permissions) ? data.permissions : []
            const additionalPermissions = [
                { public_name: "Recentes", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
                { public_name: "Termos", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
                { public_name: "Cartoes de Autografo", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
                { public_name: "Solicitantes", view: 1, create_permission: 1, delete_permission: 1, edit: 1 }
            ]
            setPermissions([...permissionsArray, ...additionalPermissions])
        } catch (error) {
            console.error("Erro ao buscar usuario:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const getCurrentGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const visiblePermissions = permissions.filter(item => item.view === 1)

    const primaryColor = '#0f4c35'
    const secondaryColor = '#1a5c42'

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                minHeight: "100vh",
                background: '#f8fafc',
            }}>
                {/* Top Bar */}
                <Box sx={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    color: 'white',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '1.1rem'
                        }}>
                            AD
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                                ArquivaDoc
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Sistema de Gestao Documental
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'capitalize' }}>
                        {formatDate()}
                    </Typography>
                </Box>

                <Container maxWidth="xl" sx={{ py: 5 }}>
                    {/* Welcome Header */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 4,
                            borderRadius: 2,
                            border: '1px solid #e2e8f0',
                            background: 'white'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 3
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        bgcolor: primaryColor,
                                        fontSize: '1.75rem',
                                        fontWeight: 600,
                                        border: '3px solid',
                                        borderColor: alpha(primaryColor, 0.2)
                                    }}
                                >
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        fontWeight={600}
                                        sx={{ color: '#1e293b', mb: 0.5 }}
                                    >
                                        {getCurrentGreeting()}, {user?.name?.split(' ')[0] || "Usuario"}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                                        Bem-vindo ao seu painel de gestao documental
                                    </Typography>
                                </Box>
                            </Box>

                            <Tooltip title="Atualizar dados">
                                <IconButton
                                    onClick={getUser}
                                    sx={{
                                        bgcolor: alpha(primaryColor, 0.08),
                                        '&:hover': { bgcolor: alpha(primaryColor, 0.12) }
                                    }}
                                >
                                    <Refresh sx={{ color: primaryColor }} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Stats Row */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1.5,
                                        bgcolor: alpha(primaryColor, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <TrendingUp sx={{ color: primaryColor, fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} color="#1e293b">
                                            {visiblePermissions.length}
                                        </Typography>
                                        <Typography variant="body2" color="#64748b">
                                            Modulos Ativos
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1.5,
                                        bgcolor: alpha('#2563eb', 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Security sx={{ color: '#2563eb', fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} color="#1e293b">
                                            100%
                                        </Typography>
                                        <Typography variant="body2" color="#64748b">
                                            Sistema Seguro
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1.5,
                                        bgcolor: alpha('#059669', 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Speed sx={{ color: '#059669', fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} color="#1e293b">
                                            24/7
                                        </Typography>
                                        <Typography variant="body2" color="#64748b">
                                            Disponibilidade
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Modules Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} color="#1e293b" sx={{ mb: 0.5 }}>
                            Modulos do Sistema
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                            Selecione um modulo para acessar suas funcionalidades
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {permissions.map((item, index) => {
                            const IconComponent = categoryIcons[index]
                            const color = categoryColors[index] || primaryColor

                            return item.view === 1 && (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 2,
                                            background: 'white',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: color,
                                                boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        <CardActionArea
                                            component={Link}
                                            href={`/${routes[index]}`}
                                            sx={{ height: '100%' }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    mb: 2
                                                }}>
                                                    <Box
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 1.5,
                                                            bgcolor: alpha(color, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <IconComponent sx={{ fontSize: 22, color: color }} />
                                                    </Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={600}
                                                        sx={{ color: '#1e293b' }}
                                                    >
                                                        {item.public_name}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#64748b',
                                                        lineHeight: 1.5,
                                                        mb: 2,
                                                        minHeight: 40
                                                    }}
                                                >
                                                    {categoryDescriptions[index]}
                                                </Typography>

                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                    {item.view === 1 && (
                                                        <Chip
                                                            label="Visualizar"
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.7rem',
                                                                bgcolor: alpha(color, 0.1),
                                                                color: color,
                                                                fontWeight: 500,
                                                                '& .MuiChip-label': { px: 1 }
                                                            }}
                                                        />
                                                    )}
                                                    {item.create_permission === 1 && (
                                                        <Chip
                                                            label="Criar"
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.7rem',
                                                                bgcolor: alpha(color, 0.1),
                                                                color: color,
                                                                fontWeight: 500,
                                                                '& .MuiChip-label': { px: 1 }
                                                            }}
                                                        />
                                                    )}
                                                    {item.edit === 1 && (
                                                        <Chip
                                                            label="Editar"
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.7rem',
                                                                bgcolor: alpha(color, 0.1),
                                                                color: color,
                                                                fontWeight: 500,
                                                                '& .MuiChip-label': { px: 1 }
                                                            }}
                                                        />
                                                    )}
                                                    {item.delete_permission === 1 && (
                                                        <Chip
                                                            label="Excluir"
                                                            size="small"
                                                            sx={{
                                                                height: 24,
                                                                fontSize: '0.7rem',
                                                                bgcolor: alpha(color, 0.1),
                                                                color: color,
                                                                fontWeight: 500,
                                                                '& .MuiChip-label': { px: 1 }
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>

                    {/* Footer */}
                    <Box sx={{
                        mt: 6,
                        pt: 4,
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            ArquivaDoc - Sistema de Gestao Documental
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            v1.0.0
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Welcome)
