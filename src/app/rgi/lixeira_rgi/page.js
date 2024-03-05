"use client"
import { Autocomplete, Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import { LixeiraTable } from "./tableLixeira"




const LixeiraRGI = ({ data }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const docs = [
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },


    ]
    const top100Films = [
        {
            label: 'Prenotação'
        },
        {
            label: 'Matrícula '
        },
        {
            label: 'Caixa'
        },
        {
            label: 'Apresentante(documento)'
        }
    ];
    
    
    const [rows, setRows] = useState([]);
      
    const getData = () => {
        
    }

    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };
    const [select, setSelect] = useState(null);
    const [valueInput, setValueInput] = useState('')
    

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            marginTop: 11,
            position: 'relative',
            padding: '30px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            placeItems: 'center'
        }}>
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"} >
                Lixeira
            </Typography>
            <Box sx={{
                maxWidth: '1200px',
                height: 'auto',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                flexWrap: 'wrap',
                placeContent: 'center',
                flexDirection: isSmallScreen ? 'column' : 'row'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', placeContent: 'center' }}>
                <TextField
                        label="Buscar"
                        sx={{ width: isSmallScreen ? '100%' : 450, '& input': { color: 'success.main' } }}
                        color="success"
                    />
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={top100Films}
                            sx={{ width: isSmallScreen ? '100%' : 450}}
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
                </Box>
                <Button variant="contained" onClick={handleBuscar} sx={{
                    background: '#247117',
                    padding: '14px 10px',
                    ":hover": {
                        background: '#247117'
                    }
                }}>
                    BUSCAR
                </Button>
            </Box>
            <LixeiraTable data={rows} onClick={handleExcluir}/>
        </Box>
    )
}

export default LixeiraRGI
