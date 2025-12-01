
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import ModalCadastroCallingEntity from "@/Components/ModalsRegistration/ModalCadastroCallingEntity";
import CadastroModalCallingTypes from "@/Components/ModalsRegistration/ModalCadastroCallingTypes";
import SnackBar from "@/Components/SnackBar";
import ScannerModal from "@/Components/scanner";
import Calling from "@/services/calling.service";
import { SET_ALERT, showAlert } from "@/store/actions";
import { CloseOutlined } from "@mui/icons-material";
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete, IconButton, Box, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'



const callingSv = new Calling()
export const CadastroOficio = ({ onClose, getData }) => {
  const dispatch = useDispatch()
  const [dataCalling, setDataCalling] = useState({
    number: "",
    entity: 0,
    calling_type: 0,
    box: 0,
    date: "",
    file_url: ""
  })
  const [types, setTypes] = useState([])
  const [entity, setEntity] = useState([])
  const [entityOption, setEntityOption] = useState(null)
  const [groupOption, setGroupOption] = useState(null)


  const handleFileChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        const fileResult = fileReader.result.split(",")[1]
        setDataCalling({ ...dataCalling, file_url: fileResult })
      }
      fileReader.readAsDataURL(files)
    }
  }
  const handleChangeValues = (e) => {
    const { name, value } = e.target
    setDataCalling({ ...dataCalling, [name]: value })
  }

  const getDataTypes = async () => {
    try {
      const data = await callingSv.getAllCallingTypes()
      setTypes(Object.values(data))
      return data

    } catch (error) {
      console.error("Erro ao buscar types de oficio!", error)
      throw error;
    }
  }
  const getDataEntity = async () => {
    try {
      const data = await callingSv.getAllCallingEntities()
      setEntity(Object.values(data))
      return data
    } catch (error) {
      console.error("Erro ao buscar types de oficio!", error)
      throw error;
    }
  }

  useEffect(() => {
    getDataTypes()
    getDataEntity()
  }, [])

  const handleCreateCalling = async () => {
    console.log(dataCalling)
    try {
      const data = await callingSv.createCalling(dataCalling)
      dispatch({type: SET_ALERT, message: "Ofício cadastrado com sucesso!", severity: "success", alertType: "file"})

      return data
    } catch (error) {
      dispatch({type: SET_ALERT, message: "Erro ao cadastrar ofício!", severity: "error", alertType: "file"})
      console.error("Error ao adicionar arquivo!", error)
      throw error;
    }
    finally {
      getData()
      onClose()
    }
  }
  const handleDeleteEntityById = async (entityId) => {
    try {
      const data = await callingSv.deleteCallingEntity(entityId)
      getDataEntity()
      dispatch({type: SET_ALERT, message: "Editade deletada com sucesso!", severity: "success", alertType: "file"})
      return data
    } catch (error) {
      dispatch({type: SET_ALERT, message: "Erro ao deletar entidade", severity: "success", alertType: "file"})
      console.error("Erro ao deletar entidade", error)
      throw error;
    }
  }
  const handleDeleteByTypeId = async (typeId) => {
    try {
      getDataTypes()
      const data = await callingSv.deleteCallingType(typeId)
      dispatch({type: SET_ALERT, message: "Tipo deletado com sucesso!", severity: "success", alertType: "file"})
      return data
    } catch (error) {
      console.error("Erro ao deletar tipo da entidade!", error)
      throw error;
    }
  }

  const [openModalCalling, setOpenModalCalling] = useState(false)
  const handleOpenModalCalling = () => setOpenModalCalling(!openModalCalling)
  const handleCloseModalCalling = () => setOpenModalCalling(!openModalCalling)
  const [openModalCadastroTypes, setOpenModalCadastroTypes] = useState(false)
  const handleOpenModalTypes = () => setOpenModalCadastroTypes(!openModalCadastroTypes)
  const handleCloseModalTypes = () => setOpenModalCadastroTypes(!openModalCadastroTypes)
  const updateDataWithUrl = (fieldToUpdate, scannedPdfUrl) => {
    setDataCalling(prevData => ({
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
          Cadastro - Oficio
        </Typography>
        <IconButton onClick={onClose} >
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
        padding: '5px 0'
      }}>

        <TextField
          fullWidth
          value={dataCalling.number}
          name="number"
          onChange={handleChangeValues}
          sx={{
            '& input': { color: 'success.main' },
          }}
          label="Número"
          type="number"
          color='success'
        />
        <TextField
          fullWidth
          value={dataCalling.box}
          name="box"
          onChange={handleChangeValues}
          sx={{
            '& input': { color: 'success.main' }
          }}
          label="N° da Caixa"
          type="number"
          color='success'
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={entity}
          value={entityOption}
          fullWidth
          noOptionsText={<RenderNoOptions onClick={handleOpenModalCalling} title={'Cadastrar Entidade'} />}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            setEntityOption(value)
            setDataCalling({ ...dataCalling, entity: value.id || "" })
          }}
          renderInput={(params) => (
            <TextField
              color="success"
              {...params}
              label="Entidade"
              sx={{
                color: "#237117",
                '& input': {
                  color: 'success.main',
                },
              }}
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
                <Grid item xs={2} lg={2} md={2} sm={2}>
                  <Box sx={{
                    width: "100%",
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}>
                    <IconButton onClick={() => handleDeleteEntityById(option.id)}>
                      <CloseOutlined sx={{ width: 20, height: 20 }} />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>

            </Box>
          )}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={types}
          value={groupOption}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            setGroupOption(value)
            setDataCalling({ ...dataCalling, calling_type: value.id || "" })
          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalTypes} title={'Cadastrar Tipo'} />}
          fullWidth
          renderInput={(params) => (
            <TextField
              color="success"
              {...params}
              label="Tipo"
              sx={{
                color: "#237117",
                '& input': {
                  color: 'success.main',
                },
              }}
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
                <Grid item xs={2} lg={2} md={2} sm={2}>
                  <Box sx={{
                    width: "100%",
                    display: 'flex',
                    justifyContent: "flex-end"
                  }}>
                    <IconButton onClick={() => handleDeleteByTypeId(option.id)}>
                      <CloseOutlined sx={{ width: 20, height: 20 }} />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>

            </Box>
          )}

        />
        <TextField
          value={dataCalling.date}
          name="date"
          onChange={handleChangeValues}
          type="date"
          label="Data"
          color='success'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          type="file"
          color='success'
          onChange={handleFileChange}
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
        }} onClick={handleCreateCalling}>
          Realizar Cadastro
        </Button>

      </Box>
      <CadastroModalCallingTypes open={openModalCadastroTypes} onClose={handleCloseModalTypes} getTypes={getDataTypes} />
      <ModalCadastroCallingEntity open={openModalCalling} onClose={handleCloseModalCalling} getEntity={getDataEntity} />
    </Box >
  );
};
