"use client";

import {
    Autocomplete,
    Box,
    Container,
    Drawer,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

import { useEffect, useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { CadastroNotas } from "@/Components/Modals/ModalCadastroNotas";
import CustomContainer from "@/Components/CustomContainer";
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
import { Buttons } from "@/Components/Button/Button";

const noteSv = new NoteService();

// 🔹 ADICIONADO
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

    // 🔹 ADICIONADO
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

    // MÁSCARA CPF/CNPJ
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

    // 🔍 FILTRO (AGORA RESPEITA O AUTOCOMPLETE)
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
                    <Box sx={{ width: '100%', py: 14 }}>
                        <Container maxWidth="lg">
                            <Grid container spacing={3}>

                                <Grid item xs={12}>
                                    <Typography fontSize={38} fontWeight="bold" textAlign='center'>
                                        Notas
                                    </Typography>
                                </Grid>

                                {/* 🔹 AUTOCOMPLETE */}
                                <Grid item xs={12} lg={4}>
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
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Filtrar por"
                                                color="success"
                                            />
                                        )}
                                    />

                                </Grid>

                                {/* INPUTS CONDICIONAIS */}
                                {filterType?.value === "number" && (
                                    <Grid item xs={12} lg={4}>
                                        <TextField
                                            label="Número do Pedido"
                                            fullWidth
                                            value={number}
                                            onChange={(e) => setNumber(e.target.value)}
                                            color="success"
                                        />
                                    </Grid>
                                )}

                                {filterType?.value === "presenter" && (
                                    <Grid item xs={12} lg={4}>
                                        <TextField
                                            label="CPF/CNPJ do Apresentante"
                                            fullWidth
                                            value={presenter}
                                            onChange={(e) => setPresenter(maskCpfCnpj(e.target.value))}
                                            inputProps={{ maxLength: 18 }}
                                            color="success"
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12} lg={4} display="flex" gap={2}>
                                    <Buttons
                                        color="green"
                                        title={searching ? "Buscando..." : "Buscar"}
                                        onClick={handleFilter}
                                        disabled={searching}
                                    />

                                    {permissions[6]?.create_permission === 1 && (
                                        <ButtonOpenModals onClick={handleOpen} />
                                    )}

                                    <ButtonLixeira href="/notas/lixeira_notas" />
                                </Grid>

                                {/* LISTA */}
                                <Grid item xs={12}>
                                    <TableList
                                        data={data}
                                        handleClick={handleClickMenu}
                                        setNumber={(n) => setNumber(n)}
                                    />
                                </Grid>

                            </Grid>
                        </Container >

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
