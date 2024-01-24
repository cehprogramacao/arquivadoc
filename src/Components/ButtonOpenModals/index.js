import React from 'react';
import IconButton from '@mui/material/IconButton';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Link from 'next/link';

export const ButtonOpenModals = ({ onClick }) => {
  return (

      <IconButton sx={{
        width: '60px',
        height: '50px',
        background: '#0088F0',
        borderRadius: '8px',
        border: '1px solid #0088F0',
        ":hover": {
          background: '#1485DB',
          '& svg': {
            fill: '#fff',
          },
        }
      }} onClick={onClick} >
        <ControlPointIcon sx={{
          fill: '#fff'
        }} />
      </IconButton>

  );
};
