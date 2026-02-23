"use client";

import {
    Autocomplete,
    Box,
    Container,
    Drawer,
    TextField,
    Typography,
    Paper,
    Button,
    Stack
} from "@mui/material";
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

import { useEffect, useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { CadastroNotas } from "@/Components/Modals/ModalCadastroNotas";
import NoteService from "@/services/notes.service";
import { TableList } from "./components/TableList";
import MenuOptionsFile from "@/Components/MenuPopUp";
import ModalList from "./components/ModalPDF";
import Loading from "@/Components/loading";
import { SET_ALERT } from "@/store/actions";
import { useDispatch } from "react-redux";
import { isLoggedIn } from "@/utils/auth";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/utils/LayoutPerm";
import { AuthProvider, useAuth } from "@/context";
import { ButtonLixeira } from "@/Components/ButtonLixeira";
import { NoteAlt, Search } from "@mui/icons-material";

const noteSv = new NoteService();

const filterOptions = [
    { label: "Número do Pedido", value: "number" },
    { label: "Apresentante (CPF/CNPJ)", value: "presenter" }
];

const PageNotas = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const { permissions } = useAuth();

    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // FILTROS
    const [presenter, setPresenter] = useState("");
    const [number, setNumber] = useState("");

    const [filterType, setFilterType] = useState({
        value: 'number'
    });

    // LISTAGEM
    const [data, setData] = useState([]);

    // MODAL PDF
    const [openPDF, setOpenPDF] = useState(false);
    const [dataFileModal, setDataFileModal] = useState([]);

    // MENU
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // CADASTRO
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // REDIRECIONAR DESLOGADO
    useEffect(() => {
        if (!isLoggedIn()) router.push("/");
    }, []);

    // MASCARA CPF/CNPJ
    const maskCpfCnpj = (value) => {
        value = value.replace(/\D/g, "");

        if (value.length <= 11) {
            return value
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }

        return value
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    };

    // LISTAR TODAS
    const dataSnack = (open,
        text,
        severity,
        type
    ) => {

        dispatch({ type: SET_ALERT, message: text, severity, alertType: type })
    }

    const getData = async () => {
        try {
            setLoading(true);
            const res = await noteSv.getAllNotes();
            setData(Object.values(res));
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao listar notas",
                severity: "error",
                alertType: "file"
            });
        } finally {
            setLoading(false);
        }
    };

    // FILTRO
    const handleFilter = async () => {
        try {
            setSearching(true);

            if (!filterType) {
                dispatch({
                    type: SET_ALERT,
                    message: "Selecione um tipo de busca",
                    severity: "warning",
                    alertType: "file"
                });
                return;
            }

            if (filterType.value === "number") {
                const res = await noteSv.getNoteByNumber(number);
                setData(Array.isArray(res) ? res : [res]);
                return;
            }

            if (filterType.value === "presenter") {
                const clean = presenter.replace(/\D/g, "");
                const res = await noteSv.getNoteByPresenter(clean);
                setData(Object.values(res));
                return;
            }

        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Nenhum registro encontrado",
                severity: "warning",
                alertType: "file"
            });
            setData([]);
        } finally {
            setSearching(false);
        }
    };

    // MODAL PDF
    const handleOpenModalPDF = async () => {
        try {
            setOpenPDF(true);
            const res = await noteSv.getNoteByNumber(number);
            setDataFileModal(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseModalPDF = () => setOpenPDF(false);

    // DELETAR
    const handleDeleteByNumber = async () => {
        await noteSv.deleteNoteByNumber(number);
        getData();
    };

    // INIT
    useEffect(() => {
        getData();
    }, []);

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Notas']}>
                {loading ? (
                    <Loading />
                ) : (
                    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f5f7fa", pt: 12, pb: 6, px: 2 }}>
                        <Container maxWidth="lg">
                            {/* Header */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        background: "linear-gradient(135deg, #237117 0%, #2e8b20 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <NoteAlt sx={{ color: "#fff", fontSize: 30 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        Notas
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {data.length} {data.length === 1 ? "registro encontrado" : "registros encontrados"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Search Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 3,
                                    p: 3,
                                    mb: 3
                                }}
                            >
                                <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems={{ lg: "center" }}>
                                    <Autocomplete
                                        options={filterOptions}
                                        value={filterType}
                                        isOptionEqualToValue={(option, value) =>
                                            option?.value === value?.value
                                        }
                                        getOptionLabel={(option) => option?.label || ""}
                                        onChange={(_, value) => {
                                            setFilterType(value);
                                            setNumber("");
                                        }}
                                        size="small"
                                        sx={{ minWidth: 250 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Filtrar por"
                                                color="success"
                                            />
                                        )}
                                    />

                                    {filterType?.value === "number" && (
                                        <TextField
                                            label="Número do Pedido"
                                            fullWidth
                                            size="small"
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                            color="success"
                                        />
                                    )}

                                    {filterType?.value === "presenter" && (
                                        <TextField
                                            label="CPF/CNPJ do Apresentante"
                                            fullWidth
                                            size="small"
                                            value={presenter}
                                            onChange={(e) => setPresenter(maskCpfCnpj(e.target.value))}
                                            inputProps={{ maxLength: 18 }}
                                            color="success"
                                        />
                                    )}

                                    <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Search />}
                                            onClick={handleFilter}
                                            disabled={searching}
                                            sx={{
                                                backgroundColor: "#237117",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                "&:hover": { backgroundColor: "#1b5c12" }
                                            }}
                                        >
                                            {searching ? "Buscando..." : "Buscar"}
                                        </Button>

                                        {permissions[6]?.create_permission === 1 && (
                                            <ButtonOpenModals onClick={handleOpen} />
                                        )}

                                        <ButtonLixeira href="/notas/lixeira_notas" />
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Table Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 3,
                                    overflow: "hidden"
                                }}
                            >
                                <TableList
                                    data={data}
                                    handleClick={handleClickMenu}
                                    setNumber={(n) => setNumber(n)}
                                />
                            </Paper>
                        </Container>

                        {/* DRAWER */}
                        <Drawer anchor="left" open={open} onClose={handleClose}>
                            <CadastroNotas onClose={handleClose} getData={getData} dataSnack={dataSnack}/>
                        </Drawer>

                        {/* MENU */}
                        <MenuOptionsFile
                            open={openMenu}
                            anchorEl={anchorEl}
                            handleClose={handleCloseMenu}
                            handleDelete={handleDeleteByNumber}
                            handleOpenModalPDF={handleOpenModalPDF}
                            type={number}
                            deletePerm={permissions[6]?.delete_permission}
                            editPerm={permissions[6]?.edit}
                        />

                        {/* MODAL PDF */}
                        <ModalList
                            open={openPDF}
                            onClose={handleCloseModalPDF}
                            data={dataFileModal}
                            number={number}
                            deletePerm={permissions[6]?.delete_permission}
                            editPerm={permissions[6]?.edit}
                        />
                    </Box>
                )}
            </PrivateRoute>
        </AuthProvider>
    );
};

export default PageNotas;
