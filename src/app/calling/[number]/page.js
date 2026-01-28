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
    Tooltip
} from "@mui/material"
import {
    ArrowLeft,
    Save,
    FileText,
    Archive,
    Calendar,
    Upload,
    ScanLine,
    CheckCircle,
    AlertCircle,
    Building2
} from "lucide-react"

import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { useDispatch } from "react-redux"
import { SET_ALERT } from "@/store/actions"
import Loading from "@/Components/loading"
import Calling from "@/services/calling.service"
import { useRouter } from "next/navigation"

const callingSv = new Calling()

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

const EditCallingByNumber = ({ params }) => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [entities, setEntities] = useState([])
    const [types, setTypes] = useState([])

    const [entityOption, setEntityOption] = useState(null)
    const [typeOption, setTypeOption] = useState(null)

    const [fileName, setFileName] = useState("")
    const [hasFile, setHasFile] = useState(false)

    const [data, setData] = useState({
        entity: "",
        calling_type: "",
        box: "",
        date: "",
        file_url: ""
    })

    /* ---------- Load Data ---------- */
    const fetchData = async () => {
        try {
            setLoading(true)
            const entitiesResp = await callingSv.getAllCallingEntities()
            const typesResp = await callingSv.getAllCallingTypes()

            setEntities(Object.values(entitiesResp))
            setTypes(Object.values(typesResp))
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao carregar dados!",
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

    /* ---------- File Upload ---------- */
    const handleChangeFile = (e) => {
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
        setHasFile(true)

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1]
            setData((state) => ({ ...state, file_url: base64 }))
        }
        reader.readAsDataURL(file)
    }

    /* ---------- Scanner ---------- */
    const handleScan = () => {
        if (!window.scanner) {
            dispatch({
                type: SET_ALERT,
                message: "Scanner não disponível!",
                severity: "error",
                alertType: "file"
            })
            return
        }

        window.scanner.scan((success, msg, response) => {
            if (!success) {
                dispatch({
                    type: SET_ALERT,
                    message: "Erro no scanner!",
                    severity: "error",
                    alertType: "file"
                })
                return
            }

            const json = JSON.parse(response)
            const scannedFile = json.output[0].result[0]

            setData((state) => ({ ...state, file_url: scannedFile }))
            setFileName(`Documento escaneado - ${new Date().toLocaleString()}`)
            setHasFile(true)

            dispatch({
                type: SET_ALERT,
                message: "Documento escaneado com sucesso!",
                severity: "success",
                alertType: "file"
            })
        }, {
            output_settings: [{
                type: "return-base64",
                format: "pdf",
                pdf_text_line: "Chamado escaneado em ${DATETIME}"
            }]
        })
    }

    /* ---------- Save ---------- */
    const handleUpdate = async () => {
        try {
            setSaving(true)
            await callingSv.updateCallingByNumber(params.number, data)

            dispatch({
                type: SET_ALERT,
                message: "Chamado atualizado com sucesso!",
                severity: "success",
                alertType: "file"
            })
            router.back()
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message,
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
            <PrivateRoute requiredPermissions={["Ofícios"]}>
                <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 12 }}>
                    <Container maxWidth="md">
                        <Paper
                            sx={{
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden"
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    background: "linear-gradient(135deg, #237117 0%, #2d8f1f 100%)",
                                    px: 3,
                                    py: 2.5,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <IconButton
                                        onClick={() => router.back()}
                                        sx={{ color: "#fff" }}
                                    >
                                        <ArrowLeft />
                                    </IconButton>
                                    <Box>
                                        <Typography color="#fff" fontWeight={700} variant="h6">
                                            Editar Chamado
                                        </Typography>
                                        <Typography color="rgba(255,255,255,.8)" variant="body2">
                                            Nº {params.number}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={hasFile ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    label={hasFile ? "PDF Anexado" : "Sem PDF"}
                                    sx={{
                                        color: "#fff",
                                        backgroundColor: hasFile
                                            ? "rgba(255,255,255,0.2)"
                                            : "rgba(255,200,0,0.3)"
                                    }}
                                />
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <SectionTitle icon={Building2} title="Dados do Chamado" />

                                <Grid container spacing={2.5}>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={entities}
                                            value={entityOption}
                                            getOptionLabel={(o) => o?.name || ""}
                                            onChange={(e, v) => {
                                                setEntityOption(v)
                                                setData((s) => ({ ...s, entity: v?.id || "" }))
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Entidade" color="success" />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            label="Caixa"
                                            type="number"
                                            value={data.box}
                                            onChange={(e) =>
                                                setData((s) => ({ ...s, box: e.target.value }))
                                            }
                                            color="success"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Autocomplete
                                            options={types}
                                            value={typeOption}
                                            getOptionLabel={(o) => o?.name || ""}
                                            onChange={(e, v) => {
                                                setTypeOption(v)
                                                setData((s) => ({ ...s, calling_type: v?.id || "" }))
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Serviço" color="success" />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            type="date"
                                            label="Data"
                                            InputLabelProps={{ shrink: true }}
                                            value={data.date}
                                            onChange={(e) =>
                                                setData((s) => ({ ...s, date: e.target.value }))
                                            }
                                            fullWidth
                                            color="success"
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <SectionTitle icon={FileText} title="Arquivo PDF" />

                                <Box
                                    component="label"
                                    sx={{
                                        border: "2px dashed",
                                        borderColor: hasFile ? "#237117" : "divider",
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        backgroundColor: hasFile
                                            ? alpha("#237117", 0.04)
                                            : "transparent"
                                    }}
                                >
                                    <input hidden type="file" accept=".pdf" onChange={handleChangeFile} />
                                    <Upload size={42} color={hasFile ? "#237117" : "#999"} />
                                    <Typography mt={1} fontWeight={600}>
                                        {fileName || "Clique para anexar PDF"}
                                    </Typography>
                                </Box>

                                <Button
                                    startIcon={<ScanLine />}
                                    sx={{ mt: 2 }}
                                    onClick={handleScan}
                                >
                                    Escanear Documento
                                </Button>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Voltar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Save />}
                                        onClick={handleUpdate}
                                        disabled={saving}
                                        sx={{ backgroundColor: "#237117" }}
                                    >
                                        Salvar Alterações
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

export default withAuth(EditCallingByNumber)
