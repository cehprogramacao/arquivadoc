"use client"
import SnackBar from '@/Components/SnackBar';
import Loading from '@/Components/loading';
import User from '@/services/user.service';
import { SET_ALERT } from '@/store/actions';
import withAuth from '@/utils/withAuth';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Card,
    CardContent,
    InputAdornment,
    IconButton,
    alpha,
    Fade,
    LinearProgress,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    CheckCircle,
    Cancel,
    Security,
    VpnKey,
    Shield
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const userSv = new User();

const ChangePassword = () => {
    const [password, setPassword] = useState({
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const validatePassword = (pass) => {
        const validations = {
            length: pass.length >= 8,
            uppercase: /[A-Z]/.test(pass),
            lowercase: /[a-z]/.test(pass),
            number: /[0-9]/.test(pass),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        };
        return validations;
    };

    const getPasswordStrength = (pass) => {
        const validations = validatePassword(pass);
        const score = Object.values(validations).filter(Boolean).length;
        
        if (score === 0) return { value: 0, label: '', color: '' };
        if (score <= 2) return { value: 40, label: 'Fraca', color: '#e53e3e' };
        if (score === 3) return { value: 60, label: 'Média', color: '#d69e2e' };
        if (score === 4) return { value: 80, label: 'Boa', color: '#38a169' };
        return { value: 100, label: 'Excelente', color: '#247117' };
    };

    const passwordStrength = getPasswordStrength(password.password);
    const validations = validatePassword(password.password);

    const handleChangePassword = async () => {
        const newErrors = {};

        if (!password.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.password.length < 8) {
            newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
        }

        if (!password.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (password.password !== password.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            dispatch({
                type: SET_ALERT,
                message: 'Por favor, corrija os erros no formulário',
                severity: 'error',
                alertType: "user"
            });
            return;
        }

        try {
            setLoading(true);
            const data = await userSv.changeUserPassword({ password: password.password });
            dispatch({
                type: SET_ALERT,
                message: 'Senha atualizada com sucesso!',
                severity: 'success',
                alertType: "user"
            });
            setPassword({ password: "", confirmPassword: "" });
            setErrors({});
        } catch (error) {
            console.error("Erro ao alterar senha!", error);
            dispatch({
                type: SET_ALERT,
                message: 'Erro ao atualizar senha!',
                severity: "error",
                alertType: 'user'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(prev => ({ ...prev, password: value }));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setPassword(prev => ({ ...prev, confirmPassword: value }));
        if (errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    };

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fdf9 0%, #ffffff 50%, #f0f9f4 100%)',
            py: { xs: 8, md: 15 },
            px: 2
        }}>
            <Container maxWidth="md">
                <Fade in timeout={600}>
                    <Box>
                        {/* Header */}
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #247117 0%, #1e5c12 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 8px 32px rgba(36, 113, 23, 0.25)'
                            }}>
                                <Security sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h3"
                                fontWeight={700}
                                sx={{
                                    mb: 1,
                                    color: '#1a1a1a',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                }}
                            >
                                Alterar Senha
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Crie uma senha forte para manter sua conta segura
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                            {/* Formulário */}
                            <Card
                                elevation={0}
                                sx={{
                                    flex: 1,
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: alpha('#247117', 0.1),
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Campo Nova Senha */}
                                        <Box>
                                            <TextField
                                                fullWidth
                                                label="Nova Senha"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password.password}
                                                onChange={handlePasswordChange}
                                                error={Boolean(errors.password)}
                                                helperText={errors.password}
                                                color="success"
                                                placeholder="Digite sua nova senha"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockIcon sx={{ color: '#247117' }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover': {
                                                            boxShadow: `0 0 0 2px ${alpha('#247117', 0.1)}`
                                                        }
                                                    }
                                                }}
                                            />

                                            {/* Indicador de Força da Senha */}
                                            {password.password && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Força da senha
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            fontWeight={600}
                                                            sx={{ color: passwordStrength.color }}
                                                        >
                                                            {passwordStrength.label}
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={passwordStrength.value}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: alpha('#000', 0.08),
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: passwordStrength.color,
                                                                borderRadius: 4
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Campo Confirmar Senha */}
                                        <TextField
                                            fullWidth
                                            label="Confirmar Nova Senha"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={password.confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            error={Boolean(errors.confirmPassword)}
                                            helperText={errors.confirmPassword}
                                            color="success"
                                            placeholder="Digite novamente sua senha"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <VpnKey sx={{ color: '#247117' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        boxShadow: `0 0 0 2px ${alpha('#247117', 0.1)}`
                                                    }
                                                }
                                            }}
                                        />

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={handleChangePassword}
                                            disabled={!password.password || !password.confirmPassword}
                                            sx={{
                                                mt: 2,
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                background: 'linear-gradient(135deg, #247117 0%, #1e5c12 100%)',
                                                boxShadow: '0 4px 14px rgba(36, 113, 23, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #1e5c12 0%, #247117 100%)',
                                                    boxShadow: '0 6px 20px rgba(36, 113, 23, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                '&.Mui-disabled': {
                                                    background: alpha('#247117', 0.3),
                                                    color: alpha('#fff', 0.5)
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Atualizar Senha
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Painel de Requisitos */}
                            <Card
                                elevation={0}
                                sx={{
                                    width: { xs: '100%', md: '340px' },
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: alpha('#247117', 0.1),
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    background: alpha('#f8fdf9', 0.5)
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Shield sx={{ color: '#247117' }} />
                                        <Typography variant="h6" fontWeight={600}>
                                            Requisitos da Senha
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <List dense sx={{ p: 0 }}>
                                        <ListItem sx={{ px: 0, py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                {validations.length ? (
                                                    <CheckCircle sx={{ color: '#38a169', fontSize: 20 }} />
                                                ) : (
                                                    <Cancel sx={{ color: alpha('#000', 0.26), fontSize: 20 }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Mínimo de 8 caracteres"
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    color: validations.length ? '#38a169' : 'text.secondary'
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0, py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                {validations.uppercase ? (
                                                    <CheckCircle sx={{ color: '#38a169', fontSize: 20 }} />
                                                ) : (
                                                    <Cancel sx={{ color: alpha('#000', 0.26), fontSize: 20 }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Uma letra maiúscula"
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    color: validations.uppercase ? '#38a169' : 'text.secondary'
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0, py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                {validations.lowercase ? (
                                                    <CheckCircle sx={{ color: '#38a169', fontSize: 20 }} />
                                                ) : (
                                                    <Cancel sx={{ color: alpha('#000', 0.26), fontSize: 20 }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Uma letra minúscula"
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    color: validations.lowercase ? '#38a169' : 'text.secondary'
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0, py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                {validations.number ? (
                                                    <CheckCircle sx={{ color: '#38a169', fontSize: 20 }} />
                                                ) : (
                                                    <Cancel sx={{ color: alpha('#000', 0.26), fontSize: 20 }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Um número"
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    color: validations.number ? '#38a169' : 'text.secondary'
                                                }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0, py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                {validations.special ? (
                                                    <CheckCircle sx={{ color: '#38a169', fontSize: 20 }} />
                                                ) : (
                                                    <Cancel sx={{ color: alpha('#000', 0.26), fontSize: 20 }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Um caractere especial"
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    color: validations.special ? '#38a169' : 'text.secondary'
                                                }}
                                            />
                                        </ListItem>
                                    </List>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            borderRadius: 2,
                                            background: alpha('#247117', 0.05),
                                            border: `1px solid ${alpha('#247117', 0.15)}`
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                            💡 <strong>Dica de Segurança:</strong>
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Use uma combinação única de letras, números e símbolos. Evite informações pessoais óbvias.
                                        </Typography>
                                    </Paper>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default withAuth(ChangePassword);