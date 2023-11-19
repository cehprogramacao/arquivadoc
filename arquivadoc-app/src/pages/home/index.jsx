
import React from "react";
import { Search } from "@/Components/Search/Search";
import { DocList } from "@/Components/List/DocList";
import { Buttons } from "@/Components/Button/Button";
import Header from '@/Components/Header/Header'
import Box from "@mui/material/Box";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { useMediaQuery, useTheme } from '@mui/material';


const docs = [
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },
  {
    name: 'Ronaldo',
    text: 'Procuração'
  },

]
export const PageHome = () => {
  const [age, setAge] = useState('');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleChange = (event) => {
    setAge(event.target.value);
  };


  return (
    <Box className="" sx={{

      display: 'flex',
      flexDirection: 'column',
      padding: '30px 60px',
      gap: '20px',
      position: 'absolute',
      width: '100%',
      marginTop: 12,
    }}>
      <Header />
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: "wrap",
        placeContent: 'center'
      }}>
        <Search />
        <div style={{
          display: 'flex',
          gap: 50,
          alignItems: 'center',
          flexWrap: 'wrap',
          placeContent: 'center'
        }}>
          <FormControl sx={{ width: isSmallScreen ? '100%' : 200 }}>
            <InputLabel id="demo-simple-select-label" color="success">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              color="success"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <Buttons color={'green'} title={'Buscar'} onClick={() => alert('Oiii')} />
          <ButtonOpenModals />

        </div>
      </div>

      <Box sx={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column ',
          padding: '0px',
          gap: 'px',
          width: 'auto',
          height: '50px',
          position: 'relative',
        }}>
          <span style={{
            color: '#212121',
            fontWeight: '500'
          }}>Recentes</span>
          <span style={{
            color: '#B5B5C3'
          }}>More than 400+ new members</span>
        </div>
        <DocList data={docs} />
      </Box>

    </Box>
  );
};

