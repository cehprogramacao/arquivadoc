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
    Divider
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
    WavingHand as WelcomeIcon,
    Dashboard as DashboardIcon,
    TrendingUp as TrendingIcon,
    Description as TermosIcon,
    CreditCard as AutografoIcon,
    PersonSearch as SolicitantesIcon,
    PersonSearch,
    CreditCard,
    Description
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
    Description,
    CreditCard,
    PersonSearch
]

const categoryColors = [
    '#e53e3e', // Vermelho para Protesto
    '#3182ce', // Azul para RGI
    '#805ad5', // Roxo para RTD
    '#38a169', // Verde para RPJ
    '#d69e2e', // Amarelo para Ofícios
    '#00b5d8', // Ciano para Clientes
    '#dd6b20', // Laranja para Notas
    '#141414', // Preto para Recentes
    '#4a5568', // Cinza para Termos
    '#2b6cb0', // Azul escuro para Cartões de Autógrafo
    '#ed8936'  // Laranja suave para Solicitantes
]


const userSv = new User()

const Welcome = () => {
    const theme = useTheme()
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState("")
    const dispatch = useDispatch()
    const user = useSelector((state) => state.login.data)

    const getUser = async () => {
        try {
            setLoading(true);

            const data = await userSv.getUser();

            const permissionsArray = Array.isArray(data?.permissions)
                ? data.permissions
                : [];

            const recentesPermission = {
                public_name: "Recentes",
                view: 1,
                create_permission: 1,
                delete_permission: 1,
                edit: 1
            };

            const termosPermission = {
                public_name: "Termos",
                view: 1,
                create_permission: 1,
                delete_permission: 1,
                edit: 1
            };

            const cartoesAutografoPermission = {
                public_name: "Cartões de Autógrafo",
                view: 1,
                create_permission: 1,
                delete_permission: 1,
                edit: 1
            };

            const solicitantesPermission = {
                public_name: "Solicitantes",
                view: 1,
                create_permission: 1,
                delete_permission: 1,
                edit: 1
            };

            const payload = [
                ...permissionsArray,
                recentesPermission,
                termosPermission,
                cartoesAutografoPermission,
                solicitantesPermission
            ];

            setPermissions(payload);




            dispatch({
                type: SET_ALERT,
                message: "Permissões atualizadas com sucesso.",
                severity: "success",
                // alertType: "success"
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
    console.log("Permissões do usuário:", permissions)
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
                background: `linear-gradient(135deg, 
                    ${alpha('#247117', 0.05)} 0%, 
                    ${alpha('#ffffff', 0.8)} 25%, 
                    ${alpha('#e8f5e8', 0.3)} 50%,
                    ${alpha('#ffffff', 0.9)} 75%,
                    ${alpha('#247117', 0.08)} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: `radial-gradient(circle, ${alpha('#247117', 0.1)} 0%, transparent 70%)`,
                    borderRadius: '50%'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 300,
                    height: 300,
                    background: `radial-gradient(circle, ${alpha('#247117', 0.08)} 0%, transparent 70%)`,
                    borderRadius: '50%'
                },
                py: 15,
                mb: 7
            }}>
                <Container fixed>
                    {/* Header de Boas-vindas */}
                    <Fade in timeout={800}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Grow in timeout={1000}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: '#247117',
                                        mx: 'auto',
                                        mb: 3,
                                        boxShadow: `0 8px 32px ${alpha('#247117', 0.3)}`
                                    }}
                                >
                                    <WelcomeIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                            </Grow>

                            <Typography
                                variant="h2"
                                fontWeight={700}
                                sx={{
                                    mb: 1,
                                    background: `linear-gradient(135deg, #247117 0%, #1e5c12 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: {
                                        xs: '2.5rem',
                                        sm: '3rem',
                                        md: '3.5rem',
                                        lg: '4rem'
                                    },
                                    lineHeight: 1.2
                                }}
                            >
                                {getCurrentGreeting()}, {user?.name}!
                            </Typography>

                            <Typography
                                variant="h5"
                                color="text.secondary"
                                fontWeight={400}
                                sx={{
                                    mb: 4,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                                }}
                            >
                                Bem-vindo de volta! Escolha uma categoria para começar
                            </Typography>

                            {/* Stats Cards */}
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: alpha('#247117', 0.08),
                                            border: `1px solid ${alpha('#247117', 0.2)}`,
                                            borderRadius: 3,
                                        }}
                                    >
                                        <Typography variant="h4" fontWeight={700} color="#247117">
                                            {visiblePermissions.length}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Módulos Ativos
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            py: 2,
                                            px: 5,
                                            textAlign: 'center',
                                            background: alpha('#3182ce', 0.08),
                                            border: `1px solid ${alpha('#3182ce', 0.2)}`,
                                            borderRadius: 3
                                        }}
                                    >
                                        <Typography variant="h4" fontWeight={700} color="#3182ce">
                                            {new Date().toLocaleDateString('pt-BR', { day: '2-digit' })}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Hoje
                                        </Typography>
                                    </Paper>
                                </Grid>
                                {/* <Grid item xs={12} sm={4}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: alpha('#805ad5', 0.08),
                                            border: `1px solid ${alpha('#805ad5', 0.2)}`,
                                            borderRadius: 3
                                        }}
                                    >
                                        <Typography variant="h4" fontWeight={700} color="#805ad5">
                                            ✨
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Novo Design
                                        </Typography>
                                    </Paper>
                                </Grid> */}
                            </Grid>
                        </Box>
                    </Fade>

                    {/* Seção Principal - Recentes */}
                    <Fade in timeout={1200}>
                        <Box sx={{ mt: 4 }}>
                            <Grid container spacing={3} alignItems='center' justifyContent='center'>
                                {/* <Grid item xs={12} md={12}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            background: `linear-gradient(135deg, #247117 0%, #1e5c12 100%)`,
                                            color: 'white',
                                            borderRadius: 4,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: `0 20px 40px ${alpha('#247117', 0.3)}`
                                            },
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
                                        component={Link}
                                        href="/recentes"
                                    >
                                        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                                        Recentes
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                        Acesse rapidamente seus documentos mais recentes
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mt: 2
                                                }}>
                                                    <TrendingIcon fontSize="small" />
                                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                        Acesso rápido
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid> */}

                                <Grid item xs={12} md={12}>
                                    <Typography
                                        variant="h4"
                                        fontWeight={600}
                                        sx={{ mb: 3, color: '#247117' }}
                                    >
                                        📂 Categorias Disponíveis
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {permissions.map((item, index) => {
                                            const IconComponent = categoryIcons[index]
                                            const color = categoryColors[index]

                                            return item.view === 1 && (
                                                <Grid item xs={6} sm={4} md={4} lg={4} key={index} spacing={2}>
                                                    <Grow in timeout={1000 + (index * 100)}>
                                                        <Card
                                                            elevation={1}
                                                            sx={{
                                                                height: '100%',
                                                                cursor: 'pointer',
                                                                border: `1px solid ${alpha(color, 0.2)}`,
                                                                borderRadius: 3,
                                                                background: alpha(color, 0.05),
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-4px)',
                                                                    boxShadow: `0 12px 28px ${alpha(color, 0.25)}`,
                                                                    border: `1px solid ${alpha(color, 0.4)}`,
                                                                    background: alpha(color, 0.1)
                                                                },
                                                                textDecoration: "none"
                                                            }}
                                                            component={Link}
                                                            href={`/${routes[index]}`}
                                                        >
                                                            <CardContent sx={{ p: 3 }}>
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={2}
                                                                    alignItems="center"
                                                                    sx={{
                                                                        textDecoration: 'none',
                                                                    }}
                                                                >
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: color,
                                                                            width: 50,
                                                                            height: 50
                                                                        }}
                                                                    >
                                                                        <IconComponent sx={{ color: 'white' }} />
                                                                    </Avatar>
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Typography
                                                                            variant="h6"
                                                                            fontWeight={600}
                                                                            sx={{
                                                                                color: color,
                                                                                mb: 0.5,
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            {item.public_name}
                                                                        </Typography>
                                                                        <Typography
                                                                            sx={{
                                                                                textDecoration: "none",
                                                                                fontSize: 14,
                                                                                color: color,
                                                                                overflow: 'hidden',
                                                                            }}
                                                                        >
                                                                            Clique para acessar
                                                                        </Typography>

                                                                    </Box>
                                                                </Stack>
                                                            </CardContent>
                                                        </Card>
                                                    </Grow>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Fade>

                    {/* Rodapé com informações extras */}
                    {/* <Fade in timeout={1600}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                background: alpha('#f7f7f7', 0.5),
                                border: `1px solid ${alpha('#247117', 0.1)}`,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                💡 <strong>Dica:</strong> Use o módulo "Recentes" para acesso rápido aos seus documentos mais utilizados
                            </Typography>
                            <Divider sx={{ my: 2, opacity: 0.3 }} />
                            <Typography variant="caption" color="text.secondary">
                                Sistema atualizado • {new Date().toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Paper>
                    </Fade> */}
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Welcome)