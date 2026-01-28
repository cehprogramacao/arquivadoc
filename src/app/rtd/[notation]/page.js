"use client"
import React, { useEffect, useState } from 'react'
import withAuth from '@/utils/withAuth'
import {
    Box,
    Container,
    Grid,
    TextField,
    Autocomplete,
    Button,
    Typography,
    Paper,
    Divider,
    IconButton,
    InputAdornment,
    Chip,
    alpha,
    Tooltip
} from '@mui/material'
import {
    ArrowLeft,
    Save,
    FileText,
    Hash,
    BookOpen,
    Layers,
    Archive,
    Upload,
    User,
    CreditCard,
    File,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { AuthProvider } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import { useDispatch } from 'react-redux'
import { SET_ALERT } from '@/store/actions'
import Loading from '@/Components/loading'
import RTDService from '@/services/rtd.service'
import { useRouter } from 'next/navigation'

const rtdSv = new RTDService()

const SectionTitle = ({ icon: Icon, title }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: alpha("#237117", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Icon size={18} color="#237117" />
        </Box>
        <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
        </Typography>
    </Box>
)

const UpdateRTD = ({ params }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [optionType, setOptionType] = useState(null)
    const [types, setTypes] = useState([])
    const [fileName, setFileName] = useState("")
    const [hasFile, setHasFile] = useState(false)
    const [originalData, setOriginalData] = useState(null)
    const router = useRouter()
    const [data, setData] = useState({
        register: "",
        service_type: "",
        book: "",
        initial_sheet: "",
        final_sheet: "",
        box: "",
        file_url: "",
        presenterName: "",
        presenterDocument: "",
        notation: ""
    })

    const onlyNumbers = (value) => String(value).replace(/\D/g, "")

    const applyCpfCnpjMask = (value) => {
        const numbers = onlyNumbers(value)
        if (numbers.length <= 11) {
            return numbers
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1-$2")
                .slice(0, 14)
        }
        return numbers
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18)
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const rtdByNotation = await rtdSv.getRTDByNotation(params.notation)
            const responseTypes = await rtdSv.getAllRTDTypes()
            const typesArray = Object.values(responseTypes)
            setTypes(typesArray)

            // Encontrar o tipo correspondente
            const currentType = typesArray.find(t => t.name === rtdByNotation.typeName)
            setOptionType(currentType || null)

            // Preencher dados
            setData({
                register: rtdByNotation.register || "",
                service_type: currentType?.id || "",
                book: rtdByNotation.book || "",
                initial_sheet: rtdByNotation.initial_sheet || "",
                final_sheet: rtdByNotation.final_sheet || "",
                box: rtdByNotation.box || "",
                file_url: "",
                presenterName: rtdByNotation.presenterName || "",
                presenterDocument: rtdByNotation.presenterDocument || "",
                notation: rtdByNotation.notation || params.notation
            })

            setOriginalData(rtdByNotation)
            setHasFile(!!rtdByNotation.file)

        } catch (error) {
            console.error('Erro ao buscar dados!', error)
            dispatch({
                type: SET_ALERT,
                message: "Erro ao carregar dados do registro!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChangeFieldValues = (event) => {
        const { name, value } = event.target
        setData((state) => ({ ...state, [name]: value }))
    }

    const handleChangeFileUrl = (event) => {
        const files = event.target.files[0]
        if (files) {
            if (files.type !== 'application/pdf') {
                dispatch({
                    type: SET_ALERT,
                    message: "Apenas arquivos PDF sao permitidos!",
                    severity: "warning",
                    alertType: "file"
                })
                return
            }

            setFileName(files.name)
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(',')[1]
                setData((state) => ({ ...state, file_url: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const handleUpdateRtdByNotation = async () => {
        if (!data.register) {
            dispatch({ type: SET_ALERT, message: "Registro e obrigatorio!", severity: "warning", alertType: "file" })
            return
        }

        try {
            setSaving(true)
            await rtdSv.updateRTDByNotation(params.notation, data)
            dispatch({
                type: SET_ALERT,
                message: "Registro atualizado com sucesso!",
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            console.error('Erro ao editar arquivo!', error)
            dispatch({
                type: SET_ALERT,
                message: "Erro ao atualizar registro!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setSaving(false)
            router.back()
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RTD']}>
                <Box
                    sx={{
                        width: "100%",
                        minHeight: "100vh",
                        backgroundColor: "#f5f5f5",
                        py: { xs: 12, md: 15 },
                        px: 2
                    }}
                >
                    <Container maxWidth="md">
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: "divider"
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    background: "linear-gradient(135deg, #237117 0%, #2d8f1f 100%)",
                                    px: 3,
                                    py: 2.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <IconButton
                                        href="/rtd"
                                        sx={{
                                            color: "#fff",
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,0.2)"
                                            }
                                        }}
                                    >
                                        <ArrowLeft size={20} />
                                    </IconButton>
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            sx={{ color: "#fff", fontWeight: 700 }}
                                        >
                                            Editar RTD
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "rgba(255,255,255,0.8)" }}
                                        >
                                            Prenotacao #{params.notation}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={hasFile ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    label={hasFile ? "PDF Anexado" : "Sem PDF"}
                                    size="small"
                                    sx={{
                                        backgroundColor: hasFile ? "rgba(255,255,255,0.2)" : "rgba(255,200,0,0.3)",
                                        color: "#fff",
                                        fontWeight: 500,
                                        "& .MuiChip-icon": { color: "#fff" }
                                    }}
                                />
                            </Box>

                            {/* Info Card - Apresentante */}
                            <Box sx={{ px: 3, pt: 3 }}>
                                <Box
                                    sx={{
                                        backgroundColor: alpha("#237117", 0.05),
                                        borderRadius: 2,
                                        p: 2,
                                        border: "1px solid",
                                        borderColor: alpha("#237117", 0.1)
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <User size={16} color="#237117" />
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            APRESENTANTE
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" fontWeight={600}>
                                        {data.presenterName || "-"}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                        <CreditCard size={14} color="#666" />
                                        <Typography variant="body2" color="text.secondary">
                                            {applyCpfCnpjMask(data.presenterDocument) || "-"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {/* Secao: Informacoes do Registro */}
                                <SectionTitle icon={FileText} title="Informacoes do Registro" />

                                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="number"
                                            name="register"
                                            label="Registro"
                                            fullWidth
                                            value={data.register}
                                            onChange={handleChangeFieldValues}
                                            color="success"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Hash size={18} color="#237117" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#237117' }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            disablePortal
                                            options={types}
                                            fullWidth
                                            value={optionType}
                                            getOptionLabel={(option) => option?.name || ""}
                                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            onChange={(event, value) => {
                                                setOptionType(value)
                                                setData((state) => ({
                                                    ...state,
                                                    service_type: value ? value.id : ""
                                                }))
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tipo"
                                                    color="success"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                <InputAdornment position="start">
                                                                    <FileText size={18} color="#237117" />
                                                                </InputAdornment>
                                                                {params.InputProps.startAdornment}
                                                            </>
                                                        )
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            '&:hover fieldset': { borderColor: '#237117' }
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* Secao: Localizacao */}
                                <SectionTitle icon={BookOpen} title="Localizacao do Documento" />

                                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="number"
                                            name="book"
                                            label="Livro"
                                            fullWidth
                                            value={data.book}
                                            onChange={handleChangeFieldValues}
                                            color="success"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BookOpen size={18} color="#237117" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#237117' }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="number"
                                            name="box"
                                            label="Caixa"
                                            fullWidth
                                            value={data.box}
                                            onChange={handleChangeFieldValues}
                                            color="success"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Archive size={18} color="#237117" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#237117' }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="number"
                                            name="initial_sheet"
                                            label="Folha Inicial"
                                            fullWidth
                                            value={data.initial_sheet}
                                            onChange={handleChangeFieldValues}
                                            color="success"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Layers size={18} color="#237117" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#237117' }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            type="number"
                                            name="final_sheet"
                                            label="Folha Final"
                                            fullWidth
                                            value={data.final_sheet}
                                            onChange={handleChangeFieldValues}
                                            color="success"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Layers size={18} color="#237117" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': { borderColor: '#237117' }
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* Secao: Arquivo */}
                                <SectionTitle icon={File} title="Arquivo PDF" />

                                <Box
                                    component="label"
                                    sx={{
                                        width: "100%",
                                        minHeight: 160,
                                        border: "2px dashed",
                                        borderColor: fileName ? "#237117" : "divider",
                                        borderRadius: 2,
                                        p: 3,
                                        backgroundColor: fileName ? alpha("#237117", 0.04) : "transparent",
                                        transition: "all 0.3s ease",
                                        cursor: "pointer",

                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,

                                        textAlign: "center",

                                        "&:hover": {
                                            borderColor: "#237117",
                                            backgroundColor: alpha("#237117", 0.04)
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        hidden
                                        onChange={handleChangeFileUrl}
                                    />

                                    <Upload
                                        size={42}
                                        color={fileName ? "#237117" : "#999"}
                                    />

                                    {fileName ? (
                                        <>
                                            <Typography
                                                variant="body1"
                                                fontWeight={600}
                                                color="#237117"
                                                sx={{
                                                    maxWidth: "100%",
                                                    wordBreak: "break-all"
                                                }}
                                            >
                                                {fileName}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                Clique para trocar o arquivo
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography variant="body1" color="text.secondary">
                                                Clique para selecionar um arquivo PDF
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {hasFile
                                                    ? "Um PDF já está anexado. Selecione para substituir."
                                                    : "Nenhum arquivo selecionado"}
                                            </Typography>
                                        </>
                                    )}
                                </Box>


                                <Divider sx={{ my: 3 }} />

                                {/* Botoes */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <Button
                                        href="/rtd"
                                        variant="outlined"
                                        startIcon={<ArrowLeft size={18} />}
                                        sx={{
                                            borderColor: "#237117",
                                            color: "#237117",
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            "&:hover": {
                                                borderColor: "#1a5511",
                                                backgroundColor: alpha("#237117", 0.04)
                                            }
                                        }}
                                    >
                                        Voltar
                                    </Button>

                                    <Button
                                        onClick={handleUpdateRtdByNotation}
                                        variant="contained"
                                        disabled={saving}
                                        startIcon={<Save size={18} />}
                                        sx={{
                                            backgroundColor: "#237117",
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            boxShadow: "0 4px 12px rgba(35, 113, 23, 0.3)",
                                            "&:hover": {
                                                backgroundColor: "#1a5511",
                                                boxShadow: "0 6px 16px rgba(35, 113, 23, 0.4)"
                                            },
                                            "&:disabled": {
                                                backgroundColor: "#ccc"
                                            }
                                        }}
                                    >
                                        {saving ? "Salvando..." : "Salvar Alteracoes"}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(UpdateRTD)
