"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { Stack, Grid } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { CadastroOficio } from '@/Components/Modals/ModalCadastroOficio';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import CustomContainer from '@/Components/CustomContainer';
import Loading from '@/Components/loading';
import { DocCalling } from './components/DocCalling';
import Calling from '@/services/calling.service';
import MenuOptionsFile from '@/Components/MenuPopUp';
import ModalCalling from './components/modalCalling';
import { NumbersRounded } from '@mui/icons-material';
import SnackBar from '@/Components/SnackBar';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import withAuth from '@/utils/withAuth';

const top100Films = [
    { label: 'Número' },
    { label: 'Entidade' },
];



const PageOficio = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { permissions } = useAuth()
    const [loading, setLoading] = useState(false)
    const [callingData, setCallingData] = useState([])
    const [number, setNumber] = useState("")
    const [open, setOpen] = useState(false);
    const [openPartes, setOpenPartes] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [alert, setAlert] = useState({
        open: false,
        type: "",
        text: "",
        severity: ""
    })

    const [openPDF, setOpenPDF] = useState(false)
    const [selectOption, setSelectOption] = useState({
        option: null,
        value: ""
    })
    const [dataFile, setDataFile] = useState([])

    const handleOpenModalPDF = async () => {
        const { getCallingByNumber } = new Calling()
        try {
            setOpenPDF(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getCallingByNumber(number, accessToken)
            console.log(response.data, 'PDFF')
            setDataFile(response.data)
            return response.data
        } catch (error) {
            console.error("Erro ao listar dados!", error)
            throw error;
        }
    }

    const handleCloseModalPDF = async () => {
        setOpenPDF(false)
    }

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(number, 'Numbeeeeeeeeeeeeeee')
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleClosePartes = () => {
        setOpenPartes(false)
    }

    const handleOpenPartes = () => {
        setOpenPartes(true)
    }

    const getCallingData = async () => {
        const { getAllCallings } = new Calling()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getAllCallings(accessToken)
            console.log(data)
            setAlert({ open: true, severity: "success", type: "file", text: `Total de arquivos: ${Object.values(data).length}` })
            setCallingData(Object.values(data))
            return data
        } catch (error) {
            setAlert({ open: true, severity: "error", type: "file", text: error.message })
            console.error("Erro ao pegar oficios!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCallingData()
    }, [])


    const getCallingByNumber = async (value, accessToken) => {
        const { getCallingByNumber } = new Calling()
        let newData = []
        try {
            setLoading(true)
            const { data } = await getCallingByNumber(value, accessToken)
            console.log(data, 'number')
            setAlert({ open: true, severity: "success", type: "file", text: `Arquivo filtrado com sucesso!` })
            newData.push(data)
            setCallingData(newData)
            return data
        } catch (error) {
            setAlert({ open: true, severity: "success", type: "file", text: error.msg })
            console.error("Erro ao filtrar dados!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    const getCallingByEntity = async (value, accessToken) => {
        const { getCallingByEntity } = new Calling()
        try {
            setLoading(true)
            const { data } = await getCallingByEntity(value, accessToken)
            console.log(data[0], 'Entity')
            setAlert({ open: true, severity: "success", type: "file", text: `Arquivo filtrado com sucesso!` })
            setCallingData(Object.values(data))
            return data
        } catch (error) {
            setAlert({ open: true, severity: "success", type: "file", text: error.msg })
            console.error("Erro ao filtrar dados!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const handleFilterByNumberOrEntity = async () => {
        console.log('Iniciando filtragem com valor:', selectOption);

        const accessToken = sessionStorage.getItem("accessToken");
        console.log('AccessToken:', accessToken);

        if (selectOption.option && selectOption.value) {
            console.log('Opção selecionada:', selectOption.option.label);

            try {
                if (selectOption.option.label === "Número") {
                    await getCallingByNumber(selectOption.value, accessToken);
                } else if (selectOption.option.label === "Entidade") {
                    await getCallingByEntity(selectOption.value, accessToken);
                }

            } catch (error) {
                console.error("Erro ao filtrar", error);
                setAlert({ open: true, severity: "error", type: "file", text: error.msg })
            }
        } else {
            console.error("Opção ou valor não definidos.");
            setAlert({ open: true, severity: "error", type: "file", text: 'Opção ou valor não definidos.' })
        }
    }

    const handleDeleteByNumber = async () => {
        const { deleteCallingByNumber } = new Calling()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await deleteCallingByNumber(number, accessToken)
            console.log(response.data)
            window.location.reload()
            return response.data
        } catch (error) {
            console.error("Error ao deletar arquivo rgi!", error)
            throw error;
        }
    }

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Ofícios']}>
                {loading
                    ?
                    <Loading />
                    :
                    <Box
                        sx={{
                            width: '100%',
                            height: '100vh',
                            py: 13,
                            px: 2
                        }}
                    >

                        <CustomContainer>
                            <Grid container spacing={0}>
                                <Grid item xs={12} >
                                    <Box sx={{
                                        display: 'flex',
                                        width: "100%",
                                        justifyContent: "center"
                                    }} >
                                        <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                            Ofício
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={5} md={5} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Buscar"
                                                type={selectOption.option?.label === "Número" ? "number" : "text"}
                                                value={selectOption.value}
                                                onChange={(e) => setSelectOption({ ...selectOption, value: e.target.value })}
                                                sx={{ '& input': { color: 'success.main' } }}
                                                color="success"
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={top100Films}
                                                getOptionLabel={(option) => option.label}
                                                fullWidth
                                                value={selectOption.option}
                                                onChange={(e, value) => setSelectOption({ ...selectOption, option: value })}
                                                renderInput={(params) => (
                                                    <TextField
                                                        color="success"
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
                                        <Grid item xs={12} lg={3} md={3} sm={12}>
                                            <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", gap: 2 }}>
                                                <Buttons color={'green'} title={'Buscar'} onClick={handleFilterByNumberOrEntity} />
                                                {permissions[4]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpen} />}
                                                <ButtonLixeira href={"/calling/lixeira_oficios"} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} >
                                    <DocCalling data={callingData} setNumber={(number) => setNumber(number)} handleClick={handleClickMenu} />
                                </Grid>
                            </Grid>
                        </CustomContainer>
                    </Box>
                }
                <Drawer anchor='left' open={open} onClose={handleClose}>
                    <CadastroOficio getData={getCallingData} onClose={handleClose} onClickPartes={handleOpenPartes} />
                </Drawer>
                <Drawer anchor='right' open={openPartes} onClose={handleClosePartes}>
                    <CadastroPartes onClose={handleClosePartes} />
                </Drawer>
                <MenuOptionsFile deletePerm={permissions[4]?.delete_permission} editPerm={permissions[4]?.edit}
                    open={openMenu} anchorEl={anchorEl} handleClose={handleCloseMenu} handleOpenModalPDF={handleOpenModalPDF} type={number} handleDelete={handleDeleteByNumber} />
                <ModalCalling open={openPDF} data={dataFile} number={number} onClose={handleCloseModalPDF} handleDeleteByNumber={handleDeleteByNumber} />
                <SnackBar data={alert} handleClose={() => setAlert({ ...alert, open: false })} />
            </PrivateRoute>
        </AuthProvider>
    );
};

export default withAuth(PageOficio);
