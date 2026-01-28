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
    Archive,
    CreditCard,
    MoreVertical
} from "lucide-react";
import Image from "next/image";

/* ---------- Helpers ---------- */
const onlyNumbers = (value = "") => value.replace(/\D/g, "");

const applyCpfMask = (value = "") =>
    onlyNumbers(value)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);

/* ---------- Empty State ---------- */
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
        <Typography variant="h6" color="text.secondary">
            Nenhum documento encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
            Não há termos cadastrados no momento.
        </Typography>
    </Box>
);

/* ---------- DocList ---------- */
export const DocList = ({ data = [], handleClick, setCPF }) => {
    if (!data.length) return <EmptyState />;

    return (
        <Grid
            container
            spacing={2}
            sx={{
                width: "100%",
                maxHeight: "600px",
                overflowY: "auto",
                px: 1,
                pb: 2
            }}
        >
            {data.map((item, index) => {
                const hasFile = Boolean(item.file_url);

                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card
                            sx={{
                                height: "100%",
                                cursor: hasFile ? "pointer" : "not-allowed",
                                opacity: hasFile ? 1 : 0.6,
                                transition: "all 0.3s ease",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                overflow: "hidden",
                                "&:hover": hasFile
                                    ? {
                                          boxShadow:
                                              "0 8px 25px rgba(35, 113, 23, 0.15)",
                                          transform: "translateY(-4px)",
                                          borderColor: "#237117"
                                      }
                                    : {}
                            }}
                            onClick={(e) => {
                                if (!hasFile) return;
                                handleClick(e);
                                setCPF(item.cpf);
                            }}
                        >
                            {/* HEADER */}
                            <Box
                                sx={{
                                    background:
                                        "linear-gradient(135deg, #237117 0%, #2d8f1f 100%)",
                                    px: 2,
                                    py: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
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
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: "#fff", fontWeight: 700 }}
                                    >
                                        Termos LGPD
                                    </Typography>
                                </Box>

                                <Tooltip title="Selecionar documento">
                                    <IconButton
                                        size="small"
                                        sx={{
                                            color: "rgba(255,255,255,0.8)"
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!hasFile) return;
                                            handleClick(e);
                                            setCPF(item.cpf);
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* CONTENT */}
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Archive size={14} color="#237117" />
                                        <Typography variant="body2" fontWeight={600}>
                                            Caixa: {item.box || "-"}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CreditCard size={14} color="#237117" />
                                        <Typography variant="body2">
                                            {applyCpfMask(item.cpf) || "-"}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Chip
                                        label={hasFile ? "PDF disponível" : "Sem PDF"}
                                        size="small"
                                        sx={{
                                            backgroundColor: hasFile
                                                ? alpha("#237117", 0.15)
                                                : alpha("#999", 0.15),
                                            color: hasFile ? "#237117" : "#666",
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};
