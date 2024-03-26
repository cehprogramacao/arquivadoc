import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import Customer from "@/services/customer.service";
import ProtestService from "@/services/protest.service";
import { showAlert } from "@/store/actions";
import { CloseOutlined } from "@mui/icons-material";
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as randomUUID } from "uuid";

export const CadastroProtesto = ({ onClose, onClickPartes, getData }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState({
    notation: 0,
    box: 0,
    presenter: null,
    drawee: null,
    debtor: null,
    situation: "",
    file_url: ""
  })
  const [presenter, setPresenter] = useState([])
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const optipos = [
    {
      label: 'Protestado'
    },
    {
      label: 'Cancelado'
    },
    {
      label: 'Sustado'
    },
  ]

  const handleChangeValues = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }
  const getDataPresenter = async () => {
    const { customers } = new Customer()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const { data } = await customers(accessToken)
      setPresenter(Object.values(data))
    } catch (error) {
      console.error("Erro ao buscar clientes", error)
      throw new Error('Erro ao buscar clientes')
    }
  }
  const handleChangeFiles = (e) => {
    const files = e.target.files[0]
    if (files) {
      const fileReader = new FileReader()
      fileReader.onloadend = () => {
        const fileResult = fileReader.result.split(',')[1]
        setData((prev) => ({ ...prev, file_url: fileResult }))
      }
      fileReader.readAsDataURL(files)
    }
  }
  const handleCreateProtest = async () => {
    const { createProtest } = new ProtestService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const response = await createProtest(data, accessToken)
      console.log(response.data)
      dispatch(showAlert(response.data.message, "success", "file"))
    } catch (error) {
      dispatch(showAlert(error.msg, "error", "file"))
      console.error("Erro ao criar protesto!", error)
      throw new Error("Erro ao criar protesto!")
    }
    finally {
      onClose()
    }
  }
  useEffect(() => {
    getDataPresenter()
  }, [])


  return (
    <Box sx={{
      width: isSmallScreen ? '320px' : "409px",
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
          Cadastro - Protestos
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
          sx={{
            '& input': { color: 'success.main' },
          }}
          value={data.notation}
          name="notation"
          onChange={handleChangeValues}
          label="Apontamento"
          type="number"
          color='success'
        />
        <TextField
          fullWidth
          sx={{
            '& input': { color: 'success.main' }
          }}
          value={data.box}
          name="box"
          onChange={handleChangeValues}
          label="N° da Caixa"
          type="number"
          color='success'
        />

        <Autocomplete
          disablePortal
          key="presenter-autocomplete"
          id="combo-box-demo"
          options={presenter}
          autoHighlight
          getOptionLabel={(option) => option.name}
          noOptionsText={<RenderNoOptions title={'Cadastrar Apresentante'} onClick={onClickPartes} />}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, presenter: value.cpfcnpj }))
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props} key={`${randomUUID()}-presenter`}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.name}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {option.cpfcnpj}
              </Typography>
            </Box>
          )}
          fullWidth
          renderInput={(params) => <TextField color="success" {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
            label="Apresentante"
            sx={{
              color: "#237117", '& input': {
                color: 'success.main',
              },
            }} />}
        />
        <Autocomplete
          key="drawee-autocomplete"
          disablePortal
          id="combo-box-demo"
          options={presenter}
          autoHighlight
          noOptionsText={<RenderNoOptions title={'Cadastrar Sacado'} onClick={onClickPartes} />}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, drawee: value.cpfcnpj }))
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props} key={`${randomUUID()}-drawee`}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.name}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {option.cpfcnpj}
              </Typography>
            </Box>
          )}
          fullWidth
          renderInput={(params) => <TextField color="success" {...params}


            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
            label="Sacado"
            sx={{
              color: "#237117", '& input': {
                color: 'success.main',
              },
            }} />}
        />
        <Autocomplete
          key="debtor-autocomplete"
          disablePortal
          id="combo-box-demo"
          options={presenter}
          autoHighlight
          getOptionLabel={(option) => option.name}
          noOptionsText={<RenderNoOptions title={'Cadastrar Devedor'} onClick={onClickPartes} />}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, debtor: value.cpfcnpj }))
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props} key={`${randomUUID()}-debtor`}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.name}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {option.cpfcnpj}
              </Typography>
            </Box>
          )}
          fullWidth
          renderInput={(params) => <TextField color="success" {...params}


            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
            label="Devedor"
            sx={{
              color: "#237117", '& input': {
                color: 'success.main',
              },
            }} />}
        />
        <Autocomplete
          disablePortal
          key="situation-autocomplete"
          id="combo-box-demo"
          options={optipos}
          fullWidth
          isOptionEqualToValue={(option, value) => option.label === value.label}
          getOptionLabel={option => option.label}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, situation: value.label }))
          }}
          renderInput={(params) => (
            <TextField
              color="success"
              {...params}
              label="Situação"
              placeholder="Escolha uma opção"
              sx={{
                color: "#237117",
                '& input': {
                  color: 'success.main',
                },
              }}
            />
          )}
        />
        <TextField
          fullWidth
          type="file"
          color='success'
          onChange={handleChangeFiles}
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
        }} onClick={handleCreateProtest}>
          Realizar Cadastro
        </Button>

      </Box>
    </Box >
  );
};
