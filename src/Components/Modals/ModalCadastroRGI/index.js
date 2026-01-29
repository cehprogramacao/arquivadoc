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
import { CheckCircle, ScanLine, Trash2, Upload } from "lucide-react";
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

    const [data, setData] = useState({
        prenotation: "",
        presenter: "",
        service_type: "",
        box: "",
        registration: "",
        file_url: ""
    });

    const [fileNames, setFileNames] = useState({
        file_url: ""
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
       UPLOAD / SCAN
    ==========================*/
    const handleChangeFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            setData((prev) => ({ ...prev, file_url: base64 }));
            setFileNames({ file_url: file.name });
        };
        reader.readAsDataURL(file);
    };

    const handleScanFile = () => {
        if (!window.scanner) {
            console.error("Scanner não disponível");
            return;
        }

        window.scanner.scan(
            (successful, message, response) => {
                if (!successful) {
                    console.error("Falha no scan:", message);
                    return;
                }

                if (
                    message &&
                    message.toLowerCase().includes("user cancel")
                ) {
                    console.info("Usuário cancelou o scan");
                    return;
                }

                if (!response) {
                    console.error("Scanner retornou resposta vazia");
                    return;
                }

                let responseJson;

                try {
                    responseJson = JSON.parse(response);
                } catch (err) {
                    console.error("Erro ao converter resposta do scanner:", err);
                    return;
                }

                // 🔥 VALIDAÇÃO FORTE
                if (
                    !responseJson.output ||
                    !Array.isArray(responseJson.output) ||
                    !responseJson.output[0]?.result ||
                    !responseJson.output[0]?.result[0]
                ) {
                    console.error("Estrutura inesperada do scanner:", responseJson);
                    return;
                }

                const base64Pdf = responseJson.output[0].result[0];

                setData(prev => ({
                    ...prev,
                    file_url: base64Pdf
                }));

                setFileNames({
                    file_url: "Documento escaneado"
                });
            },
            {
                output_settings: [
                    {
                        type: "return-base64",
                        format: "pdf"
                    }
                ]
            }
        );
    };


    const clearFile = () => {
        setData((prev) => ({ ...prev, file_url: "" }));
        setFileNames({ file_url: "" });
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

    /* =========================
       COMPONENTE DE UPLOAD
    ==========================*/
    const FileUploadCard = () => {
        const hasFile = !!data.file_url;

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
                        <Typography fontWeight={600}>Documento</Typography>
                        <Typography variant="caption">
                            {hasFile ? fileNames.file_url : "Nenhum arquivo"}
                        </Typography>
                    </Box>

                    {hasFile && (
                        <Tooltip title="Remover">
                            <IconButton onClick={clearFile}>
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
                        onClick={handleScanFile}
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
                        <input hidden type="file" accept=".pdf" onChange={handleChangeFile} />
                    </Button>
                </Box>
            </Paper>
        );
    };

    if (loading) return <Loading />;

    return (
        <Box
            sx={{
                width: 420,
                height: "100vh",
                p: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize="1.4rem">Cadastro - RGI</Typography>
                <IconButton onClick={onClose}>✕</IconButton>
            </Box>

            {/* FORM */}
            <Box mt={3} display="flex" flexDirection="column" gap={3} overflow="auto">
                <TextField
                    label="Prenotação"
                    value={data.prenotation}
                    onChange={(e) => setData({ ...data, prenotation: e.target.value })}
                    color="success"
                    sx={{
                        mt: 2
                    }}
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
                        value={tiposFiltrados.find(t => t.id === data.service_type) || null}
                        getOptionLabel={(opt) => opt?.name || ""}
                        onChange={(_, val) =>
                            setData({ ...data, service_type: val?.id || "" })
                        }
                        noOptionsText={
                            <RenderNoOptions
                                title="Cadastrar Tipo"
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
                    value={data.registration}
                    onChange={(e) => setData({ ...data, registration: e.target.value })}
                    color="success"
                />

                <FileUploadCard />

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

            {/* MODAIS */}
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
