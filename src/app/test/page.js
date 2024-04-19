"use client"
import { useState } from 'react';
import { Autocomplete, TextField, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
    const [autocompletes, setAutocompletes] = useState([{ value: null }]);

    const handleChange = (index, newValue) => {
        const newAutocompletes = [...autocompletes];
        newAutocompletes[index] = { value: newValue };
        setAutocompletes(newAutocompletes);
    };

    const handleAdd = () => {
        setAutocompletes([...autocompletes, { value: null }]);
    };

    const handleRemove = (index) => {
        if (autocompletes.length > 1) {
            const newAutocompletes = autocompletes.filter((_, idx) => idx !== index);
            setAutocompletes(newAutocompletes);
        }
    };

    // Simulação de opções para Autocomplete
    const options = [
        { name: "Pessoa 1", cpfcnpj: "123" },
        { name: "Pessoa 2", cpfcnpj: "456" },
        { name: "Pessoa 3", cpfcnpj: "789" }
    ];

    return (
        <Box sx={{ width: 300, margin: 'auto', mt: 5 }}>
            {autocompletes.map((item, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                    <Autocomplete
                        value={item.value}
                        onChange={(event, newValue) => handleChange(index, newValue)}
                        options={options}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Outorgantes"
                                color="success"
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option.cpfcnpj}>
                                {option.name}
                            </li>
                        )}
                    />
                    <Box sx={{ display: "flex", gap: "9px", marginTop: '8px' }}>
                        <IconButton
                            onClick={handleAdd}
                            sx={{
                                width: 30,
                                height: 30,
                                background: "#237117",
                                color: "#fff",
                                border: "none",
                                borderRadius: "3px",
                                cursor: 'pointer'
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleRemove(index)}
                            sx={{
                                width: 30,
                                height: 30,
                                background: "#237117",
                                color: "#fff",
                                border: "none",
                                borderRadius: "3px",
                                cursor: 'pointer'
                            }}
                            disabled={autocompletes.length === 1}
                        >
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

