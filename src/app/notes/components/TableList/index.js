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
    BookOpen,
    Layers,
    Archive,
    MoreVertical,
    CreditCard,
    Tag,
    Users
} from "lucide-react";
import Image from "next/image";

/* =========================
   COMPONENTES AUXILIARES
========================= */

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
                {value ?? "-"}
            </Typography>
        </Box>
    </Box>
);

const EmptyState = () => (
    <Box
        sx={{
            py: 8,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}
    >
        <FileText size={48} color="#237117" />
        <Typography mt={2} color="text.secondary">
            Nenhum documento encontrado
        </Typography>
    </Box>
);

/* =========================
   LISTA PRINCIPAL
========================= */

export const TableList = ({ data = [], handleClick, setNumber }) => {
    if (!data || data.length === 0) {
        return <EmptyState />;
    }

    const onlyNumbers = (value = "") => value.replace(/\D/g, "");

    const applyCpfMask = (value = "") => {
        const n = onlyNumbers(value);
        return n
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14);
    };

    return (
        <Grid container spacing={2} sx={{ px: 1, pb: 2 }}>
            {data.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.order_num || index}>
                    <Card
                        sx={{
                            height: "100%",
                            cursor: "pointer",
                            transition: "0.3s",
                            borderRadius: 2,
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 25px rgba(35,113,23,0.15)"
                            }
                        }}
                        onClick={(e) => {
                            handleClick(e);
                            setNumber(item.order_num);
                        }}
                    >
                        {/* HEADER */}
                        <Box
                            sx={{
                                px: 2,
                                py: 1.5,
                                background: "linear-gradient(135deg,#237117,#2e8b57)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                <Image
                                    src="/image/pdf-icon.svg"
                                    width={28}
                                    height={28}
                                    alt="PDF"
                                />
                                <Box>
                                    <Typography color="#fff" fontWeight={700}>
                                        Ordem {item.order_num}
                                    </Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,.8)">
                                        {item.typeName}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                size="small"
                                sx={{ color: "#fff" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick(e);
                                    setNumber(item.order_num);
                                }}
                            >
                                <MoreVertical size={18} />
                            </IconButton>
                        </Box>

                        {/* CONTEÚDO */}
                        <CardContent>
                            {/* APRESENTANTE */}
                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    backgroundColor: alpha("#237117", 0.05)
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    APRESENTANTE
                                </Typography>
                                <Typography fontWeight={600}>
                                    {item.presenterName}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <CreditCard size={12} />
                                    <Typography variant="caption">
                                        {applyCpfMask(item.presenterDocument)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* INFORMAÇÕES */}
                            <InfoRow icon={Tag} label="Tag" value={item.tagName} />
                            <InfoRow icon={BookOpen} label="Livro" value={item.book} />
                            <InfoRow
                                icon={Layers}
                                label="Folhas"
                                value={`${item.initial_sheet} a ${item.final_sheet}`}
                            />

                            <Divider sx={{ my: 1.5 }} />

                            {/* FOOTER */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    flexWrap: "wrap"
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
                                    icon={<Users size={14} />}
                                    label={`Outorgantes: ${item.grantors?.length || 0}`}
                                    size="small"
                                />
                                <Chip
                                    icon={<Users size={14} />}
                                    label={`Outorgados: ${item.granteds?.length || 0}`}
                                    size="small"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
