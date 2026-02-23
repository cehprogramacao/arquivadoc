"use client"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, Grid, Container, Paper, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { UserTable } from "./tablePessoas/table"
import { CadastroPessoas } from "@/Components/Modals/ModalCadastroPessoas"
import Customer from "@/services/customer.service"
import Loading from "@/Components/loading"
import withAuth from "@/utils/withAuth"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"
import { AuthProvider, useAuth } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import { PeopleOutline, Search } from "@mui/icons-material"


const customerSv = new Customer()
const PagePessoas = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const handleOpenModal = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)
    const [options, setOptions] = useState({
        option: "",
        value: ""
    })
    const label = [
        {
            label: 'CPF/CNPJ'
        },
    ];
    const { permissions } = useAuth()

    const getData = async () => {
        try {
            setLoading(true)
            const data = await customerSv.customers()
            setRows(data)
            return data
        } catch (error) {
            console.error('Error listing customers', error.message)
            throw error
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])


    const handleDeleteCustomer = async (cpfcnpj) => {
        try {
            setLoading(true)
            const data = await customerSv.deleteCustomer(cpfcnpj)
            dispatch({ type: SET_ALERT, message: "Cliente deletado com sucesso!", severity: "success", alertType: "user" })
        } catch (error) {
            console.error("error when deleting client", error)
            dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "user" })
            throw error
        }
        finally {
            setLoading(false)
        }
    };

    const handleFindCustomerByCpfCnpj = async () => {
        if (options.option && options.value) {
            try {
                const data = await getCustomerByCPFCNPJ(options.value)

                setRows(Object.values(data));
                dispatch({ type: SET_ALERT, message: "Cliente encontrado com sucesso!", severity: "success", alertType: "user" })
            } catch (error) {
                console.error("Erro ao buscar usuário!", error)
                dispatch({ type: SET_ALERT, message: error.message, severity: "error", alertType: "user" })
                throw error;
            }
        }
        else {
            console.error("Campos vazios!")
            dispatch({ type: SET_ALERT, message: "Preencha os campos corretamente!", severity: "error", alertType: "user" })
        }
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;


    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
                <Box sx={{
                    width: '100%',
                    minHeight: '100vh',
                    bgcolor: '#f5f7fa',
                    pt: 12,
                    pb: 6,
                    px: 2
                }}>
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #237117 0%, #2e8b1e 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(35,113,23,0.3)'
                            }}>
                                <PeopleOutline sx={{ color: '#fff', fontSize: 30 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                                    Pessoas
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    {rows.length} {rows.length === 1 ? 'pessoa cadastrada' : 'pessoas cadastradas'}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Search */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3, bgcolor: '#fff' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6} sm={6} lg={5}>
                                    <TextField
                                        label="Buscar"
                                        fullWidth
                                        size="small"
                                        value={options.value}
                                        onChange={(e) => setOptions(state => ({ ...state, value: e.target.value }))}
                                        sx={{
                                            '& input': {
                                                color: 'success.main',
                                            },
                                        }}
                                        color="success"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} sm={6} lg={5}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={label}
                                        fullWidth
                                        size="small"
                                        isOptionEqualToValue={(option, label) => option.label === label.label}
                                        autoHighlight
                                        onChange={(e, value) => {
                                            setOptions(state => ({ ...state, option: value.label }))
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                color="success"
                                                label="Buscar Por"
                                                sx={{
                                                    color: "#237117",
                                                    "& input": {
                                                        color: "success.main",
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} sm={12} lg={2}>
                                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                        <Button
                                            variant="contained"
                                            startIcon={<Search />}
                                            onClick={handleFindCustomerByCpfCnpj}
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
                                        {permissions[5]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpenModal} />}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Table */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden', bgcolor: '#fff' }}>
                            <UserTable data={rows} onClick={handleDeleteCustomer} />
                        </Paper>
                    </Container>
                    <Drawer anchor="left" open={open} onClose={handleCloseModal}>
                        <CadastroPessoas onClose={handleCloseModal} />
                    </Drawer>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PagePessoas)
