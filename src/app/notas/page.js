"use client"
import { Autocomplete, Box, Button, Drawer, Stack, TextField, Typography, styled, useMediaQuery, useTheme } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { CadastroNotas } from "@/Components/Modals/ModalCadastroNotas";
import { DocList } from "@/Components/List/DocList";

const BoxMain = styled('section')({
    maxWidth: '1300px',
    width: '85%',
    display: 'flex',
    flexDirection: "column",
    padding: '5px 10px'
});


const PageNotas = () => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
    // const isSmallScreen = useMediaQuery('(max-width: 1067px)');
    const [opt, setOpt] = useState(['Nome', 'CPF', 'Ordem', 'Livro', 'Livro Folha'])
    const [optService, setOptService] = useState(['Escrituras', 'Procuração', 'Substabelecimento', 'Divórcio',
        'Ata Notarial', 'Inventário'
    ])
    const [data, setData] = useState([
        {
            NomeFile: 'Arquivo 1',
            nameUser: 'Kauan',
            link: '/teste.pdf'
        },
        
    ])
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(!open)
    const handleClose = () => setOpen(!open)

    const BoxSearch = styled('div')({
        maxWidth: '100%',
        width: '100%',
        padding: '0px',
        display: "flex",
        gap: "30px",
        alignItems: 'center',
        flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
        flexDirection: isSmallScreen ? 'column' : 'row'
    });

    return (
        <Box sx={{
            width: '100%',
            height: "100vh",
            display: "flex",
            flexDirection: 'column',
            placeItems: 'center',
            gap: '10px'
        }}>
            <Typography fontSize={40} marginTop={13} fontWeight={'bold'} color={"black"}>
                Notas
            </Typography>
            <BoxMain >
                <BoxSearch>
                    <TextField label="Buscar" sx={{ width: isSmallScreen ? '100%' : 360 }} color="success" />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={opt}
                        sx={{ width: isSmallScreen ? '100%' : 360 }}
                        renderInput={(params) => (
                            <TextField
                                color="success"
                                InputProps={{
                                    ...params.InputProps,
                                    classes: {
                                        root: 'no-options-input',
                                    },
                                }}
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
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={optService}
                        sx={{ width: isSmallScreen ? '100%' : 360 }}
                        renderInput={(params) => (
                            <TextField
                                color="success"
                                InputProps={{
                                    ...params.InputProps,
                                    classes: {
                                        root: 'no-options-input',
                                    },
                                }}
                                {...params}
                                label="Buscar Tipo de Serviço"

                                sx={{
                                    color: "#237117",
                                    '& input': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        )}
                    />
                    <ButtonOpenModals onClick={handleOpen} />
                </BoxSearch>
                <DocList data={data} />
            </BoxMain>
            <Drawer anchor="left" open={true} onClose={handleClose}>
                <CadastroNotas onClose={handleClose} />
            </Drawer>
        </Box>
    );
}

export default PageNotas;
