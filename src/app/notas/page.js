"use client"
import { Autocomplete, Box, Button, Drawer, Stack, TextField, Typography, styled, useMediaQuery, useTheme, Grid } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState } from "react";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import { CadastroNotas } from "@/Components/Modals/ModalCadastroNotas";
import { DocList } from "@/Components/List/DocList";
import { ButtonLixeira } from "@/Components/ButtonLixeira";
import CustomContainer from "@/Components/CustomContainer";

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
            display: "flex",
            flexDirection: 'column',
            placeItems: 'center',
            py: 5,
            px: 3
        }}>
            <CustomContainer >
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <Box sx={{
                            width: "100%",
                            display: 'flex',
                            justifyContent: "center"
                        }}>
                            <Typography fontSize={40} fontWeight={'bold'} color={"black"}>
                                Notas
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={5}>
                            <Grid item xs={12} lg={4} md={4} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Buscar"
                                    color="success" />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={opt}
                                    fullWidth
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
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={optService}
                                    fullWidth
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
                            </Grid>
                            <Grid item xs={12} lg={2} md={12} sm={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 4
                                }}>
                                    <ButtonOpenModals onClick={handleOpen} />
                                    <ButtonLixeira href={"/notas/lixeira_notas"} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <DocList data={data} />
                    </Grid>
                </Grid>
            </CustomContainer>
            <Drawer anchor="left" open={open} onClose={handleClose}>
                <CadastroNotas onClose={handleClose} />
            </Drawer>
        </Box>
    );
}

export default PageNotas;
