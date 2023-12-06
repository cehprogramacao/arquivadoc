"use client"
import React, { useEffect } from "react";
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
import { Autocomplete, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import ModalList from "@/Components/Modals/ModalList";



const Page = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreenWrap = useMediaQuery(theme.breakpoints.down('lg'));
  const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false)
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const [list, setList] = useState([]);
  const [temp, setTemp] = useState(null)
  const handleOpenModalListFilePDF = (index) => {
    setTemp(index)
    setOpenModalListFilePDF(true)

  }
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3004/');
      if (response.ok) {
        const data = await response.json();
        setList(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();

  }, []);
  const handleCloseModalListFilePDF = () => {
    setOpenModalListFilePDF(false)
  }

  return (
    <Box className="" sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '27px',
      position: 'absolute',
      width: '100%',
      marginTop: 12,
      placeItems: 'center',
      padding: "50px 60px"
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: "column",
        gap: '20px',

      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          padding: '0 40px ',
          placeContent: "center",
          flexWrap: 'wrap',
          flexDirection: isSmallScreenWrap ? 'column' : 'row',
          alignItems: 'center',
          padding: '0 20px',
        }}>
          <TextField
            label="Buscar"
            sx={{ width: isSmallScreen ? '100%' : 500, '& input': { color: 'success.main' } }}
            color="success"
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={['CPF', 'CNPJ']}
            sx={{ width: isSmallScreen ? '100%' : 500 }}
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
          <Stack>
            <Buttons color={'green'} title={'Buscar'} onClick={() => alert('Oiii')} />
          </Stack>
        </div>

        <Typography sx={{
          width: "max-content",
          display: "flex",
          flexDirection: "column",
          gap: "0px",
          color: '#C2C2C2',
          fontWeight: '500',
          padding: '0 40px'
        }}>
          <span style={{
            fontSize: "1.3rem",
            color: '#000',
            fontWeight: "bold"
          }}>
            Recentes
          </span>
          More than {list.length} new members
        </Typography>
      </Box>
      <DocList data={list} onClick={handleOpenModalListFilePDF} />
      <ModalList data={list} link={list[temp]?.data} onClose={handleCloseModalListFilePDF} open={openModalListFilePDF} />
    </Box>
  );
};

export default Page

