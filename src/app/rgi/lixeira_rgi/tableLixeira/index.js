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
    Archive,
    MoreVertical,
    CreditCard,
    Search,
    X,
    Trash2
} from "lucide-react";
import Image from "next/image";

const TRASH_COLOR = "#ef5350";
const TRASH_DARK = "#c62828";

const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.3 }}>
        <Box sx={{
            width: 24, height: 24, borderRadius: 0.75,
            backgroundColor: alpha(TRASH_COLOR, 0.08),
            display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <Icon size={12} color={TRASH_COLOR} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.1, fontSize: "0.65rem" }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.8rem"
            }}>
                {value || "-"}
            </Typography>
        </Box>
    </Box>
);

const EmptyState = ({ hasFilters }) => (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, px: 2 }}>
        <Box sx={{
            width: 80, height: 80, borderRadius: "50%",
            backgroundColor: alpha(TRASH_COLOR, 0.1),
            display: "flex", alignItems: "center", justifyContent: "center", mb: 2
        }}>
            <Trash2 size={40} color={TRASH_COLOR} />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
            {hasFilters ? "Nenhum resultado encontrado" : "Lixeira vazia"}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
            {hasFilters ? "Tente ajustar os filtros de busca" : "Itens excluidos aparecerao aqui"}
        </Typography>
    </Box>
);

export const DocList = ({ data = [], handleClick, setPrenotation }) => {
    const [filters, setFilters] = useState({ prenotation: "", name: "", presenter: "" });

    const onlyNumbers = (value) => value?.replace(/\D/g, "") || "";

    const applyCpfCnpjMask = (value) => {
        if (!value) return "-";
        const numbers = onlyNumbers(value);
        if (numbers.length <= 11) {
            return numbers.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2").slice(0, 14);
        }
        return numbers.replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 18);
    };

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({ ...prev, [field]: event.target.value }));
    };

    const clearFilter = (field) => {
        setFilters(prev => ({ ...prev, [field]: "" }));
    };

    const clearAllFilters = () => {
        setFilters({ prenotation: "", name: "", presenter: "" });
    };

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            const matchPrenotation = !filters.prenotation || item.prenotation?.toString().toLowerCase().includes(filters.prenotation.toLowerCase());
            const matchName = !filters.name || item.presenterName?.toLowerCase().includes(filters.name.toLowerCase());
            const matchPresenter = !filters.presenter || onlyNumbers(item.presenter).includes(onlyNumbers(filters.presenter));
            return matchPrenotation && matchName && matchPresenter;
        });
    }, [data, filters]);

    const hasActiveFilters = filters.prenotation || filters.name || filters.presenter;

    if (!data || data.length === 0) return <EmptyState hasFilters={false} />;

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            {/* Filtros */}
            <Paper elevation={0} sx={{ p: 2, mb: 2, border: "1px solid", borderColor: alpha(TRASH_COLOR, 0.2), borderRadius: 2, bgcolor: alpha(TRASH_COLOR, 0.02) }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Search size={20} color={TRASH_COLOR} />
                        <Typography variant="subtitle1" fontWeight={600}>Filtros de Busca</Typography>
                    </Box>
                    {hasActiveFilters && (
                        <Chip label="Limpar filtros" size="small" onDelete={clearAllFilters} onClick={clearAllFilters}
                            sx={{ backgroundColor: alpha(TRASH_COLOR, 0.1), color: TRASH_COLOR, "& .MuiChip-deleteIcon": { color: TRASH_COLOR } }} />
                    )}
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Prenotacao" value={filters.prenotation} onChange={handleFilterChange("prenotation")} color="error"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Hash size={18} color={TRASH_COLOR} /></InputAdornment>,
                                endAdornment: filters.prenotation && <InputAdornment position="end"><IconButton size="small" onClick={() => clearFilter("prenotation")}><X size={16} /></IconButton></InputAdornment>
                            }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Nome do Apresentante" value={filters.name} onChange={handleFilterChange("name")} color="error"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><User size={18} color={TRASH_COLOR} /></InputAdornment>,
                                endAdornment: filters.name && <InputAdornment position="end"><IconButton size="small" onClick={() => clearFilter("name")}><X size={16} /></IconButton></InputAdornment>
                            }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="CPF/CNPJ" value={filters.presenter} onChange={handleFilterChange("presenter")} color="error"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><CreditCard size={18} color={TRASH_COLOR} /></InputAdornment>,
                                endAdornment: filters.presenter && <InputAdornment position="end"><IconButton size="small" onClick={() => clearFilter("presenter")}><X size={16} /></IconButton></InputAdornment>
                            }} />
                    </Grid>
                </Grid>
                {hasActiveFilters && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            {filteredData.length} {filteredData.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Cards */}
            {filteredData.length === 0 ? <EmptyState hasFilters={hasActiveFilters} /> : (
                <Grid container spacing={2} sx={{
                    maxHeight: "550px", overflowY: "auto",
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "3px" }
                }}>
                    {filteredData.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.prenotation || index}>
                            <Card sx={{
                                height: "100%", cursor: "pointer",
                                transition: "all 0.25s ease",
                                border: "1px solid", borderColor: alpha(TRASH_COLOR, 0.2),
                                borderRadius: 2.5, overflow: "hidden",
                                "&:hover": {
                                    transform: "translateY(-3px)",
                                    boxShadow: `0 8px 25px ${alpha(TRASH_COLOR, 0.15)}`,
                                    borderColor: TRASH_COLOR,
                                    "& .card-stripe": { opacity: 1 }
                                }
                            }}
                                onClick={(event) => { handleClick(event); setPrenotation(item.prenotation); }}
                            >
                                {/* Red stripe header */}
                                <Box className="card-stripe" sx={{
                                    background: `linear-gradient(135deg, ${TRASH_COLOR} 0%, ${TRASH_DARK} 100%)`,
                                    px: 2, py: 1.5,
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    opacity: 0.9, transition: "opacity 0.25s"
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Hash size={14} color="rgba(255,255,255,0.8)" />
                                        <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
                                            Prenotacao: {item.prenotation}
                                        </Typography>
                                    </Box>
                                    <Chip label="Lixeira" size="small" sx={{
                                        bgcolor: "rgba(255,255,255,0.2)", color: "#fff",
                                        fontWeight: 600, fontSize: "0.65rem", height: 22
                                    }} />
                                </Box>

                                <CardContent sx={{ p: 2 }}>
                                    {/* Apresentante */}
                                    <Box sx={{ backgroundColor: alpha(TRASH_COLOR, 0.04), borderRadius: 1.5, p: 1.5, mb: 1.5 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                            <User size={14} color={TRASH_COLOR} />
                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>APRESENTANTE</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {item.presenterName || "-"}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                            <CreditCard size={12} color="#666" />
                                            <Typography variant="caption" color="text.secondary">{applyCpfCnpjMask(item.presenter)}</Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    {/* Footer */}
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Chip icon={<Archive size={14} />} label="PDF" size="small"
                                            sx={{ backgroundColor: alpha(TRASH_COLOR, 0.1), color: TRASH_COLOR, fontWeight: 500, "& .MuiChip-icon": { color: TRASH_COLOR } }} />
                                        <Tooltip title="Mais opcoes">
                                            <IconButton size="small" sx={{ color: "#666", "&:hover": { backgroundColor: alpha(TRASH_COLOR, 0.1), color: TRASH_COLOR } }}
                                                onClick={(e) => { e.stopPropagation(); handleClick(e); setPrenotation(item.prenotation); }}>
                                                <MoreVertical size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
