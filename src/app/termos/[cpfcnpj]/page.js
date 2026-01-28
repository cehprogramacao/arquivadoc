"use client"

import React, { useEffect, useState } from "react"
import withAuth from "@/utils/withAuth"
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
    Autocomplete
} from "@mui/material"
import {
    ArrowLeft,
    Save,
    Archive,
    Upload,
    File,
    CheckCircle,
    AlertCircle,
    User
} from "lucide-react"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"
import Loading from "@/Components/loading"
import Customer from "@/services/customer.service"
import { useRouter } from "next/navigation"

const customerSv = new Customer()

/* ---------- MASK ---------- */
const maskCpfCnpj = (value = "") => {
    const cleaned = value.replace(/\D/g, "")

    if (cleaned.length <= 11) {
        return cleaned
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }

    return cleaned
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
}

/* ---------- Section Title ---------- */
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
        <Typography variant="h6" fontWeight={600}>
            {title}
        </Typography>
    </Box>
)

const UpdateTermLGPD = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [fileName, setFileName] = useState("")
    const [hasFile, setHasFile] = useState(false)

    const [presenter, setPresenter] = useState([])
    const [selectedPresenter, setSelectedPresenter] = useState(null)

    const [data, setData] = useState({
        box: "",
        cpfcnpj: "",
        file_url: ""
    })

    /* ---------- FETCH TERM ---------- */
    const fetchData = async () => {
        try {
            setLoading(true)

            const term = await customerSv.getTermLGDP(params.cpfcnpj)

            setData({
                box: term.box || "",
                cpfcnpj: term.cpfcnpj || params.cpfcnpj,
                file_url: ""
            })

            setHasFile(!!term.file_url)
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao carregar termo!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setLoading(false)
        }
    }

    /* ---------- FETCH PEOPLE ---------- */
    const getDataPresenter = async () => {
        try {
            const res = await customerSv.customers()
            setPresenter(Object.values(res))
        } catch (error) {
            console.error("Erro ao buscar clientes", error)
        }
    }

    /* ---------- HANDLERS ---------- */
    const handleChangeFieldValues = (e) => {
        const { name, value } = e.target
        setData((state) => ({ ...state, [name]: value }))
    }

    const handleChangeFileUrl = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            dispatch({
                type: SET_ALERT,
                message: "Apenas arquivos PDF são permitidos!",
                severity: "warning",
                alertType: "file"
            })
            return
        }

        setFileName(file.name)

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1]
            setData((state) => ({ ...state, file_url: base64 }))
        }
        reader.readAsDataURL(file)
    }

    const handleUpdateTerm = async () => {
        try {
            setSaving(true)

            await customerSv.putTermLGDP(data.cpfcnpj.replace(/\D/g, ""), data)

            dispatch({
                type: SET_ALERT,
                message: "Termo atualizado com sucesso!",
                severity: "success",
                alertType: "file"
            })

            router.back()
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao atualizar termo!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        fetchData()
        getDataPresenter()
    }, [])

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={["Cadastros"]}>
                <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 14 }}>
                    <Container maxWidth="lg">
                        <Paper sx={{ borderRadius: 4 }}>
                            {/* HEADER */}
                            <Box
                                sx={{
                                    background: "linear-gradient(135deg, #237117, #2d8f1f)",
                                    px: 3,
                                    py: 2.5,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <IconButton onClick={() => router.back()} sx={{ color: "#fff" }}>
                                        <ArrowLeft size={20} />
                                    </IconButton>

                                    <Box>
                                        <Typography color="#fff" fontWeight={700} variant="h5">
                                            Editar Termo LGPD
                                        </Typography>
                                        <Typography color="rgba(255,255,255,0.8)">
                                            CPF/CNPJ editável
                                        </Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={hasFile ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    label={hasFile ? "PDF Anexado" : "Sem PDF"}
                                    size="small"
                                    sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}
                                />
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {/* CPF */}
                                <SectionTitle icon={User} title="Pessoa Vinculada" />

                                <Autocomplete
                                    options={presenter}
                                    value={selectedPresenter}
                                    isOptionEqualToValue={(option, value) =>
                                        option?.cpfcnpj === value?.cpfcnpj
                                    }
                                    getOptionLabel={(option) =>
                                        option
                                            ? `${option.name} — ${maskCpfCnpj(option.cpfcnpj)}`
                                            : ""
                                    }
                                    onChange={(e, value) => {
                                        setSelectedPresenter(value)
                                        setData((state) => ({
                                            ...state,
                                            cpfcnpj: value ? value.cpfcnpj : ""
                                        }))
                                    }}
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            {...props}
                                            key={option.cpfcnpj}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start"
                                            }}
                                        >
                                            <Typography fontWeight={600}>
                                                {option.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {maskCpfCnpj(option.cpfcnpj)}
                                            </Typography>
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Apresentante (Nome + CPF/CNPJ)"
                                            color="success"
                                        />
                                    )}
                                />


                                <Divider sx={{ my: 3 }} />

                                {/* BOX */}
                                <SectionTitle icon={Archive} title="Localização" />

                                <TextField
                                    fullWidth
                                    name="box"
                                    label="Caixa"
                                    type="number"
                                    value={data.box}
                                    onChange={handleChangeFieldValues}
                                    color="success"
                                />

                                <Divider sx={{ my: 3 }} />

                                <SectionTitle icon={File} title="Arquivo PDF" />

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
                                        onChange={handleChangeFileUrl}
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
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Voltar
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleUpdateTerm}
                                        disabled={saving}
                                        sx={{ backgroundColor: "#237117" }}
                                    >
                                        Salvar
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

export default withAuth(UpdateTermLGPD)
