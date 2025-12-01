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
    Fade,
    Skeleton,
    Stack,
    useTheme,
    alpha
} from "@mui/material"
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { useEffect, useState } from "react"
import Loading from "../loading"
import Image from "next/image"
import { AuthProvider, useAuth } from "@/context"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"
import { 
    Description as DocumentIcon,
    Folder as FolderIcon,
    TrendingUp as TrendingIcon,
    AccessTime as TimeIcon,
    Person as PersonIcon,
    ArrowForward as ArrowIcon
} from "@mui/icons-material"

const allSv = new All();

const Recentes = () => {
    const { permissions } = useAuth()
    const theme = useTheme()
    const [data, setData] = useState({});
    const [countRecentsFile, setCountRecentsFile] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const getAllRecents = async () => {
        try {
            setLoading(true);
            const response = await allSv.getAllRecents();
            setData(response);
            console.log(response)
            countRecentsFiles(response);
            checkEmptyDataWithPermissions(response);
        } catch (error) {
            console.error("Erro ao buscar dados de recentes!", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const checkEmptyDataWithPermissions = (dataObject) => {
        permissions.forEach(permission => {
            const { public_name, view } = permission;
            if (view === 1) {
                const isEmpty = !(public_name in dataObject) || Object.keys(dataObject[public_name]).length === 0;
                if (isEmpty) {
                    dispatch({type: SET_ALERT, message: `A seção ${public_name} não possui documentos recentes.`, severity: "success", alertType: "file"});
                }
            }
        });
    };

    const countRecentsFiles = (dataObject) => {
        let totalCount = 0;
        for (const key in dataObject) {
            const value = dataObject[key];
            if (Array.isArray(value)) {
                totalCount += value.length;
            } else if (typeof value === 'object' && value !== null) {
                totalCount += Object.keys(value).length;
            }
        }
        setCountRecentsFile(totalCount);
    };

    // Preparar dados para os gráficos
    const prepareChartData = () => {
        const chartData = [];
        const colors = ['#247117', '#1e5c12', '#2e8b20', '#3da62e', '#4cc23c', '#5bd84a'];
        
        permissions.forEach((permission, index) => {
            const sectionKey = ['Protesto', 'RGI', 'RTD', 'RPJ', 'Ofícios', '', 'Notas'][index];
            if (permission.view === 1 && sectionKey && data[sectionKey]) {
                const count = Array.isArray(data[sectionKey]) 
                    ? data[sectionKey].length 
                    : Object.keys(data[sectionKey]).length;
                
                if (count > 0) {
                    chartData.push({
                        name: permission.public_name,
                        value: count,
                        color: colors[index % colors.length]
                    });
                }
            }
        });
        
        return chartData;
    };

    const chartData = prepareChartData();

    useEffect(() => {
        getAllRecents();
    }, []);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Função para renderizar cada seção de documentos
    const renderDocumentSection = (sectionKey, permissionIndex, linkPath, items) => {
        if (permissions[permissionIndex]?.view !== 1 || 
            !(sectionKey in data) || 
            typeof data[sectionKey] !== 'object' || 
            Object.keys(data[sectionKey]).length === 0) {
            return null;
        }

        return (
            <Fade in timeout={800}>
                <Card 
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        background: `linear-gradient(135deg, ${alpha('#247117', 0.02)} 0%, ${alpha('#247117', 0.08)} 100%)`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 40px ${alpha('#247117', 0.15)}`,
                            border: `1px solid ${alpha('#247117', 0.2)}`,
                        }
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        {/* Header da Seção */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 3
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: '#247117', 
                                        width: 48, 
                                        height: 48,
                                        boxShadow: `0 4px 12px ${alpha('#247117', 0.3)}`
                                    }}
                                >
                                    <FolderIcon />
                                </Avatar>
                                <Box>
                                    <Typography 
                                        variant="h5" 
                                        fontWeight={600}
                                        color="text.primary"
                                        sx={{ mb: 0.5 }}
                                    >
                                        {permissions[permissionIndex]?.public_name}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#247117', fontWeight: 600 }}
                                    >
                                        <TimeIcon fontSize="small" />
                                        {Object.keys(data[sectionKey]).length} documento(s) recente(s)
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Chip 
                                label={Object.keys(data[sectionKey]).length}
                                color="primary"
                                variant="filled"
                                sx={{ 
                                    bgcolor: '#247117',
                                    color: 'white',
                                    fontWeight: 600,
                                    minWidth: 48
                                }}
                            />
                        </Box>

                        {/* Grid de Documentos */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {Object.values(data[sectionKey]).map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Card 
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            backdropFilter: 'blur(10px)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 8px 25px ${alpha('#247117', 0.15)}`,
                                                border: `1px solid ${alpha('#247117', 0.3)}`,
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2.5 }}>
                                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: alpha('#247117', 0.1), 
                                                        color: '#247117',
                                                        width: 40, 
                                                        height: 40
                                                    }}
                                                >
                                                    <DocumentIcon fontSize="small" />
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        fontWeight={600}
                                                        color="text.primary"
                                                        sx={{ 
                                                            mb: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {item.presenterDocument || item.entityName}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        color="text.secondary"
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: 0.5 
                                                        }}
                                                    >
                                                        <PersonIcon fontSize="inherit" />
                                                        {item.presenterName || item.box}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Botão Ver Mais */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link href={linkPath} style={{ textDecoration: 'none' }}>
                                <Button 
                                    variant="contained"
                                    endIcon={<ArrowIcon />}
                                    sx={{
                                        bgcolor: '#247117',
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: `0 4px 12px ${alpha('#247117', 0.3)}`,
                                        '&:hover': {
                                            bgcolor: '#1e5c12',
                                            transform: 'translateY(-1px)',
                                            boxShadow: `0 6px 16px ${alpha('#247117', 0.4)}`,
                                        }
                                    }}
                                >
                                    Ver mais
                                </Button>
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>
        );
    };

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                minHeight: "100vh",
                background: "#fff",
                py: 15
            }}>
                <Container maxWidth="">
                    {/* Header Principal */}
                    <Fade in timeout={600}>
                        <Box sx={{ mb: 6 }}>
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: '#247117', 
                                            width: 60, 
                                            height: 60,
                                            boxShadow: `0 6px 20px ${alpha('#247117', 0.3)}`
                                        }}
                                    >
                                        <TrendingIcon sx={{ fontSize: 28 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="h3"
                                            fontWeight={700}
                                            color="text.primary"
                                            sx={{
                                                mb: 0.5,
                                                background: `linear-gradient(135deg, #247117 0%, #1e5c12 100%)`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                fontSize: { 
                                                    xs: '2rem', 
                                                    sm: '2.5rem', 
                                                    md: '3rem' 
                                                }
                                            }}
                                        >
                                            Documentos Recentes
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            color="text.secondary" 
                                            fontWeight={400}
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                        >
                                            <TimeIcon fontSize="small" />
                                            {countRecentsFile} arquivo(s) acessado(s) recentemente
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>

                            {/* Cards de Estatística */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card 
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, #247117 0%, #1e5c12 100%)`,
                                            color: 'white',
                                            boxShadow: `0 8px 25px ${alpha('#247117', 0.25)}`
                                        }}
                                    >
                                        <Typography variant="h4" fontWeight={700} sx={{
                                            fontWeight: 600, color: 'white'
                                        }}>
                                            {countRecentsFile}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600, color: 'white' }}>
                                            Total de Arquivos
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card 
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            borderRadius: 3,
                                            border: `1px solid ${alpha('#247117', 0.2)}`,
                                            background: alpha('#247117', 0.05)
                                        }}
                                    >
                                        <Typography variant="h4" fontWeight={700} color="#247117">
                                            {permissions.filter(p => p.view === 1).length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Seções Ativas
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Gráficos */}
                            {chartData.length > 0 && (
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    {/* Gráfico de Barras */}
                                    <Grid item xs={12} lg={7}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 3,
                                                border: `1px solid ${alpha('#247117', 0.1)}`,
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                height: 350
                                            }}
                                        >
                                            <Typography 
                                                variant="h6" 
                                                fontWeight={600} 
                                                sx={{ mb: 2, color: '#247117' }}
                                            >
                                                📊 Distribuição por Seção
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={280}>
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke={alpha('#247117', 0.1)} />
                                                    <XAxis 
                                                        dataKey="name" 
                                                        tick={{ fontSize: 12, fill: '#666' }}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={80}
                                                    />
                                                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                                                    <Tooltip 
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                            border: `1px solid ${alpha('#247117', 0.2)}`,
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Bar 
                                                        dataKey="value" 
                                                        fill="#247117"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Card>
                                    </Grid>

                                    {/* Gráfico de Pizza */}
                                    <Grid item xs={12} lg={5}>
                                        <Card 
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 3,
                                                border: `1px solid ${alpha('#247117', 0.1)}`,
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                backdropFilter: 'blur(10px)',
                                                height: 350
                                            }}
                                        >
                                            <Typography 
                                                variant="h6" 
                                                fontWeight={600} 
                                                sx={{ mb: 2, color: '#247117' }}
                                            >
                                                🥧 Proporção dos Documentos
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={280}>
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip 
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                            border: `1px solid ${alpha('#247117', 0.2)}`,
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
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </Fade>

                    {/* Seções de Documentos */}
                    <Box sx={{ mb: 4 }}>
                        {renderDocumentSection("Notas", 6, "/notes", data["Notas"])}
                        {renderDocumentSection("Protesto", 0, "/protest", data["Protesto"])}
                        {renderDocumentSection("Ofícios", 4, "/calling", data["Ofícios"])}
                        {renderDocumentSection("RGI", 1, "/rgi", data["RGI"])}
                        {renderDocumentSection("RTD", 2, "/rtd", data["RTD"])}
                        {renderDocumentSection("RPJ", 3, "/rpj", data["RPJ"])}
                    </Box>
                </Container>
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Recentes)