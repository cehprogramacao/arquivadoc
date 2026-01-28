"use client"

import React, { useEffect, useState } from "react"
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
    Tag,
    User,
    Layers,
    BookOpen,
    Archive,
    Upload,
    CheckCircle,
    AlertCircle,
    File
} from "lucide-react"

import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import CustomContainer from "@/Components/CustomContainer"
import Loading from "@/Components/loading"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"
import NoteService from "@/services/notes.service"
import Customer from "@/services/customer.service"

const noteSv = new NoteService()
const customerSv = new Customer()

/* ================= SECTION TITLE ================= */
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

/* ================= COMPONENT ================= */
const NoteUpdate = ({ params }) => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    /* ===== OPTIONS ===== */
    const [tags, setTags] = useState([])
    const [presenters, setPresenters] = useState([])
    const [notesType, setNotesType] = useState([])     // GRUPOS
    const [typesGroup, setTypesGroup] = useState([])   // TIPOS

    /* ===== SELECTED ===== */
    const [optionTag, setOptionTag] = useState(null)
    const [optionPresenter, setOptionPresenter] = useState(null)
    const [valueNotesType, setValueNotesType] = useState(null)
    const [optionType, setOptionType] = useState(null)

    /* ===== FILE ===== */
    const [fileName, setFileName] = useState("")
    const [hasFile, setHasFile] = useState(false)

    /* ===== DATA ===== */
    const [data, setData] = useState({
        tag: 0,
        presenter: 0,
        service_type: 0,
        book: "",
        initial_sheet: "",
        final_sheet: "",
        box: "",
        file_url: ""
    })

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((s) => ({ ...s, [name]: value }))
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            dispatch(showAlert("Apenas PDF é permitido", "warning", "file"))
            return
        }

        setFileName(file.name)
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1]
            setData((s) => ({ ...s, file_url: base64 }))
            setHasFile(true)
        }
        reader.readAsDataURL(file)
    }

    const handleScan = () => {
        if (!window.scanner) {
            dispatch(showAlert("Scanner não disponível", "error", "file"))
            return
        }

        window.scanner.scan((ok, msg, response) => {
            if (!ok) return
            if (msg?.toLowerCase().includes("cancel")) return

            try {
                const json = JSON.parse(response)
                const base64 = json.output[0].result[0]
                setData((s) => ({ ...s, file_url: base64 }))
                setHasFile(true)
                dispatch(showAlert("Documento escaneado com sucesso!", "success", "file"))
            } catch {
                dispatch(showAlert("Erro ao processar scan", "error", "file"))
            }
        }, {
            output_settings: [{ type: "return-base64", format: "pdf" }]
        })
    }

    /* ================= LOAD DATA ================= */
    const loadData = async () => {
        try {
            setLoading(true)

            const [
                tagsRes,
                presentersRes,
                groupsRes,
                typesRes,
                note
            ] = await Promise.all([
                noteSv.getAllNoteTags(),
                customerSv.customers(),
                noteSv.getAllNoteGroups(),
                noteSv.getAllNoteTypes(),
                noteSv.getNoteByNumber(params.number)
            ])

            const tagsArr = Object.values(tagsRes)
            const presentersArr = Object.values(presentersRes)
            const groupsArr = Object.values(groupsRes)
            const typesArr = Object.values(typesRes)

            setTags(tagsArr)
            setPresenters(presentersArr)
            setNotesType(groupsArr)
            setTypesGroup(typesArr)

            const selectedTag = tagsArr.find(t => t.id === note.tag)
            const selectedPresenter = presentersArr.find(p => p.cpfcnpj === note.presenter)
            const selectedType = typesArr.find(t => t.id === note.service_type)
            const selectedGroup = groupsArr.find(g => g.id === selectedType?.group_id)

            setOptionTag(selectedTag || null)
            setOptionPresenter(selectedPresenter || null)
            setValueNotesType(selectedGroup || null)
            setOptionType(selectedType || null)

            setData({
                tag: note.tag,
                presenter: note.presenter,
                service_type: note.service_type,
                book: note.book,
                initial_sheet: note.initial_sheet,
                final_sheet: note.final_sheet,
                box: note.box,
                file_url: ""
            })

            setHasFile(!!note.file_url)

        } finally {
            setLoading(false)
        }
    }

    /* ================= UPDATE ================= */
    const handleUpdate = async () => {
        try {
            setSaving(true)
            await noteSv.updateNoteByNumber(params.number, data)
            dispatch({
                type: SET_ALERT,
                message: "Nota atualizada com sucesso!",
                severity: "success",
                alertType: "file"
            })
        } catch {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao atualizar nota!",
                severity: "error",
                alertType: "file"
            })
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    if (loading) return <Loading />

    /* ================= RENDER ================= */
    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={["Notas"]}>
                <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", py: 14 }}>
                    <Container maxWidth="md">
                        <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>

                            {/* HEADER */}
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
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <IconButton href="/notes" sx={{ color: "#fff" }}>
                                        <ArrowLeft size={20} />
                                    </IconButton>
                                    <Box>
                                        <Typography color="#fff" fontWeight={700} variant="h5">
                                            Editar Nota
                                        </Typography>
                                        <Typography color="rgba(255,255,255,0.8)">
                                            Nº {params.number}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={hasFile ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    label={hasFile ? "Documento Anexado" : "Sem Documento"}
                                    sx={{
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        "& .MuiChip-icon": { color: "#fff" }
                                    }}
                                />
                            </Box>

                            <Box sx={{ p: 3 }}>

                                {/* TAG / APRESENTANTE */}
                                <SectionTitle icon={Tag} title="Identificação" />

                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            value={optionTag}
                                            options={tags}
                                            getOptionLabel={(o) => o?.name || ""}
                                            onChange={(e, v) => {
                                                setOptionTag(v)
                                                setData(s => ({ ...s, tag: v?.id || 0 }))
                                            }}
                                            renderInput={(p) =>
                                                <TextField {...p} label="Tag" color="success" />
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            value={optionPresenter}
                                            options={presenters}
                                            getOptionLabel={(o) => o?.name || ""}
                                            onChange={(e, v) => {
                                                setOptionPresenter(v)
                                                setData(s => ({ ...s, presenter: v?.cpfcnpj || 0 }))
                                            }}
                                            renderInput={(p) =>
                                                <TextField {...p} label="Apresentante" color="success" />
                                            }
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* TIPO / SUBTIPO */}
                                <SectionTitle icon={FileText} title="Tipo da Nota" />

                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            value={valueNotesType}
                                            options={notesType}
                                            getOptionLabel={(o) => o?.name || ""}
                                            onChange={(e, v) => {
                                                setValueNotesType(v)
                                                setOptionType(null)
                                                setData(s => ({ ...s, service_type: 0 }))
                                            }}
                                            renderInput={(p) =>
                                                <TextField {...p} label="Grupo" color="success" />
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            value={optionType}
                                            options={typesGroup.filter(t => t.group_id === valueNotesType?.id)}
                                            getOptionLabel={(o) => o?.name || ""}
                                            onChange={(e, v) => {
                                                setOptionType(v)
                                                setData(s => ({ ...s, service_type: v?.id || 0 }))
                                            }}
                                            renderInput={(p) =>
                                                <TextField {...p} label="Tipo / Subtipo" color="success" />
                                            }
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* LOCALIZAÇÃO */}
                                <SectionTitle icon={BookOpen} title="Localização Física" />

                                <Grid container spacing={2.5}>
                                    {["book", "box", "initial_sheet", "final_sheet"].map((field) => (
                                        <Grid item xs={12} sm={6} key={field}>
                                            <TextField
                                                fullWidth
                                                name={field}
                                                type="number"
                                                label={field.replace("_", " ").toUpperCase()}
                                                value={data[field]}
                                                onChange={handleChange}
                                                color="success"
                                            />
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {/* ARQUIVO */}
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
                                        onChange={handleFileUpload}
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

                                <Button
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="outlined"
                                    onClick={handleScan}
                                >
                                    Escanear Documento
                                </Button>

                                <Divider sx={{ my: 3 }} />

                                {/* ACTIONS */}
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button href="/notes" variant="outlined" startIcon={<ArrowLeft size={18} />}>
                                        Voltar
                                    </Button>

                                    <Button
                                        variant="contained"
                                        startIcon={<Save size={18} />}
                                        onClick={handleUpdate}
                                        disabled={saving}
                                    >
                                        {saving ? "Salvando..." : "Salvar Alterações"}
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

export default NoteUpdate
