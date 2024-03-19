"use client"
import { Autocomplete, Box, Button, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useState } from "react"
import { LixeiraTable } from "./tableLixeira"
import CustomContainer from "@/Components/CustomContainer"



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
            py: 15,
            px: 3
        }}>
            <CustomContainer>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                                Lixeira
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={5} md={5} sm={6} >
                                <TextField label="Buscar"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            color: 'success.main',
                                        },
                                    }} color="success" />
                            </Grid>
                            <Grid item xs={12} lg={5} md={5} sm={6} >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={top100Films}
                                    fullWidth
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
                            </Grid>
                            <Grid item xs={12} lg={2} md={2} sm={12}>
                                <Box sx={{
                                    display: "flex",
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: { lg: "flex-end", md: "flex-end", sm: "center", xs: "center" }
                                }}>
                                    <Button variant="contained" onClick={handleBuscar} sx={{
                                        background: '#247117',
                                        px: 5,
                                        py: "15px",
                                        ":hover": {
                                            background: '#247117'
                                        }
                                    }}>
                                        BUSCAR
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <LixeiraTable data={rows} onClick={handleExcluir} />
                    </Grid>
                </Grid>

            </CustomContainer>
        </Box>
    )
}

export default LixeiraProtestos
