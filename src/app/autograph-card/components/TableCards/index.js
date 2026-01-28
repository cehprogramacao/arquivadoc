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
    CreditCard,
    Archive,
    MoreVertical,
    Calendar,
    Files
} from "lucide-react";
import Image from "next/image";

/* ---------- Helpers ---------- */

const onlyNumbers = (value = "") => String(value).replace(/\D/g, "");

const applyCpfMask = (value = "") => {
    const numbers = onlyNumbers(value);
    return numbers
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.4 }}>
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
            <Typography
                variant="body2"
                fontWeight={500}
                noWrap
            >
                {value || "-"}
            </Typography>
        </Box>
    </Box>
);

/* ---------- Empty State ---------- */

const EmptyState = () => (
    <Box
        sx={{
            width: "100%",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5
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
                justifyContent: "center"
            }}
        >
            <FileText size={40} color="#237117" />
        </Box>
        <Typography variant="h6" color="text.secondary">
            Nenhum Cartão de Autógrafo encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Utilize a busca acima para localizar registros.
        </Typography>
    </Box>
);

/* ---------- DocList ---------- */

export const DocList = ({ data = [], handleClick, setCPF }) => {
    if (!data || data.length === 0) {
        return <EmptyState />;
    }

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
            {data && data.map((item, index) => {
                const filesCount = [
                    item.card_file_url,
                    item.doc_file_url,
                    item.cpf_file_url,
                    item.comp_resid_file_url
                ].length;

                console.log(filesCount, 999)

                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card
                            onClick={(event) => {
                                handleClick(event);
                                setCPF(item.cpf);
                            }}
                            sx={{
                                height: "100%",
                                cursor: "pointer",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                transition: "all 0.3s ease",
                                overflow: "hidden",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 10px 30px rgba(35,113,23,0.18)",
                                    borderColor: "#237117",
                                    "& .card-header": {
                                        background:
                                            "linear-gradient(135deg, #237117 0%, #2d8f1f 100%)"
                                    }
                                }
                            }}
                        >
                            {/* Header */}
                            <Box
                                className="card-header"
                                sx={{
                                    background:
                                        "linear-gradient(135deg, #2d8f1f 0%, #3da82e 100%)",
                                    px: 2,
                                    py: 1.5,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
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
                                            width={24}
                                            height={24}
                                            alt="PDF"
                                        />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ color: "#fff", fontWeight: 700 }}
                                        >
                                            Cartão de Autógrafo
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ color: "rgba(255,255,255,0.85)" }}
                                        >
                                            CPF: {applyCpfMask(item.cpf)}
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
                                            setCPF(item.cpf);
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* Content */}
                            <CardContent sx={{ p: 2 }}>
                                <Box
                                    sx={{
                                        backgroundColor: alpha("#237117", 0.04),
                                        borderRadius: 1.5,
                                        p: 1.5,
                                        mb: 2
                                    }}
                                >
                                    <InfoRow
                                        icon={CreditCard}
                                        label="CPF"
                                        value={applyCpfMask(item.cpf)}
                                    />
                                    <InfoRow
                                        icon={Archive}
                                        label="Caixa"
                                        value={item.box}
                                    />
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <Chip
                                        icon={<Files size={14} />}
                                        label={`${filesCount} arquivos`}
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
                );
            })}
        </Grid>
    );
};
