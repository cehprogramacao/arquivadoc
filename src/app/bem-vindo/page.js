"use client"
import Loading from "@/Components/loading"
import { AuthProvider } from "@/context"
import User from "@/services/user.service"
import { SET_ALERT } from "@/store/actions"
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
    LinearProgress
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
    Inventory2 as InventarioIcon,
    ArrowForward,
    Refresh
} from "@mui/icons-material"
import {
    LayoutDashboard,
    Clock,
    TrendingUp,
    Sparkles,
    ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const moduleConfig = {
    "Protesto": { route: "protest", icon: ProtestIcon, color: "#dc2626", description: "Gestao de protestos e documentos" },
    "RGI": { route: "rgi", icon: RGIIcon, color: "#2563eb", description: "Registro Geral de Imoveis" },
    "RTD": { route: "rtd", icon: RTDIcon, color: "#7c3aed", description: "Registro de Titulos e Documentos" },
    "RPJ": { route: "rpj", icon: RPJIcon, color: "#059669", description: "Registro de Pessoas Juridicas" },
    "Oficio": { route: "calling", icon: CallingIcon, color: "#d97706", description: "Controle de oficios e comunicacoes" },
    "Clientes": { route: "customers", icon: CustomersIcon, color: "#0891b2", description: "Cadastro e gestao de clientes" },
    "Notas": { route: "notes", icon: NotesIcon, color: "#ea580c", description: "Anotacoes e observacoes" },
    "Recentes": { route: "recentes", icon: RecentesIcon, color: "#374151", description: "Acesso rapido aos documentos recentes" },
    "Termos": { route: "termos", icon: TermosIcon, color: "#4b5563", description: "Termos e documentacao" },
    "Cartoes de Autografo": { route: "autograph-card", icon: AutografoIcon, color: "#1d4ed8", description: "Gestao de cartoes de autografo" },
    "Solicitantes": { route: "solicitantes", icon: SolicitantesIcon, color: "#f97316", description: "Cadastro de solicitantes" },
    "Inventario": { route: "inventario", icon: InventarioIcon, color: "#247117", description: "Inventario patrimonial da empresa" },
}

const userSv = new User()

const Welcome = () => {
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [hoveredCard, setHoveredCard] = useState(null)
    const dispatch = useDispatch()
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
                { public_name: "Solicitantes", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
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

    const visiblePermissions = permissions.filter(item => item.view === 1)

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                minHeight: "100vh",
                background: "#fafafa",
                py: { xs: 10, md: 14 },
                px: { xs: 2, md: 0 }
            }}>
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box sx={{ mb: 5 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 3,
                            mb: 4
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: '#237117',
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 24px rgba(35, 113, 23, 0.25)'
                                    }}
                                >
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{
                                            color: '#1a1a1a',
                                            fontSize: { xs: '1.5rem', md: '2rem' }
                                        }}
                                    >
                                        {getCurrentGreeting()}, {user?.name?.split(' ')[0] || "Usuario"}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {new Date().toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>

                            <Tooltip title="Atualizar">
                                <IconButton
                                    onClick={getUser}
                                    sx={{
                                        bgcolor: alpha('#237117', 0.1),
                                        '&:hover': { bgcolor: alpha('#237117', 0.15) }
                                    }}
                                >
                                    <Refresh sx={{ color: '#237117' }} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Stats Cards */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #237117 0%, #1a5511 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -30,
                                        right: -30,
                                        width: 120,
                                        height: 120,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }} />
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <LayoutDashboard size={20} />
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Modulos Disponiveis
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight={700}>
                                            {visiblePermissions.length}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={100}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: '#4ade80',
                                                        borderRadius: 3
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
                                                Todos os modulos ativos
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -30,
                                        right: -30,
                                        width: 120,
                                        height: 120,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }} />
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Clock size={20} />
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Acesso Rapido
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight={700}>
                                            24/7
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, mt: 2, display: 'block' }}>
                                            Sistema disponivel a qualquer momento
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -30,
                                        right: -30,
                                        width: 120,
                                        height: 120,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }} />
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <TrendingUp size={20} />
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                Performance
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" fontWeight={700}>
                                            100%
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, mt: 2, display: 'block' }}>
                                            Sistema otimizado e funcionando
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Modules Section */}
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: alpha('#237117', 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Sparkles size={20} color="#237117" />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                                        Seus Modulos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Selecione um modulo para comecar
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label={`${visiblePermissions.length} ativos`}
                                size="small"
                                sx={{
                                    bgcolor: alpha('#237117', 0.1),
                                    color: '#237117',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        <Grid container spacing={2.5}>
                            {permissions.map((item, index) => {
                                const config = moduleConfig[item.public_name]
                                if (!config) return null
                                const { route, icon: IconComponent, color, description } = config
                                const isHovered = hoveredCard === item.public_name

                                return item.view === 1 && (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.public_name}>
                                        <Card
                                            elevation={0}
                                            onMouseEnter={() => setHoveredCard(item.public_name)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            sx={{
                                                height: '100%',
                                                border: '1px solid',
                                                borderColor: isHovered ? color : '#e5e7eb',
                                                borderRadius: 3,
                                                background: isHovered ? alpha(color, 0.02) : '#fff',
                                                transition: 'all 0.3s ease',
                                                transform: isHovered ? 'translateY(-6px)' : 'none',
                                                boxShadow: isHovered
                                                    ? `0 20px 40px ${alpha(color, 0.15)}`
                                                    : '0 1px 3px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <CardActionArea
                                                component={Link}
                                                href={`/${route}`}
                                                sx={{ height: '100%' }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'space-between',
                                                        mb: 2.5
                                                    }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: color,
                                                                width: 52,
                                                                height: 52,
                                                                boxShadow: `0 4px 14px ${alpha(color, 0.35)}`,
                                                                transition: 'transform 0.3s ease',
                                                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                                                            }}
                                                        >
                                                            <IconComponent sx={{ fontSize: 26 }} />
                                                        </Avatar>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                bgcolor: alpha(color, 0.1),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                opacity: isHovered ? 1 : 0,
                                                                transition: 'opacity 0.3s ease'
                                                            }}
                                                        >
                                                            <ChevronRight size={18} color={color} />
                                                        </Box>
                                                    </Box>

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                        sx={{ color: '#1a1a1a', mb: 0.5, fontSize: '1.1rem' }}
                                                    >
                                                        {item.public_name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            lineHeight: 1.6,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            mb: 2
                                                        }}
                                                    >
                                                        {description}
                                                    </Typography>

                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 0.5,
                                                        pt: 2,
                                                        borderTop: '1px solid',
                                                        borderColor: alpha(color, 0.1)
                                                    }}>
                                                        {item.view === 1 && (
                                                            <Chip
                                                                label="Ver"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    bgcolor: alpha(color, 0.1),
                                                                    color: color,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                        {item.create_permission === 1 && (
                                                            <Chip
                                                                label="Criar"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    bgcolor: alpha(color, 0.1),
                                                                    color: color,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                        {item.edit === 1 && (
                                                            <Chip
                                                                label="Editar"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    bgcolor: alpha(color, 0.1),
                                                                    color: color,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                        {item.delete_permission === 1 && (
                                                            <Chip
                                                                label="Deletar"
                                                                size="small"
                                                                sx={{
                                                                    height: 22,
                                                                    fontSize: '0.7rem',
                                                                    bgcolor: alpha(color, 0.1),
                                                                    color: color,
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
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

export default withAuth(Welcome)
