"use client"
import { Autocomplete, Box, Button, Drawer, TextField, Typography, useTheme, useMediaQuery, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import { Buttons } from "@/Components/Button/Button"
import { UserTable } from "./tablePessoas/table"
import { CadastroPessoas } from "@/Components/Modals/ModalCadastroPessoas"
import CustomContainer from "@/Components/CustomContainer"
import Customer from "@/services/customer.service"
import Loading from "@/Components/loading"
import withAuth from "@/utils/withAuth"



const PagePessoas = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false)
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const handleOpenModal = () => setOpen(true)
    const handleCloseModal = () => setOpen(false)

    const top100Films = [
        {
            label: 'CPF/CNPJ'
        },
        {
            label: 'Nome'
        },
    ];

    const getData = async () => {
        try {
            setLoading(true)
            const customer = new Customer()
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await customer.customers(accessToken)
            setRows(data)
            console.log(data)
            return data
        } catch (error) {
            console.error('Error listing customers', error.message)
            throw error
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])


    const handleDeleteCustomer = async (cpfcnpj) => {
        const customer = new Customer()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await customer.deleteCustomer(cpfcnpj, accessToken)
            console.log(data)
            return data
        } catch (error) {
            console.error("error when deleting client", error)
            throw error
        }
        finally {
            setLoading(false)
        }
    };


    return (
        <>
            {loading ?
                <Loading />
                :
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    px: 3,
                    py: 13
                }}>
                    <CustomContainer >
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Typography fontSize={30} fontWeight={'bold'} color={"black"}>
                                        Pessoas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} sm={6} lg={5}>
                                        <TextField label="Buscar"
                                            fullWidth
                                            sx={{
                                                '& input': {
                                                    color: 'success.main',
                                                },
                                            }} color="success" />
                                    </Grid>
                                    <Grid item xs={12} md={6} sm={6} lg={5}>
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
                                    <Grid item xs={12} md={12} sm={12} lg={2}>
                                        <Box sx={{
                                            display: 'flex',
                                            width: '100%',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 3
                                        }}>
                                            <Buttons color={'green'} title={'Buscar'} />
                                            <ButtonOpenModals onClick={handleOpenModal} />
                                        </Box>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={12} >
                                <UserTable data={rows} onClick={handleDeleteCustomer} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                    <Drawer anchor="left" open={open} onClose={handleCloseModal}>
                        <CadastroPessoas onClose={handleCloseModal} />
                    </Drawer>
                </Box>
            }
        </>
    )
}

export default withAuth(PagePessoas)