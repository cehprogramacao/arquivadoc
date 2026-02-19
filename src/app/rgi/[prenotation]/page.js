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
    alpha
} from "@mui/material"
import {
    ArrowLeft,
    Save,
    FileText,
    Hash,
    Archive,
    Upload,
    CreditCard,
    CheckCircle,
    AlertCircle,
    User,
    Scan,
    Calendar
} from "lucide-react"
import Loading from "@/Components/loading"
import RGI from "@/services/rgi.service"
import { useRouter } from "next/navigation"

const rgiSv = new RGI()

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

const UpdateRGI = ({ params }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [types, setTypes] = useState([])
    const [optionType, setOptionType] = useState(null)
    const [fileNames, setFileNames] = useState({
        file_url: "",
        matricula_acervo_file_url: ""
    })

    const [data, setData] = useState({
        prenotation: "",
        box: "",
        presenterDocument: "",
        presenterName: "",
        service_type: "",
        registration: "",
        data_prenotation: "",
        matricula: "",
        file_url: "",
        matricula_acervo_file_url: ""
    })

    /* ---------- Utils ---------- */
    const onlyNumbers = (value = "") => value.replace(/\D/g, "")

    const applyCpfMask = (value = "") =>
        onlyNumbers(value)
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14)

    /* ---------- Fetch ---------- */
    const fetchData = async () => {
        try {
            setLoading(true)

            const rgi = await rgiSv.getByPrenotation(params.prenotation)
            const responseTypes = await rgiSv.getType()
            const typesArray = Object.values(responseTypes)

            setTypes(typesArray)

            const currentType = typesArray.find(t => t.name === rgi.typeName)
            setOptionType(currentType || null)

            setData({
                prenotation: rgi.prenotation || "",
                box: rgi.box || "",
                presenterDocument: rgi.presenterDocument || "",
                presenterName: rgi.presenterName || "",
                service_type: currentType?.id || "",
                registration: rgi.registration || "",
                data_prenotation: rgi.data_prenotation || "",
                matricula: rgi.matricula || "",
                file_url: "",
                matricula_acervo_file_url: ""
            })

            if (rgi.file_url) {
                setFileNames(prev => ({ ...prev, file_url: "PDF existente" }))
            }
            if (rgi.matricula_acervo_file_url) {
                setFileNames(prev => ({ ...prev, matricula_acervo_file_url: "PDF existente" }))
            }
        } catch (error) {
            console.error("Erro ao carregar RGI", error)
        } finally {
            setLoading(false)
        }
    }

    /* ---------- Handlers ---------- */
    const handleChangeFieldValues = (e) => {
        const { name, value } = e.target
        setData((state) => ({ ...state, [name]: value }))
    }

    const handleChangeFileUrl = (field) => (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            alert("Apenas PDF permitido")
            return
        }

        setFileNames(prev => ({ ...prev, [field]: file.name }))
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1]
            setData((state) => ({ ...state, [field]: base64 }))
        }
        reader.readAsDataURL(file)
    }

    const handleScanFile = (field) => {
        if (!window.scanner) {
            console.error("Scanner não disponível")
            alert("Scanner não disponível neste dispositivo")
            return
        }

        window.scanner.scan(
            (successful, message, response) => {
                if (!successful) {
                    console.error("Falha no scanner: " + message)
                    return
                }
                if (message && message.toLowerCase().indexOf("user cancel") >= 0) {
                    console.info("Usuário cancelou")
                    return
                }
                if (!response) return

                const responseJson = JSON.parse(response)
                const base64Pdf = responseJson.output[0].result[0]

                setData(prev => ({ ...prev, [field]: base64Pdf }))
                setFileNames(prev => ({
                    ...prev,
                    [field]: "Documento escaneado"
                }))
            },
            {
                output_settings: [
                    {
                        type: "return-base64",
                        format: "pdf"
                    }
                ]
            }
        )
    }

    const handleUpdateRGI = async () => {
        try {
            setSaving(true)
            await rgiSv.putByPrenotation(data.prenotation, data)
            router.back()
        } catch (error) {
            console.error("Erro ao atualizar RGI", error)
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <Loading />

    return (
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
                <Paper sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    {/* HEADER */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #237117, #2d8f1f)",
                            px: 3,
                            py: 2.5,
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <IconButton
                                onClick={() => router.back()}
                                sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
                            >
                                <ArrowLeft size={20} />
                            </IconButton>
                            <Box>
                                <Typography color="#fff" fontWeight={700} variant="h5">
                                    Editar RGI
                                </Typography>
                                <Typography color="rgba(255,255,255,0.8)">
                                    Prenotação #{data.prenotation}
                                </Typography>
                            </Box>
                        </Box>

                        <Chip
                            icon={
                                fileNames.file_url ?
                                    <CheckCircle size={14} /> :
                                    <AlertCircle size={14} />
                            }
                            label={fileNames.file_url ? "PDF Anexado" : "Sem PDF"}
                            size="small"
                            sx={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.2)" }}
                        />
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <SectionTitle icon={FileText} title="Dados do Registro" />

                        <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Prenotação"
                                    value={data.prenotation}
                                    disabled
                                    fullWidth
                                    color="success"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Data Prenotação"
                                    name="data_prenotation"
                                    type="date"
                                    value={data.data_prenotation}
                                    onChange={handleChangeFieldValues}
                                    fullWidth
                                    color="success"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Calendar size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Registro"
                                    name="registration"
                                    value={data.registration}
                                    onChange={handleChangeFieldValues}
                                    fullWidth
                                    color="success"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Hash size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Matrícula"
                                    name="matricula"
                                    value={data.matricula}
                                    onChange={handleChangeFieldValues}
                                    fullWidth
                                    color="success"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Hash size={18} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Caixa"
                                    name="box"
                                    type="number"
                                    value={data.box}
                                    onChange={handleChangeFieldValues}
                                    fullWidth
                                    color="success"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Archive size={18} />
                                            </InputAdornment>
                                        )
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
                                        setData((s) => ({ ...s, service_type: value ? value.id : "" }))
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tipo de Serviço"
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
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <SectionTitle icon={User} title="Apresentante" />

                        <Box
                            sx={{
                                backgroundColor: alpha("#237117", 0.05),
                                borderRadius: 2,
                                p: 2,
                                border: "1px solid",
                                borderColor: alpha("#237117", 0.1),
                                mb: 3
                            }}
                        >
                            <Typography variant="body1" fontWeight={600}>
                                {data.presenterName || "-"}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                <CreditCard size={14} color="#666" />
                                <Typography variant="body2" color="text.secondary">
                                    {applyCpfMask(data.presenterDocument) || "-"}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <SectionTitle icon={Upload} title="Arquivo PDF Principal" />

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
                                type="file"
                                hidden
                                accept=".pdf"
                                onChange={handleChangeFileUrl("file_url")}
                            />
                            <Upload size={42} color="#237117" />
                            <Typography>
                                {fileNames.file_url || "Clique para selecionar um PDF"}
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
                                    cursor: 'pointer',
                                    ":hover": {
                                        background: '#FED70B',
                                        border: '1px solid #FED70B',
                                        color: '#fff'
                                    }
                                }}
                                startIcon={<Scan size={18} />}
                                onClick={() => handleScanFile("file_url")}
                            >
                                Escanear Documento
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <SectionTitle icon={Upload} title="Matrícula Acervo - PDF" />

                        <Box
                            component="label"
                            sx={{
                                minHeight: 160,
                                border: "2px dashed",
                                borderColor: fileNames.matricula_acervo_file_url ? "#237117" : "divider",
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
                                type="file"
                                hidden
                                accept=".pdf"
                                onChange={handleChangeFileUrl("matricula_acervo_file_url")}
                            />
                            <Upload size={42} color="#237117" />
                            <Typography>
                                {fileNames.matricula_acervo_file_url || "Clique para selecionar um PDF"}
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
                                    cursor: 'pointer',
                                    ":hover": {
                                        background: '#FED70B',
                                        border: '1px solid #FED70B',
                                        color: '#fff'
                                    }
                                }}
                                startIcon={<Scan size={18} />}
                                onClick={() => handleScanFile("matricula_acervo_file_url")}
                            >
                                Escanear Matrícula
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button variant="outlined" onClick={() => router.back()}>
                                Voltar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleUpdateRGI}
                                disabled={saving}
                                startIcon={<Save size={18} />}
                            >
                                {saving ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default withAuth(UpdateRGI)