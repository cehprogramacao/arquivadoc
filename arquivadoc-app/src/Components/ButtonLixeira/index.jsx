// Exemplo do componente ButtonLixeira
import React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export const ButtonLixeira = ({ onClick }) => {
  return (
    <IconButton sx={{
        width: '60px',
        height: '50px',
        background: 'transparent',
        borderRadius: '8px',
        border: '1px solid #FF0000',
        ":hover": {
            background: '#FF0000',
            '& svg': {
                fill: '#fff',
              },
        }
    }} onClick={onClick}>
      <DeleteIcon sx={{
        fill: '#FF0000'
      }}/>
    </IconButton>
  );
};
