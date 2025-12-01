import React, { useEffect, useState } from 'react'
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete, IconButton, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import RenderNoOptions from '@/Components/ButtonOpenModalCadastro';
import { CloseOutlined } from '@mui/icons-material';
import Customer from '@/services/customer.service';
import { useDispatch } from 'react-redux'
import { showAlert } from '@/store/actions';
import { useAuth } from '@/context';
import RTDService from '@/services/rtd.service';
import ModalTypesRTD from '@/Components/ModalsRegistration/ModalCadastroTypesRTD';



const rtdSv = new RTDService()
const customerSv = new Customer()
export const CadastroModalRTD = ({ onClose, getData }) => {
    const dispatch = useDispatch()
    const [data, setData] = useState({
        notation: 0,
        register: 0,
        presenter: null,
        service_type: null,
        book: 0,
        initial_sheet: 0,
        final_sheet: 0,
        box: 0,
        file_url: ""
    })
    const [presenter, setPresenter] = useState([])
    const { permissions } = useAuth()

    const [optionPresenter, setOptionPresenter] = useState(null)
    const [optionType, setOptionType] = useState(null)
    const [types, setTypes] = useState([])
    const [openModalCadastroTypes, setOpenModalCadastroTypes] = useState(false)
    const handleOpenModalTypes = () => setOpenModalCadastroTypes(!openModalCadastroTypes)
    const handleCloseModalTypes = () => setOpenModalCadastroTypes(!openModalCadastroTypes)

    const fetchData = async () => {
        try {
            const responseTypes = await rtdSv.getAllRTDTypes()
            setTypes(Object.values(responseTypes))

        } catch (error) {
            console.error('Erro ao buscar dados!', error)
            throw error
        }
    }
    const fetchDataCustomers = async () => {
        try {
            const responseCustomers = await customerSv.customers()
            setPresenter(Object.values(responseCustomers))

        } catch (error) {
            console.error('Erro ao buscar dados!', error)
            throw error
        }
    }

    const handleChangeFileUrl = (event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")[1]
                setData(state => ({ ...state, file_url: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const handleChangeValuesField = (event) => {
        const { name, value } = event.target
        setData(state => ({ ...state, [name]: value }))
    }

    const handleCreateFileRtd = async () => {
        try {
            const response = await rtdSv.createRTD(data)
            dispatch({type: SET_ALERT, message: "Arquivo de RTD cadastrado com sucesso!", alertType: "file", severity: "success"})
        } catch (error) {
            console.error("Erro ao arquivar arquivo de rpj", error)
            dispatch({type: SET_ALERT, message: "Erro ao cadastrar arquivo RTD!", alertType: "file", severity: "error"})
            throw error
        }
        finally {
            getData()
            onClose()
        }
    }
    const deletePresenterById = async (typeId) => {
        try {
            const data = await customerSv.deleteCustomer(typeId)
            console.log(data)
            dispatch({type: SET_ALERT, message: "Apresentante deletado com sucesso!", alertType: "file", severity: "success"})
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao deletar apresentante", alertType: "file", severity: "error"})
            console.error('Erro ao deletar tipo de rgi!', error)
            throw error;
        }

    }

    const handleDeleteTypeRpjById = async (typeId) => {
        try {
            const data = await rtdSv.deleteRTDTypeById(typeId)
            dispatch({type: SET_ALERT, message: "Tipo de RTD deletado com sucesso!", alertType: "file", severity: "success"})
        } catch (error) {
            dispatch({type: SET_ALERT, message: "Erro ao deletar tipo de RTD", alertType: "file", severity: "error"})
            console.error("Erro ao deletar tipo de rpj!", error)
            throw error;
        }
        finally {
            fetchData()
        }
    }

    const [openModalCadastroPartes, setOpenModalCadastroPartes] = useState(false)
    const handleOpenModalPartes = () => setOpenModalCadastroPartes(true)
    const handleCloseModalPartes = () => setOpenModalCadastroPartes(false)
    useEffect(() => {
        fetchData()
        fetchDataCustomers()
    }, [])

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
            width: { md: 400, xs: "100%" },
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            px: 1,
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
                    Cadastro - RTD
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseOutlined />
                </IconButton>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '30px',
                height: "100vh",
                overflowY: 'auto',
                py: 1,
            }}>

                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    label="Notação"
                    type="text"
                    color='success'
                    name='notation'
                    value={data.notation}
                    onChange={handleChangeValuesField}
                />
                <TextField sx={{
                    '& input': { color: 'success.main' },
                }}
                    fullWidth
                    label="Registro"
                    type="text"
                    name='register'
                    value={data.register}
                    onChange={handleChangeValuesField}
                    color='success'
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={presenter}
                    noOptionsText={<RenderNoOptions onClick={handleOpenModalPartes} title={'Cadastrar Apresentante'} />}
                    autoHighlight
                    value={optionPresenter}
                    isOptionEqualToValue={(option, label) => option.name === label.name}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => {
                        setOptionPresenter(value);
                        setData((state) => ({ ...state, presenter: value ? value.cpfcnpj : optionPresenter }));
                    }}
                    fullWidth
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Apresentante"
                            color="success"
                            name="presenter"
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
                            <Grid container alignItems={"center"} justifyContent="space-between" >
                                <Grid item xs={10} lg={10} md={10} sm={10}>
                                    <Typography >
                                        {option.name}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: "11px", display: 'flex', alignSelf: 'start',
                                        textTransform: 'uppercase'
                                    }}>
                                        {option.cpfcnpj}
                                    </Typography>
                                </Grid>
                                {permissions[5]?.delete_permission === 1 && (
                                    <Grid item xs={2} lg={2} md={2} sm={2}>
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
                    disablePortal
                    id="combo-box-demo"
                    options={types}
                    noOptionsText={<RenderNoOptions onClick={handleOpenModalTypes} title={'Cadastrar Tipo'} />}
                    fullWidth
                    value={optionType}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, label) => option.name === label.name}
                    onChange={(event, value) => {
                        setOptionType(value);
                        setData((state) => ({ ...state, service_type: value ? value.id : optionType }));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tipo"
                            name="service_type"
                            color="success"
                        />
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
                                {permissions[3]?.delete_permission === 1 && (
                                    <Grid item xs={2} lg={2} md={2} sm={2}>
                                        <Box sx={{
                                            width: "100%",
                                            display: 'flex',
                                            justifyContent: "flex-end"
                                        }}>
                                            <IconButton onClick={() => handleDeleteTypeRpjById(option.id)}>
                                                <CloseOutlined sx={{ width: 20, height: 20 }} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                        </Box>
                    )}
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    label="Livro"
                    type="number"
                    color='success'
                    onChange={handleChangeValuesField}
                    name='book'
                    value={data.book}
                />

                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    type="number"
                    label="Folha inicial"
                    color='success'
                    onChange={handleChangeValuesField}
                    value={data.initial_sheet}
                    name='initial_sheet'
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    type="number"
                    label="Folha final"
                    color='success'
                    value={data.final_sheet}
                    name='final_sheet'
                    onChange={handleChangeValuesField}
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    onChange={handleChangeValuesField}
                    value={data.box}
                    fullWidth
                    label="Número da caixa"
                    type="number"
                    color='success'
                    name='box'
                />
                <TextField
                    sx={{
                    }}
                    onChange={handleChangeFileUrl}
                    fullWidth
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
                }} onClick={handleCreateFileRtd}>
                    Realizar Cadastro
                </Button>

            </Box>
            <ModalTypesRTD open={openModalCadastroTypes} onClose={handleCloseModalTypes} />
            <CadastroPartes open={openModalCadastroPartes} onClose={handleCloseModalPartes} getData={fetchData} />
        </Box >
    );
};
