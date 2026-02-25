import React from 'react';
import {
    Box,
    Typography,
    alpha,
    IconButton,
    Tooltip,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider
} from '@mui/material';
import { FileText, MoreVertical, User, CreditCard, Trash2, Hash } from 'lucide-react';

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

const EmptyState = () => (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, px: 2 }}>
        <Box sx={{
            width: 80, height: 80, borderRadius: "50%",
            backgroundColor: alpha(TRASH_COLOR, 0.1),
            display: "flex", alignItems: "center", justifyContent: "center", mb: 2
        }}>
            <Trash2 size={40} color={TRASH_COLOR} />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
            Lixeira vazia
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Nenhum cartao de autografo na lixeira
        </Typography>
    </Box>
);

export const DocList = ({ data = [], handleClick, setPresenter }) => {
    if (!data || data.length === 0) return <EmptyState />;

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{
                maxHeight: "550px", overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "3px" }
            }}>
                {data.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.cpfcnpj || index}>
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
                            onClick={(event) => { handleClick(event); setPresenter(item.cpfcnpj); }}
                        >
                            {/* Red stripe header */}
                            <Box className="card-stripe" sx={{
                                background: `linear-gradient(135deg, ${TRASH_COLOR} 0%, ${TRASH_DARK} 100%)`,
                                px: 2, py: 1.5,
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                opacity: 0.9, transition: "opacity 0.25s"
                            }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <FileText size={14} color="rgba(255,255,255,0.8)" />
                                    <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700 }}>
                                        Cartao de Autografo
                                    </Typography>
                                </Box>
                                <Chip label="Lixeira" size="small" sx={{
                                    bgcolor: "rgba(255,255,255,0.2)", color: "#fff",
                                    fontWeight: 600, fontSize: "0.65rem", height: 22
                                }} />
                            </Box>

                            <CardContent sx={{ p: 2 }}>
                                {/* Info */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1.5 }}>
                                    <InfoRow icon={CreditCard} label="Documento" value={item.presenterDocument} />
                                    <InfoRow icon={User} label="Nome" value={item.presenterName} />
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {/* Footer */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Chip icon={<Trash2 size={14} />} label="Excluido" size="small"
                                        sx={{ backgroundColor: alpha(TRASH_COLOR, 0.1), color: TRASH_COLOR, fontWeight: 500, "& .MuiChip-icon": { color: TRASH_COLOR } }} />
                                    <Tooltip title="Opcoes">
                                        <IconButton size="small" sx={{ color: "#666", "&:hover": { backgroundColor: alpha(TRASH_COLOR, 0.1), color: TRASH_COLOR } }}
                                            onClick={(e) => { e.stopPropagation(); handleClick(e); setPresenter(item.cpfcnpj); }}>
                                            <MoreVertical size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
