import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import CadastroRGITypes from "@/Components/ModalsRegistration/ModalTypesRGI";
import Loading from "@/Components/loading";
import Customer from "@/services/customer.service";
import RGI from "@/services/rgi.service";

import {
    useMediaQuery,
    useTheme,
    alpha,
    TextField,
    Button,
    Typography,
    Autocomplete,
    IconButton,
    Paper,
    Tooltip
} from "@mui/material";

import { Box } from "@mui/system";
import { DocumentScanner } from "@mui/icons-material";
import { ScanLine, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

const customerSv = new Customer();
const rgiSv = new RGI();

export const CadastroModalRGI = ({ onClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [loading, setLoading] = useState(false);

    const [presenterList, setPresenterList] = useState([]);
    const [userPresenter, setUserPresenter] = useState(null);

    const [types, setTypes] = useState([]);
    const [grupo, setGrupo] = useState(null);

    const [openModalRGITypes, setOpenModalRGITypes] = useState(false);
    const [openModalPresenter, setOpenModalPresenter] = useState(false);

    /* =========================
       STATE PRINCIPAL (NOVOS CAMPOS INCLUÍDOS)
    ==========================*/
    const [data, setData] = useState({
        prenotation: "",
        data_prenotation: "",
        presenter: "",
        service_type: "",
        box: "",
        registration: "",
        matricula: "",
        file_url: "",
        matricula_acervo_file_url: ""
    });

    const [fileNames, setFileNames] = useState({
        file_url: "",
        matricula_acervo_file_url: ""
    });

    const grupos = ["Registro", "Averbação"];

    const tiposFiltrados = grupo
        ? types.filter((tipo) => tipo.group === grupo)
        : [];

    /* =========================
       BUSCAS INICIAIS
    ==========================*/
    const getCustomersPresenter = async () => {
        const res = await customerSv.customers();
        setPresenterList(Object.values(res));
    };

    const getTypesRGI = async () => {
        const res = await rgiSv.getType();
        setTypes(Object.values(res));
    };

    useEffect(() => {
        getCustomersPresenter();
        getTypesRGI();
    }, []);

    /* =========================
       UPLOAD / SCAN (GENÉRICO)
    ==========================*/
    const handleFileBase64 = (file, field) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            setData(prev => ({ ...prev, [field]: base64 }));
            setFileNames(prev => ({ ...prev, [field]: file.name }));
        };
        reader.readAsDataURL(file);
    };

    const handleChangeFile = (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFileBase64(file, field);
    };

    const handleScanFile = (field) => {
        if (!window.scanner) {
            console.error("Scanner não disponível");
            return;
        }

        window.scanner.scan(
            (successful, message, response) => {
                if (!successful || !response) return;

                const responseJson = JSON.parse(response);
                const base64Pdf = responseJson.output[0].result[0];

                setData(prev => ({ ...prev, [field]: base64Pdf }));
                setFileNames(prev => ({
                    ...prev,
                    [field]: "Documento escaneado"
                }));
            },
            {
                output_settings: [{ type: "return-base64", format: "pdf" }]
            }
        );
    };

    const clearFile = (field) => {
        setData(prev => ({ ...prev, [field]: "" }));
        setFileNames(prev => ({ ...prev, [field]: "" }));
    };

    /* =========================
       COMPONENTE DE UPLOAD
    ==========================*/
    const FileUploadCard = ({ label, field }) => {
        const hasFile = !!data[field];

        return (
            <Paper
                sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: hasFile ? alpha("#237117", 0.4) : "divider",
                    borderRadius: 2
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <DocumentScanner color={hasFile ? "success" : "disabled"} />
                    <Box flex={1}>
                        <Typography fontWeight={600}>{label}</Typography>
                        <Typography variant="caption">
                            {hasFile ? fileNames[field] : "Nenhum arquivo"}
                        </Typography>
                    </Box>

                    {hasFile && (
                        <Tooltip title="Remover">
                            <IconButton onClick={() => clearFile(field)}>
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ScanLine size={16} />}
                        fullWidth
                        onClick={() => handleScanFile(field)}
                    >
                        Escanear
                    </Button>

                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<Upload size={16} />}
                        fullWidth
                        sx={{ backgroundColor: "#237117" }}
                    >
                        Upload
                        <input
                            hidden
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleChangeFile(e, field)}
                        />
                    </Button>
                </Box>
            </Paper>
        );
    };

    /* =========================
       CRIAÇÃO
    ==========================*/
    const handleCreateRGI = async () => {
        try {
            setLoading(true);
            await rgiSv.create(data);
            onClose();
            window.location.reload();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Box sx={{ width: 420, height: "100vh", p: 2, display: "flex", flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize="1.4rem">Cadastro - RGI</Typography>
                <IconButton onClick={onClose}>✕</IconButton>
            </Box>

            <Box mt={3} display="flex" flexDirection="column" gap={3} overflow="auto">
                <TextField
                    label="Prenotação"
                    value={data.prenotation}
                    onChange={(e) => setData({ ...data, prenotation: e.target.value })}
                    color="success"
                />

                <TextField
                    type="date"
                    label="Data da Prenotação"
                    InputLabelProps={{ shrink: true }}
                    value={data.data_prenotation}
                    onChange={(e) => setData({ ...data, data_prenotation: e.target.value })}
                    color="success"
                />

                <TextField
                    label="Nº da Caixa"
                    value={data.box}
                    onChange={(e) => setData({ ...data, box: e.target.value })}
                    color="success"
                />

                <Autocomplete
                    value={userPresenter}
                    options={presenterList}
                    getOptionLabel={(opt) => opt?.name || ""}
                    onChange={(_, val) => {
                        setUserPresenter(val);
                        setData({ ...data, presenter: val?.cpfcnpj || "" });
                    }}
                    noOptionsText={
                        <RenderNoOptions
                            title="Cadastrar Apresentante"
                            onClick={() => setOpenModalPresenter(true)}
                        />
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Apresentante" color="success" />
                    )}
                />

                <Autocomplete
                    options={grupos}
                    value={grupo}
                    onChange={(_, val) => setGrupo(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Tipo de Serviço" color="success" />
                    )}
                />

                {grupo && (
                    <Autocomplete
                        options={tiposFiltrados}
                        getOptionLabel={(opt) => opt?.name || ""}
                        onChange={(_, val) =>
                            setData({ ...data, service_type: val?.id || "" })
                        }
                        noOptionsText={
                            <RenderNoOptions
                                title="Cadastrar Tipo RGI"
                                onClick={() => setOpenModalRGITypes(true)}
                            />
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Tipo" color="success" />
                        )}
                    />
                )}

                <TextField
                    label="Número da Matrícula"
                    value={data.matricula}
                    onChange={(e) => setData({ ...data, matricula: e.target.value })}
                    color="success"
                />

                <TextField
                    label="Registro"
                    value={data.registration}
                    onChange={(e) => setData({ ...data, registration: e.target.value })}
                    color="success"
                />

                <FileUploadCard label="Documento RGI" field="file_url" />
                <FileUploadCard label="Documento do Acervo (Matrícula)" field="matricula_acervo_file_url" />

                <Button
                    sx={{
                        backgroundColor: "#237117",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#1b5a12" }
                    }}
                    onClick={handleCreateRGI}
                >
                    Realizar Cadastro
                </Button>
            </Box>

            <CadastroRGITypes
                open={openModalRGITypes}
                onClose={() => setOpenModalRGITypes(false)}
                getData={getTypesRGI}
            />

            <CadastroPartes
                open={openModalPresenter}
                onClose={() => setOpenModalPresenter(false)}
                getAllPartes={getCustomersPresenter}
            />
        </Box>
    );
};
