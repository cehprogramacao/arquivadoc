import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import Calling from '@/services/calling.service';

const ModalCadastroCallingEntity = ({ onClose, open, getEntity }) => {

  const [data, setData] = useState({
    name:""
  })

  const handleCreateTypeEntity = async () => {
    const { createCallingEntity } = new Calling()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const response = await createCallingEntity(data, accessToken)
      getEntity()
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao adicionar endidade!', error)
      throw error;
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          width: {lg: 440, md: 440, sm: 400, xs: 350},
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
            Cadastro - Tipo de Entidade
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
          sx={{
            '& input': { color: 'success.main' },
            mb: 7
          }}
          value={data.name}
          onChange={(e) => setData({...data, name: e.target.value})}
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
            fontSize: '.9rem',
            alignSelf: "center",
            borderRadius: '5px',
            ':hover': {
              background: 'transparent',
              color: '#237117',
            },
          }}
          onClick={() => {
            onClose()
            handleCreateTypeEntity()
          }}
        >
          Realizar Cadastro
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalCadastroCallingEntity