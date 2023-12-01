"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useState } from "react"
import { LixeiraTable } from "./tableLixeira"



const LixeiraRPJ = ({ data }) => {
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
            registro: '000001',
            protocolo: '14276',
            caixa: '001',
            apresentante: 'Apresentante 1',
            livro: '02',
            folhas: '64',
            arquivo: 'https://link-arquivo-1.com'
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
            <LixeiraTable data={rows} onClick={handleExcluir} />
        </Box>
    )
}

export default LixeiraRPJ
