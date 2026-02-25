import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    alpha,
    Divider
} from "@mui/material";
import { FileText, User, Hash, Archive, CreditCard } from "lucide-react";

const EmptyState = () => (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, px: 2 }}>
        <Box sx={{
            width: 80, height: 80, borderRadius: "50%",
            backgroundColor: alpha("#ef5350", 0.1),
            display: "flex", alignItems: "center", justifyContent: "center", mb: 2
        }}>
            <FileText size={40} color="#ef5350" />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum documento na lixeira
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Itens excluidos aparecerao aqui
        </Typography>
    </Box>
);

const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.3 }}>
        <Box sx={{
            width: 24, height: 24, borderRadius: 0.75,
            backgroundColor: alpha("#ef5350", 0.08),
            display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <Icon size={12} color="#ef5350" />
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

export const LixeiraTable = ({ data = [], onClick }) => {
    if (!data || data.length === 0) return <EmptyState />;

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{
                maxHeight: "550px", overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "3px" }
            }}>
                {data.map((row, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={row.id || index}>
                        <Card sx={{
                            height: "100%",
                            transition: "all 0.25s ease",
                            border: "1px solid", borderColor: alpha("#ef5350", 0.2),
                            borderRadius: 2.5, overflow: "hidden",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 25px rgba(239,83,80,0.15)",
                                borderColor: "#ef5350",
                                "& .card-stripe": { opacity: 1 }
                            }
                        }}>
                            {/* Red stripe header */}
                            <Box className="card-stripe" sx={{
                                background: "linear-gradient(135deg, #ef5350 0%, #c62828 100%)",
                                px: 2, py: 1.5,
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                opacity: 0.9, transition: "opacity 0.25s"
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Hash size={14} color="rgba(255,255,255,0.8)" />
                                    <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
                                        Termo: {row.numero}
                                    </Typography>
                                </Box>
                                <Chip label={`Caixa ${row.caixa}`} size="small" sx={{
                                    bgcolor: "rgba(255,255,255,0.2)", color: "#fff",
                                    fontWeight: 600, fontSize: "0.65rem", height: 22
                                }} />
                            </Box>

                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1.5 }}>
                                    <InfoRow icon={User} label="Parte" value={row.parte} />
                                    <InfoRow icon={CreditCard} label="Cartao" value={row.cartao} />
                                    <InfoRow icon={Archive} label="Caixa" value={row.caixa} />
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {/* Action buttons */}
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        onClick={() => onClick(row.id)}
                                        sx={{
                                            textTransform: "none", fontWeight: 600, fontSize: "0.75rem",
                                            color: "#ef5350", borderColor: alpha("#ef5350", 0.4),
                                            borderRadius: 1.5,
                                            "&:hover": { bgcolor: "#ef5350", color: "#fff", borderColor: "#ef5350" }
                                        }}
                                    >
                                        Excluir
                                    </Button>
                                    <Button
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            textTransform: "none", fontWeight: 600, fontSize: "0.75rem",
                                            color: "#0dcaf0", borderColor: alpha("#0dcaf0", 0.4),
                                            borderRadius: 1.5,
                                            "&:hover": { bgcolor: "#0dcaf0", color: "#fff", borderColor: "#0dcaf0" }
                                        }}
                                    >
                                        Restaurar
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
