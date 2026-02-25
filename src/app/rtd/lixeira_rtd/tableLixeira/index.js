import React from "react";
import {
    Grid, Card, CardContent, Typography, Box, Chip,
    alpha, Tooltip, IconButton
} from "@mui/material";
import { FileText, User, MoreVertical, Hash } from "lucide-react";

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

export const DocList = ({ data = [], handleClick, setNotation }) => {
    if (!data || data.length === 0) return <EmptyState />;

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{
                maxHeight: "550px", overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "3px" }
            }}>
                {data.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.notation || index}>
                        <Card sx={{
                            height: "100%", cursor: "pointer",
                            transition: "all 0.25s ease",
                            border: "1px solid", borderColor: alpha("#ef5350", 0.2),
                            borderRadius: 2.5, overflow: "hidden",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: "0 8px 25px rgba(239,83,80,0.15)",
                                borderColor: "#ef5350",
                                "& .card-stripe": { opacity: 1 }
                            }
                        }}
                        onClick={(e) => { handleClick(e); setNotation(item.notation); }}
                        >
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
                                        Prenotacao: {item.notation}
                                    </Typography>
                                </Box>
                                <Tooltip title="Opcoes">
                                    <IconButton size="small" sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}
                                        onClick={(e) => { e.stopPropagation(); handleClick(e); setNotation(item.notation); }}>
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{
                                    backgroundColor: alpha("#ef5350", 0.04),
                                    borderRadius: 1.5, p: 1.5
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                                        <User size={13} color="#ef5350" />
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            APRESENTANTE
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={600} sx={{
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                    }}>
                                        {item.presenterName || "-"}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
                                    <Chip label="Lixeira" size="small" sx={{
                                        bgcolor: alpha("#ef5350", 0.1), color: "#ef5350", fontWeight: 600, fontSize: "0.7rem"
                                    }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
