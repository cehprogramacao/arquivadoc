"use client"
import React, { useEffect, useState } from 'react';
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
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Chip,
    Alert,
    Container,
} from '@mui/material';
import { styled } from '@mui/system';
import CustomContainer from '@/Components/CustomContainer';
import withIsAdmin from '@/utils/isAdmin';
import User from '@/services/user.service';
import Loading from '@/Components/loading';
import ReactInputMask from 'react-input-mask';
import { isLoggedIn } from '@/utils/auth';
import withAuth from '@/utils/withAuth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { AddAlarmSharp } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const StyledFormContainer = styled(Box)({
    width: '90%',
    maxWidth: '1000px',
    margin: 'auto',
    padding: '40px 20px',
    minHeight: '100vh',
});

const StyledCard = styled(Card)({
    marginTop: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    borderRadius: '16px',
    overflow: 'visible',
});

const StyledButtonContainer = styled(Box)({
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
});

const PermissionButton = styled(Button)({
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '0.95rem',
    padding: '8px 16px',
    fontWeight: 500,
});

const numberMaskEstruct = '(99) 99999-9999';

const userSv = new User();

const AddUser = ({ params }) => {
    const [loading, setLoading] = useState(false);
    const [numberMask, setNumberMask] = useState(numberMaskEstruct);
    const [errors, setErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter()
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        permissions: Array(7).fill().map(() => [0, 0, 0, 0])
    });

    const steps = ['Dados do Usuário', 'Configurar Permissões'];
    const permissionNames = ['Protesto', 'RGI', 'RTD', 'RPJ', 'Ofícios', 'Cadastros', 'Notas'];
    const permissionTypes = ['Visualizar', 'Adicionar', 'Editar', 'Deletar'];

    const handleCheckedPermission = (permIndex, checkboxIndex) => {
        const newPermissions = userData.permissions.map((perm, index) => {
            if (index === permIndex) {
                const updatedPerm = [...perm];
                updatedPerm[checkboxIndex] = updatedPerm[checkboxIndex] === 0 ? 1 : 0;
                return updatedPerm;
            }
            return perm;
        });

        setUserData({ ...userData, permissions: newPermissions });
    };

    const handleSelectAll = () => {
        const allSelected = userData.permissions.map(() => [1, 1, 1, 1]);
        setUserData({ ...userData, permissions: allSelected });
    };

    const handleClearAll = () => {
        const allCleared = userData.permissions.map(() => [0, 0, 0, 0]);
        setUserData({ ...userData, permissions: allCleared });
    };

    const handleSelectRowAll = (permIndex) => {
        const newPermissions = [...userData.permissions];
        newPermissions[permIndex] = [1, 1, 1, 1];
        setUserData({ ...userData, permissions: newPermissions });
    };

    const handleClearRow = (permIndex) => {
        const newPermissions = [...userData.permissions];
        newPermissions[permIndex] = [0, 0, 0, 0];
        setUserData({ ...userData, permissions: newPermissions });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors({ ...errors, [name]: '' });
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setNumberMask(numberMaskEstruct)
            : setNumberMask(numberMaskEstruct);
        setUserData({ ...userData, phone: e.target.value });
        setErrors({ ...errors, phone: '' });
    };

    const handleInputBlur = () => {
        if (userData.phone?.replace(/\D/g, '').length < 11 && userData.phone) {
            setErrors({ ...errors, phone: 'Telefone incompleto' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!userData.phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (userData.phone.replace(/\D/g, '').length < 11) {
            newErrors.phone = 'Telefone incompleto';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (activeStep === 0 && !validateForm()) {
            return;
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSend = async () => {
        try {
            setLoading(true);
            const data = await userSv.updateUserByAdmin(params.id, userData);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setActiveStep(0);
            }, 3000);
            return data;
        } catch (error) {
            console.error('Erro ao atualizar usuário!', error);
            setErrors({ submit: 'Erro ao salvar. Tente novamente.' });
            throw error;
        } finally {
            setLoading(false);
            router.push("/usuarios")
        }
    };

    const getDataByUser = async (params) => {
        try {
            if (!isLoggedIn()) {
                throw new Error('Usuário não autenticado');
            }

            const data = await userSv.getUserById(params.id);

            const initialPermissions = Array(7).fill().map(() => [0, 0, 0, 0]);

            data.permissions.forEach((permission) => {
                const permIndex = permissionNames.indexOf(permission.public_name);
                if (permIndex !== -1) {
                    initialPermissions[permIndex] = [
                        permission.view,
                        permission.create_permission,
                        permission.edit,
                        permission.delete_permission
                    ];
                }
            });

            setUserData({
                name: data.user[0].name,
                phone: data.user[0].phone,
                permissions: initialPermissions
            });
        } catch (error) {
            console.error("Erro ao buscar dados do usuário!", error);
            throw error;
        }
    };

    useEffect(() => {
        getDataByUser(params);
    }, [params]);

    const getPermissionCount = () => {
        return userData.permissions.reduce((total, perm) => {
            return total + perm.filter(p => p === 1).length;
        }, 0);
    };

    return (
        <>
            {!loading ? (
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    py: 15,
                    px: 3
                }}>
                    <Container maxWidth="xl">
                        <StyledFormContainer>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h4" sx={{
                                    fontWeight: 600,
                                    color: '#237117',
                                    mb: 1
                                }}>
                                    Editar Usuário
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    Gerencie dados e permissões do usuário
                                </Typography>
                            </Box>

                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel
                                            StepIconProps={{
                                                sx: {
                                                    '&.Mui-active': { color: '#237117' },
                                                    '&.Mui-completed': { color: '#237117' },
                                                }
                                            }}
                                        >
                                            {label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {showSuccess && (
                                <Alert
                                    severity="success"
                                    sx={{ mb: 3 }}
                                    icon={<CheckCircleIcon />}
                                >
                                    Usuário atualizado com sucesso!
                                </Alert>
                            )}

                            {errors.submit && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {errors.submit}
                                </Alert>
                            )}

                            <StyledCard>
                                <CardContent sx={{ p: 4 }}>
                                    {activeStep === 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <PersonIcon sx={{ color: '#237117', mr: 1, fontSize: 28 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    Informações Pessoais
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                <TextField
                                                    label="Nome Completo"
                                                    name="name"
                                                    variant="outlined"
                                                    color="success"
                                                    value={userData.name}
                                                    onChange={handleChange}
                                                    error={Boolean(errors.name)}
                                                    helperText={errors.name}
                                                    fullWidth
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px',
                                                        }
                                                    }}
                                                />

                                                <FormControl fullWidth error={Boolean(errors.phone)}>
                                                    <ReactInputMask
                                                        mask={numberMask}
                                                        value={userData.phone}
                                                        onChange={handleInputChange}
                                                        onBlur={handleInputBlur}
                                                        name="phone"
                                                    >
                                                        {(inputProps) => (
                                                            <OutlinedInput
                                                                {...inputProps}
                                                                color="success"
                                                                placeholder="Número de Telefone"
                                                                required
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                }}
                                                            />
                                                        )}
                                                    </ReactInputMask>
                                                    {errors.phone && (
                                                        <Typography variant="caption" sx={{ color: '#d32f2f', mt: 0.5, ml: 1.5 }}>
                                                            {errors.phone}
                                                        </Typography>
                                                    )}
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    )}

                                    {activeStep === 1 && (
                                        <Box>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                mb: 3,
                                                flexWrap: 'wrap',
                                                gap: 2
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <SecurityIcon sx={{ color: '#237117', mr: 1, fontSize: 28 }} />
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            Permissões do Sistema
                                                        </Typography>
                                                        <Chip
                                                            label={`${getPermissionCount()} permissões ativas`}
                                                            size="small"
                                                            sx={{ mt: 0.5, bgcolor: '#e8f5e9' }}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Selecionar todas as permissões">
                                                        <PermissionButton
                                                            variant="contained"
                                                            startIcon={<SelectAllIcon />}
                                                            onClick={handleSelectAll}
                                                            sx={{
                                                                bgcolor: '#237117',
                                                                '&:hover': { bgcolor: '#1a5c11' }
                                                            }}
                                                        >
                                                            Selecionar Tudo
                                                        </PermissionButton>
                                                    </Tooltip>
                                                    <Tooltip title="Remover todas as permissões">
                                                        <PermissionButton
                                                            variant="outlined"
                                                            startIcon={<ClearAllIcon />}
                                                            onClick={handleClearAll}
                                                            sx={{
                                                                borderColor: '#237117',
                                                                color: '#237117',
                                                                '&:hover': {
                                                                    borderColor: '#1a5c11',
                                                                    bgcolor: 'rgba(35, 113, 23, 0.04)'
                                                                }
                                                            }}
                                                        >
                                                            Limpar Tudo
                                                        </PermissionButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>

                                            <TableContainer
                                                component={Paper}
                                                sx={{
                                                    borderRadius: '12px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                                }}
                                            >
                                                <Table>
                                                    <TableHead sx={{ bgcolor: '#237117' }}>
                                                        <TableRow>
                                                            <TableCell
                                                                sx={{
                                                                    color: '#fff',
                                                                    fontSize: '1rem',
                                                                    fontWeight: 600,
                                                                    minWidth: '150px'
                                                                }}
                                                            >
                                                                Módulo
                                                            </TableCell>
                                                            {permissionTypes.map((type) => (
                                                                <TableCell
                                                                    key={type}
                                                                    sx={{
                                                                        color: '#fff',
                                                                        fontSize: '1rem',
                                                                        fontWeight: 600
                                                                    }}
                                                                    align="center"
                                                                >
                                                                    {type}
                                                                </TableCell>
                                                            ))}
                                                            <TableCell
                                                                sx={{
                                                                    color: '#fff',
                                                                    fontSize: '1rem',
                                                                    fontWeight: 600
                                                                }}
                                                                align="center"
                                                            >
                                                                Ações
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {permissionNames.map((permission, permIndex) => (
                                                            <TableRow
                                                                key={permission}
                                                                sx={{
                                                                    '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' },
                                                                    '&:hover': { bgcolor: '#f0f7ef' }
                                                                }}
                                                            >
                                                                <TableCell
                                                                    sx={{
                                                                        fontSize: '0.95rem',
                                                                        fontWeight: 500,
                                                                        color: '#333'
                                                                    }}
                                                                >
                                                                    {permission}
                                                                </TableCell>
                                                                {userData.permissions[permIndex].map((value, checkboxIndex) => (
                                                                    <TableCell key={checkboxIndex} align="center">
                                                                        <Checkbox
                                                                            color="success"
                                                                            checked={value === 1}
                                                                            onChange={() => handleCheckedPermission(permIndex, checkboxIndex)}
                                                                            sx={{
                                                                                '&.Mui-checked': {
                                                                                    color: '#237117',
                                                                                }
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                ))}
                                                                <TableCell align="center">
                                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                                        <Tooltip title="Marcar todas desta linha">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleSelectRowAll(permIndex)}
                                                                                sx={{
                                                                                    color: '#237117',
                                                                                    '&:hover': { bgcolor: 'rgba(35, 113, 23, 0.08)' }
                                                                                }}
                                                                            >
                                                                                <SelectAllIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Limpar esta linha">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleClearRow(permIndex)}
                                                                                sx={{
                                                                                    color: '#666',
                                                                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                                                                                }}
                                                                            >
                                                                                <ClearAllIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}
                                </CardContent>
                            </StyledCard>

                            <StyledButtonContainer>
                                <Button
                                    onClick={handleBack}
                                    disabled={activeStep === 0}
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: '#237117',
                                        color: '#237117',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        px: 4,
                                        '&:hover': {
                                            borderColor: '#1a5c11',
                                            bgcolor: 'rgba(35, 113, 23, 0.04)'
                                        },
                                        '&:disabled': {
                                            borderColor: '#ccc',
                                            color: '#999'
                                        }
                                    }}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    onClick={activeStep === steps.length - 1 ? handleSend : handleNext}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        bgcolor: '#237117',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        px: 4,
                                        '&:hover': {
                                            bgcolor: '#1a5c11'
                                        }
                                    }}
                                >
                                    {activeStep === steps.length - 1 ? 'Salvar Alterações' : 'Próximo'}
                                </Button>
                            </StyledButtonContainer>
                        </StyledFormContainer>
                    </Container>
                </Box>

            ) : (
                <Loading />
            )}
        </>
    );
};

export default withAuth(withIsAdmin(AddUser));