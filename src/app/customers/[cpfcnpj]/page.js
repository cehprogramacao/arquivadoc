"use client";
import CustomContainer from '@/Components/CustomContainer';
import SnackBar from '@/Components/SnackBar';
import Loading from '@/Components/loading';
import { AuthProvider } from '@/context';
import Customer from '@/services/customer.service';
import { SET_ALERT, showAlert } from '@/store/actions';
import PrivateRoute from '@/utils/LayoutPerm';
import withAuth from '@/utils/withAuth';
import { 
    Box, 
    TextField, 
    Typography, 
    Button, 
    Autocomplete, 
    FormControl, 
    FormLabel, 
    FormHelperText, 
    OutlinedInput, 
    Grid,
    Paper,
    Divider,
    Alert,
    Skeleton,
    Card,
    CardContent,
    IconButton,
    Tooltip
} from "@mui/material";
import { 
    Person as PersonIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ReactInputMask from 'react-input-mask';
import { useDispatch } from 'react-redux';

// Máscaras e configurações
const cpfMask = '999.999.999-99';
const cnpjMask = '99.999.999/9999-99';

// Opções de tipo de pessoa
const personTypeOptions = [
    { label: 'Pessoa Física', value: 'PF', icon: <PersonIcon /> },
    { label: 'Pessoa Jurídica', value: 'PJ', icon: <BusinessIcon /> }
];

const customerSv = new Customer();

const PageEditarPessoas = ({ params }) => {
    const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    
    const [data, setData] = useState({
        cpfcnpj: "",
        type: "",
        name: ""
    });

    const [initialData, setInitialData] = useState({});

    // Validação de CPF
    const validateCPF = (cpf) => {
        const cleanCpf = cpf.replace(/\D/g, '');
        if (cleanCpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleanCpf)) return false;
        
        // Validação do algoritmo do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cleanCpf.charAt(10));
    };

    // Validação de CNPJ
    const validateCNPJ = (cnpj) => {
        const cleanCnpj = cnpj.replace(/\D/g, '');
        if (cleanCnpj.length !== 14) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cleanCnpj)) return false;
        
        // Validação do algoritmo do CNPJ
        let length = cleanCnpj.length - 2;
        let numbers = cleanCnpj.substring(0, length);
        const digits = cleanCnpj.substring(length);
        let sum = 0;
        let pos = length - 7;
        
        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(0))) return false;
        
        length = length + 1;
        numbers = cleanCnpj.substring(0, length);
        sum = 0;
        pos = length - 7;
        
        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        return result === parseInt(digits.charAt(1));
    };

    // Validação dos dados
    const validateForm = () => {
        const newErrors = {};
        
        if (!data.name?.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (data.name.trim().length < 2) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }
        
        if (!data.type) {
            newErrors.type = 'Tipo de pessoa é obrigatório';
        }
        
        if (!data.cpfcnpj?.trim()) {
            newErrors.cpfcnpj = 'CPF/CNPJ é obrigatório';
        } else {
            const cleanDoc = data.cpfcnpj.replace(/\D/g, '');
            if (cleanDoc.length === 11) {
                if (!validateCPF(data.cpfcnpj)) {
                    newErrors.cpfcnpj = 'CPF inválido';
                }
                if (data.type !== 'Pessoa Física') {
                    newErrors.type = 'Para CPF, selecione Pessoa Física';
                }
            } else if (cleanDoc.length === 14) {
                if (!validateCNPJ(data.cpfcnpj)) {
                    newErrors.cpfcnpj = 'CNPJ inválido';
                }
                if (data.type !== 'Pessoa Jurídica') {
                    newErrors.type = 'Para CNPJ, selecione Pessoa Jurídica';
                }
            } else {
                newErrors.cpfcnpj = 'CPF/CNPJ deve ter 11 ou 14 dígitos';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manipula mudanças no CPF/CNPJ
    const handleInputChange = (e) => {
        const value = e.target.value;
        const cleanValue = value.replace(/\D/g, '');
        
        // Atualiza a máscara baseada no tamanho
        if (cleanValue.length <= 11) {
            setCpfCnpjMask(cpfMask);
            // Auto-seleciona tipo de pessoa
            if (cleanValue.length === 11 && data.type !== 'Pessoa Física') {
                setData(prev => ({ ...prev, cpfcnpj: value, type: 'Pessoa Física' }));
            } else {
                setData(prev => ({ ...prev, cpfcnpj: value }));
            }
        } else {
            setCpfCnpjMask(cnpjMask);
            // Auto-seleciona tipo de pessoa
            if (cleanValue.length === 14 && data.type !== 'Pessoa Jurídica') {
                setData(prev => ({ ...prev, cpfcnpj: value, type: 'Pessoa Jurídica' }));
            } else {
                setData(prev => ({ ...prev, cpfcnpj: value }));
            }
        }
        
        // Limpa erros quando o usuário digita
        if (errors.cpfcnpj) {
            setErrors(prev => ({ ...prev, cpfcnpj: '' }));
        }
    };

    const handleInputBlur = () => {
        const cleanValue = data.cpfcnpj?.replace(/\D/g, '') || '';
        if (cleanValue.length === 11) {
            setCpfCnpjMask(cpfMask);
        }
    };

    // Busca dados do cliente
    const getCustomer = async () => {
        try {
            setInitialLoading(true);
            const customer = await customerSv.getCustomerByCPFCNPJ(params.cpfcnpj);
            
            const customerData = {
                name: customer.name || '',
                type: customer.type || '',
                cpfcnpj: customer.cpfcnpj || params.cpfcnpj || ''
            };
            
            setData(customerData);
            setInitialData(customerData);
            
            // Define a máscara correta
            const cleanCpfCnpj = customerData.cpfcnpj.replace(/\D/g, '');
            setCpfCnpjMask(cleanCpfCnpj.length <= 11 ? cpfMask : cnpjMask);
            
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            dispatch(showAlert('Erro ao carregar dados do cliente', 'error'));
        } finally {
            setInitialLoading(false);
        }
    };

    // Atualiza cliente
    const handleEditCustomer = async () => {
        if (!validateForm()) {
            dispatch(showAlert('Por favor, corrija os erros no formulário', 'warning'));
            return;
        }

        try {
            setLoading(true);
            
            const updatedData = {
                name: data.name.trim(),
                type: data.type,
                cpfcnpj: data.cpfcnpj
            };
            
            await customerSv.editCustomer(params.cpfcnpj, updatedData);
            
            dispatch({
                type: SET_ALERT, 
                message: "Cliente atualizado com sucesso!", 
                severity: "success", 
                alertType: "user"
            });
            
            // Pequeno delay para mostrar a mensagem antes de redirecionar
            setTimeout(() => {
                router.push("/customers");
            }, 1500);
            
        } catch (error) {
            console.error("Erro ao editar cliente:", error);
            dispatch(showAlert(
                error?.response?.data?.message || error?.message || 'Erro ao atualizar cliente', 
                'error'
            ));
        } finally {
            setLoading(false);
        }
    };

    // Monitora mudanças nos dados
    useEffect(() => {
        const hasDataChanged = JSON.stringify(data) !== JSON.stringify(initialData);
        setHasChanges(hasDataChanged);
    }, [data, initialData]);

    useEffect(() => {
        if (params.cpfcnpj) {
            getCustomer();
        }
    }, [params.cpfcnpj]);

    // Loading inicial
    if (initialLoading) {
        return (
            <AuthProvider>
                <PrivateRoute requiredPermissions={['Cadastros']}>
                    <Box sx={{ width: '100vw', height: "100vh", py: 14, px: 4 }}>
                        <CustomContainer>
                            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                                <Skeleton variant="text" height={60} sx={{ mb: 4 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Skeleton variant="rectangular" height={56} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Skeleton variant="rectangular" height={56} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Skeleton variant="rectangular" height={56} />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Skeleton variant="rectangular" width={150} height={40} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </CustomContainer>
                    </Box>
                </PrivateRoute>
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
                <Box sx={{ width: '100vw', minHeight: "100vh", py: 14, px: 4, bgcolor: '#f5f5f5' }}>
                    <CustomContainer>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
                            {/* Header */}
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                                    <Tooltip title="Voltar">
                                        <IconButton 
                                            onClick={() => router.push('/customers')}
                                            sx={{ position: 'absolute', left: 0 }}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <EditIcon color="primary" sx={{ fontSize: 40 }} />
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        Editar Cliente
                                    </Typography>
                                </Box>
                                <Divider />
                            </Box>

                            {/* Formulário */}
                            <Grid container spacing={3}>
                                {/* Nome */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome Completo"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData({ ...data, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: '' });
                                        }}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                        color="success"
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Tipo de Pessoa */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        fullWidth
                                        options={personTypeOptions}
                                        getOptionLabel={(option) => option.label}
                                        value={personTypeOptions.find(opt => opt.label === data.type) || null}
                                        onChange={(e, value) => {
                                            setData({ ...data, type: value?.label || '' });
                                            if (errors.type) setErrors({ ...errors, type: '' });
                                        }}
                                        renderOption={(props, option) => (
                                            <Box component="li" {...props} sx={{ gap: 1 }}>
                                                {option.icon}
                                                {option.label}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo de Pessoa"
                                                color="success"
                                                error={Boolean(errors.type)}
                                                helperText={errors.type}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* CPF/CNPJ */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth error={Boolean(errors.cpfcnpj)}>
                                        <ReactInputMask
                                            mask={cpfCnpjMask}
                                            value={data.cpfcnpj}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                        >
                                            {(inputProps) => (
                                                <OutlinedInput
                                                    {...inputProps}
                                                    placeholder="CPF/CNPJ"
                                                    color="success"
                                                    sx={{
                                                        borderRadius: 2,
                                                        '& input': {
                                                            color: 'success.main',
                                                        }
                                                    }}
                                                />
                                            )}
                                        </ReactInputMask>
                                        {errors.cpfcnpj && (
                                            <FormHelperText>{errors.cpfcnpj}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Botão de Ação */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => router.push('/customers')}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleEditCustomer}
                                            disabled={loading || !hasChanges}
                                            startIcon={loading ? <Loading size={20} /> : <SaveIcon />}
                                            sx={{
                                                minWidth: 150,
                                                bgcolor: '#237117',
                                                '&:hover': {
                                                    bgcolor: '#1a5a12'
                                                }
                                            }}
                                        >
                                            {loading ? 'Atualizando...' : 'Atualizar'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            {hasChanges && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Existem alterações não salvas no formulário.
                                </Alert>
                            )}
                        </Paper>
                    </CustomContainer>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    );
};

export default PageEditarPessoas