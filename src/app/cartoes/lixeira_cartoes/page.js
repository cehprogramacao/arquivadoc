"use client"
import Header from "@/Components/Header/Header"

import { Autocomplete, Box, Button, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"

import { LixeiraTable } from "./tableLixeira"
import { DocList } from "@/Components/List/DocList"
import ModalList from "@/Components/Modals/ModalList"



const LixeiraCartoes = ({ data }) => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    const docs = [
        {
            NameFile: 'Procuração',
            nomeUser: 'Kauan',
            link:'/teste.pdf'
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
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
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
                placeContent: "center",
                flexDirection: isSmallScreen ? 'column' : 'row'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', placeContent: 'center' }}>
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
                    width: 'max-content',
                    padding: '14px 28px',
                    ":hover": {
                        background: '#247117'
                    }
                }}>
                    BUSCAR
                </Button>
            </div>
            <DocList data={docs[0]} />
            <ModalList data={docs[0]} link={docs[0].link} />
        </Box>
    )
}

export default LixeiraCartoes
