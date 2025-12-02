"use client"
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    FormControl,
    OutlinedInput,
    Grid,
    Container,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Snackbar,
    InputAdornment,
    IconButton,
    Tooltip,
    Fade,
    LinearProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomContainer from '@/Components/CustomContainer';
import withIsAdmin from '@/utils/isAdmin';
import User from '@/services/user.service';
import Loading from '@/Components/loading';
import ReactInputMask from 'react-input-mask';
import withAuth from '@/utils/withAuth';
import { useRouter } from 'next/navigation';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(35, 113, 23, 0.12)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 12px 48px rgba(35, 113, 23, 0.18)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '12px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(35, 113, 23, 0.3)',
    },
}));

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(35, 113, 23, 0.15)',
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 16px rgba(35, 113, 23, 0.25)',
        },
    },
});

const user = new User();
const numberMaskEstruct = '(99) 99999-9999';
const steps = ['Dados do Usuário', 'Permissões'];

const AddUser = () => {
    const [numberMask, setNumberMask] = useState(numberMaskEstruct);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        permissions: Array(7).fill().map(() => Array(4).fill(0)),
    });
    
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        return phone.replace(/\D/g, '').length >= 10;
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!userData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }
        
        if (!userData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(userData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!userData.phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (!validatePhone(userData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }
        
        if (!userData.password.trim()) {
            newErrors.password = 'Senha é obrigatória';
        } else if (!validatePassword(userData.password)) {
            newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckedPermission = (permIndex, checkboxIndex) => {
        const newPermissions = userData.permissions.map((perm, index) =>
            index === permIndex ? perm.map((value, cIndex) =>
                cIndex === checkboxIndex ? (value === 0 ? 1 : 0) : value
            ) : perm
        );

        setUserData({ ...userData, permissions: newPermissions });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleInputChange = (e) => {
        setUserData({ ...userData, phone: e.target.value.replace(/[^\d]+/g, '') });
        if (errors.phone) {
            setErrors({ ...errors, phone: '' });
        }
    };

    const handleNext = () => {
        if (validateForm()) {
            setActiveStep(1);
        } else {
            setSnackbar({
                open: true,
                message: 'Por favor, preencha todos os campos corretamente',
                severity: 'error'
            });
        }
    };

    const handleSend = async () => {
        try {
            setLoading(true);
            const data = await user.addUserByAdmin(userData);
            setSnackbar({
                open: true,
                message: 'Usuário adicionado com sucesso!',
                severity: 'success'
            });
            setTimeout(() => {
                router.push("/usuarios");
            }, 1500);
            return data;
        } catch (error) {
            console.log('Erro ao adicionar usuário!', error);
            setSnackbar({
                open: true,
                message: 'Erro ao adicionar usuário. Tente novamente.',
                severity: 'error'
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setActiveStep(0);
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return 0;
        if (password.length < 6) return 25;
        if (password.length < 8) return 50;
        if (password.length < 10) return 75;
        return 100;
    };

    const passwordStrength = getPasswordStrength(userData.password);

    return loading ? <Loading /> : (
        <Box sx={{
            width: "100%",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%)",
            px: 2,
            py: 4,
        }}>
            <CustomContainer>
                <Container maxWidth="md">
                    <Fade in timeout={800}>
                        <Box>
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    textAlign: 'center', 
                                    mb: 4,
                                    fontWeight: 700,
                                    color: '#237117',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                Adicionar Novo Usuário
                            </Typography>

                            <StyledCard sx={{ mb: 4 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel 
                                                    StepIconProps={{
                                                        sx: {
                                                            '&.Mui-active': { color: '#237117' },
                                                            '&.Mui-completed': { color: '#237117' },
                                                        }
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    {activeStep === 0 && (
                                        <Fade in timeout={600}>
                                            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                                <StyledTextField
                                                    label="Nome Completo"
                                                    name="name"
                                                    variant="outlined"
                                                    color="success"
                                                    value={userData.name}
                                                    onChange={handleChange}
                                                    error={Boolean(errors.name)}
                                                    helperText={errors.name}
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PersonIcon sx={{ color: '#237117' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <StyledTextField
                                                    label="Email"
                                                    name="email"
                                                    variant="outlined"
                                                    type="email"
                                                    color="success"
                                                    value={userData.email}
                                                    onChange={handleChange}
                                                    error={Boolean(errors.email)}
                                                    helperText={errors.email}
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <EmailIcon sx={{ color: '#237117' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />

                                                <FormControl fullWidth error={Boolean(errors.phone)}>
                                                    <ReactInputMask
                                                        mask={numberMask}
                                                        value={userData.phone}
                                                        onChange={handleInputChange}
                                                        name="phone"
                                                    >
                                                        {(inputProps) => (
                                                            <StyledTextField
                                                                {...inputProps}
                                                                label="Telefone"
                                                                color="success"
                                                                error={Boolean(errors.phone)}
                                                                helperText={errors.phone}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <PhoneIcon sx={{ color: '#237117' }} />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                    </ReactInputMask>
                                                </FormControl>

                                                <Box>
                                                    <StyledTextField
                                                        label="Senha"
                                                        name="password"
                                                        variant="outlined"
                                                        type={showPassword ? 'text' : 'password'}
                                                        color="success"
                                                        value={userData.password}
                                                        onChange={handleChange}
                                                        error={Boolean(errors.password)}
                                                        helperText={errors.password}
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LockIcon sx={{ color: '#237117' }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    {userData.password && (
                                                        <Box sx={{ mt: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Força da senha:
                                                                </Typography>
                                                                <Typography 
                                                                    variant="caption" 
                                                                    sx={{ 
                                                                        fontWeight: 600,
                                                                        color: passwordStrength < 50 ? '#d32f2f' : 
                                                                               passwordStrength < 75 ? '#ed6c02' : '#237117'
                                                                    }}
                                                                >
                                                                    {passwordStrength < 50 ? 'Fraca' : 
                                                                     passwordStrength < 75 ? 'Média' : 'Forte'}
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={passwordStrength}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    backgroundColor: '#e0e0e0',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        backgroundColor: passwordStrength < 50 ? '#d32f2f' : 
                                                                                       passwordStrength < 75 ? '#ed6c02' : '#237117'
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Fade>
                                    )}

                                    {activeStep === 1 && (
                                        <Fade in timeout={600}>
                                            <Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center',
                                                    mb: 3,
                                                    flexWrap: 'wrap',
                                                    gap: 2
                                                }}>
                                                    <Typography 
                                                        variant="h6" 
                                                        sx={{ fontWeight: 600, color: '#237117' }}
                                                    >
                                                        Configure as permissões de acesso
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Conceder todas as permissões" arrow>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => {
                                                                    const allPermissions = Array(7).fill().map(() => Array(4).fill(1));
                                                                    setUserData({ ...userData, permissions: allPermissions });
                                                                }}
                                                                sx={{
                                                                    background: "linear-gradient(135deg, #237117 0%, #2d8b1f 100%)",
                                                                    color: '#fff',
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    fontSize: '0.875rem',
                                                                    px: 2,
                                                                    '&:hover': {
                                                                        background: "linear-gradient(135deg, #1a5a11 0%, #237117 100%)",
                                                                    }
                                                                }}
                                                            >
                                                                Selecionar Tudo
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip title="Remover todas as permissões" arrow>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    const noPermissions = Array(7).fill().map(() => Array(4).fill(0));
                                                                    setUserData({ ...userData, permissions: noPermissions });
                                                                }}
                                                                sx={{
                                                                    borderColor: "#237117",
                                                                    color: '#237117',
                                                                    borderRadius: '8px',
                                                                    textTransform: 'none',
                                                                    fontSize: '0.875rem',
                                                                    px: 2,
                                                                    '&:hover': {
                                                                        borderColor: "#237117",
                                                                        backgroundColor: 'rgba(35, 113, 23, 0.04)',
                                                                    }
                                                                }}
                                                            >
                                                                Limpar Tudo
                                                            </Button>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                                <TableContainer 
                                                    component={Paper} 
                                                    sx={{ 
                                                        borderRadius: '12px',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Table>
                                                        <TableHead sx={{ background: 'linear-gradient(135deg, #237117 0%, #2d8b1f 100%)' }}>
                                                            <TableRow>
                                                                <TableCell sx={{ color: '#fff', fontSize: "1rem", fontWeight: 700 }} align="center">
                                                                    Módulo
                                                                </TableCell>
                                                                <TableCell sx={{ color: '#fff', fontSize: "1rem", fontWeight: 700 }} align="center">
                                                                    Visualizar
                                                                </TableCell>
                                                                <TableCell sx={{ color: '#fff', fontSize: "1rem", fontWeight: 700 }} align="center">
                                                                    Adicionar
                                                                </TableCell>
                                                                <TableCell sx={{ color: '#fff', fontSize: "1rem", fontWeight: 700 }} align="center">
                                                                    Editar
                                                                </TableCell>
                                                                <TableCell sx={{ color: '#fff', fontSize: "1rem", fontWeight: 700 }} align="center">
                                                                    Deletar
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {['Protesto', 'RGI', 'RTD', 'RPJ', 'Ofícios', 'Cadastros', 'Notas'].map((permission, permIndex) => (
                                                                <TableRow 
                                                                    key={permission}
                                                                    sx={{
                                                                        '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                                                                        '&:hover': { backgroundColor: '#e8f5e9' },
                                                                        transition: 'background-color 0.2s ease'
                                                                    }}
                                                                >
                                                                    <TableCell 
                                                                        sx={{ 
                                                                            fontSize: "1rem", 
                                                                            fontWeight: 600,
                                                                            color: '#237117'
                                                                        }} 
                                                                        align="center"
                                                                    >
                                                                        {permission}
                                                                    </TableCell>
                                                                    {userData.permissions[permIndex].map((value, checkboxIndex) => (
                                                                        <TableCell key={checkboxIndex} align="center">
                                                                            <Tooltip 
                                                                                title={value === 1 ? "Clique para remover" : "Clique para conceder"}
                                                                                arrow
                                                                            >
                                                                                <Checkbox
                                                                                    color='success'
                                                                                    checked={value === 1}
                                                                                    onChange={() => handleCheckedPermission(permIndex, checkboxIndex)}
                                                                                    icon={<Box sx={{ 
                                                                                        width: 24, 
                                                                                        height: 24, 
                                                                                        border: '2px solid #237117',
                                                                                        borderRadius: '6px'
                                                                                    }} />}
                                                                                    checkedIcon={<CheckCircleIcon sx={{ fontSize: 28 }} />}
                                                                                />
                                                                            </Tooltip>
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        </Fade>
                                    )}

                                    <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
                                        <StyledButton
                                            onClick={handleBack}
                                            variant="outlined"
                                            disabled={activeStep === 0}
                                            sx={{
                                                borderColor: "#237117",
                                                color: '#237117',
                                                '&:hover': {
                                                    borderColor: "#237117",
                                                    backgroundColor: 'rgba(35, 113, 23, 0.04)',
                                                },
                                                '&.Mui-disabled': {
                                                    borderColor: '#ccc',
                                                    color: '#ccc',
                                                }
                                            }}
                                        >
                                            Voltar
                                        </StyledButton>

                                        <StyledButton
                                            onClick={activeStep === 0 ? handleNext : handleSend}
                                            variant="contained"
                                            sx={{
                                                background: "linear-gradient(135deg, #237117 0%, #2d8b1f 100%)",
                                                color: '#fff',
                                                '&:hover': {
                                                    background: "linear-gradient(135deg, #1a5a11 0%, #237117 100%)",
                                                }
                                            }}
                                        >
                                            {activeStep === 0 ? 'Próximo' : 'Criar Usuário'}
                                        </StyledButton>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Box>
                    </Fade>
                </Container>
            </CustomContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ borderRadius: '12px', boxShadow: 3 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default withAuth(withIsAdmin(AddUser));