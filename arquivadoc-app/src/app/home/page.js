"use client"
import React from "react";
import { Search } from "@/Components/Search/Search";
import { DocList } from "@/Components/List/DocList";
import { Buttons } from "@/Components/Button/Button";
import Box from "@mui/material/Box";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { Autocomplete, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';



const Page = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const docs = [
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' }, 
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' }, 
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' },
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' },
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' },
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' }, 
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' },
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' }, 
    { name: 'Ronaldo', text: 'Procuração' }, { name: 'Ronaldo', text: 'Procuração' }, 
    { name: 'Ronaldo', text: 'Procuração' },

  ]

  return (
    <Box className="" sx={{

      display: 'flex',
      flexDirection: 'column',
      padding: '30px 60px',
      gap: '27px',
      position: 'absolute',
      width: 'auto',
      marginTop: 12,
    }}>
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: "wrap",
        placeContent: 'center'
      }}>

        <div style={{
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          flexWrap: 'wrap',
          placeContent: 'center',

        }}>
          <TextField
            label="Buscar"
            sx={{ width: isSmallScreen ? '100%' : 400, '& input': { color: 'success.main' } }}
            color="success"
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={['CPF', 'CNPJ']}
            sx={{ width: isSmallScreen ? '100%' : 400 }}
            renderInput={(params) => (
              <TextField
                color="success"
                {...params}
                label="Buscar Por"
                
                sx={{
                  color: "#237117",
                  '& input': {
                    color: 'success.main',
                  },
                }}
              />
            )}
          />
        </div>
        <Buttons color={'green'} title={'Buscar'} onClick={() => alert('Oiii')} />
      </div>

      <Typography sx={{
        width:"max-content",
        display:"flex",
        flexDirection:"column",
        gap: "0px",
        color:'#C2C2C2',
        fontWeight:'500',
        padding:'0 40px'
      }}>
        <span style={{
          fontSize:"1.3rem",
          color:'#000',
          fontWeight:"bold"
        }}>
          Recentes
        </span>
        More than {'400'} new members
      </Typography>
      <DocList data={docs} />
    </Box>
  );
};

export default Page

