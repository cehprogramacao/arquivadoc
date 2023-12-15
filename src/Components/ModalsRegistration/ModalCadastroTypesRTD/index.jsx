
import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Typography, useMediaQuery, useTheme } from '@mui/material';

const ModalTypesRTD = ({ onClose, open }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          width: isSmallScreen ? '100%' : "440px",
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
            Cadastro - Tipo de RTD
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
          onClick={onClose}
        >
          Realizar Cadastro
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalTypesRTD