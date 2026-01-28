"use client"
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    FormControl,
    Grid,
    Container,
    Avatar,
    IconButton,
    Paper,
    Divider,
    InputAdornment,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material'
import {
    Camera,
    Phone,
    Save,
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Shield,
    CheckCircle
} from 'lucide-react'
import { Person, Visibility, VisibilityOff } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import ReactInputMask from 'react-input-mask'
import { useDispatch } from 'react-redux'
import Loading from '@/Components/loading'
import { SET_ALERT } from '@/store/actions'
import withAuth from '@/utils/withAuth'
import UserService from "@/services/user.service"

const numberMaskEstruct = '(99) 99999-9999'
const userSv = new UserService()

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    )
}

const ProfilePage = () => {
    const [numberMask, setNumberMask] = useState(numberMaskEstruct)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [tabValue, setTabValue] = useState(0)
    const dispatch = useDispatch()

    // Dados do usuario
    const [userData, setUserData] = useState({
        name: "",
        phone: "",
        email: ""
    })

    // Estados para alteracao de email
    const [emailData, setEmailData] = useState({
        newEmail: "",
        password: ""
    })
    const [showEmailPassword, setShowEmailPassword] = useState(false)

    // Estados para alteracao de senha
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Dialog de confirmacao
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: '',
        title: '',
        message: ''
    })

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleInputChange = (e) => {
        setUserData({ ...userData, phone: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                dispatch({
                    type: SET_ALERT,
                    message: "A imagem deve ter no maximo 5MB",
                    severity: "error",
                    alertType: "user"
                })
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUploadPhoto = async () => {
        if (!imageFile) {
            dispatch({
                type: SET_ALERT,
                message: "Selecione uma imagem primeiro",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        try {
            setSaving(true)

            const reader = new FileReader()
            reader.onloadend = async () => {
                const base64String = reader.result

                await userSv.updateUserFoto({
                    base64: base64String
                })

                dispatch({
                    type: SET_ALERT,
                    message: "Foto atualizada com sucesso!",
                    severity: "success",
                    alertType: "user"
                })

                setImageFile(null)
            }

            reader.readAsDataURL(imageFile)
        } catch (error) {
            console.error("Erro ao fazer upload da foto!", error)
            dispatch({
                type: SET_ALERT,
                message: "Erro ao atualizar foto!",
                severity: "error",
                alertType: "user"
            })
        } finally {
            setSaving(false)
        }
    }

    const getUser = async () => {
        try {
            setLoading(true)
            const response = await userSv.getUser()
            setUserData({
                name: response.user[0]?.name || "",
                phone: response.user[0]?.phone || "",
                email: response.user[0]?.email || ""
            })
            if (response.user[0]?.foto_url) {
                const mimeType = detectMimeType(response.user[0].foto_url)
                setImagePreview(`data:${mimeType};base64,${response.user[0].foto_url}`)
            }
        } catch (error) {
            console.error("Erro ao buscar usuario!", error)
            dispatch({
                type: SET_ALERT,
                message: "Erro ao carregar dados do usuario",
                severity: "error",
                alertType: "user"
            })
        } finally {
            setLoading(false)
        }
    }

    const detectMimeType = (base64) => {
        const header = base64.substring(0, 20)
        if (header.includes("/9j/")) return "image/jpeg"
        if (header.includes("iVBORw0KGgo")) return "image/png"
        if (header.includes("R0lGOD")) return "image/gif"
        if (header.includes("UklGR")) return "image/webp"
        return "image/png"
    }

    const handleUpdateUser = async () => {
        if (!userData.name.trim()) {
            dispatch({
                type: SET_ALERT,
                message: "Nome e obrigatorio",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        if (!userData.phone || userData.phone.replace(/\D/g, '').length < 11) {
            dispatch({
                type: SET_ALERT,
                message: "Telefone invalido",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        try {
            setSaving(true)
            await userSv.updateUser({
                name: userData.name,
                phone: userData.phone
            })
            dispatch({
                type: SET_ALERT,
                message: "Perfil atualizado com sucesso!",
                severity: "success",
                alertType: "user"
            })
        } catch (error) {
            console.error("Erro ao editar usuario!", error)
            dispatch({
                type: SET_ALERT,
                message: "Erro ao atualizar perfil!",
                severity: "error",
                alertType: "user"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateEmail = async () => {
        if (!emailData.newEmail.trim()) {
            dispatch({
                type: SET_ALERT,
                message: "Novo e-mail e obrigatorio",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailData.newEmail)) {
            dispatch({
                type: SET_ALERT,
                message: "E-mail invalido",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        if (!emailData.password) {
            dispatch({
                type: SET_ALERT,
                message: "Senha e obrigatoria para alterar o e-mail",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        try {
            setSaving(true)
            const response = await userSv.updateEmail({
                newEmail: emailData.newEmail,
                password: emailData.password
            })

            // Atualizar tokens no localStorage
            if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken)
            }
            if (response.refreshToken) {
                localStorage.setItem("refreshToken", response.refreshToken)
            }

            setUserData(prev => ({ ...prev, email: emailData.newEmail }))
            setEmailData({ newEmail: "", password: "" })

            dispatch({
                type: SET_ALERT,
                message: "E-mail atualizado com sucesso!",
                severity: "success",
                alertType: "user"
            })
        } catch (error) {
            console.error("Erro ao atualizar e-mail!", error)
            dispatch({
                type: SET_ALERT,
                message: error?.message || "Erro ao atualizar e-mail!",
                severity: "error",
                alertType: "user"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async () => {
        if (!passwordData.currentPassword) {
            dispatch({
                type: SET_ALERT,
                message: "Senha atual e obrigatoria",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        if (!passwordData.newPassword) {
            dispatch({
                type: SET_ALERT,
                message: "Nova senha e obrigatoria",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        if (passwordData.newPassword.length < 6) {
            dispatch({
                type: SET_ALERT,
                message: "A nova senha deve ter pelo menos 6 caracteres",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            dispatch({
                type: SET_ALERT,
                message: "As senhas nao coincidem",
                severity: "warning",
                alertType: "user"
            })
            return
        }

        try {
            setSaving(true)

            // Primeiro verificar a senha atual
            const verifyResponse = await userSv.verifyCurrentPassword({
                currentPassword: passwordData.currentPassword
            })

            if (!verifyResponse.valid) {
                dispatch({
                    type: SET_ALERT,
                    message: "Senha atual incorreta!",
                    severity: "error",
                    alertType: "user"
                })
                return
            }

            // Alterar a senha
            await userSv.changeUserPassword({
                password: passwordData.newPassword
            })

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })

            dispatch({
                type: SET_ALERT,
                message: "Senha alterada com sucesso!",
                severity: "success",
                alertType: "user"
            })
        } catch (error) {
            console.error("Erro ao alterar senha!", error)
            dispatch({
                type: SET_ALERT,
                message: error?.message || "Erro ao alterar senha!",
                severity: "error",
                alertType: "user"
            })
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    if (!isClient) return null

    return loading ? <Loading /> : (
        <Box sx={{
            width: "100%",
            minHeight: "100vh",
            background: "#f5f5f5",
            py: { xs: 12, md: 15 },
            px: 2,
        }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "#fff"
                }}>
                    {/* Header */}
                    <Box sx={{
                        background: "linear-gradient(135deg, #237117 0%, #2d8f1f 100%)",
                        p: 3,
                        position: "relative",
                    }}>
                        <IconButton
                            onClick={() => window.history.back()}
                            sx={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                color: "#fff",
                                background: "rgba(255,255,255,0.1)",
                                "&:hover": {
                                    background: "rgba(255,255,255,0.2)"
                                }
                            }}
                        >
                            <ArrowLeft size={20} />
                        </IconButton>

                        <Typography
                            variant="h4"
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                textAlign: "center",
                                fontSize: { xs: "1.5rem", sm: "2rem" }
                            }}
                        >
                            Meu Perfil
                        </Typography>
                    </Box>

                    {/* Avatar Section */}
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 4,
                        mb: 2,
                        px: 3
                    }}>
                        <Box sx={{ position: "relative" }}>
                            <Avatar
                                src={imagePreview}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: "4px solid #fff",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    background: imagePreview ? "transparent" : "#237117",
                                    fontSize: "3rem"
                                }}
                            >
                                {!imagePreview && <Person sx={{ fontSize: 60 }} />}
                            </Avatar>

                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="avatar-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="avatar-upload">
                                <IconButton
                                    component="span"
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        background: "#237117",
                                        color: "#fff",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                        width: 36,
                                        height: 36,
                                        "&:hover": {
                                            background: "#1a5511"
                                        }
                                    }}
                                >
                                    <Camera size={18} />
                                </IconButton>
                            </label>
                        </Box>

                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                            {userData.name || "Usuario"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userData.email}
                        </Typography>

                        {imageFile && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Save size={16} />}
                                onClick={handleUploadPhoto}
                                disabled={saving}
                                sx={{
                                    mt: 2,
                                    borderColor: "#237117",
                                    color: "#237117",
                                    "&:hover": {
                                        borderColor: "#1a5511",
                                        background: "rgba(35, 113, 23, 0.04)"
                                    }
                                }}
                            >
                                Salvar Foto
                            </Button>
                        )}
                    </Box>

                    <Divider />

                    {/* Tabs */}
                    <Box sx={{ px: { xs: 2, sm: 3 } }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant={isSmallScreen ? "fullWidth" : "standard"}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem'
                                },
                                '& .Mui-selected': {
                                    color: '#237117 !important'
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#237117'
                                }
                            }}
                        >
                            <Tab
                                icon={<User size={18} />}
                                iconPosition="start"
                                label="Dados Pessoais"
                            />
                            <Tab
                                icon={<Mail size={18} />}
                                iconPosition="start"
                                label="E-mail"
                            />
                            <Tab
                                icon={<Shield size={18} />}
                                iconPosition="start"
                                label="Seguranca"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <Box sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
                        {/* Tab 0: Dados Pessoais */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome Completo"
                                        placeholder="Digite seu nome completo"
                                        value={userData.name}
                                        onChange={(e) => setUserData(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        color="success"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: "#237117" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#237117',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <ReactInputMask
                                            mask={numberMask}
                                            value={userData.phone}
                                            onChange={handleInputChange}
                                            name="phone"
                                        >
                                            {(inputProps) => (
                                                <TextField
                                                    {...inputProps}
                                                    fullWidth
                                                    label="Telefone"
                                                    placeholder="(00) 00000-0000"
                                                    color="success"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Phone size={20} color="#237117" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover fieldset': {
                                                                borderColor: '#237117',
                                                            },
                                                        }
                                                    }}
                                                />
                                            )}
                                        </ReactInputMask>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Save size={18} />}
                                            onClick={handleUpdateUser}
                                            disabled={saving}
                                            sx={{
                                                background: "#237117",
                                                color: "#fff",
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                "&:hover": {
                                                    background: "#1a5511",
                                                },
                                            }}
                                        >
                                            {saving ? "Salvando..." : "Salvar Alteracoes"}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Tab 1: E-mail */}
                        <TabPanel value={tabValue} index={1}>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Para alterar seu e-mail, voce precisara confirmar sua senha atual.
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="E-mail Atual"
                                        value={userData.email}
                                        disabled
                                        color="success"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Mail size={20} color="#999" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Novo E-mail"
                                        placeholder="Digite o novo e-mail"
                                        type="email"
                                        value={emailData.newEmail}
                                        onChange={(e) => setEmailData(prev => ({
                                            ...prev,
                                            newEmail: e.target.value
                                        }))}
                                        color="success"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Mail size={20} color="#237117" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#237117',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Confirme sua Senha"
                                        placeholder="Digite sua senha atual"
                                        type={showEmailPassword ? "text" : "password"}
                                        value={emailData.password}
                                        onChange={(e) => setEmailData(prev => ({
                                            ...prev,
                                            password: e.target.value
                                        }))}
                                        color="success"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={20} color="#237117" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                                                        edge="end"
                                                    >
                                                        {showEmailPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#237117',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Mail size={18} />}
                                            onClick={handleUpdateEmail}
                                            disabled={saving || !emailData.newEmail || !emailData.password}
                                            sx={{
                                                background: "#237117",
                                                color: "#fff",
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                "&:hover": {
                                                    background: "#1a5511",
                                                },
                                                "&:disabled": {
                                                    background: "#ccc"
                                                }
                                            }}
                                        >
                                            {saving ? "Atualizando..." : "Atualizar E-mail"}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Tab 2: Seguranca (Senha) */}
                        <TabPanel value={tabValue} index={2}>
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                Escolha uma senha forte com pelo menos 6 caracteres.
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Senha Atual"
                                        placeholder="Digite sua senha atual"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            currentPassword: e.target.value
                                        }))}
                                        color="success"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={20} color="#237117" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        edge="end"
                                                    >
                                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#237117',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nova Senha"
                                        placeholder="Digite a nova senha"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            newPassword: e.target.value
                                        }))}
                                        color="success"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={20} color="#237117" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: '#237117',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Confirmar Nova Senha"
                                        placeholder="Confirme a nova senha"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        color="success"
                                        error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword}
                                        helperText={
                                            passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                                                ? "As senhas nao coincidem"
                                                : ""
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={20} color="#237117" />
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
                                                '&:hover fieldset': {
                                                    borderColor: '#237117',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Shield size={18} />}
                                            onClick={handleUpdatePassword}
                                            disabled={
                                                saving ||
                                                !passwordData.currentPassword ||
                                                !passwordData.newPassword ||
                                                !passwordData.confirmPassword ||
                                                passwordData.newPassword !== passwordData.confirmPassword
                                            }
                                            sx={{
                                                background: "#237117",
                                                color: "#fff",
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                "&:hover": {
                                                    background: "#1a5511",
                                                },
                                                "&:disabled": {
                                                    background: "#ccc"
                                                }
                                            }}
                                        >
                                            {saving ? "Alterando..." : "Alterar Senha"}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default withAuth(ProfilePage)
