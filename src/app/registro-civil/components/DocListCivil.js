"use client"
import React, { useState, useMemo } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    alpha,
    Tooltip,
    IconButton,
    TextField,
    InputAdornment,
    Paper
} from "@mui/material";
import {
    FileText,
    User,
    Hash,
    MoreVertical,
    Search,
    X,
    BookOpen,
    Calendar
} from "lucide-react";

/* ---------- Config ---------- */
const TIPO_COLORS = {
    nascimento: { color: "#2196F3", bg: "linear-gradient(135deg, #1976D2, #42A5F5)" },
    casamento: { color: "#E91E63", bg: "linear-gradient(135deg, #C2185B, #F06292)" },
    obito: { color: "#616161", bg: "linear-gradient(135deg, #424242, #9E9E9E)" },
    natimorto: { color: "#78909C", bg: "linear-gradient(135deg, #546E7A, #90A4AE)" },
    habilitacao_casamento: { color: "#FF7043", bg: "linear-gradient(135deg, #E64A19, #FF8A65)" },
    emancipacao: { color: "#26A69A", bg: "linear-gradient(135deg, #00897B, #4DB6AC)" },
    adocao: { color: "#AB47BC", bg: "linear-gradient(135deg, #8E24AA, #CE93D8)" },
    registro_tardio: { color: "#5C6BC0", bg: "linear-gradient(135deg, #3949AB, #7986CB)" },
};

const DEFAULT_TIPO_STYLE = { color: "#247117", bg: "linear-gradient(135deg, #20832d, #20832d)" };

const getTipoConfig = (tipo) => {
    const style = TIPO_COLORS[tipo] || DEFAULT_TIPO_STYLE;
    const label = tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' ') : "Registro";
    return { ...style, label };
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

/* ---------- Components ---------- */
const InfoRow = ({ icon: Icon, label, value, color = "#8E24AA" }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
        <Box
            sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                backgroundColor: alpha(color, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Icon size={14} color={color} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    </Box>
);

const EmptyState = ({ hasFilters }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 2,
            width: "100%"
        }}
    >
        <Box
            sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: alpha("#20832d", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2
            }}
        >
            <FileText size={40} color="#20832d" />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
            {hasFilters ? "Nenhum resultado encontrado" : "Nenhum registro encontrado"}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
            {hasFilters
                ? "Tente ajustar os filtros de busca"
                : "Utilize a busca acima para encontrar registros ou cadastre um novo."}
        </Typography>
    </Box>
);

/* ---------- DocListCivil ---------- */
export const DocListCivil = ({ data = [], handleClick, setSelectedId }) => {
    const [filters, setFilters] = useState({
        nome: "",
        tipo: "",
        livroTermo: ""
    });

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({ ...prev, [field]: event.target.value }));
    };

    const clearFilter = (field) => {
        setFilters(prev => ({ ...prev, [field]: "" }));
    };

    const clearAllFilters = () => {
        setFilters({ nome: "", tipo: "", livroTermo: "" });
    };

    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter(item => {
            const matchNome = !filters.nome ||
                item.nome_principal?.toLowerCase().includes(filters.nome.toLowerCase()) ||
                item.nome_secundario?.toLowerCase().includes(filters.nome.toLowerCase());

            const matchTipo = !filters.tipo ||
                item.tipo?.toLowerCase().includes(filters.tipo.toLowerCase());

            const matchLivroTermo = !filters.livroTermo ||
                item.livro?.toString().includes(filters.livroTermo) ||
                item.termo?.toString().includes(filters.livroTermo);

            return matchNome && matchTipo && matchLivroTermo;
        });
    }, [data, filters]);

    const hasActiveFilters = filters.nome || filters.tipo || filters.livroTermo;

    if (!data || data.length === 0) {
        return <EmptyState hasFilters={false} />;
    }

    return (
        <Box sx={{ width: "100%" }}>
            {/* Filtros */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Search size={20} color="#20832d" />
                        <Typography variant="subtitle1" fontWeight={600}>
                            Filtros de Busca
                        </Typography>
                    </Box>
                    {hasActiveFilters && (
                        <Chip
                            label="Limpar filtros"
                            size="small"
                            onDelete={clearAllFilters}
                            onClick={clearAllFilters}
                            sx={{
                                backgroundColor: alpha("#20832d", 0.1),
                                color: "#20832d",
                                "& .MuiChip-deleteIcon": { color: "#20832d" }
                            }}
                        />
                    )}
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nome"
                            value={filters.nome}
                            onChange={handleFilterChange("nome")}
                            color="secondary"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={18} color="#20832d" />
                                    </InputAdornment>
                                ),
                                endAdornment: filters.nome && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => clearFilter("nome")}>
                                            <X size={16} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Tipo (nascimento/casamento/óbito)"
                            value={filters.tipo}
                            onChange={handleFilterChange("tipo")}
                            color="secondary"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FileText size={18} color="#20832d" />
                                    </InputAdornment>
                                ),
                                endAdornment: filters.tipo && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => clearFilter("tipo")}>
                                            <X size={16} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Livro / Termo"
                            value={filters.livroTermo}
                            onChange={handleFilterChange("livroTermo")}
                            color="secondary"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Hash size={18} color="#20832d" />
                                    </InputAdornment>
                                ),
                                endAdornment: filters.livroTermo && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => clearFilter("livroTermo")}>
                                            <X size={16} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                {hasActiveFilters && (
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {filteredData.length} {filteredData.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Lista de Cards */}
            {filteredData.length === 0 ? (
                <EmptyState hasFilters={hasActiveFilters} />
            ) : (
                <Grid
                    container
                    spacing={2}
                    sx={{
                        width: "100%",
                        maxHeight: "550px",
                        overflowY: "auto",
                        px: 1,
                        pb: 2,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1", borderRadius: "4px" },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#c1c1c1",
                            borderRadius: "4px",
                            "&:hover": { backgroundColor: "#a8a8a8" }
                        }
                    }}
                >
                    {filteredData.map((item, index) => {
                        const tipoConfig = getTipoConfig(item.tipo);

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id || index}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        "&:hover": {
                                            boxShadow: `0 8px 25px ${alpha(tipoConfig.color, 0.2)}`,
                                            transform: "translateY(-4px)",
                                            borderColor: tipoConfig.color,
                                        }
                                    }}
                                    onClick={(event) => {
                                        handleClick(event);
                                        setSelectedId(item.id);
                                    }}
                                >
                                    {/* Card Header */}
                                    <Box
                                        sx={{
                                            background: tipoConfig.bg,
                                            px: 2,
                                            py: 1.5,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    backgroundColor: "rgba(255,255,255,0.2)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <BookOpen size={22} color="#fff" />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}
                                                >
                                                    {item.tipo_descricao || tipoConfig.label}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: "rgba(255,255,255,0.8)" }}
                                                >
                                                    Livro {item.livro} | Termo {item.termo}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Tooltip title="Mais opções">
                                            <IconButton
                                                size="small"
                                                sx={{ color: "rgba(255,255,255,0.8)" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClick(e);
                                                    setSelectedId(item.id);
                                                }}
                                            >
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    {/* Card Body */}
                                    <CardContent sx={{ p: 2 }}>
                                        <Box
                                            sx={{
                                                backgroundColor: alpha(tipoConfig.color, 0.04),
                                                borderRadius: 1.5,
                                                p: 1.5,
                                                mb: 2
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                                <User size={14} color={tipoConfig.color} />
                                                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                                    NOME PRINCIPAL
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                                {item.nome_principal || "-"}
                                            </Typography>
                                            {item.nome_secundario && (
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {item.nome_secundario}
                                                </Typography>
                                            )}
                                        </Box>

                                        <InfoRow
                                            icon={Calendar}
                                            label="Data do Registro"
                                            value={formatDate(item.data_registro)}
                                            color={tipoConfig.color}
                                        />

                                        <Divider sx={{ my: 1.5 }} />

                                        {/* Footer */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 1,
                                                flexWrap: "wrap"
                                            }}
                                        >
                                            <Chip
                                                label={item.tipo_descricao || tipoConfig.label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: tipoConfig.color,
                                                    color: "#fff",
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Chip
                                                label={item.status || "ativo"}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: item.status === "ativo" ? "#4CAF50" : "#F44336",
                                                    color: item.status === "ativo" ? "#4CAF50" : "#F44336",
                                                }}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};
