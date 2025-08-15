"use client"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Drawer, Grid, FormControl, OutlinedInput } from "@mui/material"
import { use, useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { Buttons } from "@/Components/Button/Button"
import { CadastroTermosModal } from "@/Components/Modals/ModalCadastroTermo"
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes"
import CustomContainer from "@/Components/CustomContainer"
import { DocList } from "./components/tableTermos/table"
import Customer from "@/services/customer.service"
import ReactInputMask from "react-input-mask"
import ModalListTerm from "./components/modalList"
import MenuOptionsFile from "@/Components/MenuPopUp"
import SnackBar from "@/Components/SnackBar"
import Loading from "@/Components/loading"
import { AuthProvider, useAuth } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"
import withAuth from "@/utils/withAuth"


const cpfMask = '999.999.999-99';
const customerSv = new Customer()
const cnpjMask = '99.999.999/9999-99';
const PageTermos = () => {
    const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const { permissions } = useAuth()

    const [dataOptions, setDataOptions] = useState({
        cpfcnpj: "",
        option: ""
    })

    const [cpfcnpj, setCpfcnpj] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const [openPDF, setOpenPDF] = useState(false)
    const [dataFile, setDataFile] = useState([])

    const handleOpenModalPDF = async () => {
        try {
            setOpenPDF(true)
            const response = await customerSv.getTermLGDP(cpfcnpj)
            console.log(response, 'PDFF')
            setDataFile(response)
            return response
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
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const [data, setData] = useState([])
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    }



    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setCpfCnpjMask(cpfMask)
            : setCpfCnpjMask(cnpjMask);
        setDataOptions({ ...Options, cpfcnpj: e.target.value.replace(/[^\d]+/g, '') });
    };

    const handleInputBlur = () => {
        dataOptions.cpfcnpj?.replace(/\D/g, '').length === 11 && setCpfCnpjMask(cpfMask);
    };
    const labels = [
        {
            label: 'CPF/CNPJ'
        },
    ];
    const handleDeleteByCPFCNPJ = async () => {
        try {
            const response = await customerSv.deleteTermLGDP(cpfcnpj)
            return response
        } catch (error) {
            console.error("Error ao deletar termo !", error)
            throw error;
        }
    }
    const handleFilterTermLGPD = async () => {
        let newData = []
        try {
            setLoading(true)
            const response = await customerSv.getTermLGDP(dataOptions.cpfcnpj)
            setData(Object.values(response));
            return response
        } catch (error) {
            console.error("Erro ao filtrar Termos", error);
            throw error;
        } finally {
            setLoading(false);
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
                    py: 12,
                    px: 3
                }}>

                    <CustomContainer>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                                        TERMOS
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={4} md={6} sm={12}>
                                        <FormControl fullWidth error={Boolean(errors['cpfcnpj'])}>
                                            <ReactInputMask
                                                mask={cpfCnpjMask}
                                                value={dataOptions.cpfcnpj}
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                name="cpfcnpj"
                                            >
                                                {(inputProps) => (
                                                    <OutlinedInput
                                                        {...inputProps}
                                                        id={'id-documento'}
                                                        color="success"
                                                        placeholder={'CPF/CNPJ'}
                                                        sx={{
                                                            borderRadius: '12.5px',
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderRadius: '4px',
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </ReactInputMask>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} lg={4} md={6} sm={12}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={labels}
                                            fullWidth
                                            autoHighlight
                                            getOptionLabel={(option) => option.label || ""}
                                            onChange={(e, newValue) => setDataOptions({ ...Options, option: newValue })}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
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
                                    <Grid item xs={12} lg={4} md={12} sm={12}>
                                        <Box sx={{ display: 'flex', justifyContent: "center", width: '100%', gap: '30px' }}>
                                            <Buttons color={'green'} title={'Buscar'} onClick={handleFilterTermLGPD} />
                                            {permissions[5]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpen} />}
                                            {/* <ButtonLixeira href={"/termos/lixeira_termo"} /> */}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <DocList data={data} setCPF={(cpf) => setCpfcnpj(cpf)} handleClick={handleClickMenu} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <Drawer anchor="left" open={open} onClose={handleClose} >
                        <CadastroTermosModal onClose={handleClose} />
                    </Drawer>
                </Box>
                <MenuOptionsFile
                    editPerm={permissions[5]?.edit}
                    deletePerm={permissions[5]?.delete_permission}
                    anchorEl={anchorEl} data={data} open={openMenu} handleClose={handleCloseMenu} handleOpenModalPDF={handleOpenModalPDF} type={cpfcnpj} handleDelete={handleDeleteByCPFCNPJ} />
                <ModalListTerm data={dataFile} onClose={handleCloseModalPDF} open={openPDF} cpfcnpj={cpfcnpj} />
            </PrivateRoute>
        </AuthProvider>
    )
}

export default withAuth(PageTermos)