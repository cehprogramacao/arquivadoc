"use client"
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const options = ['Option 1', 'Option 2', 'Option 3'];

const CustomAutocomplete = () => {
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    // Lógica para executar outra coisa quando o botão é clicado
    console.log('Botão clicado! Executar outra coisa...');
  };

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const renderNoOptions = () => {
    return (
      <button onClick={handleButtonClick} variant="contained" style={{background: '#237117'}}>
        Cadastrar Tag
      </button>
    );
  };

  return (
    <Autocomplete
    sx={{marginTop: 19}}
      value={inputValue}
      onChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} label="Escolha uma opção" />}
      renderOption={(props, option) => <li {...props}>{option}</li>}
      noOptionsText={renderNoOptions()}
    />
  );
};

export default CustomAutocomplete;

