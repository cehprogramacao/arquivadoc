import { useMediaQuery, useTheme, TextField, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FilledInput from '@mui/material/FilledInput';


export const CadastroTermosModal = ({ onClose, onClickPartes }) => {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


  return (
    <Box sx={{
      width: isSmallScreen ? '300px' : "389px",
      height: '100vh',
      padding: '8px 10px',
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
        width: 'auto',
        gap: isSmallScreen ? '20px' : '26px',
        padding:'5px 0'
      }}>
        
        <TextField sx={{
          width: isSmallScreen ? '100%' : '370px',
          '& input': { color: 'success.main' },


        }}
          label="N° do Cartão"
          color='success'
        />
        <TextField sx={{
          width: isSmallScreen ? '100%' : '370px',
          '& input': { color: 'success.main' }
        }}
          label="N° da Caixa"
          color='success'
        />
        <TextField sx={{
          width: isSmallScreen ? '100%' : '370px',
          '& input': { color: 'success.main' },

          "::placeholder": {
            color: 'success.main'
          }
        }}
          label="Parte"
          color='success'
        />
        <TextField
          sx={{
            width: isSmallScreen ? '100%' : '370px',
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
        }}>
          Realizar Cadastro
        </Button>

      </Box>
    </Box >
  );
};
