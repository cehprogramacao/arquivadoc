"use client"
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
import { Description, Search } from '@mui/icons-material';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { DocList } from '@/Components/List/DocList';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import ModalList from '@/Components/Modals/ModalList';
import { useEffect, useState } from 'react';
import { CadastroModalRGI } from '@/Components/Modals/ModalCadastroRGI';
import RGI from '@/services/rgi.service';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/Components/loading';
import MenuOptionsFile from '@/Components/MenuPopUp';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import withAuth from '@/utils/withAuth';
import { SET_ALERT } from '@/store/actions';

const optionsFilter = [
    { label: 'Prenotação' },
    { label: 'Apresentante' },
];

const rgiSv = new RGI();

/* ======================
   MÁSCARA CPF / CNPJ
====================== */
const maskCpfCnpj = (value) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 11) {
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

const PageRGI = () => {
    const dispatch = useDispatch()
    const payload = useSelector(state => state.login)

    const [value, setValue] = useState({
        option: null,
        value: ""
    })

    const [isAdmin, setIsAdmin] = useState("")
    const [loading, setLoading] = useState(false)
    const [openModalRGI, setOpenModalRGI] = useState(false)
    const [data, setData] = useState([])
    const [openFilterModalPDF, setOpenFilterModalPDF] = useState(false)
    const [prenotation, setPrenotation] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { permissions } = useAuth()
    const [openPDF, setOpenPDF] = useState(false)
    const [dataFile, setDataFile] = useState([])

    /* ======================
       FUNÇÕES ORIGINAIS
    ====================== */

    const handleOpenModalPDF = async () => {
        try {
            setOpenPDF(true)
            const response = await rgiSv.getByPrenotation(prenotation)
            setDataFile(response)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleCloseModalPDF = async () => setOpenPDF(false)

    const handleClickMenu = (event) => setAnchorEl(event.currentTarget)
    const handleCloseMenu = () => setAnchorEl(null)

    const handleOpenModalRGI = () => setOpenModalRGI(true)
    const handleCloseModalRGI = () => setOpenModalRGI(false)

    const handleDeleteByPrenotation = async () => {
        try {
            await rgiSv.deleteByPrenotation(prenotation)
            dispatch({
                type: SET_ALERT,
                message: "Prenotação deletada com sucesso!",
                severity: "success",
                alertType: "file"
            })
        } catch (error) {
            dispatch({
                type: SET_ALERT,
                message: error.message,
                severity: "error",
                alertType: "file"
            })
        } finally {
            getDataRGI()
        }
    }

    const handlePresenterFilter = async (val) => {
        try {
            setLoading(true)
            const clean = val.replace(/\D/g, '')
            const response = await rgiSv.getByPresenter(clean)
            setData(Object.values(response))
        } finally {
            setLoading(false)
        }
    }

    const handlePrenotationFilter = async (val) => {
        try {
            setLoading(true)
            const response = await rgiSv.getByPrenotation(Number(val))
            setData(response)
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = async () => {
        if (!value.option || !value.value) {
            dispatch({
                type: SET_ALERT,
                message: "Selecione o tipo de busca.",
                severity: "warning",
                alertType: "file"
            })
            return
        }

        if (value.option.label === "Prenotação") {
            await handlePrenotationFilter(value.value)
        }

        if (value.option.label === "Apresentante") {
            await handlePresenterFilter(value.value)
        }
    }

    const getDataRGI = async () => {
        try {
            setLoading(true)
            const response = await rgiSv.getData()
            setData(Object.values(response))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDataRGI()
        setIsAdmin(localStorage.getItem('isAdmin'))
    }, [])

    if (loading) return <Loading />

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['RGI']}>
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
                                    <Description sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} color="#1a1a1a">
                                        RGI
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
                                        label="Buscar"
                                        color="success"
                                        value={value.value}
                                        onChange={(e) => {
                                            if (value.option?.label === "Prenotação") {
                                                setValue({
                                                    ...value,
                                                    value: e.target.value.replace(/\D/g, '')
                                                })
                                            } else if (value.option?.label === "Apresentante") {
                                                setValue({
                                                    ...value,
                                                    value: maskCpfCnpj(e.target.value)
                                                })
                                            } else {
                                                setValue({ ...value, value: e.target.value })
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        size="small"
                                        options={optionsFilter}
                                        getOptionLabel={(o) => o.label}
                                        onChange={(e, opt) =>
                                            setValue({ option: opt, value: "" })
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
                                            onClick={handleFilter}
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
                                        {permissions[1]?.create_permission === 1 &&
                                            <ButtonOpenModals onClick={handleOpenModalRGI} />}
                                        {isAdmin === "1" &&
                                            <ButtonLixeira href="/rgi/lixeira_rgi" />}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Table */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden', bgcolor: '#fff' }}>
                            <DocList
                                data={data}
                                setPrenotation={setPrenotation}
                                handleClick={handleClickMenu}
                            />
                        </Paper>
                    </Container>

                    <Drawer anchor="left" open={openModalRGI} onClose={handleCloseModalRGI}>
                        <CadastroModalRGI onClose={handleCloseModalRGI} />
                    </Drawer>
                </Box>

                <MenuOptionsFile
                    anchorEl={anchorEl}
                    open={open}
                    handleClose={handleCloseMenu}
                    handleOpenModalPDF={handleOpenModalPDF}
                    type={prenotation}
                    handleDelete={handleDeleteByPrenotation}
                    deletePerm={permissions[1]?.delete_permission}
                    editPerm={permissions[1]?.edit}
                />

                <ModalList
                    data={dataFile}
                    open={openPDF}
                    onClose={handleCloseModalPDF}
                    prenotation={prenotation}
                    deletePerm={permissions[1]?.delete_permission}
                    editPerm={permissions[1]?.edit}
                    handleDeleteByPrenotation={handleDeleteByPrenotation}
                />

            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageRGI)
