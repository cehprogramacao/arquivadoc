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
    Hash,
    BookOpen,
    Layers,
    Archive,
    MoreVertical,
    Calendar,
    CreditCard
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

const EmptyState = () => (
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
            Nenhum documento encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
            Utilize a busca acima para encontrar documentos ou cadastre um novo.
        </Typography>
    </Box>
);

export const DocList = ({ data = [], handleClick, setNotation }) => {
    if (!data || data.length === 0) {
        return <EmptyState />;
    }

    const onlyNumbers = (value) => value.replace(/\D/g, "");

    const applyCpfCnpjMask = (value) => {
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

    return (
        <Grid
            container
            spacing={2}
            sx={{
                width: "100%",
                maxHeight: "600px",
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
            {data.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.notation || index}>
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
                            setNotation(item.notation);
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
                                        Prenotação: {item.notation}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "rgba(255,255,255,0.8)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5
                                        }}
                                    >
                                        <Hash size={10} />
                                        Registro: {item.register}
                                    </Typography>
                                </Box>
                            </Box>
                            <Tooltip title="Mais opcoes">
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
                                        setNotation(item.notation);
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
                                        {applyCpfCnpjMask(item.presenterDocument) || "-"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Info Grid */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <InfoRow
                                    icon={FileText}
                                    label="Tipo"
                                    value={item.typeName}
                                />
                                <InfoRow
                                    icon={BookOpen}
                                    label="Livro"
                                    value={item.book}
                                />
                                <InfoRow
                                    icon={Layers}
                                    label="Folhas"
                                    value={`${item.initial_sheet || "-"} a ${item.final_sheet || "-"}`}
                                />
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            {/* Footer Tags */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1
                                }}
                            >
                                <Chip
                                    icon={<Archive size={14} />}
                                    label={`Caixa ${item.box || "-"}`}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha("#237117", 0.1),
                                        color: "#237117",
                                        fontWeight: 500,
                                        "& .MuiChip-icon": {
                                            color: "#237117"
                                        }
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
