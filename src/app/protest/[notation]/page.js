"use client"

import React, { useEffect, useState } from "react"
import withAuth from "@/utils/withAuth"
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
    Tooltip,
    useTheme
} from "@mui/material"
import {
    ArrowLeft,
    Save,
    FileText,
    Archive,
    Upload,
    User,
    Users,
    File,
    AlertCircle,
    CheckCircle,
    Scan
} from "lucide-react"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"
import Loading from "@/Components/loading"
import ProtestService from "@/services/protest.service"
import CustomerService from "@/services/customer.service"
import { useRouter } from "next/navigation"

const protestSv = new ProtestService()
const customerSv = new CustomerService()

/* ---------- Utils ---------- */
const onlyNumbers = (v = "") => v.replace(/\D/g, "")

const applyCpfCnpjMask = (v = "") => {
    const n = onlyNumbers(v)
    if (n.length <= 11)
        return n
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14)

    return n
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18)
}

const getCustomerLabel = (opt) =>
    opt ? `${opt.name} — ${applyCpfCnpjMask(opt.cpfcnpj)}` : ""

/* ---------- UI ---------- */
const SectionTitle = ({ icon: Icon, title, theme }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Icon size={18} color={theme.palette.primary.main} />
        </Box>
        <Typography variant="h6" fontWeight={600}>
            {title}
        </Typography>
    </Box>
)

/* ---------- Component ---------- */
const UpdateProtest = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const theme = useTheme()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [customers, setCustomers] = useState([])

    const [fileNames, setFileNames] = useState({
        file_url: "",
        carta_anuencia_file_url: "",
        ar_file_url: ""
    })

    const [data, setData] = useState({
        box: 0,
        presenter: null,
        drawee: null,
        debtor: null,
        file_url: "",
        carta_anuencia_file_url: "",
        ar_file_url: ""
    })

    /* ---------- Fetch ---------- */
    const fetchData = async () => {
        try {
            setLoading(true)

            const protest = await protestSv.getProtestByNotation(params.notation)
            const customersResp = await customerSv.customers()
            const list = Object.values(customersResp)

            setCustomers(list)

            setData({
                box: protest.box || 0,
                presenter: list.find(c => c.cpfcnpj === protest.presenterDocument) || null,
                drawee: list.find(c => c.cpfcnpj === protest.draweeDocument) || null,
                debtor: list.find(c => c.cpfcnpj === protest.debtorDocument) || null,
                file_url: "",
                carta_anuencia_file_url: "",
                ar_file_url: ""
            })

            setFileNames({
                file_url: protest.file_url ? "Documento já anexado" : "",
                carta_anuencia_file_url: protest.carta_anuencia_file_url ? "Documento já anexado" : "",
                ar_file_url: protest.ar_file_url ? "Documento já anexado" : ""
            })
        } catch {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao carregar dados do protesto!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    /* ---------- Upload ---------- */
    const handleFileChange = (field) => (e) => {
        const file = e.target.files[0]
        if (!file || file.type !== "application/pdf") return

        const reader = new FileReader()
        reader.onloadend = () => {
            setData(prev => ({ ...prev, [field]: reader.result.split(",")[1] }))
            setFileNames(prev => ({ ...prev, [field]: file.name }))
        }
        reader.readAsDataURL(file)
    }

    /* ---------- Scan ---------- */
    const handleScanFile = (field) => {
        if (!window.scanner) {
            alert("Scanner não disponível neste dispositivo")
            return
        }

        window.scanner.scan(
            (successful, message, response) => {
                if (!successful) return
                if (message?.toLowerCase().includes("user cancel")) return
                if (!response) return

                const responseJson = JSON.parse(response)
                const base64Pdf = responseJson.output[0].result[0]

                setData(prev => ({ ...prev, [field]: base64Pdf }))
                setFileNames(prev => ({ ...prev, [field]: "Documento escaneado" }))
            },
            {
                output_settings: [
                    { type: "return-base64", format: "pdf" }
                ]
            }
        )
    }

    /* ---------- Save ---------- */
    const handleUpdate = async () => {
        try {
            setSaving(true)

            await protestSv.editProtestByNotation(params.notation, {
                box: data.box,
                presenter: data.presenter,
                drawee: data.drawee,
                debtor: data.debtor,
                file_url: data.file_url,
                carta_anuencia_file_url: data.carta_anuencia_file_url,
                ar_file_url: data.ar_file_url
            })

            dispatch({
                type: SET_ALERT,
                message: "Protesto atualizado com sucesso!",
                severity: "success",
                alertType: "file"
            })

            router.back()
        } catch {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao atualizar protesto!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={["Protesto"]}>
                <Box sx={{ width: "100%", minHeight: "100vh", py: 14 }}>
                    <Container maxWidth="md">
                        <Paper sx={{ borderRadius: 3 }}>
                            {/* HEADER */}
                            <Box
                                sx={{
                                    background: "linear-gradient(135deg,#237117,#2d8f1f)",
                                    px: 3,
                                    py: 2.5,
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <IconButton onClick={() => router.back()} sx={{ color: "#fff" }}>
                                        <ArrowLeft />
                                    </IconButton>
                                    <Box>
                                        <Typography color="#fff" fontWeight={700} variant="h5">
                                            Editar Protesto
                                        </Typography>
                                        <Typography color="rgba(255,255,255,.8)">
                                            Prenotação #{params.notation}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <SectionTitle theme={theme} icon={User} title="Apresentante" />

                                <Autocomplete
                                    options={customers}
                                    value={data.presenter}
                                    getOptionLabel={getCustomerLabel}
                                    onChange={(e, v) => setData(s => ({ ...s, presenter: v }))}
                                    renderInput={(p) => <TextField {...p} label="Apresentante" />}
                                />

                                <Divider sx={{ my: 3 }} />

                                <SectionTitle theme={theme} icon={Users} title="Partes" />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            options={customers}
                                            value={data.drawee}
                                            getOptionLabel={getCustomerLabel}
                                            onChange={(e, v) => setData(s => ({ ...s, drawee: v }))}
                                            renderInput={(p) => <TextField {...p} label="Sacado" />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            options={customers}
                                            value={data.debtor}
                                            getOptionLabel={getCustomerLabel}
                                            onChange={(e, v) => setData(s => ({ ...s, debtor: v }))}
                                            renderInput={(p) => <TextField {...p} label="Devedor" />}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <SectionTitle theme={theme} icon={FileText} title="Dados do Protesto" />

                                <TextField
                                    type="number"
                                    label="Caixa"
                                    value={data.box}
                                    onChange={(e) =>
                                        setData(s => ({ ...s, box: Number(e.target.value) }))
                                    }
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Archive size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Divider sx={{ my: 3 }} />

                                {/* SCANS */}
                                {[
                                    { label: "Scan do Protesto", field: "file_url" },
                                    { label: "Scan Carta de Anuência", field: "carta_anuencia_file_url" },
                                    { label: "Scan AR", field: "ar_file_url" }
                                ].map(({ label, field }) => (
                                    <Box key={field} sx={{ mb: 4 }}>
                                        <Typography fontWeight={600}>{label}</Typography>

                                        <Box
                                            component="label"
                                            sx={{
                                                minHeight: 160,
                                                border: "2px dashed",
                                                borderColor: fileNames.file_url ? "#237117" : "divider",
                                                borderRadius: 2,
                                                p: 3,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 1,
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                                "&:hover": {
                                                    borderColor: "#237117",
                                                    backgroundColor: alpha("#237117", 0.02)
                                                }
                                            }}
                                        >
                                            <input
                                                hidden
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange(field)}
                                            />
                                            <Upload size={32} color="#237117" />
                                            <Typography variant="body2">
                                                {fileNames[field] || "Clique para anexar PDF"}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    background: 'transparent',
                                                    padding: '5px 20px',
                                                    color: '#FED70B',
                                                    borderRadius: "7px",
                                                    border: '1px solid #FED70B',
                                                    ":hover": {
                                                        background: '#FED70B',
                                                        border: '1px solid #FED70B',
                                                        color: '#fff'
                                                    }
                                                }}
                                                startIcon={<Scan size={18} />}
                                                onClick={() => handleScanFile(field)}
                                            >
                                                Escanear Documento
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button onClick={() => router.back()}>Voltar</Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        disabled={saving}
                                        onClick={handleUpdate}
                                    >
                                        {saving ? "Salvando..." : "Salvar"}
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

export default withAuth(UpdateProtest)