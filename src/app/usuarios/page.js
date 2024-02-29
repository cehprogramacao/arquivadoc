"use client"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { Buttons } from "@/Components/Button/Button"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import Link from "next/link"
import withIsAdmin from "@/utils/isAdmin"
import CustomContainer from "@/Components/CustomContainer"
import User from "@/services/user.service"
import TableComponente, { UserTable } from "./tableUser"
import Loading from "@/Components/loading"


const PageUsuarios = () => {
    const [dataRows, setDataRows] = useState([])
    const [loading, setLoading] = useState(false)
    const getUsers = async () => {
        const user = new User();
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken");
            const response = await user.getUsers(accessToken)
            console.log(response.data, '788812akaakak');
            setDataRows(response.data)
        } catch (error) {
            console.error("Erro ao listar usuários!", error);
            throw error;
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getUsers()
    }, []);

    const top100Films = [
        {
            label: 'Número'
        },
        {
            label: 'Caixa'
        },
    ];


    // const dadosFicticios = [
    //     { id: 1, name: 'João Silva', email: 'joao.silva@example.com', setor: 'TI' },
    //     { id: 2, name: 'Maria Oliveira', email: 'maria.oliveira@example.com', setor: 'RH' },
    //     { id: 3, name: 'Carlos Pereira', email: 'carlos.pereira@example.com', setor: 'Financeiro' },
    //     { id: 4, name: 'Ana Costa', email: 'ana.costa@example.com', setor: 'Marketing' },
    //     { id: 5, name: 'Felipe Dias', email: 'felipe.dias@example.com', setor: 'Vendas' }
    //   ];


    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };

    return (
        <>
            {!loading ?
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
                                            justifyContent: "center"
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
                                <TableComponente data={dataRows} />

                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
                :
                <Loading />
            }

        </>
    )
}

export default withIsAdmin(PageUsuarios)