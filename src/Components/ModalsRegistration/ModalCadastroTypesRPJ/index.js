import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux'
import RPJService from '@/services/rpj.service';
import { SET_ALERT, showAlert } from '@/store/actions';

const rpjSv = new RPJService()
const ModalTypesRPJ = ({ onClose, open, getData }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState({
    name: ""
  })


  const handleCreateTypeRpj = async () => {
    
    try {
      const response = await rpjSv.createRPJType(data)
      dispatch({type: SET_ALERT, message: "Tipo de RPJ cadastrado com sucesso!", alertType: "file", severity: "success"})
    } catch (error) {
      dispatch({type: SET_ALERT, message: "Erro ao criar tipo de rpj", alertType: "file", severity: "error"})
      console.error("Erro ao criar tipo de rpj", error)
      throw error;
    }
    finally {
      onClose()
      getData()
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          width: { md: 420, xs: "100%" },
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 250,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          display: "flex",
          flexDirection: 'column',
          gap: '0px',
          borderRadius: '20px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            sx={{
              color: "#000",
              fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
            }}
          >
            Cadastro - Tipo de RPJ
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          value={data.name}
          onChange={(e) => setData((state) => ({...state, name: e.target.value}))}
          sx={{
            '& input': { color: 'success.main' },
            mb: 7
          }}
          label="Nome"
          color="success"
        />

        <Button
          sx={{
            display: 'flex',
            width: 'max-content',
            background: '#237117',
            color: '#fff',
            border: '1px solid #237117',
            textTransform: 'capitalize',
            fontSize: '.9rem',
            alignSelf: "center",
            borderRadius: '5px',
            ':hover': {
              background: 'transparent',
              color: '#237117',
            },
          }}
          onClick={handleCreateTypeRpj}
        >
          Realizar Cadastro
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalTypesRPJ