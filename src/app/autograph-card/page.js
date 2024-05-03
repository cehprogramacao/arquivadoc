"use client"
import { Box, Drawer, TextField, Typography, useMediaQuery, useTheme, Grid, FormControl, OutlinedInput } from '@mui/material';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import Autocomplete from '@mui/material/Autocomplete';
import { ButtonOpenModals } from '@/Components/ButtonOpenModals';
import { CadastrarCartoesModal } from '@/Components/Modals/ModalCadastroCartoes';
import { useEffect, useState } from 'react';
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import CustomContainer from '@/Components/CustomContainer';
import withAuth from '@/utils/withAuth';
import { AuthProvider, useAuth } from '@/context';
import PrivateRoute from '@/utils/LayoutPerm';
import Customer from '@/services/customer.service';
import MenuOptionsFile from '@/Components/MenuPopUp';
import ModalListCards from './components/ModalPDF';
import SnackBar from '@/Components/SnackBar';
import { DocList } from './components/TableCards';
import ReactInputMask from "react-input-mask"
import Loading from '@/Components/loading';
import { useDispatch } from 'react-redux';
import { showAlert } from '@/store/actions';


const cpfMask = '999.999.999-99';
const cnpjMask = '99.999.999/9999-99';
const PageAutographCards = () => {
    const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const { permissions } = useAuth()
    const [dataOptions, setDataOptions] = useState({
        cpfcnpj: null,
        option: null
    })
    const [cpfcnpj, setCpfcnpj] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [isAdmin, setIsAdmin] = useState("")
    const [openPDF, setOpenPDF] = useState(false)
    const [dataFile, setDataFile] = useState([])


    const handleOpenModalPDF = async () => {
        const { getAutographCard } = new Customer()
        try {
            setOpenPDF(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getAutographCard(cpfcnpj, accessToken)
            setDataFile(response.data)
            return response.data
        } catch (error) {
            console.error("Erro ao listar dados!", error)
            throw error;
        }
    }

    const handleDeleteByCPFCNPJ = async () => {
        const { deleteAutographCard } = new Customer()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await deleteAutographCard(cpfcnpj, accessToken)
            dispatch(showAlert(response.data.message, "success", "file"))
            return response.data
        } catch (error) {
            dispatch(showAlert(error.msg, "error", "file"))
            console.error("Error ao deletar termo !", error)
            throw error;
        }
    }
    const handleFilterAutographCard = async () => {
        const { getAutographCard } = new Customer()
        let newData = []
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")

            const response = await getAutographCard(dataOptions.cpfcnpj, accessToken)
            newData.push(response.data)
            setData(newData)
            return response.data
        } catch (error) {
            console.error("Erro ao filtrar Termos", error);
            throw error;
        } finally {
            setLoading(false);
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

    const [open, setOpen] = useState(false);
    const [openPartes, setOpenPartes] = useState(false)
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

    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setCpfCnpjMask(cpfMask)
            : setCpfCnpjMask(cnpjMask);
        setDataOptions({ ...dataOptions, cpfcnpj: e.target.value.replace(/[^\d]/g, '') });

    };

    const handleInputBlur = () => {
        dataOptions.cpfcnpj?.replace(/\D/g, '').length === 11 && setCpfCnpjMask(cpfMask);
    };

    useEffect(() => {
        const isAdminUser = sessionStorage.getItem("isAdmin")
        setIsAdmin(isAdminUser)
    })
    const service = ['CPF']
    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']} >
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    py: 14,
                    px: 4,
                }}>
                    <CustomContainer>
                        <Grid container spacing={3}>
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={40} fontWeight={'bold'} color="#000">
                                        Cartões
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={5} md={5} sm={12}>
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
                                    <Grid item xs={12} lg={4} md={4} sm={12}>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={service}
                                            fullWidth
                                            autoHighlight
                                            value={dataOptions.option}
                                            getOptionLabel={(option) => option || ""}
                                            onChange={(e, newValue) => setDataOptions({ ...dataOptions, option: newValue })}
                                            isOptionEqualToValue={(option, value) => option === value}
                                            renderInput={(params) => <TextField color="success" {...params} label="Buscar Por"
                                                sx={{
                                                    color: "#237117", '& input': {
                                                        color: 'success.main',
                                                    },
                                                }} />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3} md={3} sm={12}>
                                        <Box sx={{ display: 'flex', width: '100%', justifyContent: "center", gap: '30px' }}>
                                            <Buttons color={'green'} title={'Buscar'} onClick={handleFilterAutographCard} />
                                            {permissions[5]?.create_permission === 1 && <ButtonOpenModals onClick={handleOpen} />}
                                            {isAdmin === "1" && <ButtonLixeira href={"/autograph-card/lixeira_cartoes"} />}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <DocList data={data} setCPF={(cpf) => setCpfcnpj(cpf)} handleClick={handleClickMenu} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <Drawer anchor='left' open={open} onClose={handleClose}>
                        <CadastrarCartoesModal onClose={handleClose} onClickPartes={handleOpenPartes} />
                    </Drawer>
                    <CadastroPartes open={openPartes} onClose={handleClosePartes} />

                </Box>
                <MenuOptionsFile
                    editPerm={permissions[5]?.edit}
                    deletePerm={permissions[5]?.delete_permission}
                    anchorEl={anchorEl} data={data} open={openMenu} handleClose={handleCloseMenu} handleOpenModalPDF={handleOpenModalPDF} type={cpfcnpj} handleDelete={handleDeleteByCPFCNPJ} />
                <ModalListCards data={dataFile} onClose={handleCloseModalPDF} open={openPDF} cpfcnpj={cpfcnpj} />
                <SnackBar />
            </PrivateRoute>
        </AuthProvider>
    )
}
export default withAuth(PageAutographCards)