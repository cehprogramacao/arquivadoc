import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import NoteService from '@/services/notes.service';

export const ModalNotesTag = ({ onClose, open, getData }) => {
  const [data, setData] = useState({
    name: ""
  })
  const handleCreateTag = async () => {
    const { createNoteTag } = new NoteService()
    try {
      const accessToken = sessionStorage.getItem("accessToken")
      const response = await createNoteTag(data, accessToken)
    } catch (error) {
      console.error("Erro ao criar tag", error)
      throw error;
    }
    finally {
      getData()
      onClose()
    }
  }


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          width: { md: 440, xs: '100%' },
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
            }}
          >
            Cadastro - Tag
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
          onChange={(e) => setData((prev) => ({...prev, name: e.target.value}))}
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
            background: '#237117',
            alignItems: "center",
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
          onClick={handleCreateTag}
        >
          Realizar Cadastro
        </Button>
      </Box>
    </Modal>
  );
};
