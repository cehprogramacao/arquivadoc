import { useMediaQuery, useTheme, TextField, Button, Typography, IconButton, FormControl, OutlinedInput, Autocomplete } from "@mui/material";
import { Box } from "@mui/system";
import FilledInput from '@mui/material/FilledInput';
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import Customer from "@/services/customer.service";
import { useDispatch } from "react-redux";
import { SET_ALERT, showAlert } from "@/store/actions";
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";

const cpfMask = '999.999.999-99';
const cnpjMask = '99.999.999/9999-99';

const customerSv = new Customer();

export const CadastroTermosModal = ({ onClose, onClickPartes }) => {
  const dispatch = useDispatch()
  const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    customer_cpfcnpj: "",
    box: "",
    file_url: ""
  })
  const handleInputChange = (e) => {
    e.target.value?.replace(/\D/g, '').length < 11
      ? setCpfCnpjMask(cpfMask)
      : setCpfCnpjMask(cnpjMask);
    setData({ ...data, customer_cpfcnpj: e.target.value.replace(/[^\d]+/g, '') });
  };

  const handleInputBlur = () => {
    data.customer_cpfcnpj?.replace(/\D/g, '').length === 11 && setCpfCnpjMask(cpfMask);
  };
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


  const handleChangeData = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  const handleChangeFile = (e) => {
    const files = e.target.files[0]
    if (files) {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        let resultURL = fileReader.result.split(",")[1]
        setData((prev) => ({ ...prev, file_url: resultURL }))
      }
      fileReader.readAsDataURL(files)
    }
  }
  const handleCreateTerm = async () => {
    try {

      const response = await customerSv.createTermLGDP(data);
      dispatch({ type: SET_ALERT, message: "Termo cadastrado com sucesso!", severity: "success", actionType: "file" })
      return response;
    } catch (error) {
      dispatch({ type: SET_ALERT, message: "Erro ao cadastrar termo!", severity: "error", actionType: "file" })
      console.error("Error creating customer:", error);
      throw error;
    }
    finally {
      onClose()
      window.location.reload()
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

  const [presenter, setPresenter] = useState([])


  const getDataPresenter = async () => {
    try {
      const data = await customerSv.customers()
      setPresenter(Object.values(data))
      console.log(data, '21212')

    } catch (error) {
      console.error("Erro ao buscar clientes", error)
      throw error;
    }
  }
  useEffect(() => {
    getDataPresenter()
  }, [])


  return (
    <Box sx={{
      width: { lg: 350, md: 350, sm: 350, xs: 250 },
      height: '100vh',
      py: 2,
      px: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
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
          Cadastro - Termos
        </Typography>
        <IconButton sx={{
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
        width: 'auto',
        gap: isSmallScreen ? '20px' : '26px',
        padding: '5px 0'
      }}>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={presenter}
          fullWidth
          autoHighlight
          // value={data.customer_cpfcnpj}
          noOptionsText={<RenderNoOptions onClick={onClickPartes} title={'Cadastrar Cliente'} />}
          getOptionLabel={(option) => option.name || ""}
          onChange={(e, newValue) => setData({ ...data, customer_cpfcnpj: newValue.cpfcnpj })}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderInput={(params) => <TextField color="success" {...params} label="Apresentante"
            sx={{
              color: theme.palette.primary.main, '& input': {
                color: 'success.main',
              },
            }} />}
        />
        <TextField
          fullWidth
          value={data.box}
          onChange={handleChangeData}
          name="box"
          sx={{
            '& input': { color: 'success.main' }
          }}
          label="N° da Caixa"
          color='success'
        />

        <TextField
          fullWidth
          onChange={handleChangeFile}
          sx={{

            border: 'none',
            '::placeholder': {
              color: 'success.main',
            },
            '& .MuiInputBase-input': {
              display: 'block',
              width: '100%',
              padding: '0.9rem 0.75rem',
              fontSize: '1rem',
              fontWeight: 400,
              lineHeight: 1.5,
              backgroundColor: theme.palette.primary.white,
              backgroundClip: 'padding-box',
              border: '1px solid #ced4da',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              borderRadius: '0.375rem',
              transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInput-underline': {
              '&:before, &:after': {
                borderBottom: 'none',
              },
            },
          }}
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
          color: theme.palette.background.yellow,
          border: `1px solid ${theme.palette.background.yellow}`,
          padding: '6px 12px',
          textTransform: 'capitalize',
          fontSize: ".9rem",
          borderRadius: '8px',
          ":hover": {
            background: theme.palette.background.yellow,
            color: '#FFF',

          }
        }} onClick={handleScanFile}>
          Scannear Arquivos
        </Button>
        <Button sx={{
          display: 'flex',
          width: '169px',
          background: theme.palette.primary.main,
          color: '#fff',
          border: `1px solid ${theme.palette.primary.main}`,
          textTransform: 'capitalize',
          fontSize: ".9rem",
          borderRadius: '8px',
          ":hover": {
            background: 'transparent',
            color: theme.palette.primary.main,

          }
        }} onClick={handleCreateTerm}>
          Realizar Cadastro
        </Button>

      </Box>
    </Box >
  );
};
