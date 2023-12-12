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
    
    
    const [rows, setRows] = useState([
        { 
          id: 1, 
          prenotacao: '000001',
          caixa: 1,
          apresentante: '14276348000110',
          servico: 'Serviço 1',
          matricula: '14276348000110',
          arquivo: 'https://drive.google.com/file/d/1Uw9X7wXwXigimanH2d-G5rY4Uo-OOX3L/view?pli=1'
        },
        { 
          id: 2, 
          prenotacao: '000002',
          caixa: 2,
          apresentante: '14276348000110',
          servico: 'Serviço 2',
          matricula: '14276348000110',
          arquivo: 'https://drive.google.com/file/d/1xV4ubFGKXhluQtVUZEUROEK4_KxxF5OV/view'
        },
        { 
          id: 3, 
          prenotacao: '000003',
          caixa: 3,
          apresentante: '14276348000110',
          servico: 'Serviço 3',
          matricula: '14276348000110',
          arquivo: 'https://drive.google.com/file/d/1Uw9X7wXwXigimanH2d-G5rY4Uo-OOX3L/view'
        },
        // Adicione mais objetos conforme necessário
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', placeContent: 'center' }}>
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
                </div>
                <Button variant="contained" onClick={handleBuscar} sx={{
                    background: '#247117',
                    padding: '14px 10px',
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

export default LixeiraRGI
