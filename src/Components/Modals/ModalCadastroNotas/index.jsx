
import { ModalNotesTag } from "@/Components/ModalsRegistration/ModalNotesTag";
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import renderNoOptions from "@/Components/ButtonOpenModalCadastro";
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";


export const CadastroNotas = ({ onClose, onClickPartes }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const BoxMain = styled('main')({
    width: isSmallScreen ? '350px' : "409px",
    height: '100vh',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    overflow: 'hidden'
  })
  const BoxSearchTitle = styled("div")({
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  })
  const ButtonClose = styled("button")({
    boxSizing: 'content-box',
    width: '1em',
    height: '1em',
    padding: '0.25em 0.25em',
    color: '#000',
    border: 0,
    background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23000\'%3e%3cpath d=\'M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z\'/%3e%3c/svg%3e")',
    borderRadius: '0.375rem',
    opacity: '.5',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1',
    },
  })
  const ButtonScanner = styled("button")({
    display: 'flex',
    width: 'max-content',
    background: 'transparent',
    color: '#FFC117',
    border: '1px solid #FFC117',
    padding: '10px 15px',
    textTransform: 'capitalize',
    fontSize: ".9rem",
    borderRadius: '8px',
    ":hover": {
      background: "#FFC117",
      color: '#FFF',

    }
  })
  const ButtonCadastrar = styled("button")({
    display: 'flex',
    width: 'max-content',
    background: "#237117",
    color: '#fff',
    padding: "10px 18px",
    textAlign: 'center',
    border: '1px solid #237117',
    textTransform: 'capitalize',
    fontSize: ".9rem",
    borderRadius: '8px',
    ":hover": {
      background: 'transparent',
      color: '#237117',

    }
  })
  const BoxInputs = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: isSmallScreen ? '20px' : '30px',
    height: "100vh",
    overflowY: 'auto',
    padding: '5px 0'
  })
  const [value, setValue] = useState('')
  const [exisType, setExisType] = useState(false)


  const opt = [
    {
      id: 1,
      label: 'Juninho Construtora'
    },
    {
      id: 1,
      label: 'ADS Construtora'
    },
    {
      id: 1,
      label: 'EP Engenharia LTDA'
    }
  ]
  const tipos_escrituras = [
    {
      label: 'Compra e Venda'
    },
    {
      label: 'Declatória',
    },
    {
      label: 'Doação',
    },
    {
      label: 'Rerratificação',
    },
    {
      label: 'Revogação',
    },
    {
      label: 'Aditamento',
    },
  ];
  const optapresentante = [
    {
      numero: '3333', label: 'Guaiuba Construtora'
    }
  ]


  const [outorgantes, setOutorgantes] = useState(['']);
  const [outorgados, setOutorgados] = useState(['']);

  const adicionarInput = (tipo) => {
    if (tipo === 'outorgante') {
      setOutorgantes([...outorgantes, '']);
    } else if (tipo === 'outorgado') {
      setOutorgados([...outorgados, '']);
    }
  };

  const removerInput = (tipo, index) => {
    if (tipo === 'outorgante') {
      const novosOutorgantes = [...outorgantes];
      novosOutorgantes.splice(index, 1);
      setOutorgantes(novosOutorgantes);
    } else if (tipo === 'outorgado') {
      const novosOutorgados = [...outorgados];
      novosOutorgados.splice(index, 1);
      setOutorgados(novosOutorgados);
    }
  };

  const handleChange = (tipo, index, valor) => {
    if (tipo === 'outorgante') {
      const novosOutorgantes = [...outorgantes];
      novosOutorgantes[index] = valor;
      setOutorgantes(novosOutorgantes);
    } else if (tipo === 'outorgado') {
      const novosOutorgados = [...outorgados];
      novosOutorgados[index] = valor;
      setOutorgados(novosOutorgados);
    }
  };
  const [open, setOpen] = useState(false);
  const [openApresentante, setOpenApresentante] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [inputValueApresentante, setInputValueApresentante] = useState('')
  const handleOpenModalTag = () => {
    setOpen(!open)
  };
  const handleCloseModalTag = () => {
    setOpen(!open)
  }
  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };
  const handleInputChangeApresentante = (event, newValue) => {
    setInputValueApresentante(newValue);
  };
  const handleOpenModalApresentante = () => {
    setOpenApresentante(!openApresentante)
  };
  const handleCloseModalApresentante = () => {
    setOpenApresentante(!openApresentante)
  }

  return (
    <BoxMain>
      <BoxSearchTitle >
        <Typography sx={{
          fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
        }}>
          Cadastro - Notas Escrituras
        </Typography>
        <ButtonClose onClick={onClose} />
      </BoxSearchTitle>
      <BoxInputs>

        <TextField sx={{
          width: isSmallScreen ? '100%' : '360px',
          '& input': { color: 'success.main' },


        }}
          label="Ordem"
          type="text"
          color='success'
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={opt}
          sx={{ width: isSmallScreen ? '100%' : '360px' }}
          value={inputValue}
          onChange={handleInputChange}
          getOptionLabel={(option) => option ? option.label : ''}
          renderInput={(params) => <TextField {...params} color="success" label="Tag" />}
          renderOption={(props, option) => (
            <li key={option.id} {...props}>{option.label}</li> // Use option.label aqui
          )}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalTag} title="Cadastrar Tag" />}
        />

        <Autocomplete
          disablePortal
          options={optapresentante}
          autoHighlight
          value={inputValueApresentante}
          onChange={handleInputChangeApresentante}
          getOptionLabel={(option) => (option && option.numero ? option.numero : option ? option.label : "")}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalApresentante} title="Cadastrar Partes" />}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.numero}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {option.label}
              </Typography>
            </Box>
          )}
          sx={{ width: isSmallScreen ? '100%' : 360 }}
          filterOptions={(options, { inputValue }) => {
            const filteredOptions = options.filter(
              (option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                option.numero.toString().includes(inputValue)
            );
            return filteredOptions;
          }}
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
          disablePortal
          options={tipos_escrituras}


          sx={{ width: isSmallScreen ? "100%" : 360 }}
          renderInput={(params) => (
            <TextField
              color="success"
              InputProps={{
                ...params.InputProps,
                classes: {
                  root: 'no-options-input',
                },
              }}
              {...params}
              label="Tipo de serviço"
              sx={{
                color: "#237117",
                "& input": {
                  color: "success.main",
                },
              }}
            />
          )}
        />
        <TextField sx={{
          width: isSmallScreen ? '100%' : '360px',
          '& input': { color: 'success.main' },


        }}
          label="Livro"
          type="number"
          color='success'

        />

        <TextField sx={{
          width: isSmallScreen ? '100%' : '360px',

        }}
          type="text"
          label="Folha inicial"
          color='success'

        />
        <TextField sx={{
          width: isSmallScreen ? '100%' : '360px',

        }}
          type="text"
          label="Folha final"
          color='success'

        />
        {outorgantes.map((outorgante, index) => (
          <div key={index} style={{
            display: "flex",
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'start'
          }}>
            <Autocomplete
              disablePortal


              options={['kauan', 'ronaldo']}
              value={outorgante}
              onChange={(e, newValue) => handleChange('outorgante', index, newValue)}
              getOptionLabel={(option) => option ? option : ''}
              sx={{ width: isSmallScreen ? "100%" : 360 }}
              renderInput={(params) => (
                <TextField

                  color="success"
                  InputProps={{
                    ...params.InputProps,
                    classes: {
                      root: 'no-options-input',
                    },
                  }}
                  {...params}
                  label="Tipo de serviço"
                  sx={{
                    color: "#237117",
                    "& input": {
                      color: "success.main",
                    },
                  }}
                />
              )}
            />
            <div style={{ display: 'flex', gap: '9px' }}>
              <button style={{
                background: "#237117", color: '#fff', border: 'none', padding: '5px 13px',
                borderRadius: '3px'
              }} onClick={() => adicionarInput('outorgante')}>+</button>
              {index > 0 && <button style={{
                background: "#237117", color: '#fff', border: 'none', padding: '5px 13px',
                borderRadius: '3px'
              }} onClick={() => removerInput('outorgante', index)}>-</button>}
            </div>
          </div>
        ))}
        {outorgados.map((outorgado, index) => (
          <div key={index} style={{
            display: "flex",
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'start'
          }}>
            <Autocomplete
              disablePortal


              options={['kauan', 'ronaldo']}
              value={outorgado}
              onChange={(e, newValue) => handleChange('outorgado', index, newValue)}
              getOptionLabel={(option) => option ? option : ''}

              sx={{ width: isSmallScreen ? "100%" : 360 }}
              renderInput={(params) => (
                <TextField
                  color="success"
                  InputProps={{
                    ...params.InputProps,
                    classes: {
                      root: 'no-options-input',
                    },
                  }}
                  {...params}
                  label="Tipo de serviço"
                  sx={{
                    color: "#237117",
                    "& input": {
                      color: "success.main",
                    },
                  }}
                />
              )}
            />
            <div style={{ display: 'flex', gap: '9px' }}>
              <button style={{
                background: "#237117", color: '#fff', border: 'none', padding: '5px 13px',
                borderRadius: '3px'
              }} onClick={() => adicionarInput('outorgado')}>+</button>
              {index > 0 && <button style={{
                background: "#237117", color: '#fff', border: 'none', padding: '5px 13px',
                borderRadius: '3px'
              }}
                onClick={() => removerInput('outorgado', index)}>-</button>}
            </div>
          </div>
        ))}
        <TextField
          sx={{
            width: isSmallScreen ? '100%' : '360px',
          }}
          type="file"
          color='success'
          InputLabelProps={{
            shrink: true,
          }}

        />
        <ButtonScanner >
          Scannear Arquivos
        </ButtonScanner>
        <ButtonCadastrar onClick={(e) => console.log(e)}>
          Realizar Cadastro
        </ButtonCadastrar>

      </BoxInputs>
      {/* <ModalNotesTag open={open} onClose={handleCloseModalTag} />
      <CadastroPartes onClose={handleCloseModalApresentante} open={openApresentante} /> */}
    </BoxMain >
  );
};
