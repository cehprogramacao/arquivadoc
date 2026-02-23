"use client"
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Chip,
    Divider,
    Button,
    TextField,
    alpha,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Avatar,
    Card,
    CardContent,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    ArrowBack,
    FamilyRestroom,
    Person,
    CalendarMonth,
    MenuBook,
    Description,
    VerifiedUser,
    Add,
    Print,
    Badge,
    Groups
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RegistroCivil from '@/services/registroCivil.service';
import Loading from '@/Components/loading';
import withAuth from '@/utils/withAuth';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import { useDispatch } from 'react-redux';
import { SET_ALERT } from '@/store/actions';

const registroCivilSv = new RegistroCivil();

const TIPO_COLORS = {
    nascimento: { color: "#2196F3", bg: "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)" },
    casamento: { color: "#E91E63", bg: "linear-gradient(135deg, #AD1457 0%, #F06292 100%)" },
    obito: { color: "#616161", bg: "linear-gradient(135deg, #37474F 0%, #90A4AE 100%)" },
    natimorto: { color: "#78909C", bg: "linear-gradient(135deg, #455A64 0%, #B0BEC5 100%)" },
    habilitacao_casamento: { color: "#FF7043", bg: "linear-gradient(135deg, #D84315 0%, #FF8A65 100%)" },
    emancipacao: { color: "#26A69A", bg: "linear-gradient(135deg, #00695C 0%, #4DB6AC 100%)" },
    adocao: { color: "#247117", bg: "linear-gradient(135deg, #1a5511 0%, #2d8a1f 100%)" },
    registro_tardio: { color: "#5C6BC0", bg: "linear-gradient(135deg, #283593 0%, #7986CB 100%)" },
};

const DEFAULT_TIPO_STYLE = { color: "#237117", bg: "linear-gradient(135deg, #1a5511 0%, #2d8a1f 100%)" };

const getTipoConfig = (tipo) => {
    const style = TIPO_COLORS[tipo] || DEFAULT_TIPO_STYLE;
    const label = tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' ') : "Registro";
    return { ...style, label };
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

const SectionHeader = ({ icon: Icon, title, color = "#237117", action }) => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2.5,
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 40,
                height: 40,
            }}>
                <Icon sx={{ fontSize: 22 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700} color="#1a1a1a">
                {title}
            </Typography>
        </Box>
        {action}
    </Box>
);

const InfoItem = ({ label, value, xs = 6 }) => (
    <Grid item xs={xs}>
        <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#f8faf8',
            border: '1px solid #e8f5e9',
            height: '100%'
        }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography fontWeight={600} sx={{ mt: 0.5, fontSize: '0.95rem' }}>
                {value || "-"}
            </Typography>
        </Box>
    </Grid>
);

const DetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { permissions } = useAuth();
    const [loading, setLoading] = useState(true);
    const [registro, setRegistro] = useState(null);
    const [averbacoes, setAverbacoes] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [certidoes, setCertidoes] = useState([]);

    const [openAverbacao, setOpenAverbacao] = useState(false);
    const [openCertidao, setOpenCertidao] = useState(false);

    const [novaAverbacao, setNovaAverbacao] = useState({
        descricao: "",
        data_averbacao: "",
        livro: "",
        folha: "",
        termo: ""
    });

    const [tipoCertidao, setTipoCertidao] = useState("");

    const createPerm = permissions?.find(p => p?.public_name === 'Registro Civil')?.create_permission;

    const fetchData = async () => {
        try {
            setLoading(true);
            const id = params.id;
            const registroData = await registroCivilSv.getById(id);
            setRegistro(registroData);

            const averbacoesData = await registroCivilSv.getAverbacoes(id);
            setAverbacoes(Object.values(averbacoesData));

            const documentosData = await registroCivilSv.getDocumentos(id);
            setDocumentos(Object.values(documentosData));

            const certidoesData = await registroCivilSv.getCertidoes(id);
            setCertidoes(Object.values(certidoesData));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddAverbacao = async () => {
        try {
            await registroCivilSv.addAverbacao(params.id, novaAverbacao);
            dispatch({ type: SET_ALERT, message: "Averbacao adicionada!", severity: "success", alertType: "file" });
            setOpenAverbacao(false);
            setNovaAverbacao({ descricao: "", data_averbacao: "", livro: "", folha: "", termo: "" });
            fetchData();
        } catch (err) {
            dispatch({ type: SET_ALERT, message: err.message, severity: "error", alertType: "file" });
        }
    };

    const handleEmitirCertidao = async () => {
        try {
            const result = await registroCivilSv.emitirCertidao(params.id, { tipo: tipoCertidao });

            if (result.pdf_base64) {
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${result.pdf_base64}`;
                link.download = `certidao_${params.id}_${result.codigo_validacao}.pdf`;
                link.click();
            }

            dispatch({ type: SET_ALERT, message: "Certidao emitida!", severity: "success", alertType: "file" });
            setOpenCertidao(false);
            setTipoCertidao("");
            fetchData();
        } catch (err) {
            dispatch({ type: SET_ALERT, message: err.message, severity: "error", alertType: "file" });
        }
    };

    if (loading) return <Loading />;
    if (!registro) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
            <FamilyRestroom sx={{ fontSize: 64, color: '#ccc' }} />
            <Typography variant="h6" color="text.secondary">Registro nao encontrado.</Typography>
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => router.push('/registro-civil')}
                sx={{ borderColor: '#237117', color: '#237117' }}
            >
                Voltar
            </Button>
        </Box>
    );

    const tipoConfig = getTipoConfig(registro.tipo);

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Registro Civil']}>
                <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fafafa' }}>
                    {/* Header */}
                    <Box
                        sx={{
                            background: tipoConfig.bg,
                            pt: 14,
                            pb: 5,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                                pointerEvents: 'none',
                            }
                        }}
                    >
                        <Container maxWidth="lg">
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Button
                                    startIcon={<ArrowBack />}
                                    onClick={() => router.push('/registro-civil')}
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        mb: 2,
                                        textTransform: 'none',
                                        '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Voltar para Registro Civil
                                </Button>

                                <Box display="flex" alignItems="center" gap={2.5}>
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                        }}
                                    >
                                        <FamilyRestroom sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
                                            {registro.tipo_descricao || tipoConfig.label}
                                        </Typography>
                                        <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: '1.1rem', mt: 0.5 }}>
                                            {registro.nome_principal}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={`Livro ${registro.livro}`}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
                                            />
                                            <Chip
                                                label={`Folha ${registro.folha}`}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
                                            />
                                            <Chip
                                                label={`Termo ${registro.termo}`}
                                                size="small"
                                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
                                            />
                                            <Chip
                                                label={registro.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: registro.status === 'ativo' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    border: '1px solid rgba(255,255,255,0.3)'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
                    </Box>

                    <Container maxWidth="lg" sx={{ mt: -3, pb: 6, position: 'relative', zIndex: 2 }}>
                        <Grid container spacing={3}>
                            {/* Dados do Registro */}
                            <Grid item xs={12} md={6}>
                                <Card elevation={0} sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e5e7eb',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={MenuBook} title="Dados do Registro" color={tipoConfig.color} />
                                        <Grid container spacing={1.5}>
                                            <InfoItem label="Livro" value={registro.livro} xs={4} />
                                            <InfoItem label="Folha" value={registro.folha} xs={4} />
                                            <InfoItem label="Termo" value={registro.termo} xs={4} />
                                            <InfoItem label="Data do Registro" value={formatDate(registro.data_registro)} />
                                            <InfoItem label="Tipo" value={registro.tipo_descricao || tipoConfig.label} />
                                            <InfoItem label="Nome Principal" value={registro.nome_principal} xs={12} />
                                            {registro.nome_secundario && (
                                                <InfoItem label="Nome Secundario" value={registro.nome_secundario} xs={12} />
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Pessoas Vinculadas */}
                            <Grid item xs={12} md={6}>
                                <Card elevation={0} sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e5e7eb',
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader icon={Groups} title="Pessoas Vinculadas" color={tipoConfig.color} />
                                        {registro.pessoas && registro.pessoas.length > 0 ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                {registro.pessoas.map((pessoa, idx) => (
                                                    <Box
                                                        key={idx}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            border: '1px solid',
                                                            borderColor: alpha(tipoConfig.color, 0.15),
                                                            bgcolor: alpha(tipoConfig.color, 0.02),
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                borderColor: alpha(tipoConfig.color, 0.3),
                                                                bgcolor: alpha(tipoConfig.color, 0.05),
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar sx={{
                                                                width: 36,
                                                                height: 36,
                                                                bgcolor: alpha(tipoConfig.color, 0.1),
                                                                color: tipoConfig.color,
                                                            }}>
                                                                <Person sx={{ fontSize: 18 }} />
                                                            </Avatar>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                                                                    <Typography fontWeight={600} fontSize="0.95rem">
                                                                        {pessoa.nome}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={pessoa.tipo_participacao?.toUpperCase()}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 20,
                                                                            fontSize: '0.65rem',
                                                                            fontWeight: 700,
                                                                            bgcolor: alpha(tipoConfig.color, 0.1),
                                                                            color: tipoConfig.color,
                                                                        }}
                                                                    />
                                                                </Box>
                                                                {pessoa.cpf && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        CPF: {pessoa.cpf}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <Groups sx={{ fontSize: 48, color: '#e0e0e0', mb: 1 }} />
                                                <Typography color="text.secondary">Nenhuma pessoa vinculada.</Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Documento PDF */}
                            {registro.file && (
                                <Grid item xs={12}>
                                    <Card elevation={0} sx={{
                                        borderRadius: 3,
                                        border: '1px solid #e5e7eb',
                                        overflow: 'hidden',
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <SectionHeader icon={Description} title="Documento Digitalizado" color={tipoConfig.color} />
                                            <Box sx={{
                                                width: '100%',
                                                height: 650,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                border: '1px solid #e5e7eb',
                                            }}>
                                                <iframe
                                                    src={`data:application/pdf;base64,${registro.file}`}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 'none' }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Averbacoes */}
                            <Grid item xs={12}>
                                <Card elevation={0} sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader
                                            icon={Badge}
                                            title="Averbacoes"
                                            color={tipoConfig.color}
                                            action={createPerm === 1 && (
                                                <Button
                                                    startIcon={<Add />}
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => setOpenAverbacao(true)}
                                                    sx={{
                                                        bgcolor: '#237117',
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        px: 2.5,
                                                        '&:hover': { bgcolor: '#1a5511' }
                                                    }}
                                                >
                                                    Nova Averbacao
                                                </Button>
                                            )}
                                        />
                                        {averbacoes.length > 0 ? (
                                            <TableContainer sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ bgcolor: '#f8faf8' }}>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Data</TableCell>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Descricao</TableCell>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Livro/Folha/Termo</TableCell>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Criado por</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {averbacoes.map((av) => (
                                                            <TableRow
                                                                key={av.id}
                                                                sx={{
                                                                    '&:hover': { bgcolor: '#f8faf8' },
                                                                    transition: 'background 0.2s ease'
                                                                }}
                                                            >
                                                                <TableCell>{formatDate(av.data_averbacao)}</TableCell>
                                                                <TableCell>{av.descricao}</TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                        {av.livro && <Chip label={`L.${av.livro}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />}
                                                                        {av.folha && <Chip label={`F.${av.folha}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />}
                                                                        {av.termo && <Chip label={`T.${av.termo}`} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.7rem' }} />}
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>{av.created_by_name}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <Badge sx={{ fontSize: 48, color: '#e0e0e0', mb: 1 }} />
                                                <Typography color="text.secondary">Nenhuma averbacao registrada.</Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Certidoes */}
                            <Grid item xs={12}>
                                <Card elevation={0} sx={{
                                    borderRadius: 3,
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <SectionHeader
                                            icon={VerifiedUser}
                                            title="Certidoes Emitidas"
                                            color={tipoConfig.color}
                                            action={createPerm === 1 && (
                                                <Button
                                                    startIcon={<Print />}
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => setOpenCertidao(true)}
                                                    sx={{
                                                        bgcolor: '#237117',
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        px: 2.5,
                                                        '&:hover': { bgcolor: '#1a5511' }
                                                    }}
                                                >
                                                    Emitir Certidao
                                                </Button>
                                            )}
                                        />
                                        {certidoes.length > 0 ? (
                                            <TableContainer sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ bgcolor: '#f8faf8' }}>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Tipo</TableCell>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Codigo de Validacao</TableCell>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Emitida por</TableCell>
                                                            <TableCell sx={{ fontWeight: 700, color: '#237117' }}>Data</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {certidoes.map((cert) => (
                                                            <TableRow
                                                                key={cert.id}
                                                                sx={{
                                                                    '&:hover': { bgcolor: '#f8faf8' },
                                                                    transition: 'background 0.2s ease'
                                                                }}
                                                            >
                                                                <TableCell>
                                                                    <Chip
                                                                        label={cert.tipo?.replace(/_/g, ' ')}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: alpha(tipoConfig.color, 0.1),
                                                                            color: tipoConfig.color,
                                                                            fontWeight: 600,
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography sx={{
                                                                        fontFamily: 'monospace',
                                                                        fontSize: '0.8rem',
                                                                        bgcolor: '#f5f5f5',
                                                                        px: 1,
                                                                        py: 0.3,
                                                                        borderRadius: 1,
                                                                        display: 'inline-block',
                                                                    }}>
                                                                        {cert.codigo_validacao}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>{cert.emitida_por_name}</TableCell>
                                                                <TableCell>{formatDate(cert.created_at)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <VerifiedUser sx={{ fontSize: 48, color: '#e0e0e0', mb: 1 }} />
                                                <Typography color="text.secondary">Nenhuma certidao emitida.</Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Dialog: Nova Averbacao */}
                <Dialog
                    open={openAverbacao}
                    onClose={() => setOpenAverbacao(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle sx={{
                        bgcolor: '#237117',
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Add /> Nova Averbacao
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
                            <TextField
                                label="Descricao"
                                multiline
                                rows={3}
                                value={novaAverbacao.descricao}
                                onChange={(e) => setNovaAverbacao({ ...novaAverbacao, descricao: e.target.value })}
                                color="success"
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <TextField
                                type="date"
                                label="Data da Averbacao"
                                InputLabelProps={{ shrink: true }}
                                value={novaAverbacao.data_averbacao}
                                onChange={(e) => setNovaAverbacao({ ...novaAverbacao, data_averbacao: e.target.value })}
                                color="success"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                            <Box display="flex" gap={1.5}>
                                <TextField
                                    label="Livro"
                                    value={novaAverbacao.livro}
                                    onChange={(e) => setNovaAverbacao({ ...novaAverbacao, livro: e.target.value })}
                                    color="success"
                                    fullWidth
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    label="Folha"
                                    value={novaAverbacao.folha}
                                    onChange={(e) => setNovaAverbacao({ ...novaAverbacao, folha: e.target.value })}
                                    color="success"
                                    fullWidth
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    label="Termo"
                                    value={novaAverbacao.termo}
                                    onChange={(e) => setNovaAverbacao({ ...novaAverbacao, termo: e.target.value })}
                                    color="success"
                                    fullWidth
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, gap: 1 }}>
                        <Button
                            onClick={() => setOpenAverbacao(false)}
                            sx={{ borderRadius: 2, textTransform: 'none', color: '#666' }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddAverbacao}
                            variant="contained"
                            sx={{
                                bgcolor: '#237117',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                '&:hover': { bgcolor: '#1a5511' }
                            }}
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog: Emitir Certidao */}
                <Dialog
                    open={openCertidao}
                    onClose={() => setOpenCertidao(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 3 } }}
                >
                    <DialogTitle sx={{
                        bgcolor: '#237117',
                        color: '#fff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Print /> Emitir Certidao
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box mt={1}>
                            <Autocomplete
                                options={[
                                    { label: "Breve Relato", value: "breve_relato" },
                                    { label: "Inteiro Teor (Digitada)", value: "inteiro_teor_digitada" },
                                    { label: "Inteiro Teor (Reprografica)", value: "inteiro_teor_reprografica" },
                                ]}
                                getOptionLabel={(opt) => opt.label}
                                onChange={(_, val) => setTipoCertidao(val?.value || "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo de Certidao"
                                        color="success"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                )}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2.5, gap: 1 }}>
                        <Button
                            onClick={() => setOpenCertidao(false)}
                            sx={{ borderRadius: 2, textTransform: 'none', color: '#666' }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEmitirCertidao}
                            variant="contained"
                            sx={{
                                bgcolor: '#237117',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                '&:hover': { bgcolor: '#1a5511' }
                            }}
                            disabled={!tipoCertidao}
                        >
                            Emitir
                        </Button>
                    </DialogActions>
                </Dialog>
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(DetailPage);
