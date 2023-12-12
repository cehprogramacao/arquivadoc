"use client"

import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { LixeiraTable } from "./tableLixeira"



const LixeiraTermos = ({ data }) => {
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
            label: 'Número'
        },
        {
            label: 'Caixa'
        },
    ];
    const [rows, setRows] = useState([
        { 
          id: 1, 
          numero: '8231', 
          caixa: 2, 
          parte: 'Alice Johnson', 
          cartao: '123456' 
        },
        { 
          id: 2, 
          numero: '1234', 
          caixa: 1, 
          parte: 'Bob Smith', 
          cartao: '234567' 
        },
        { 
          id: 3, 
          numero: '5678', 
          caixa: 3, 
          parte: 'Charlie Brown', 
          cartao: '345678' 
        },
        { 
          id: 4, 
          numero: '9876', 
          caixa: 4, 
          parte: 'David Lee', 
          cartao: '456789' 
        },
        { 
          id: 5, 
          numero: '5432', 
          caixa: 2, 
          parte: 'Eva Miller', 
          cartao: '567890' 
        },
        { 
          id: 6, 
          numero: '1122', 
          caixa: 1, 
          parte: 'Frank Wilson', 
          cartao: '678901' 
        },
        { 
          id: 7, 
          numero: '9988', 
          caixa: 3, 
          parte: 'Grace Davis', 
          cartao: '789012' 
        },
        { 
          id: 8, 
          numero: '6655', 
          caixa: 4, 
          parte: 'Henry Taylor', 
          cartao: '890123' 
        },
        { 
          id: 9, 
          numero: '4477', 
          caixa: 2, 
          parte: 'Ivy Thomas', 
          cartao: '901234' 
        },
        { 
          id: 10, 
          numero: '2255', 
          caixa: 1, 
          parte: 'Jack Robinson', 
          cartao: '012345' 
        },
      ]);
      
      

    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };
    const [select, setSelect] = useState(null);
    const [valueInput, setValueInput] = useState('')
    const handleBuscar = () => {

    };

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
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"} >
                Lixeira
            </Typography>
            <div style={{
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, placeContent: "center", flexWrap: 'wrap' }}>
                    <TextField label="Buscar"
                        sx={{
                            width: isSmallScreen ? '100%' : 400,
                            '& input': {
                                color: 'success.main',
                            },
                        }} color="success" />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 400 }}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                color="success"
                                label="Buscar Por"
                                onChange={(e) => {
                                    const selected = top100Films.find(
                                        (item) => item.label === e.target.value
                                    );
                                    setSelect(selected)
                                }}
                                sx={{
                                    color: "#237117",
                                    "& input": {
                                        color: "success.main",
                                    },
                                }}
                            />
                        )}
                    />
                </div>
                <Button variant="contained" onClick={handleBuscar} sx={{
                    background: '#247117',
                    padding: '14px 30px',
                    ":hover": {
                        background: '#247117'
                    }
                }}>
                    BUSCAR
                </Button>
            </div>
            <LixeiraTable data={rows} onClick={handleExcluir}/>
        </Box>
    )
}

export default LixeiraTermos
