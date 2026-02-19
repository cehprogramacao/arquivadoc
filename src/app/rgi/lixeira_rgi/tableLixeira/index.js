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
    X
} from "lucide-react";
import Image from "next/image";

const InfoRow = ({ icon: Icon, label, value, color = "#237117" }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 0.5
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 1,
                backgroundColor: alpha(color, 0.1)
            }}
        >
            <Icon size={14} color={color} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", lineHeight: 1.2 }}
            >
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
                backgroundColor: alpha("#237117", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2
            }}
        >
            <FileText size={40} color="#237117" />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
            {hasFilters ? "Nenhum resultado encontrado" : "Nenhum documento encontrado"}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
            {hasFilters 
                ? "Tente ajustar os filtros de busca" 
                : "Utilize a busca acima para encontrar documentos ou cadastre um novo."}
        </Typography>
    </Box>
);

export const DocList = ({ data = [], handleClick, setPrenotation }) => {
    const [filters, setFilters] = useState({
        prenotation: "",
        name: "",
        presenter: ""
    });

    const onlyNumbers = (value) => value?.replace(/\D/g, "") || "";

    const applyCpfCnpjMask = (value) => {
        if (!value) return "-";
        const numbers = onlyNumbers(value);

        if (numbers.length <= 11) {
            return numbers
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1-$2")
                .slice(0, 14);
        }

        return numbers
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18);
    };

    const handleFilterChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const clearFilter = (field) => {
        setFilters(prev => ({
            ...prev,
            [field]: ""
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            prenotation: "",
            name: "",
            presenter: ""
        });
    };

    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter(item => {
            const matchPrenotation = !filters.prenotation || 
                item.prenotation?.toString().toLowerCase().includes(filters.prenotation.toLowerCase());
            
            const matchName = !filters.name || 
                item.presenterName?.toLowerCase().includes(filters.name.toLowerCase());
            
            const matchPresenter = !filters.presenter || 
                onlyNumbers(item.presenter).includes(onlyNumbers(filters.presenter));

            return matchPrenotation && matchName && matchPresenter;
        });
    }, [data, filters]);

    const hasActiveFilters = filters.prenotation || filters.name || filters.presenter;

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
                        <Search size={20} color="#237117" />
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
                                backgroundColor: alpha("#237117", 0.1),
                                color: "#237117",
                                "& .MuiChip-deleteIcon": {
                                    color: "#237117"
                                }
                            }}
                        />
                    )}
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Prenotação"
                            value={filters.prenotation}
                            onChange={handleFilterChange("prenotation")}
                            color="success"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Hash size={18} color="#237117" />
                                    </InputAdornment>
                                ),
                                endAdornment: filters.prenotation && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => clearFilter("prenotation")}
                                        >
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
                            label="Nome do Apresentante"
                            value={filters.name}
                            onChange={handleFilterChange("name")}
                            color="success"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={18} color="#237117" />
                                    </InputAdornment>
                                ),
                                endAdornment: filters.name && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => clearFilter("name")}
                                        >
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
                            label="CPF/CNPJ do Apresentante"
                            value={filters.presenter}
                            onChange={handleFilterChange("presenter")}
                            color="success"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCard size={18} color="#237117" />
                                    </InputAdornment>
                                ),
                                endAdornment: filters.presenter && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => clearFilter("presenter")}
                                        >
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
                        "&::-webkit-scrollbar": {
                            width: "8px"
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f1f1f1",
                            borderRadius: "4px"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#c1c1c1",
                            borderRadius: "4px",
                            "&:hover": {
                                backgroundColor: "#a8a8a8"
                            }
                        }
                    }}
                >
                    {filteredData.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.prenotation || index}>
                            <Card
                                sx={{
                                    height: "100%",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    position: "relative",
                                    "&:hover": {
                                        boxShadow: "0 8px 25px rgba(35, 113, 23, 0.15)",
                                        transform: "translateY(-4px)",
                                        borderColor: "#237117",
                                        "& .card-header": {
                                            background: "linear-gradient(135deg, #237117 0%, #2d8f1f 100%)"
                                        }
                                    }
                                }}
                                onClick={(event) => {
                                    handleClick(event);
                                    setPrenotation(item.prenotation);
                                }}
                            >
                                {/* Card Header */}
                                <Box
                                    className="card-header"
                                    sx={{
                                        background: "linear-gradient(135deg, #2d8f1f 0%, #3da82e 100%)",
                                        px: 2,
                                        py: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        transition: "background 0.3s ease"
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
                                            <Image
                                                src="/image/pdf-icon.svg"
                                                width={24}
                                                height={24}
                                                alt="PDF"
                                            />
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                Prenotação: {item.prenotation}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Tooltip title="Mais opções">
                                        <IconButton
                                            size="small"
                                            sx={{
                                                color: "rgba(255,255,255,0.8)",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255,255,255,0.1)"
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(e);
                                                setPrenotation(item.prenotation);
                                            }}
                                        >
                                            <MoreVertical size={18} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <CardContent sx={{ p: 2 }}>
                                    {/* Apresentante Section */}
                                    <Box
                                        sx={{
                                            backgroundColor: alpha("#237117", 0.04),
                                            borderRadius: 1.5,
                                            p: 1.5,
                                            mb: 2
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                            <User size={14} color="#237117" />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                fontWeight={500}
                                            >
                                                APRESENTANTE
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {item.presenterName || "-"}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                            <CreditCard size={12} color="#666" />
                                            <Typography variant="caption" color="text.secondary">
                                                {applyCpfCnpjMask(item.presenter)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Footer Tag */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Chip
                                            label="PDF"
                                            size="small"
                                            sx={{
                                                backgroundColor: "#237117",
                                                color: "#fff",
                                                fontWeight: 600
                                            }}
                                        />
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