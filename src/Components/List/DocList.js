import React from "react";
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
    IconButton
} from "@mui/material";
import {
    FileText,
    User,
    Archive,
    MoreVertical,
    CreditCard
} from "lucide-react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Image from "next/image";

/* ---------- Utils ---------- */
const onlyNumbers = (value = "") => value.replace(/\D/g, "");

const applyCpfCnpjMask = (value = "") => {
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

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

/* ---------- Components ---------- */
const InfoRow = ({ icon: Icon, label, value, color = "#237117" }) => (
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

const EmptyState = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            width: "100%"
        }}
    >
        <FileText size={40} color="#237117" />
        <Typography variant="h6" color="text.secondary" mt={2}>
            Nenhum documento encontrado
        </Typography>
    </Box>
);

/* ---------- DocList ---------- */
export const DocList = ({ data = [], handleClick, setPrenotation }) => {
    if (!data.length) return <EmptyState />;

    return (
        <Grid
            container
            spacing={2}
            sx={{
                width: "100%",
                maxHeight: "600px",
                overflowY: "auto",
                px: 1
            }}
        >
            {data.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.prenotation || index}>
                    <Card
                        onClick={(e) => {
                            handleClick(e);
                            setPrenotation(item.prenotation);
                        }}
                        sx={{
                            height: "100%",
                            cursor: "pointer",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 25px rgba(35,113,23,0.15)",
                                borderColor: "#237117"
                            }
                        }}
                    >
                        {/* HEADER */}
                        <Box
                            sx={{
                                background: "linear-gradient(135deg, #237117, #2d8f1f)",
                                px: 2,
                                py: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Box sx={{ display: "flex", gap: 1.5 }}>
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
                                        width={22}
                                        height={22}
                                        alt="PDF"
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: "#fff", fontWeight: 700 }}
                                    >
                                        Prenotação {item.prenotation}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "rgba(255,255,255,0.8)" }}
                                    >
                                        Registro {item.registration}
                                    </Typography>
                                </Box>
                            </Box>

                            <Tooltip title="Mais opções">
                                <IconButton
                                    size="small"
                                    sx={{ color: "#fff" }}
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

                        {/* BODY */}
                        <CardContent>
                            {/* Apresentante */}
                            <Box
                                sx={{
                                    backgroundColor: alpha("#237117", 0.05),
                                    borderRadius: 1.5,
                                    p: 1.5,
                                    mb: 2
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <User size={14} color="#237117" />
                                    <Typography variant="caption" fontWeight={600}>
                                        APRESENTANTE
                                    </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                    {item.presenterName}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <CreditCard size={12} />
                                    <Typography variant="caption" color="text.secondary">
                                        {applyCpfCnpjMask(item.presenterDocument)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Info */}
                            <InfoRow
                                icon={FileText}
                                label="Tipo do Documento"
                                value={item.typeName}
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
                                {item.data_prenotation && (
                                    <Chip
                                        icon={<BookmarkIcon />}
                                        label={`Data: ${formatDate(item.data_prenotation)}`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}

                                <Chip
                                    icon={<Archive size={14} />}
                                    label={`Caixa ${item.box}`}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha("#237117", 0.1),
                                        color: "#237117"
                                    }}
                                />

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
    );
};
