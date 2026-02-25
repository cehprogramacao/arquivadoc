"use client";

import {
    Box,
    Button,
    Container,
    Drawer,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Gavel, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { CadastroModalRPJ } from '@/Components/Modals/ModalCadastroRPJ';
import RPJService from '@/services/rpj.service';
import { SET_ALERT } from '@/store/actions';
import Loading from '@/Components/loading';
import withAuth from '@/utils/withAuth';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import { DocList } from './components/TableRPJ';
import MenuOptionsFile from '@/Components/MenuPopUp';
import ModalList from './components/ModalPDF';

const options = [
    { label: 'Apresentante' },
    { label: 'Prenotação' },
];

const rpjSv = new RPJService();

/* ============================
   UTILITÁRIOS CPF / CNPJ
============================ */
const onlyNumbers = (value) => value.replace(/\D/g, "");

const applyCpfCnpjMask = (value) => {
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

const PageRPJ = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { permissions } = useAuth();

    const [notation, setNotation] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const [dataFile, setDataFile] = useState([]);
    const [data, setData] = useState([]);

    const [option, setOption] = useState({
        option: "",
        value: ""
    });

    const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false);
    const [openModalCadastroRPJ, setOpenModalCadastroRPJ] = useState(false);
    const [isAdmin, setIsAdmin] = useState("");

    const open = Boolean(anchorEl);

    /* ============================
       MENU
    ============================ */
    const handleOpenMenuOptions = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenuOptions = () => setAnchorEl(null);

    /* ============================
       MODAIS
    ============================ */
    const handleOpenModalListFilePDF = async () => {
        try {
            setOpenModalListFilePDF(true);
            const result = await rpjSv.getRPJByNotation(notation);
            setDataFile(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseModalListFilePDF = () => setOpenModalListFilePDF(false);
    const handleOpenModalCadastroRPJ = () => setOpenModalCadastroRPJ(true);
    const handleCloseModalCadastroRPJ = () => setOpenModalCadastroRPJ(false);

    /* ============================
       BUSCAS
    ============================ */
    const getAllFilesRPJ = async () => {
        try {
            setLoading(true);
            const result = await rpjSv.getAllRPJ();
            setData(Object.values(result));
            dispatch({
                type: SET_ALERT,
                message: `Arquivos carregados com sucesso! Total: ${Object.values(result).length}`,
                severity: "success",
                alertType: "file"
            });
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error?.msg || "Erro ao buscar arquivos!",
                severity: "error",
                alertType: "file"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllFilesByNotation = async (value) => {
        const result = await rpjSv.getRPJByNotation(value);
        setData(Object.values(result));
    };

    const fetchAllFilesByPresenter = async (value) => {
        const result = await rpjSv.getRPJByPresenter(value);
        setData(Object.values(result));
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
                message: "Informe o valor para busca!",
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
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteByNotation = async () => {
        try {
            const result = await rpjSv.deleteRPJByNotation(notation)
            dispatch({
                type: SET_ALERT,
                message: "Documento deletado com sucesso!",
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: "Error ao deletar documento!",
                severity: "success",
                alertType: "file"
            })
            console.error(error)
        }
        finally {
            window.location.reload()
        }
    }

    /* ============================
       INIT
    ============================ */
    useEffect(() => {
        setIsAdmin(localStorage.getItem("isAdmin") || "");
        getAllFilesRPJ();
    }, []);

    if (loading) return <Loading />;

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RPJ']}>
                <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f7fa', pt: 12, pb: 6, px: 2 }}>
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 3,
                                    background: 'linear-gradient(135deg, #237117 0%, #1a5511 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(35,113,23,0.3)'
                                }}>
                                    <Gavel sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} color="#1a1a1a">
                                        RPJ
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {data?.length || 0} {data?.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Search Section */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3, bgcolor: '#fff' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label={
                                            option.option === "Prenotação"
                                                ? "Buscar por Prenotação"
                                                : option.option === "Apresentante"
                                                    ? "Buscar por CPF ou CNPJ"
                                                    : "Selecione o tipo de busca"
                                        }
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
                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        size="small"
                                        options={options}
                                        getOptionLabel={(opt) => opt.label}
                                        onChange={(e, value) =>
                                            setOption({ option: value?.label || "", value: "" })
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Buscar Por" color="success" />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            startIcon={<Search />}
                                            onClick={handleFetchFileByNotationOrPresenter}
                                            sx={{
                                                bgcolor: '#237117',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: '#1a5511' }
                                            }}
                                        >
                                            Buscar
                                        </Button>
                                        {permissions[3]?.create_permission === 1 && (
                                            <ButtonOpenModals onClick={handleOpenModalCadastroRPJ} />
                                        )}
                                        {isAdmin === "1" && <ButtonLixeira href="/rpj/lixeira_rpj" />}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Table */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden', bgcolor: '#fff' }}>
                            <DocList
                                data={data}
                                handleClick={handleOpenMenuOptions}
                                setNotation={(e) => setNotation(e)}
                            />
                        </Paper>
                    </Container>

                    <ModalList
                        data={dataFile}
                        notation={notation}
                        open={openModalListFilePDF}
                        onClose={handleCloseModalListFilePDF}
                        deletePerm={permissions[3]?.delete_permission}
                        editPerm={permissions[3]?.edit}
                        handleDeleteByNotation={handleDeleteByNotation}
                    />

                    <Drawer anchor="left" open={openModalCadastroRPJ} onClose={handleCloseModalCadastroRPJ}>
                        <CadastroModalRPJ onClose={handleCloseModalCadastroRPJ} getData={getAllFilesRPJ} />
                    </Drawer>
                </Box>

                <MenuOptionsFile
                    deletePerm={permissions[3]?.delete_permission}
                    editPerm={permissions[3]?.edit}
                    open={open}
                    anchorEl={anchorEl}
                    type={notation}
                    handleClose={handleCloseMenuOptions}
                    handleOpenModalPDF={handleOpenModalListFilePDF}
                    handleDelete={handleDeleteByNotation}
                />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageRPJ);
