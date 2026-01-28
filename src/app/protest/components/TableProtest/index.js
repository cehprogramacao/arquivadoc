import React from "react"
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
} from "@mui/material"
import {
    FileText,
    User,
    Users,
    Archive,
    MoreVertical,
    CreditCard
} from "lucide-react"
import Image from "next/image"

/* ---------------- Utils ---------------- */
const onlyNumbers = (value = "") => value.replace(/\D/g, "")

const applyCpfCnpjMask = (value = "") => {
    const numbers = onlyNumbers(value)

    if (numbers.length <= 11) {
        return numbers
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14)
    }

    return numbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18)
}

/* ---------------- Components ---------------- */
const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
            sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                backgroundColor: alpha("#237117", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Icon size={14} color="#237117" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={500} noWrap>
                {value || "-"}
            </Typography>
        </Box>
    </Box>
)

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
            Nenhum protesto encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
            Utilize a busca acima para localizar protestos.
        </Typography>
    </Box>
)

/* ---------------- DocList Protesto ---------------- */
export const DocList = ({ data = [], handleClick, setNotation }) => {
    if (!data.length) return <EmptyState />

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
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.notation || index}>
                    <Card
                        onClick={(e) => {
                            handleClick(e)
                            setNotation(item.notation)
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
                                    Protesto - Prenotação: {item.notation}
                                </Typography>
                            </Box>

                            <Tooltip title="Mais opções">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClick(e)
                                        setNotation(item.notation)
                                    }}
                                    sx={{ color: "#fff" }}
                                >
                                    <MoreVertical size={18} />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <CardContent sx={{ p: 2 }}>
                            {/* APRESENTANTE */}
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

                                <Typography fontWeight={600} noWrap>
                                    {item.presenterName || "-"}
                                </Typography>

                                <Box sx={{ display: "flex", gap: .5, alignItems: "center" }}>
                                    <CreditCard size={12} />
                                    <Typography variant="caption">
                                        {applyCpfCnpjMask(item.presenterDocument)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* SACADO / DEVEDOR */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <InfoRow
                                    icon={Users}
                                    label="Sacado"
                                    value={item.draweeName}
                                />
                                <InfoRow
                                    icon={Users}
                                    label="Devedor"
                                    value={item.debtorName}
                                />
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            {/* FOOTER */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1
                                }}
                            >
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
