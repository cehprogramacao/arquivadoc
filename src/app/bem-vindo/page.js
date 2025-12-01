"use client"
import Loading from "@/Components/loading"
import { AuthProvider, useAuth } from "@/context"
import User from "@/services/user.service"
import { SET_ALERT } from "@/store/actions"
import withAuth from "@/utils/withAuth"
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Avatar,
    Fade,
    Grow,
    useTheme,
    alpha,
    Paper,
    Stack,
    Chip,
    IconButton,
    Tooltip,
    CardActionArea
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
    ArrowForward,
    Settings,
    Notifications,
    TrendingUp,
    AccessTime,
    FiberManualRecord
} from "@mui/icons-material"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

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

const categoryColors = [
    '#e53e3e',
    '#3182ce',
    '#805ad5',
    '#38a169',
    '#d69e2e',
    '#00b5d8',
    '#dd6b20',
    '#2d3748',
    '#4a5568',
    '#2b6cb0',
    '#ed8936'
]

const categoryDescriptions = [
    'Gestão de protestos e documentos',
    'Registro Geral de Imóveis',
    'Registro de Títulos e Documentos',
    'Registro de Pessoas Jurídicas',
    'Controle de ofícios e comunicações',
    'Cadastro e gestão de clientes',
    'Anotações e observações',
    'Acesso rápido aos documentos recentes',
    'Termos e documentação',
    'Gestão de cartões de autógrafo',
    'Cadastro de solicitantes'
]

const userSv = new User()

const Welcome = () => {
    const theme = useTheme()
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [hoveredCard, setHoveredCard] = useState(null)
    const dispatch = useDispatch()
    const user = useSelector((state) => state.login.data)

    const getUser = async () => {
        try {
            setLoading(true);

            const data = await userSv.getUser();

            const permissionsArray = Array.isArray(data?.permissions)
                ? data.permissions
                : [];

            const additionalPermissions = [
                { public_name: "Recentes", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
                { public_name: "Termos", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
                { public_name: "Cartões de Autógrafo", view: 1, create_permission: 1, delete_permission: 1, edit: 1 },
                { public_name: "Solicitantes", view: 1, create_permission: 1, delete_permission: 1, edit: 1 }
            ];

            const payload = [...permissionsArray, ...additionalPermissions];
            setPermissions(payload);

            dispatch({
                type: SET_ALERT,
                message: "Bem-vindo ao sistema!",
                severity: "success",
            });

        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser()
    }, [])

    const getCurrentGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }

    const getCurrentPeriodEmoji = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "🌅"
        if (hour < 18) return "☀️"
        return "🌙"
    }

    const visiblePermissions = permissions.filter(item => item.view === 1)

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                minHeight: "100vh",
                background: 'linear-gradient(135deg, #f8fdf9 0%, #ffffff 50%, #f0f9f4 100%)',
                py: { xs: 4, md: 15 },
                px: { xs: 2, md: 3 }
            }}>
                <Container maxWidth="">
                    {/* Header Superior */}
                    <Fade in timeout={600}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4,
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: '#247117',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 14px rgba(36, 113, 23, 0.25)'
                                    }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700} color="#1a1a1a">
                                        {getCurrentGreeting()}, {user?.name?.split(' ')[0]}! {getCurrentPeriodEmoji()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date().toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Notificações" arrow>
                                    <IconButton 
                                        sx={{ 
                                            bgcolor: alpha('#247117', 0.08),
                                            '&:hover': { bgcolor: alpha('#247117', 0.15) }
                                        }}
                                    >
                                        <Notifications sx={{ color: '#247117' }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Configurações" arrow>
                                    <IconButton 
                                        sx={{ 
                                            bgcolor: alpha('#247117', 0.08),
                                            '&:hover': { bgcolor: alpha('#247117', 0.15) }
                                        }}
                                    >
                                        <Settings sx={{ color: '#247117' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box> */}
                        </Box>
                    </Fade>

                    {/* Cards de Estatísticas */}
                    <Fade in timeout={800}>
                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #247117 0%, #1e5c12 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -20,
                                            right: -20,
                                            width: 100,
                                            height: 100,
                                            background: alpha('#ffffff', 0.1),
                                            borderRadius: '50%'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, color: theme.palette.text.white }}>
                                            Módulos Disponíveis
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700}>
                                            {visiblePermissions.length}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                            <FiberManualRecord sx={{ fontSize: 8, color: '#4ade80' }} />
                                            <Typography variant="caption" sx={{ opacity: 0.8, color: theme.palette.text.white }}>
                                                Todos ativos
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
                                        background: 'linear-gradient(135deg, #3182ce 0%, #2563eb 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -20,
                                            right: -20,
                                            width: 100,
                                            height: 100,
                                            background: alpha('#ffffff', 0.1),
                                            borderRadius: '50%'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, color: theme.palette.text.white }}>
                                            Acesso Rápido
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700}>
                                            <AccessTime sx={{ fontSize: 40, mb: -1 }} />
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block', color: theme.palette.text.white }}>
                                            Use "Recentes" para agilidade
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -20,
                                            right: -20,
                                            width: 100,
                                            height: 100,
                                            background: alpha('#ffffff', 0.1),
                                            borderRadius: '50%'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, color: theme.palette.text.white }}>
                                            Produtividade
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700}>
                                            <TrendingUp sx={{ fontSize: 40, mb: -1 }} />
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, color: theme.palette.text.white,display: 'block' }}>
                                            Sistema otimizado
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Fade>

                    {/* Seção de Módulos */}
                    <Fade in timeout={1000}>
                        <Box>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} color="#1a1a1a" sx={{ mb: 0.5 }}>
                                        Seus Módulos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Selecione um módulo para começar a trabalhar
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={`${visiblePermissions.length} disponíveis`}
                                    sx={{ 
                                        bgcolor: alpha('#247117', 0.1),
                                        color: '#247117',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>

                            <Grid container spacing={2.5}>
                                {permissions.map((item, index) => {
                                    const IconComponent = categoryIcons[index]
                                    const color = categoryColors[index]

                                    return item.view === 1 && (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                            <Grow in timeout={800 + (index * 80)}>
                                                <Card
                                                    elevation={0}
                                                    onMouseEnter={() => setHoveredCard(index)}
                                                    onMouseLeave={() => setHoveredCard(null)}
                                                    sx={{
                                                        height: '100%',
                                                        border: `2px solid ${hoveredCard === index ? color : alpha(color, 0.15)}`,
                                                        borderRadius: 3,
                                                        background: hoveredCard === index ? alpha(color, 0.02) : 'white',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        transform: hoveredCard === index ? 'translateY(-8px)' : 'translateY(0)',
                                                        boxShadow: hoveredCard === index 
                                                            ? `0 12px 40px ${alpha(color, 0.25)}` 
                                                            : '0 2px 8px rgba(0,0,0,0.04)',
                                                    }}
                                                >
                                                    <CardActionArea
                                                        component={Link}
                                                        href={`/${routes[index]}`}
                                                        sx={{ height: '100%' }}
                                                    >
                                                        <CardContent sx={{ p: 3, height: '100%' }}>
                                                            <Box sx={{ 
                                                                display: 'flex', 
                                                                flexDirection: 'column',
                                                                height: '100%'
                                                            }}>
                                                                <Box sx={{ 
                                                                    display: 'flex',
                                                                    alignItems: 'flex-start',
                                                                    justifyContent: 'space-between',
                                                                    mb: 2
                                                                }}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: color,
                                                                            width: 56,
                                                                            height: 56,
                                                                            boxShadow: `0 4px 14px ${alpha(color, 0.3)}`,
                                                                            transition: 'all 0.3s ease',
                                                                            transform: hoveredCard === index ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                                                                        }}
                                                                    >
                                                                        <IconComponent sx={{ fontSize: 28 }} />
                                                                    </Avatar>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: alpha(color, 0.1),
                                                                            color: color,
                                                                            opacity: hoveredCard === index ? 1 : 0,
                                                                            transition: 'opacity 0.3s ease',
                                                                            '&:hover': {
                                                                                bgcolor: alpha(color, 0.2),
                                                                            }
                                                                        }}
                                                                    >
                                                                        <ArrowForward fontSize="small" />
                                                                    </IconButton>
                                                                </Box>

                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        fontWeight={700}
                                                                        sx={{
                                                                            color: '#1a1a1a',
                                                                            mb: 1,
                                                                            lineHeight: 1.3
                                                                        }}
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
                                                                            overflow: 'hidden'
                                                                        }}
                                                                    >
                                                                        {categoryDescriptions[index]}
                                                                    </Typography>
                                                                </Box>

                                                                <Box sx={{ 
                                                                    mt: 2,
                                                                    pt: 2,
                                                                    borderTop: `1px solid ${alpha(color, 0.1)}`
                                                                }}>
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                          {item.view === 1 && (
                                                                            <Chip 
                                                                                label="Visualizar" 
                                                                                size="small"
                                                                                sx={{ 
                                                                                    height: 20,
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
                                                                                    height: 20,
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
                                                                                    height: 20,
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
                                                                                    height: 20,
                                                                                    fontSize: '0.7rem',
                                                                                    bgcolor: alpha(color, 0.1),
                                                                                    color: color,
                                                                                    fontWeight: 600
                                                                                }}
                                                                            />
                                                                        )}

                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grow>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Box>
                    </Fade>

                    {/* Footer com Dica */}
                    {/* <Fade in timeout={1400}>
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 5,
                                p: 3,
                                borderRadius: 3,
                                background: alpha('#f8f9fa', 0.8),
                                border: `1px solid ${alpha('#247117', 0.1)}`,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                💡 <strong>Dica:</strong> Use atalhos de teclado para navegar mais rápido pelo sistema
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Versão 2.0 • Sistema atualizado
                            </Typography>
                        </Paper>
                    </Fade> */}
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Welcome)