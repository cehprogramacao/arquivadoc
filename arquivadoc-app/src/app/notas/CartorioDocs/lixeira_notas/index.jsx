
import Header from "@/Components/Header/Header"

import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useState } from "react"

import { LixeiraTable } from "./tableLixeira"



const LixeiraNotas = ({ data }) => {
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
          ordem: 'Ordem 1',
          solicitacao: 'Solicitação 1',
          tipoDeServico: 'Tipo de Serviço 1',
          livro: 'Livro 1',
          folhas: 'Folhas 1',
          outorgantes: 'Outorgantes 1',
          outorgados: 'Outorgados 1',
        },
        { 
          id: 2, 
          ordem: 'Ordem 2',
          solicitacao: 'Solicitação 2',
          tipoDeServico: 'Tipo de Serviço 2',
          livro: 'Livro 2',
          folhas: 'Folhas 2',
          outorgantes: 'Outorgantes 2',
          outorgados: 'Outorgados 2',
        },
        { 
          id: 3, 
          ordem: 'Ordem 3',
          solicitacao: 'Solicitação 3',
          tipoDeServico: 'Tipo de Serviço 3',
          livro: 'Livro 3',
          folhas: 'Folhas 3',
          outorgantes: 'Outorgantes 3',
          outorgados: 'Outorgados 3',
        },
        { 
          id: 4, 
          ordem: 'Ordem 4',
          solicitacao: 'Solicitação 4',
          tipoDeServico: 'Tipo de Serviço 4',
          livro: 'Livro 4',
          folhas: 'Folhas 4',
          outorgantes: 'Outorgantes 4',
          outorgados: 'Outorgados 4',
        },
        { 
          id: 5, 
          ordem: 'Ordem 5',
          solicitacao: 'Solicitação 5',
          tipoDeServico: 'Tipo de Serviço 5',
          livro: 'Livro 5',
          folhas: 'Folhas 5',
          outorgantes: 'Outorgantes 5',
          outorgados: 'Outorgados 5',
        },
        { 
          id: 6, 
          ordem: 'Ordem 6',
          solicitacao: 'Solicitação 6',
          tipoDeServico: 'Tipo de Serviço 6',
          livro: 'Livro 6',
          folhas: 'Folhas 6',
          outorgantes: 'Outorgantes 6',
          outorgados: 'Outorgados 6',
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
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} >
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
                    <TextField label="Buscar"
                        sx={{
                            width: isSmallScreen ? '100%' : 450,
                            '& input': {
                                color: 'success.main',
                            },
                        }} color="success" />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: isSmallScreen ? '100%' : 450 }}
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

export default LixeiraNotas
