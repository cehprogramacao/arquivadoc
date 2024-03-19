"use client"
import { Autocomplete, Box, Button, Drawer, Stack, TextField, Typography, styled, useMediaQuery, useTheme, Grid } from "@mui/material";
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

const BoxMain = styled('section')({
    maxWidth: '1300px',
    width: '85%',
    display: 'flex',
    flexDirection: "column",
    padding: '5px 10px'
});


const PageNotas = () => {
    const theme = useTheme()
    const [loading, setLoading] = useState(false)
    const { permissions, updatePermissions } = useAuth()
    const [alert, setAlert] = useState({
        open: false,
        text: "",
        severity: "",
        type: ""
    })
    const [opt, setOpt] = useState(['Nome', 'CPF', 'Ordem', 'Livro', 'Livro Folha'])
    const [optService, setOptService] = useState(['Escrituras', 'Procuração', 'Substabelecimento', 'Divórcio',
        'Ata Notarial', 'Inventário'
    ])

    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPDF, setOpenPDF] = useState(false)
    const [dataFileModal, setDataFileModal] = useState([])
    const [number, setNumber] = useState("")
    const openMenu = Boolean(anchorEl);
    const handleOpen = () => setOpen(!open)
    const handleClose = () => setOpen(!open)

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
            setAlert({ open: true, text: `Total de arquivos: ${Object.values(dataNote.data).length}`, type: "file", severity: "success" })
            console.log(dataNote.data)
            setData(Object.values(dataNote.data))
        } catch (error) {
            setAlert({ open: true, text: error.message, type: "file", severity: "error" })
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
            console.log(noteFilter.data, 'noteeeeeeeeeee 88')
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
            setAlert({ open: true, text: response.data.message, type: "file", severity: "success" })
            console.log(response.data)
            return response.data
        } catch (error) {
            setAlert({ open: true, text: error.message, type: "file", severity: "error" })
            console.error("Error ao deletar arquivo rgi!", error)
            throw error;
        }
        finally {
            getData()
        }
    }



    useEffect(() => {
        getData()

    }, [])

    return (
        <AuthProvider >
            <PrivateRoute requiredPermissions={['Notas']} >
                {loading ? <Loading />
                    :
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
                                        <Grid item xs={12} lg={4} md={4} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="Buscar"
                                                color="success" />
                                        </Grid>
                                        <Grid item xs={12} lg={3} md={4} sm={4}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={opt}
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
                                        <Grid item xs={12} lg={3} md={4} sm={4}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={optService}
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
                                                        label="Buscar Tipo de Serviço"

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
                                        <Grid item xs={12} lg={2} md={12} sm={12} >
                                            <Box sx={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 4
                                            }}>
                                                {permissions[6]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpen} />}
                                                <ButtonLixeira href={"/notas/lixeira_notas"} />
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
                        <ModalList data={dataFileModal} number={number} onClose={handleCloseModalPDF} open={openPDF} />
                        <SnackBar data={alert} handleClose={() => setAlert({ ...alert, open: false })} />
                    </Box>
                }
            </PrivateRoute>
        </AuthProvider>
    );
}

export default PageNotas;
