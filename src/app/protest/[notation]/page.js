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
    CreditCard,
    File,
    AlertCircle,
    CheckCircle
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
    const [fileName, setFileName] = useState("")
    const [hasFile, setHasFile] = useState(false)

    const [data, setData] = useState({
        box: 0,
        presenter: null,
        drawee: null,
        debtor: null,
        situation: "",
        file_url: ""
    })

    const situationOptions = [
        { label: "Protestado" },
        { label: "Cancelado" },
        { label: "Sustado" }
    ]

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
                situation: protest.situation || "",
                file_url: ""
            })

            setHasFile(!!protest.file_url)
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

    /* ---------- File ---------- */
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file || file.type !== "application/pdf") return

        setFileName(file.name)
        const reader = new FileReader()
        reader.onloadend = () =>
            setData(s => ({ ...s, file_url: reader.result.split(",")[1] }))
        reader.readAsDataURL(file)
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
                situation: data.situation,
                file_url: data.file_url
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

                                <Chip
                                    icon={hasFile ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    label={hasFile ? "PDF Anexado" : "Sem PDF"}
                                    sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,.2)" }}
                                />
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {/* APRESENTANTE */}
                                <SectionTitle theme={theme} icon={User} title="Apresentante" />
                                <Autocomplete
                                    options={customers}
                                    value={data.presenter}
                                    getOptionLabel={getCustomerLabel}
                                    isOptionEqualToValue={(o, v) => o?.id === v?.id}
                                    onChange={(e, v) => setData(s => ({ ...s, presenter: v }))}
                                    renderInput={(p) => <TextField {...p} label="Apresentante" />}
                                />

                                <Divider sx={{ my: 3 }} />

                                {/* SACADO / DEVEDOR */}
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

                                {/* DADOS */}
                                <SectionTitle theme={theme} icon={FileText} title="Dados do Protesto" />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
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
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Autocomplete
                                            options={situationOptions}
                                            value={situationOptions.find(o => o.label === data.situation) || null}
                                            getOptionLabel={(o) => o.label}
                                            onChange={(e, v) =>
                                                setData(s => ({ ...s, situation: v?.label || "" }))
                                            }
                                            renderInput={(p) => <TextField {...p} label="Situação" />}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* PDF */}
                                <SectionTitle icon={File} theme={theme} title="Arquivo PDF" />

                                <Box
                                    component="label"
                                    sx={{
                                        minHeight: 160,
                                        border: "2px dashed",
                                        borderColor: fileName ? "#237117" : "divider",
                                        borderRadius: 2,
                                        p: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        cursor: "pointer",
                                        backgroundColor: fileName
                                            ? alpha("#237117", 0.04)
                                            : "transparent",
                                        "&:hover": {
                                            borderColor: "#237117",
                                            backgroundColor: alpha("#237117", 0.04)
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />

                                    <Upload
                                        size={42}
                                        color={fileName ? "#237117" : "#999"}
                                    />

                                    {fileName ? (
                                        <>
                                            <Typography fontWeight={600} color="#237117">
                                                {fileName}
                                            </Typography>
                                            <Typography variant="caption">
                                                Clique para trocar o arquivo
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography color="text.secondary">
                                                Clique para selecionar um PDF
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {hasFile
                                                    ? "Já existe um PDF anexado"
                                                    : "Nenhum arquivo selecionado"}
                                            </Typography>
                                        </>
                                    )}
                                </Box>

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
