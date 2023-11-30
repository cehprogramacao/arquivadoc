import Header from "@/Components/Header/Header"

import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { LixeiraTable } from "./tableLixeira"



const LixeiraProtestos = ({ data }) => {
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
          numero: '000001',
          caixa: '14276348000110',
          status: 'Ativo',
          tipo: 'Tipo 1',
          apresentante: '14276348000110',
          sacado: 'Sacado 1',
          devedor: 'Devedor 1',
          arquivo: 'https://link-arquivo-1.com'
        },
        { 
          id: 2, 
          numero: '000002',
          caixa: '14276348000110',
          status: 'Inativo',
          tipo: 'Tipo 2',
          apresentante: '14276348000110',
          sacado: 'Sacado 2',
          devedor: 'Devedor 2',
          arquivo: 'https://link-arquivo-2.com'
        },
        { 
          id: 3, 
          numero: '000003',
          caixa: '14276348000110',
          status: 'Ativo',
          tipo: 'Tipo 3',
          apresentante: '14276348000110',
          sacado: 'Sacado 3',
          devedor: 'Devedor 3',
          arquivo: 'https://link-arquivo-3.com'
        },
        { 
          id: 4, 
          numero: '000004',
          caixa: '14276348000110',
          status: 'Inativo',
          tipo: 'Tipo 4',
          apresentante: '14276348000110',
          sacado: 'Sacado 4',
          devedor: 'Devedor 4',
          arquivo: 'https://link-arquivo-4.com'
        },
        { 
          id: 5, 
          numero: '000005',
          caixa: '14276348000110',
          status: 'Ativo',
          tipo: 'Tipo 5',
          apresentante: '14276348000110',
          sacado: 'Sacado 5',
          devedor: 'Devedor 5',
          arquivo: 'https://link-arquivo-5.com'
        },
        { 
          id: 6, 
          numero: '000006',
          caixa: '14276348000110',
          status: 'Inativo',
          tipo: 'Tipo 6',
          apresentante: '14276348000110',
          sacado: 'Sacado 6',
          devedor: 'Devedor 6',
          arquivo: 'https://link-arquivo-6.com'
        },
        { 
          id: 7, 
          numero: '000007',
          caixa: '14276348000110',
          status: 'Ativo',
          tipo: 'Tipo 7',
          apresentante: '14276348000110',
          sacado: 'Sacado 7',
          devedor: 'Devedor 7',
          arquivo: 'https://link-arquivo-7.com'
        },
        { 
          id: 8, 
          numero: '000008',
          caixa: '14276348000110',
          status: 'Inativo',
          tipo: 'Tipo 8',
          apresentante: '14276348000110',
          sacado: 'Sacado 8',
          devedor: 'Devedor 8',
          arquivo: 'https://link-arquivo-8.com'
        },
        { 
          id: 9, 
          numero: '000009',
          caixa: '14276348000110',
          status: 'Ativo',
          tipo: 'Tipo 9',
          apresentante: '14276348000110',
          sacado: 'Sacado 9',
          devedor: 'Devedor 9',
          arquivo: 'https://link-arquivo-9.com'
        },
        { 
          id: 10, 
          numero: '000010',
          caixa: '14276348000110',
          status: 'Inativo',
          tipo: 'Tipo 10',
          apresentante: '14276348000110',
          sacado: 'Sacado 10',
          devedor: 'Devedor 10',
          arquivo: 'https://link-arquivo-10.com'
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
                flexDirection: isSmallScreen ? 'column' : 'row',
                placeContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, placeContent: 'center', flexWrap: 'wrap' }}>
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

export default LixeiraProtestos
