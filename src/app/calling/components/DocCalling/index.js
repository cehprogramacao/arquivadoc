import React from "react"
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    alpha
} from "@mui/material"
import {
    FileText,
    Archive,
    Building2,
    Calendar,
    MoreVertical
} from "lucide-react"
import Image from "next/image"

/* ---------------- Utils ---------------- */
const formatDate = (date) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("pt-BR")
}

/* ---------------- Empty State ---------------- */
const EmptyState = () => (
    <Box
        sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6
        }}
    >
        <FileText size={48} color="#237117" />
        <Typography variant="h6" color="text.secondary" mt={2}>
            Nenhum chamado encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Utilize os filtros ou realize uma nova busca
        </Typography>
    </Box>
)

/* ---------------- DocCalling ---------------- */
export const DocCalling = ({ data = [], setNumber, handleClick }) => {
    if (!data.length) return <EmptyState />

    return (
        <Grid
            container
            spacing={2}
            sx={{
                width: "100%",
                maxHeight: "450px",
                overflowY: "auto",
                px: 1
            }}
        >
            {data.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.number || index}>
                    <Card
                        onClick={(e) => {
                            handleClick(e)
                            setNumber(item.number)
                        }}
                        sx={{
                            height: "100%",
                            cursor: "pointer",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all .3s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 25px rgba(35,113,23,.15)",
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
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
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

                                <Typography color="#fff" fontWeight={700}>
                                    Chamado #{item.number}
                                </Typography>
                            </Box>

                            <Tooltip title="Mais opções">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClick(e)
                                        setNumber(item.number)
                                    }}
                                    sx={{ color: "#fff" }}
                                >
                                    <MoreVertical size={18} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* CONTENT */}
                        <CardContent sx={{ p: 2 }}>
                            {/* ENTIDADE */}
                            <Box
                                sx={{
                                    backgroundColor: alpha("#237117", 0.06),
                                    borderRadius: 1.5,
                                    p: 1.5,
                                    mb: 2
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Building2 size={14} color="#237117" />
                                    <Typography variant="caption" fontWeight={600}>
                                        ENTIDADE
                                    </Typography>
                                </Box>

                                <Typography fontWeight={600} noWrap>
                                    {item.entityName || "-"}
                                </Typography>
                            </Box>

                            {/* INFO */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Archive size={14} />
                                    <Typography variant="body2">
                                        Caixa: <strong>{item.box || "-"}</strong>
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Calendar size={14} />
                                    <Typography variant="body2">
                                        Data: <strong>{formatDate(item.date)}</strong>
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            {/* FOOTER */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Chip
                                    label={item.situation || "Ativo"}
                                    size="small"
                                    sx={{
                                        backgroundColor: "#237117",
                                        color: "#fff"
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}
