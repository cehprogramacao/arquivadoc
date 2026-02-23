"use client"
import Loading from "@/Components/loading";
import RegistroCivil from "@/services/registroCivil.service";

import {
    alpha,
    TextField,
    Button,
    Typography,
    Autocomplete,
    IconButton,
    Paper,
    Tooltip,
    Divider,
    Box
} from "@mui/material";

import { DocumentScanner } from "@mui/icons-material";
import { ScanLine, Trash2, Upload, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

const registroCivilSv = new RegistroCivil();

export const CadastroModalRegistroCivil = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(true);
    const [tipos, setTipos] = useState([]);
    const [tiposParticipacao, setTiposParticipacao] = useState([]);

    const [data, setData] = useState({
        tipo: null,
        livro: "",
        folha: "",
        termo: "",
        data_registro: "",
        nome_principal: "",
        nome_secundario: "",
        observacoes: "",
        file_url: "",
    });

    const [pessoas, setPessoas] = useState([]);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tiposRes, participacaoRes] = await Promise.all([
                    registroCivilSv.getAllTipos(),
                    registroCivilSv.getAllTiposParticipacao(),
                ]);
                setTipos(Array.isArray(tiposRes) ? tiposRes : Object.values(tiposRes));
                setTiposParticipacao(Array.isArray(participacaoRes) ? participacaoRes : Object.values(participacaoRes));
            } catch (err) {
                console.error("Erro ao carregar tipos:", err);
            } finally {
                setLoadingInit(false);
            }
        };
        fetchData();
    }, []);

    /* =========================
       FILE HANDLING
    ==========================*/
    const handleFileBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            setData(prev => ({ ...prev, file_url: base64 }));
            setFileName(file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleChangeFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFileBase64(file);
    };

    const handleScanFile = () => {
        if (!window.scanner) {
            console.error("Scanner não disponível");
            return;
        }

        window.scanner.scan(
            (successful, message, response) => {
                if (!successful || !response) return;

                const responseJson = JSON.parse(response);
                const base64Pdf = responseJson.output[0].result[0];

                setData(prev => ({ ...prev, file_url: base64Pdf }));
                setFileName("Documento escaneado");
            },
            {
                output_settings: [{ type: "return-base64", format: "pdf" }]
            }
        );
    };

    const clearFile = () => {
        setData(prev => ({ ...prev, file_url: "" }));
        setFileName("");
    };

    /* =========================
       PESSOAS HANDLING
    ==========================*/
    const addPessoa = () => {
        setPessoas(prev => [...prev, {
            tipo_participacao_id: null,
            tipo_participacao_nome: "",
            nome: "",
            cpf: "",
            rg: "",
            data_nascimento: "",
        }]);
    };

    const updatePessoa = (index, field, value) => {
        setPessoas(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const removePessoa = (index) => {
        setPessoas(prev => prev.filter((_, i) => i !== index));
    };

    /* =========================
       HELPERS
    ==========================*/
    const getParticipacaoByNome = (nome) => tiposParticipacao.find(tp => tp.nome === nome);

    const makePessoaTemplate = (nomeParticipacao) => {
        const tp = getParticipacaoByNome(nomeParticipacao);
        return {
            tipo_participacao_id: tp?.id || null,
            tipo_participacao_nome: nomeParticipacao,
            nome: "",
            cpf: "",
            rg: "",
            data_nascimento: "",
        };
    };

    /* =========================
       TIPO CHANGE - Auto populate pessoas
    ==========================*/
    const PESSOAS_TEMPLATE = {
        nascimento: ["registrado", "pai", "mae", "declarante"],
        casamento: ["conjuge", "conjuge"],
        obito: ["falecido", "declarante"],
        natimorto: ["registrado", "pai", "mae", "declarante"],
        habilitacao_casamento: ["contraente", "contraente"],
        proclamas: ["contraente", "contraente"],
        conversao_uniao_estavel: ["conjuge", "conjuge"],
        registro_uniao_estavel: ["conjuge", "conjuge"],
        emancipacao: ["emancipado", "pai", "mae"],
        interdicao: ["interditado", "curador", "requerente"],
        tutela: ["registrado", "tutor", "requerente"],
        curatela: ["interditado", "curador", "requerente"],
        guarda: ["registrado", "guardiao", "requerente"],
        adocao: ["adotado", "adotante"],
        reconhecimento_paternidade: ["reconhecido", "pai"],
        registro_tardio: ["registrado", "pai", "mae", "declarante"],
        registro_indigena: ["registrado", "declarante"],
        registro_socioafetivo: ["reconhecido", "pai"],
        transcricao_nascimento_estrangeiro: ["registrado", "pai", "mae"],
        transcricao_casamento_estrangeiro: ["conjuge", "conjuge"],
        transcricao_obito_estrangeiro: ["falecido", "declarante"],
    };

    const handleTipoChange = (tipoObj) => {
        setData(prev => ({ ...prev, tipo: tipoObj }));

        if (!tipoObj) {
            setPessoas([]);
            return;
        }

        const template = PESSOAS_TEMPLATE[tipoObj.nome];
        if (template) {
            setPessoas(template.map(nome => makePessoaTemplate(nome)));
        } else {
            setPessoas([makePessoaTemplate("requerente")]);
        }
    };

    /* =========================
       FILE UPLOAD CARD
    ==========================*/
    const FileUploadCard = () => {
        const hasFile = !!data.file_url;

        return (
            <Paper
                sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: hasFile ? alpha("#8E24AA", 0.4) : "divider",
                    borderRadius: 2
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <DocumentScanner color={hasFile ? "secondary" : "disabled"} />
                    <Box flex={1}>
                        <Typography fontWeight={600}>Documento Digitalizado</Typography>
                        <Typography variant="caption">
                            {hasFile ? fileName : "Nenhum arquivo"}
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
                        color="secondary"
                    >
                        Escanear
                    </Button>

                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<Upload size={16} />}
                        fullWidth
                        sx={{ backgroundColor: "#8E24AA" }}
                    >
                        Upload
                        <input
                            hidden
                            type="file"
                            accept=".pdf"
                            onChange={handleChangeFile}
                        />
                    </Button>
                </Box>
            </Paper>
        );
    };

    /* =========================
       SUBMIT
    ==========================*/
    const handleCreate = async () => {
        try {
            setLoading(true);

            if (!data.tipo) {
                alert("Selecione um tipo de registro válido.");
                return;
            }

            const tipo_id = data.tipo.id;
            const tipoNome = data.tipo.nome;

            let nome_principal = data.nome_principal;
            let nome_secundario = data.nome_secundario;

            // Tipos com 2 conjuges/contraentes
            const tiposDuplos = ["casamento", "habilitacao_casamento", "proclamas", "conversao_uniao_estavel", "registro_uniao_estavel", "transcricao_casamento_estrangeiro"];
            // Tipos com falecido
            const tiposFalecido = ["obito", "natimorto", "transcricao_obito_estrangeiro"];
            // Tipos com registrado
            const tiposRegistrado = ["nascimento", "registro_tardio", "registro_indigena", "transcricao_nascimento_estrangeiro", "tutela", "guarda"];
            // Tipos com pessoa principal especifica
            const tiposPessoaEspecifica = {
                emancipacao: "emancipado",
                interdicao: "interditado",
                curatela: "interditado",
                adocao: "adotado",
                reconhecimento_paternidade: "reconhecido",
                registro_socioafetivo: "reconhecido",
            };

            if (tiposDuplos.includes(tipoNome)) {
                const pares = pessoas.filter(p => p.tipo_participacao_nome === "conjuge" || p.tipo_participacao_nome === "contraente");
                if (pares[0]?.nome) nome_principal = pares[0].nome;
                if (pares[1]?.nome) nome_secundario = pares[1].nome;
            } else if (tiposFalecido.includes(tipoNome)) {
                const falecido = pessoas.find(p => p.tipo_participacao_nome === "falecido" || p.tipo_participacao_nome === "registrado");
                if (falecido?.nome) nome_principal = falecido.nome;
            } else if (tiposRegistrado.includes(tipoNome)) {
                const registrado = pessoas.find(p => p.tipo_participacao_nome === "registrado");
                if (registrado?.nome) nome_principal = registrado.nome;
            } else if (tiposPessoaEspecifica[tipoNome]) {
                const pessoa = pessoas.find(p => p.tipo_participacao_nome === tiposPessoaEspecifica[tipoNome]);
                if (pessoa?.nome) nome_principal = pessoa.nome;
            }

            const pessoasPayload = pessoas.map(p => ({
                tipo_participacao_id: p.tipo_participacao_id,
                nome: p.nome,
                cpf: p.cpf || null,
                rg: p.rg || null,
                data_nascimento: p.data_nascimento || null,
            }));

            const payload = {
                tipo_id,
                livro: data.livro,
                folha: data.folha,
                termo: data.termo,
                data_registro: data.data_registro,
                nome_principal,
                nome_secundario,
                observacoes: data.observacoes,
                file_url: data.file_url,
                pessoas: pessoasPayload,
            };

            await registroCivilSv.create(payload);
            onClose();
            window.location.reload();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loadingInit || loading) return <Loading />;

    const tipoNome = data.tipo?.nome || "";

    return (
        <Box sx={{ width: 450, height: "100vh", p: 2, display: "flex", flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize="1.4rem" fontWeight={600} color="#8E24AA">
                    Cadastro - Registro Civil
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Box mt={3} display="flex" flexDirection="column" gap={2.5} overflow="auto" flex={1} pb={2}>
                {/* Tipo de Registro */}
                <Autocomplete
                    options={tipos}
                    getOptionLabel={(opt) => opt.descricao || opt.nome}
                    groupBy={(opt) => opt.categoria?.toUpperCase() || "OUTROS"}
                    onChange={(_, val) => handleTipoChange(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Tipo de Registro" color="secondary" />
                    )}
                />

                {/* Campos de Livro/Folha/Termo */}
                <Box display="flex" gap={1}>
                    <TextField
                        label="Livro"
                        value={data.livro}
                        onChange={(e) => setData({ ...data, livro: e.target.value })}
                        color="secondary"
                        fullWidth
                    />
                    <TextField
                        label="Folha"
                        value={data.folha}
                        onChange={(e) => setData({ ...data, folha: e.target.value })}
                        color="secondary"
                        fullWidth
                    />
                    <TextField
                        label="Termo"
                        value={data.termo}
                        onChange={(e) => setData({ ...data, termo: e.target.value })}
                        color="secondary"
                        fullWidth
                    />
                </Box>

                <TextField
                    type="date"
                    label="Data do Registro"
                    InputLabelProps={{ shrink: true }}
                    value={data.data_registro}
                    onChange={(e) => setData({ ...data, data_registro: e.target.value })}
                    color="secondary"
                />

                {/* Nome principal / secundario - dinamico por tipo */}
                {tipoNome && !["casamento", "habilitacao_casamento", "proclamas", "conversao_uniao_estavel", "registro_uniao_estavel", "transcricao_casamento_estrangeiro"].includes(tipoNome) && (
                    <TextField
                        label="Nome Principal"
                        value={data.nome_principal}
                        onChange={(e) => setData({ ...data, nome_principal: e.target.value })}
                        color="secondary"
                    />
                )}

                {tipoNome && ["casamento", "habilitacao_casamento", "proclamas", "conversao_uniao_estavel", "registro_uniao_estavel", "transcricao_casamento_estrangeiro"].includes(tipoNome) && (
                    <>
                        <TextField
                            label={tipoNome.includes("habilitacao") || tipoNome === "proclamas" ? "Contraente 1" : "Conjuge 1"}
                            value={data.nome_principal}
                            onChange={(e) => setData({ ...data, nome_principal: e.target.value })}
                            color="secondary"
                        />
                        <TextField
                            label={tipoNome.includes("habilitacao") || tipoNome === "proclamas" ? "Contraente 2" : "Conjuge 2"}
                            value={data.nome_secundario}
                            onChange={(e) => setData({ ...data, nome_secundario: e.target.value })}
                            color="secondary"
                        />
                    </>
                )}

                <TextField
                    label="Observacoes"
                    multiline
                    rows={2}
                    value={data.observacoes}
                    onChange={(e) => setData({ ...data, observacoes: e.target.value })}
                    color="secondary"
                />

                {/* Pessoas Vinculadas */}
                {tipoNome && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={600}>Pessoas Vinculadas</Typography>
                            <Button
                                startIcon={<Plus size={16} />}
                                size="small"
                                color="secondary"
                                onClick={addPessoa}
                            >
                                Adicionar
                            </Button>
                        </Box>

                        {pessoas.map((pessoa, index) => (
                            <Paper key={index} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="secondary">
                                        {pessoa.tipo_participacao_nome?.toUpperCase() || `Pessoa ${index + 1}`}
                                    </Typography>
                                    <IconButton size="small" onClick={() => removePessoa(index)}>
                                        <X size={14} />
                                    </IconButton>
                                </Box>

                                <Box display="flex" flexDirection="column" gap={1.5}>
                                    <Autocomplete
                                        value={tiposParticipacao.find(tp => tp.id === pessoa.tipo_participacao_id) || null}
                                        options={tiposParticipacao}
                                        getOptionLabel={(opt) => opt.descricao || opt.nome}
                                        onChange={(_, val) => {
                                            updatePessoa(index, "tipo_participacao_id", val?.id || null);
                                            updatePessoa(index, "tipo_participacao_nome", val?.nome || "");
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Participacao" size="small" color="secondary" />
                                        )}
                                    />
                                    <TextField
                                        label="Nome"
                                        size="small"
                                        value={pessoa.nome}
                                        onChange={(e) => updatePessoa(index, "nome", e.target.value)}
                                        color="secondary"
                                    />
                                    <Box display="flex" gap={1}>
                                        <TextField
                                            label="CPF"
                                            size="small"
                                            value={pessoa.cpf}
                                            onChange={(e) => updatePessoa(index, "cpf", e.target.value)}
                                            color="secondary"
                                            fullWidth
                                        />
                                        <TextField
                                            label="RG"
                                            size="small"
                                            value={pessoa.rg}
                                            onChange={(e) => updatePessoa(index, "rg", e.target.value)}
                                            color="secondary"
                                            fullWidth
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </>
                )}

                {/* Upload */}
                <Divider sx={{ my: 1 }} />
                <FileUploadCard />

                {/* Submit */}
                <Button
                    sx={{
                        backgroundColor: "#8E24AA",
                        color: "#fff",
                        py: 1.5,
                        "&:hover": { backgroundColor: "#7B1FA2" }
                    }}
                    onClick={handleCreate}
                    fullWidth
                >
                    Realizar Cadastro
                </Button>
            </Box>
        </Box>
    );
};
