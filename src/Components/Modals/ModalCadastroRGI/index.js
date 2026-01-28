import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import CadastroRGITypes from "@/Components/ModalsRegistration/ModalTypesRGI";
import Loading from "@/Components/loading";
import Customer from "@/services/customer.service";
import RGI from "@/services/rgi.service";
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

const customerSv = new Customer();
const rgiSv = new RGI();
export const CadastroModalRGI = ({ onClose, onClickPartes }) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    // States
    const [loading, setLoading] = useState(false)
    const [grupo, setGrupo] = useState(null);
    const [types, setTypes] = useState([]);
    const [userPresenter, setUserPresenter] = useState(null)
    const [presenter, setPresenter] = useState([]);
    const [data, setData] = useState({
        prenotation: 0,
        presenter: userPresenter,
        service_type: "",
        box: 0,
        registration: "",
        file_url: ""
    });

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
        try {
            const data = await customerSv.customers();
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
        try {
            setLoading(true)
            const response = await rgiSv.create(data)
            console.log(response)
            return response
        } catch (error) {
            console.error("Error creating record", error)
            throw error;
        }
        finally {
            setLoading(false)
            onClose()
            window.location.reload()

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
        try {

            const data = await rgiSv.getType();
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
        <>
            {loading ? <Loading />
                :
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
                        gap: isSmallScreen ? '20px' : '30px',
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
                                <li {...props} key={option.cpfcnpj}>
                                    {option.name}
                                </li>
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
                                value={data.service_type}
                                onChange={(event, newValue) => setData({ ...data, service_type: newValue })}
                                options={tiposFiltrados.map(tipo => tipo.id)}
                                getOptionLabel={(id) => {
                                    const tipoSelecionado = tiposFiltrados.find(t => t.id === id);
                                    return tipoSelecionado ? tipoSelecionado.name : '';
                                }}
                                noOptionsText={<RenderNoOptions onClick={handleOpenModalRGITypes} title={'Cadastrar Tipo'} />}
                                renderInput={(params) => (
                                    <TextField {...params} label={`Selecione a opção de ${grupo}`} color="success" variant="outlined" />
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
                        <Button 
                        onClick={handleScanFile}
                        sx={{
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
                        }}>
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
                    <CadastroRGITypes open={openModalRGITypes} onClose={handleCloseModalRGITypes} />
                    <CadastroPartes open={openModalPresenter} onClose={handleCloseModalPresenter} />
                </Box >
            }
        </>
    );
};
