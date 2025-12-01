"use client"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { Buttons } from "@/Components/Button/Button"
import { UserTable } from "./tablePessoas/table"
import { CadastroPessoas } from "@/Components/Modals/ModalCadastroPessoas"
import CustomContainer from "@/Components/CustomContainer"
import Customer from "@/services/customer.service"
import Loading from "@/Components/loading"
import withAuth from "@/utils/withAuth"
import { useDispatch } from "react-redux"
import { SET_ALERT, showAlert } from "@/store/actions"
import { AuthProvider, useAuth } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import SnackBar from "@/Components/SnackBar"


const customerSv = new Customer()
const PagePessoas = () => {
    const dispatch = useDispatch()
    const theme = useTheme();
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
                    height: '100vh',
                    px: 3,
                    py: 13
                }}>
                    <CustomContainer >
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={30} fontWeight={'bold'} color={"black"}>
                                        Pessoas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} sm={6} lg={5}>
                                        <TextField label="Buscar"
                                            fullWidth
                                            value={options.value}
                                            onChange={(e) => setOptions(state => ({ ...state, value: e.target.value }))}
                                            sx={{
                                                '& input': {
                                                    color: 'success.main',
                                                },
                                            }} color="success" />
                                    </Grid>
                                    <Grid item xs={12} md={6} sm={6} lg={5}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={label}
                                            fullWidth
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
                                        <Box sx={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 3
                                        }}>
                                            <Buttons color={'green'} title={'Buscar'} onClick={handleFindCustomerByCpfCnpj} />
                                            {permissions[5]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpenModal} />}
                                        </Box>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <UserTable data={rows} onClick={handleDeleteCustomer} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <Drawer anchor="left" open={open} onClose={handleCloseModal}>
                        <CadastroPessoas onClose={handleCloseModal} />
                    </Drawer>

                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PagePessoas)