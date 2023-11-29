
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";


export const CadastroNotaEscrituras = ({ onClose, onClickPartes }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = useState('')
  const [exisType, setExisType] = useState(false)


  const opt = ['Juninho Construtora', 'ADS Construtora', 'EP Engenharia LTDA']
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

  const handleChangeTypeService = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    const exists = tipos_escrituras.some((item) => item.label === inputValue);

    if (!exists && inputValue.trim() !== '') {
      setExisType(true);
    } else {
      setExisType(false);
    }
  };

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



  return (
    <Box sx={{
      width: isSmallScreen ? '300px' : "390px",
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
          Cadastro - Notas Escrituras
        </Typography>
        <button style={{
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
        }} onClick={onClose} >

        </button>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: isSmallScreen ? '20px' : '30px',
        height: "100vh",
        overflowY: 'auto'
      }}>
        <Button sx={{
          width: '169px',
          background: 'transparent',

          border: '1px solid #237117',
          boxShadow: 'none',
          textTransform: "capitalize",
          color: "#237117",
          borderRadius: '8px',
          ":hover": {
            background: '#237117',

            color: '#fff',
            boxShadow: 'none'
          }
        }} variant="contained" onClick={() => {
          onClose()
          onClickPartes()
        }}>
          Cadastrar Partes
        </Button>
        <TextField sx={{
          width: isSmallScreen ? '100%' : '360px',
          '& input': { color: 'success.main' },


        }}
          label="Número da ordem"
          type="number"
          color='success'
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={opt}
          sx={{ width: isSmallScreen ? '100%' : 360 }}
          renderInput={(params) => (
            <TextField
              color="success"
              {...params}
              label="Solicitado por"

              sx={{
                color: "#237117",
                '& input': {
                  color: 'success.main',
                },
              }}
            />
          )}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={tipos_escrituras}
          sx={{ width: isSmallScreen ? "100%" : 360 }}
          renderInput={(params) => (
            <TextField
              color="success"

              {...params}
              value={value}
              onChange={handleChangeTypeService}
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
        {exisType && (
          <TextField
            sx={{
              width: isSmallScreen ? "100%" : "360px",
              "& input": { color: "success.main" },
            }}
            label="Cadastre um novo serviço"
            type="text"
            required

            color="success"
          />
        )}
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
          label="Folhas"
          color='success'

        />
        {outorgantes.map((outorgante, index) => (
          <div key={index} style={{
            display: "flex",
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'start'
          }}>

            <TextField sx={{
              width: isSmallScreen ? '100%' : '360px',

            }}
              type="text"
              label="Outorgantes"
              color='success'
              value={outorgante}

              onChange={(e) => handleChange('outorgante', index, e.target.value)}
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
            <TextField
              sx={{
                width: isSmallScreen ? '100%' : '360px',

              }}
              type="text"
              label="Outorgados"
              value={outorgado}
              color="success"
              onChange={(e) => handleChange('outorgado', index, e.target.value)}
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
              backgroundColor: '#fff',
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
        }} onClick={(e) => console.log(e)}>
          Realizar Cadastro
        </Button>

      </Box>
    </Box >
  );
};
