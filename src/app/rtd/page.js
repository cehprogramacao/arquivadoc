"use client";

import {
    Box,
    Container,
    Drawer,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    Grid
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Buttons } from "@/Components/Button/Button";
import { ButtonLixeira } from "@/Components/ButtonLixeira";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import Loading from "@/Components/loading";
import MenuOptionsFile from "@/Components/MenuPopUp";
import ModalList from "./components/ModalPDF";
import { DocList } from "./components/TableRTD";
import { CadastroModalRTD } from "@/Components/Modals/ModalCadastroRTD";

import { SET_ALERT } from "@/store/actions";
import withAuth from "@/utils/withAuth";
import { AuthProvider, useAuth } from "@/context";
import PrivateRoute from "@/utils/LayoutPerm";
import RTDService from "@/services/rtd.service";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";

/* ============================
   OPTIONS
============================ */
const options = [
    { label: "Apresentante" },
    { label: "Prenotação" }
];

const rtdSv = new RTDService();

/* ============================
   UTIL CPF / CNPJ
============================ */
const onlyNumbers = (value = "") => value.replace(/\D/g, "");

const applyCpfCnpjMask = (value = "") => {
    const numbers = onlyNumbers(value);

    if (numbers.length <= 11) {
        return numbers
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
            .slice(0, 14);
    }

    return numbers
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 18);
};

const PageRTD = () => {
    const dispatch = useDispatch();
    const { permissions } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [dataFile, setDataFile] = useState([]);
    const [notation, setNotation] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isAdmin, setIsAdmin] = useState("");

    const [option, setOption] = useState({
        option: "",
        value: ""
    });

    const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false);
    const [openModalCadastroRTD, setOpenModalCadastroRTD] = useState(false);

    const open = Boolean(anchorEl);

    /* ============================
       AUTH
    ============================ */
    useEffect(() => {
        if (!isLoggedIn()) router.push("/");
    }, []);

    /* ============================
       LOAD ALL
    ============================ */
    const getAllFilesRTD = async () => {
        try {
            setLoading(true);
            const result = await rtdSv.getAllRTD();
            setData(Object.values(result));
            dispatch({
                type: SET_ALERT,
                message: "Arquivos carregados com sucesso!",
                severity: "success",
                alertType: "file"
            });
        } catch {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao buscar arquivos!",
                severity: "error",
                alertType: "file"
            });
        } finally {
            setLoading(false);
        }
    };

    /* ============================
       FILTERS
    ============================ */
    const fetchAllFilesByNotation = async (notation) => {
        const result = await rtdSv.getRTDByNotation(notation);
        const list = Object.values(result || {});
        setData(list);
    };

    const fetchAllFilesByPresenter = async (presenter) => {
        const result = await rtdSv.getRTDByPresenter(presenter);
        const list = Object.values(result || {});
        setData(list);
    };

    const handleFetchFileByNotationOrPresenter = async () => {
        if (!option.option) {
            dispatch({
                type: SET_ALERT,
                message: "Selecione o tipo de busca!",
                severity: "error",
                alertType: "file"
            });
            return;
        }

        if (!option.value) {
            dispatch({
                type: SET_ALERT,
                message: "Informe o valor da busca!",
                severity: "error",
                alertType: "file"
            });
            return;
        }

        try {
            if (option.option === "Prenotação") {
                await fetchAllFilesByNotation(option.value);
            }

            if (option.option === "Apresentante") {
                await fetchAllFilesByPresenter(onlyNumbers(option.value));
            }
        } catch {
            dispatch({
                type: SET_ALERT,
                message: "Erro ao realizar busca!",
                severity: "error",
                alertType: "file"
            });
        }
    };

     const handleOpenModalListFilePDF = async () => {
        try {
            setOpenModalListFilePDF(true);
            const result = await rtdSv.getRTDByNotation(notation);
            setDataFile(result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllFilesRTD();
        setIsAdmin(localStorage.getItem("isAdmin") || "");
    }, []);

    if (loading) return <Loading />;

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={["RPJ"]}>
                <Box sx={{ width: "100%", height: "100vh", py: 15, px: 0 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography fontSize={40} fontWeight="bold" textAlign="center">
                                    RTD
                                </Typography>
                            </Grid>

                            {/* INPUT */}
                            <Grid item xs={12} lg={5}>
                                <TextField
                                    label={
                                        option.option === "Prenotação"
                                            ? "Buscar por Prenotação"
                                            : option.option === "Apresentante"
                                            ? "Buscar por CPF ou CNPJ"
                                            : "Selecione o tipo de busca"
                                    }
                                    fullWidth
                                    disabled={!option.option}
                                    value={option.value}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (option.option === "Apresentante") {
                                            value = applyCpfCnpjMask(value);
                                        }
                                        setOption({ ...option, value });
                                    }}
                                    color="success"
                                />
                            </Grid>

                            {/* AUTOCOMPLETE */}
                            <Grid item xs={12} lg={4}>
                                <Autocomplete
                                    options={options}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e, value) =>
                                        setOption({
                                            option: value?.label || "",
                                            value: ""
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Buscar Por" color="success" />
                                    )}
                                />
                            </Grid>

                            {/* BUTTONS */}
                            <Grid item xs={12} lg={3}>
                                <Box display="flex" gap={2} justifyContent="center">
                                    <Buttons
                                        color="green"
                                        title="Buscar"
                                        onClick={handleFetchFileByNotationOrPresenter}
                                    />
                                    {permissions[2]?.create_permission === 1 && (
                                        <ButtonOpenModals onClick={() => setOpenModalCadastroRTD(true)} />
                                    )}
                                    {isAdmin === "1" && <ButtonLixeira href="/rpj/lixeira_rpj" />}
                                </Box>
                            </Grid>

                            {/* TABLE */}
                            <Grid item xs={12}>
                                <DocList
                                    data={data}
                                    handleClick={(e) => setAnchorEl(e.currentTarget)}
                                    setNotation={(e) => setNotation(e)}
                                />
                            </Grid>
                        </Grid>
                    </Container>

                    <ModalList
                        data={dataFile}
                        notation={notation}
                        open={openModalListFilePDF}
                        onClose={() => setOpenModalListFilePDF(false)}
                        deletePerm={permissions[2]?.delete_permission}
                        editPerm={permissions[2]?.edit}
                    />

                    <Drawer
                        anchor="left"
                        open={openModalCadastroRTD}
                        onClose={() => setOpenModalCadastroRTD(false)}
                    >
                        <CadastroModalRTD
                            onClose={() => setOpenModalCadastroRTD(false)}
                            getData={getAllFilesRTD}
                        />
                    </Drawer>

                    <MenuOptionsFile
                        deletePerm={permissions[2]?.delete_permission}
                        editPerm={permissions[2]?.edit}
                        open={open}
                        anchorEl={anchorEl}
                        type={notation}
                        handleClose={() => setAnchorEl(null)}
                        handleOpenModalPDF={handleOpenModalListFilePDF}
                    />
                </Box>
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageRTD);
