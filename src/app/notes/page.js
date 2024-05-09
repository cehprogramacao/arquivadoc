"use client"
import { Autocomplete, Box, Button, Stack, TextField, Drawer, Typography, styled, useMediaQuery, useTheme, Grid } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect, useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { CadastroNotas } from "@/Components/Modals/ModalCadastroNotas";
import { DocList } from "@/Components/List/DocList";
import { ButtonLixeira } from "@/Components/ButtonLixeira";
import CustomContainer from "@/Components/CustomContainer";
import NoteService from "@/services/notes.service";
import { TableList } from "./components/TableList";
import MenuOptionsFile from "@/Components/MenuPopUp";
import ModalList from "./components/ModalPDF";
import Loading from "@/Components/loading";
import SnackBar from "@/Components/SnackBar";
import User from "@/services/user.service";
import PrivateRoute from "@/utils/LayoutPerm";
import { AuthProvider, useAuth } from "@/context";
import { Buttons } from "@/Components/Button/Button";
import withAuth from "@/utils/withAuth";
import { useDispatch } from "react-redux";
import { showAlert } from "@/store/actions";

const BoxMain = styled('section')({
    maxWidth: '1300px',
    width: '85%',
    display: 'flex',
    flexDirection: "column",
    padding: '5px 10px'
});


const PageNotas = () => {
    const [loading, setLoading] = useState(false)
    const { permissions, updatePermissions } = useAuth()
    const [data, setData] = useState([])
    const [selectOption, setSelectOption] = useState({
        option: null,
        value: ""
    })
    const [isAdmin, setIsAdmin] = useState("")
    const [opt, setOpt] = useState(['Número', 'Apresentante'])
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPDF, setOpenPDF] = useState(false)
    const [dataFileModal, setDataFileModal] = useState([])
    const [number, setNumber] = useState("")
    const openMenu = Boolean(anchorEl);
    const handleOpen = () => setOpen(!open)
    const handleClose = () => setOpen(!open)
    const dispatch = useDispatch()
    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const getData = async () => {
        const { getAllNotes } = new NoteService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const dataNote = await getAllNotes(accessToken)
            dispatch(showAlert(`Total de arquivos: ${Object.values(dataNote.data).length}`, "success", "file"))
            setData(Object.values(dataNote.data))
        } catch (error) {
            dispatch(showAlert(error.message, "error", "file"))
            console.error("Erro ao listar notas", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    const handleOpenModalPDF = async () => {
        const { getNoteByNumber } = new NoteService()
        try {
            setOpenPDF(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const noteFilter = await getNoteByNumber(number, accessToken)
            console.log(noteFilter.data)
            setDataFileModal(noteFilter.data)
        } catch (error) {
            console.error("Error ao lista dados por apresentante", error)
            throw error;
        }
    }
    const handleCloseModalPDF = () => {
        setOpenPDF(false)
    }
    const handleDeleteByNumber = async () => {
        const { deleteNoteByNumber } = new NoteService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await deleteNoteByNumber(number, accessToken)
            dispatch(showAlert(response.data.message, "success", "file"))
            console.log(response.data)
            return response.data
        } catch (error) {
            dispatch(showAlert(error.msg, "error", "file"))
            console.error("Error ao deletar arquivo de notas!", error)
            throw error;
        }
        finally {
            getData()
        }
    }

    const handleSearchByPresenter = async (value, accessToken) => {
        const { getNoteByPresenter } = new NoteService();
        let newData = [];
        try {
            setLoading(true);
            const response = await getNoteByPresenter(value, accessToken);
            const validData = Array.isArray(response.data)
                ? response.data.filter(item => Object.keys(item).length > 0)
                : [];

            setData(validData);

            return validData;
        } catch (error) {
            console.error("Erro ao filtrar por Apresentante", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleSearchByNumber = async (value, accessToken) => {
        const { getNoteByNumber } = new NoteService();
        let newData = []
        try {
            setLoading(true);
            const response = await getNoteByNumber(value, accessToken);
            const validData = Array.isArray(response.data)
                ? response.data.filter(item => Object.keys(item).length > 0)
                : [];

            setData(validData);

            return validData;
        } catch (error) {
            console.error("Erro ao filtrar por número", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearchByPresenterOrNumber = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (selectOption.option && selectOption.value) {
            try {
                if (selectOption.option === "Número") {
                    await handleSearchByNumber(selectOption.value, accessToken);
                } else if (selectOption.option === "Apresentante") {
                    await handleSearchByPresenter(selectOption.value, accessToken);
                }

            } catch (error) {
                console.error("Erro ao filtrar", error);
            }
        } else {
            console.error("Opção ou valor não definidos.");
        }
    }


    useEffect(() => {
        getData()
        const isAdminUser = sessionStorage.getItem('isAdmin')
        setIsAdmin(isAdminUser)
    }, [])

    return loading ? <Loading /> : (
        <AuthProvider >
            <PrivateRoute requiredPermissions={['Notas']} >
                <Box sx={{
                    width: '100%',
                    display: "flex",
                    flexDirection: 'column',
                    placeItems: 'center',
                    py: 12,
                    px: 3
                }}>
                    <CustomContainer >
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: 'flex',
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                        Notas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={5}>
                                    <Grid item xs={12} lg={4} md={6} sm={6}>
                                        <TextField
                                            fullWidth
                                            value={selectOption.value}
                                            // isOptionEqualToValue={(option, value) => option.label === value.label}
                                            onChange={(e) => setSelectOption((prev) => ({ ...prev, value: e.target.value }))}
                                            label="Buscar"
                                            color="success" />
                                    </Grid>
                                    <Grid item xs={12} lg={5} md={6} sm={6}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={opt}
                                            getOptionLabel={(option) => option}
                                            value={selectOption.option}
                                            isOptionEqualToValue={(option, value) => option === value}
                                            onChange={(e, value) => {
                                                setSelectOption((prev) => ({ ...prev, option: value }))
                                            }}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField
                                                    color="success"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        classes: {
                                                            root: 'no-options-input',
                                                        },
                                                    }}
                                                    {...params}
                                                    label="Buscar Por"

                                                    sx={{
                                                        color: "#237117",
                                                        '& input': {
                                                            color: 'success.main',
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3} md={12} sm={12} >
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 4
                                        }}>
                                            <Buttons title={"Buscar"} color={"green"} onClick={handleSearchByPresenterOrNumber} />
                                            {permissions[6]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpen} />}
                                            {isAdmin === "1" && <ButtonLixeira href={"/notes/lixeira_notas"} />}
                                        </Box>

                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <TableList data={data} handleClick={handleClickMenu} setNumber={(e) => setNumber(e)} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <Drawer anchor="left" open={open} onClose={handleClose}>
                        <CadastroNotas onClose={handleClose} getData={getData} dataSnack={(e) => setAlert({ ...e })} />
                    </Drawer>
                    <MenuOptionsFile open={openMenu}
                        handleClose={handleCloseMenu}
                        anchorEl={anchorEl}
                        handleDelete={handleDeleteByNumber}
                        handleOpenModalPDF={handleOpenModalPDF}
                        type={number}
                        deletePerm={permissions[6]?.delete_permission}
                        editPerm={permissions[6]?.edit}
                    />
                    <ModalList
                        data={dataFileModal}
                        number={number}
                        onClose={handleCloseModalPDF}
                        open={openPDF}
                        deletePerm={permissions[6]?.delete_permission}
                        editPerm={permissions[6]?.edit}
                    />
                    <SnackBar />
                </Box>
            </PrivateRoute>
        </AuthProvider>
    );
}

export default withAuth(PageNotas);
