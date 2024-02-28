"use client"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useState } from "react"
import { Buttons } from "@/Components/Button/Button"
import { UserTable } from "./tableUser/table"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import Link from "next/link"
import withIsAdmin from "@/utils/isAdmin"
import CustomContainer from "@/Components/CustomContainer"


const PageUsuarios = ({ data }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const top100Films = [
        {
            label: 'Número'
        },
        {
            label: 'Caixa'
        },
    ];

    const [rows, setRows] = useState([
        { id: 1, nome: 'Kauan BrTech', email: 'kauandasilva@brtech.dev', setor: 'admin' },
        { id: 2, nome: 'Kauan BrTech', email: 'kauandasilva@brtech.dev', setor: 'admin' },
        { id: 3, nome: 'Kauan BrTech', email: 'kauandasilva@brtech.dev', setor: 'admin' }
    ]);

    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            py: 14,
            px: 3
        }}>
            <CustomContainer>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Typography fontSize={30} fontWeight={'bold'} color={"black"}>
                                Usuários
                            </Typography>

                        </Box>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={5} md={5} sm={6}>
                                <TextField label="Buscar"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            color: 'success.main',
                                        },
                                    }} color="success" />
                            </Grid>
                            <Grid item xs={12} lg={5} md={5} sm={6}>
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
                            <Grid item xs={12} lg={2} md={2} sm={12} >
                                <Box sx={{
                                    display: 'flex',
                                    width: '100%',
                                    gap: "10px",
                                    justifyContent:"center"
                                }}>
                                    <Buttons color={'green'} title={'Buscar'} />
                                    <Link href={"/addUser"}>
                                        <ButtonOpenModals />
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <UserTable data={rows} onClick={handleExcluir} />
                    </Grid>
                </Grid>
            </CustomContainer>
        </Box>
    )
}

export default withIsAdmin(PageUsuarios)