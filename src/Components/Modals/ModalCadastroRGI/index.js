import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import CadastroRGITypes from "@/Components/ModalsRegistration/ModalTypesRGI";
import Loading from "@/Components/loading";
import { useAuth } from "@/context";
import Customer from "@/services/customer.service";
import RGI from "@/services/rgi.service";
import { showAlert } from "@/store/actions";
import { CloseOutlined } from "@mui/icons-material";
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete, IconButton, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


export const CadastroModalRGI = ({ onClose }) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // States
    const [loading, setLoading] = useState(false)
    const [grupo, setGrupo] = useState(null); // Estado para armazenar o grupo selecionado
    const [types, setTypes] = useState([]);
    const [userPresenter, setUserPresenter] = useState(null)
    const [presenter, setPresenter] = useState([]);
    const { permissions } = useAuth()
    const [data, setData] = useState({
        prenotation: 0,
        presenter: '',
        service_type: "",
        box: 0,
        registration: "",
        file_url: ""
    });
    const dispatch = useDispatch()

    const [openModalRGITypes, setOpenModalRGITypes] = useState(false);
    const [openModalPresenter, setOpenModalPresenter] = useState(false);


    // Functions
    const handleOpenModalPresenter = () => {
        setOpenModalPresenter(!openModalPresenter);
    }
    const handleCloseModalPresenter = () => {
        setOpenModalPresenter(!openModalPresenter);
    }
    const handleOpenModalRGITypes = () => {
        setOpenModalRGITypes(!openModalRGITypes);
    }
    const handleCloseModalRGITypes = () => {
        setOpenModalRGITypes(!openModalRGITypes);
    }
    // const handleChangeFile = (e) => {
    //     const files = e.target.files[0];
    //     if (files) {
    //         const fileReader = new FileReader();
    //         fileReader.onloadend = () => {
    //             setData((prevFormData) => ({ ...prevFormData, file_url: fileReader.result }));
    //         };
    //         fileReader.readAsDataURL(files);    
    //         console.log(fileReader,'888');
    //     }
    // };
    const handleChangeFile = (e) => {
        const files = e.target.files[0];
        if (files) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                let base64String = fileReader.result.split(',')[1];
                setData((prevFormData) => ({ ...prevFormData, file_url: base64String }));
            };
            fileReader.readAsDataURL(files);
            console.log(fileReader, '888');
        }
    };



    const getCustomersPresenter = async () => {
        const customer = new Customer();
        try {
            const accessToken = sessionStorage.getItem("accessToken");
            const { data } = await customer.customers(accessToken);
            const newData = Object.values(data);
            setPresenter(newData);
            console.log(data);
            return data;
        } catch (error) {
            console.error("Error when listing presenters", error);
            throw error;
        }
    };

    const handleCreateRGI = async () => {
        console.log(data);
        const { create } = new RGI()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await create(data, accessToken)
            console.log(response.data)
            dispatch(showAlert(response.data.message,"success","file"))
            return response.data
        } catch (error) {
            dispatch(showAlert(error.msg,"error","file"))
            console.error("Error creating record", error)
            throw error;
        }
        finally {
            setLoading(false)
            onClose()
        }
    }

    const group = [
        {
            id: 1,
            label: "Registro"
        },
        {
            id: 2,
            label: "Averbação"
        }
    ]
    const tiposFiltrados = grupo ? types.filter(tipo => tipo.group === grupo) : [];
    // useEffect
    const getTypesRGI = async () => {
        const { getType } = new RGI()
        try {

            const accessToken = sessionStorage.getItem("accessToken");
            const { data } = await getType(accessToken);
            const newData = Object.values(data);
            console.log(data);
            console.log(newData, '7777777777777')
            setTypes(newData)
            return data;
        } catch (error) {
            console.error("Error when listing types rgi", error);
            throw error;
        }

    };
    useEffect(() => {
        getCustomersPresenter();
        getTypesRGI()
    }, []);

    const deteleTypeById = async (typeId) => {
        const { deleteType } = new RGI()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await deleteType(typeId, accessToken)
            getTypesRGI()
        } catch (error) {
            console.error('Erro ao deletar tipo de rgi!', error)
            throw error;
        }

    }

    const deletePresenterById = async (typeId) => {
        const { deleteCustomer } = new Customer()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await deleteCustomer(typeId, accessToken)
        } catch (error) {
            console.error('Erro ao deletar tipo de rgi!', error)
            throw error;
        }

    }

    const updateDataWithUrl = (fieldToUpdate, scannedPdfUrl) => {
        setData(prevData => ({
            ...prevData,
            [fieldToUpdate]: scannedPdfUrl
        }));
    };
    const handleScanFile = () => {
        window.scanner.scan((successful, mesg, response) => {
            if (!successful) {
                console.error('Failed: ' + mesg);
                return;
            }
            if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
                console.info('User cancelled');
                return;
            }
            const responseJson = JSON.parse(response);
            const scannedPdfUrl = responseJson.output[0].result[0];
            updateDataWithUrl('file_url', scannedPdfUrl);
        }, {
            "output_settings": [
                {
                    "type": "return-base64",
                    "format": "pdf",
                    "pdf_text_line": "By ${USERNAME} on ${DATETIME}"
                },
                {
                    "type": "return-base64-thumbnail",
                    "format": "jpg",
                    "thumbnail_height": 200
                }
            ]
        });
    };

    useEffect(() => {
        if (window.scanner) {
            window.scanner.scanDisplayImagesOnPage = (successful, mesg, response) => {
                if (!successful) {
                    console.error('Failed: ' + mesg);
                    return;
                }
                if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
                    console.info('User cancelled');
                    return;
                }
            };
        }
    }, []);


    return (
        <Box sx={{
            width: { lg: 409, md: 409, sm: 380, xs: 300 },
            height: '100vh',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            overflow: 'hidden'
        }}>
            <Box sx={{
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Typography sx={{
                    fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
                }}>
                    Cadastro - RGI
                </Typography>
                <IconButton style={{
                    boxSizing: 'content-box',
                    color: '#000',
                    border: 0,
                    background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23000\'%3e%3cpath d=\'M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z\'/%3e%3c/svg%3e")',
                    borderRadius: '0.375rem',
                    opacity: '.5',
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: '1',
                    },
                }} onClick={onClose} >

                </IconButton>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '30px',
                height: "100vh",
                overflowY: 'auto',
                padding: '5px 0'

            }}>
                <TextField sx={{
                    '& input': { color: 'success.main' },
                }}
                    label="Prenotação"
                    value={data.prenotation}
                    fullWidth
                    onChange={(e) => setData({ ...data, prenotation: e.target.value })}
                    color='success'
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    value={data.box}
                    onChange={(e) => setData({ ...data, box: e.target.value })}
                    label="N° da Caixa"
                    color='success'
                />
                <Autocomplete
                    value={userPresenter}
                    options={presenter}
                    fullWidth
                    getOptionLabel={(option) => (option && option.cpfcnpj) ? option.cpfcnpj : ''}
                    onChange={(event, newValue) => {
                        setUserPresenter(newValue);
                        setData({ ...data, presenter: (newValue && newValue.cpfcnpj) ? newValue.cpfcnpj : '' });
                    }}
                    noOptionsText={<RenderNoOptions onClick={handleOpenModalPresenter} title="Cadastrar Apresentante" />}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Apresentante"
                            color="success"
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box
                            {...props}
                            key={option.cpfcnpj}
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <Grid container alignItems={"center"} >
                                <Grid item xs={11} lg={11} md={11} sm={11}>
                                    <Typography >
                                        {option.name}
                                    </Typography>
                                </Grid>
                                {permissions[5]?.delete_permission === 1 && (
                                    <Grid item xs={1} lg={1} md={1} sm={1}>
                                        <Box sx={{
                                            width: "100%",
                                            display: 'flex',
                                            justifyContent: "flex-end"
                                        }}>
                                            <IconButton onClick={() => deletePresenterById(option.cpfcnpj)}>
                                                <CloseOutlined sx={{ width: 20, height: 20 }} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                        </Box>
                    )}
                />

                <Autocomplete
                    value={grupo}
                    onChange={(event, newValue) => setGrupo(newValue)}
                    options={group.map(option => option.label)}
                    getOptionLabel={(option) => option}
                    fullWidth
                    renderInput={(params) => (
                        <TextField {...params} label="Tipo de Serviço" variant="outlined" color="success" />
                    )}
                />

                {grupo && (
                    <Autocomplete
                        fullWidth
                        // value={data.service_type}
                        onChange={(event, newValue) => setData({ ...data, service_type: newValue.id })}
                        options={tiposFiltrados.filter(tipo => tipo.id)}
                        getOptionLabel={(id) => {
                            const tipoSelecionado = tiposFiltrados.find(t => t.name === id.name);
                            return tipoSelecionado ? tipoSelecionado.name : '';
                        }}
                        noOptionsText={<RenderNoOptions onClick={handleOpenModalRGITypes} title={'Cadastrar Tipo'} />}
                        renderInput={(params) => (
                            <TextField {...params} label={`Selecione a opção de ${grupo}`} color="success" variant="outlined" />
                        )}
                        renderOption={(props, option) => (
                            <Box
                                {...props}
                                key={option.id}
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Grid container alignItems={"center"} justifyContent="space-between" >
                                    <Grid item xs={10} lg={10} md={10} sm={10}>
                                        <Typography >
                                            {option.name}
                                        </Typography>
                                    </Grid>
                                    {permissions[1]?.delete_permission === 1 && (
                                        <Grid item xs={2} lg={2} md={2} sm={2}>
                                            <Box sx={{
                                                width: "100%",
                                                display: 'flex',
                                                justifyContent: "flex-end"
                                            }}>
                                                <IconButton onClick={() => deteleTypeById(option.id)}>
                                                    <CloseOutlined sx={{ width: 20, height: 20 }} />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>

                            </Box>
                        )}
                    />
                )}
                <TextField
                    fullWidth
                    type="text"
                    label="Número da matrícula"
                    color='success'
                    value={data.registration}
                    onChange={(e) => setData({ ...data, registration: e.target.value })}
                />
                <TextField
                    fullWidth
                    onChange={handleChangeFile}
                    type="file"
                    color='success'
                    InputLabelProps={{
                        shrink: true,
                    }}

                />
                <Button sx={{
                    display: 'flex',
                    width: '169px',
                    background: 'transparent',
                    color: '#FFC117',
                    border: '1px solid #FFC117',
                    padding: '6px 12px',
                    textTransform: 'capitalize',
                    fontSize: ".9rem",
                    borderRadius: '8px',
                    ":hover": {
                        background: "#FFC117",
                        color: '#FFF',

                    }
                }} onClick={handleScanFile}>
                    Scannear Arquivos
                </Button>
                <Button sx={{
                    display: 'flex',
                    width: '169px',
                    background: "#237117",
                    color: '#fff',
                    border: '1px solid #237117',
                    textTransform: 'capitalize',
                    fontSize: ".9rem",
                    borderRadius: '8px',
                    ":hover": {
                        background: 'transparent',
                        color: '#237117',

                    }
                }} onClick={handleCreateRGI}>
                    Realizar Cadastro
                </Button>

            </Box>
            <CadastroRGITypes getData={getTypesRGI} open={openModalRGITypes} onClose={handleCloseModalRGITypes} />
            <CadastroPartes getData={getCustomersPresenter} open={openModalPresenter} onClose={handleCloseModalPresenter} />
        </Box >
    );
};
