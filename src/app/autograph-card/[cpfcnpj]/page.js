"use client"
import React, { useState } from 'react'
import Loading from '@/Components/loading'
import { AuthProvider } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import withAuth from '@/utils/withAuth'
import {
    Box,
    Container,
    Grid,
    TextField,
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
    Archive,
    Upload,
    ScanLine,
    CheckCircle,
    AlertCircle,
    Trash2,
    CreditCard,
    FileCheck,
    Home,
    UserSquare2
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { SET_ALERT, showAlert } from '@/store/actions'
import { useRouter } from 'next/navigation'
import Customer from '@/services/customer.service'

const customerSv = new Customer()

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: alpha("#237117", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Icon size={20} color="#237117" />
        </Box>
        <Box>
            <Typography variant="h6" fontWeight={600} color="text.primary">
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </Box>
    </Box>
)

const UpdateFileAutographCard = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        box: 0,
        card_file_url: "",
        doc_file_url: "",
        cpf_file_url: "",
        comp_resid_file_url: ""
    })

    const [fileNames, setFileNames] = useState({
        card_file_url: "",
        doc_file_url: "",
        cpf_file_url: "",
        comp_resid_file_url: ""
    })

    const fileLabels = {
        card_file_url: "Cartao de Autografo",
        doc_file_url: "Documento de Identificacao",
        cpf_file_url: "CPF",
        comp_resid_file_url: "Comprovante de Residencia"
    }

    const fileIcons = {
        card_file_url: UserSquare2,
        doc_file_url: CreditCard,
        cpf_file_url: FileCheck,
        comp_resid_file_url: Home
    }

    const getFilesCount = () => {
        return [
            data.card_file_url,
            data.doc_file_url,
            data.cpf_file_url,
            data.comp_resid_file_url
        ].filter(file => file !== "").length
    }

    const handleChangeFileUrl = (name, event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")[1]
                setData(state => ({ ...state, [name]: fileResult }))
                setFileNames(state => ({ ...state, [name]: files.name }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const updateDataWithUrl = (fieldName, base64Url) => {
        setData(state => ({ ...state, [fieldName]: base64Url }))
        setFileNames(state => ({ ...state, [fieldName]: `Documento escaneado - ${new Date().toLocaleString()}` }))
    }

    const clearFile = (fieldName) => {
        setData(state => ({ ...state, [fieldName]: "" }))
        setFileNames(state => ({ ...state, [fieldName]: "" }))
    }

    const handleScan = (fieldName, customSettings = {}) => {
        if (!window.scanner) {
            dispatch(showAlert("Scanner nao disponivel", "error", "file"))
            return
        }

        const defaultSettings = {
            "use_asprise_dialog": false,
            "show_scanner_ui": false,
            "twain_cap_setting": {
                "ICAP_PIXELTYPE": "TWPT_RGB",
                "ICAP_XRESOLUTION": "300",
                "ICAP_YRESOLUTION": "300",
                "ICAP_SUPPORTEDSIZES": "TWSS_A4"
            },
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": `${fileLabels[fieldName]} - Escaneado por \${USERNAME} em \${DATETIME}`,
                    "pdf_owner_password": "",
                    "pdf_user_password": ""
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 200
                }
            ]
        }

        const settings = { ...defaultSettings, ...customSettings }

        window.scanner.scan((successful, mesg, response) => {
            if (!successful) {
                console.error('Falha no scan: ' + mesg)
                dispatch(showAlert(`Erro no scan: ${mesg}`, "error", "file"))
                return
            }
            if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
                console.info('Usuario cancelou o scan')
                return
            }
            try {
                const responseJson = JSON.parse(response)
                const scannedPdfUrl = responseJson.output[0].result[0]
                updateDataWithUrl(fieldName, scannedPdfUrl)
                dispatch(showAlert(`${fileLabels[fieldName]} escaneado com sucesso!`, "success", "file"))
            } catch (error) {
                console.error('Erro ao processar resposta do scan:', error)
                dispatch(showAlert("Erro ao processar arquivo escaneado", "error", "file"))
            }
        }, settings)
    }

    const handleCardScan = () => {
        handleScan('card_file_url', {
            "twain_cap_setting": {
                "ICAP_PIXELTYPE": "TWPT_RGB",
                "ICAP_XRESOLUTION": "300",
                "ICAP_YRESOLUTION": "300",
                "ICAP_SUPPORTEDSIZES": "TWSS_A5"
            },
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "Cartao de Autografo - Escaneado por ${USERNAME} em ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 300
                }
            ]
        })
    }

    const handleDocScan = () => {
        handleScan('doc_file_url', {
            "twain_cap_setting": {
                "ICAP_PIXELTYPE": "TWPT_RGB",
                "ICAP_XRESOLUTION": "300",
                "ICAP_YRESOLUTION": "300",
                "ICAP_SUPPORTEDSIZES": "TWSS_A4"
            }
        })
    }

    const handleCpfScan = () => {
        handleScan('cpf_file_url', {
            "twain_cap_setting": {
                "ICAP_PIXELTYPE": "TWPT_RGB",
                "ICAP_XRESOLUTION": "200",
                "ICAP_YRESOLUTION": "200",
                "ICAP_SUPPORTEDSIZES": "TWSS_A6"
            },
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "CPF - Escaneado por ${USERNAME} em ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 250
                }
            ]
        })
    }

    const handleCompResidScan = () => {
        handleScan('comp_resid_file_url', {
            "twain_cap_setting": {
                "ICAP_PIXELTYPE": "TWPT_RGB",
                "ICAP_XRESOLUTION": "200",
                "ICAP_YRESOLUTION": "200",
                "ICAP_SUPPORTEDSIZES": "TWSS_A4"
            },
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "Comprovante de Residencia - Escaneado por ${USERNAME} em ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 250
                }
            ]
        })
    }

    const handleUpdateAutographCard = async () => {
        if (!data.card_file_url && !data.doc_file_url && !data.cpf_file_url && !data.comp_resid_file_url) {
            dispatch({ type: SET_ALERT, message: "Pelo menos um arquivo deve ser carregado!", severity: "error", alertType: "file" })
            return
        }

        try {
            setLoading(true)
            const response = await customerSv.putAutographCard(params.cpfcnpj, data)
            dispatch({ type: SET_ALERT, message: "Arquivos atualizados com sucesso!", severity: "success", alertType: "file" })
        } catch (error) {
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "file" })
            console.error("Erro ao atualizar arquivo", error)
            throw error
        } finally {
            setLoading(false)
            router.push("/autograph-card")
        }
    }

    const FileUploadCard = ({ fieldName, scanHandler, label }) => {
        const Icon = fileIcons[fieldName]
        const hasFile = !!data[fieldName]

        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: hasFile ? alpha("#237117", 0.3) : "divider",
                    backgroundColor: hasFile ? alpha("#237117", 0.02) : "transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        borderColor: alpha("#237117", 0.5),
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                    }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            backgroundColor: hasFile ? alpha("#237117", 0.15) : alpha("#666", 0.1),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Icon size={18} color={hasFile ? "#237117" : "#666"} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                            {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {hasFile ? "Arquivo carregado" : "Nenhum arquivo"}
                        </Typography>
                    </Box>
                    {hasFile && (
                        <Tooltip title="Remover arquivo">
                            <IconButton
                                onClick={() => clearFile(fieldName)}
                                size="small"
                                sx={{
                                    color: "#d32f2f",
                                    backgroundColor: alpha("#d32f2f", 0.1),
                                    "&:hover": {
                                        backgroundColor: alpha("#d32f2f", 0.2)
                                    }
                                }}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {hasFile && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1.5,
                            mb: 2,
                            backgroundColor: alpha("#237117", 0.08),
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: alpha("#237117", 0.2)
                        }}
                    >
                        <CheckCircle size={16} color="#237117" />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "#237117",
                                fontWeight: 500,
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {fileNames[fieldName] || "Arquivo carregado"}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ScanLine size={16} />}
                        onClick={scanHandler}
                        size="small"
                        fullWidth
                        sx={{
                            borderColor: "#FFC117",
                            color: "#B8860B",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            py: 1,
                            "&:hover": {
                                backgroundColor: "#FFC117",
                                color: "#000",
                                borderColor: "#FFC117"
                            }
                        }}
                    >
                        Escanear
                    </Button>

                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<Upload size={16} />}
                        size="small"
                        fullWidth
                        sx={{
                            backgroundColor: "#237117",
                            color: "white",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            py: 1,
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#1a5511",
                                boxShadow: "0 4px 8px rgba(35, 113, 23, 0.25)"
                            }
                        }}
                    >
                        Carregar
                        <input
                            type="file"
                            hidden
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleChangeFileUrl(fieldName, e)}
                        />
                    </Button>
                </Box>
            </Paper>
        )
    }

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
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
                            {/* Header com Gradiente */}
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
                                        href="/autograph-card"
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
                                            Cartao de Autografo
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "rgba(255,255,255,0.8)" }}
                                        >
                                            CPF/CNPJ: {params.cpfcnpj}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={getFilesCount() > 0 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    label={getFilesCount() > 0 ? `${getFilesCount()} arquivo(s)` : "Sem arquivos"}
                                    size="small"
                                    sx={{
                                        backgroundColor: getFilesCount() > 0 ? "rgba(255,255,255,0.2)" : "rgba(255,200,0,0.3)",
                                        color: "#fff",
                                        fontWeight: 500,
                                        "& .MuiChip-icon": { color: "#fff" }
                                    }}
                                />
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {/* Secao: Informacoes Gerais */}
                                <SectionTitle
                                    icon={Archive}
                                    title="Informacoes Gerais"
                                    subtitle="Preencha o numero da caixa de arquivamento"
                                />

                                <TextField
                                    fullWidth
                                    id="box"
                                    name="box"
                                    label="Numero da Caixa"
                                    value={data.box}
                                    onChange={(e) => setData(state => ({ ...state, box: e.target.value }))}
                                    type="number"
                                    color="success"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Archive size={18} color="#237117" />
                                            </InputAdornment>
                                        )
                                    }}
                                    helperText="Informe o numero da caixa onde o documento sera arquivado"
                                    sx={{
                                        mb: 4,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: '#237117' }
                                        }
                                    }}
                                />

                                <Divider sx={{ my: 3 }} />

                                {/* Secao: Documentos */}
                                <SectionTitle
                                    icon={FileText}
                                    title="Documentos"
                                    subtitle="Escaneie ou carregue os documentos necessarios"
                                />

                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <FileUploadCard
                                            fieldName="card_file_url"
                                            scanHandler={handleCardScan}
                                            label="Cartao de Autografo"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FileUploadCard
                                            fieldName="doc_file_url"
                                            scanHandler={handleDocScan}
                                            label="Documento de Identificacao"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FileUploadCard
                                            fieldName="cpf_file_url"
                                            scanHandler={handleCpfScan}
                                            label="CPF"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FileUploadCard
                                            fieldName="comp_resid_file_url"
                                            scanHandler={handleCompResidScan}
                                            label="Comprovante de Residencia"
                                        />
                                    </Grid>
                                </Grid>

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
                                        href="/autograph-card"
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
                                        onClick={handleUpdateAutographCard}
                                        variant="contained"
                                        disabled={loading || (!data.card_file_url && !data.doc_file_url && !data.cpf_file_url && !data.comp_resid_file_url)}
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
                                        {loading ? "Salvando..." : "Atualizar Arquivos"}
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

export default UpdateFileAutographCard
