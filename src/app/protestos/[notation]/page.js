"use client"
import CustomContainer from "@/Components/CustomContainer";
import SnackBar from "@/Components/SnackBar";
import Loading from "@/Components/loading";
import { AuthProvider } from "@/context";
import Customer from "@/services/customer.service";
import ProtestService from "@/services/protest.service";
import { SET_ALERT, SHOW_ALERT, showAlert } from "@/store/actions";
import PrivateRoute from "@/utils/LayoutPerm";
import { Autocomplete, Box, Button, Container, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as randomUUID } from 'uuid'

const UpdateProtestByNotation = ({ params }) => {
    const dispatch = useDispatch()
    const [data, setData] = useState({
        box: 0,
        presenter: null,
        drawee: null,
        debtor: null,
        situation: "",
        file_url: ""
    })
    const [loading, setLoading] = useState(false)
    const [presenter, setPresenter] = useState([])

    const options = [
        {
            label: 'Protestado'
        },
        {
            label: 'Cancelado'
        },
        {
            label: 'Sustado'
        },
    ]

    const handleChangeValues = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }
    const getDataPresenter = async () => {
        const { customers } = new Customer()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await customers(accessToken)
            setPresenter(Object.values(data))
        } catch (error) {
            console.error("Erro ao buscar clientes", error)
            throw new Error('Erro ao buscar clientes')
        }
    }
    const handleChangeFiles = (e) => {
        const files = e.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(',')[1]
                setData((prev) => ({ ...prev, file_url: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }
    const handleUpdateProtestByNotation = async () => {
        const { editProtestByNotation } = new ProtestService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await editProtestByNotation(params.notation,data, accessToken)
            console.log(response.data)
            dispatch(showAlert(response.data.message, "success", "file"))
        } catch (error) {
            dispatch(showAlert(error.msg, "error", "file"))
            console.error("Erro ao criar protesto!", error)
            throw new Error("Erro ao criar protesto!")
        }
    }
    useEffect(() => {
        getDataPresenter()
    }, [])

    return loading ? <Loading /> : (
        <AuthProvider >
            <PrivateRoute requiredPermissions={['Protesto']}>
                <Box sx={{
                    width: "100%",
                    height: "100vh",
                    py: 14,
                    px: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <CustomContainer>
                        <Container maxWidth="sm">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <TextField
                                        fullWidth
                                        sx={{
                                            '& input': { color: 'success.main' }
                                        }}
                                        value={data.box}
                                        name="box"
                                        onChange={handleChangeValues}
                                        label="N° da Caixa"
                                        type="number"
                                        color='success'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Autocomplete
                                        disablePortal
                                        key="presenter-autocomplete"
                                        id="combo-box-demo"
                                        options={presenter}
                                        autoHighlight
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, value) => {
                                            setData((prev) => ({ ...prev, presenter: value.cpfcnpj }))
                                        }}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{
                                                width: '100%',
                                                display: 'flex', flexDirection: 'column', gap: '6px'
                                            }} {...props} key={`${randomUUID()}-presenter`}>
                                                <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                                                    {option.name}
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: "11px", display: 'flex', alignSelf: 'start',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {option.cpfcnpj}
                                                </Typography>
                                            </Box>
                                        )}
                                        fullWidth
                                        renderInput={(params) => <TextField color="success" {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password',
                                            }}
                                            label="Apresentante"
                                            sx={{
                                                color: "#237117", '& input': {
                                                    color: 'success.main',
                                                },
                                            }} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Autocomplete
                                        key="drawee-autocomplete"
                                        disablePortal
                                        id="combo-box-demo"
                                        options={presenter}
                                        autoHighlight
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, value) => {
                                            setData((prev) => ({ ...prev, drawee: value.cpfcnpj }))
                                        }}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{
                                                width: '100%',
                                                display: 'flex', flexDirection: 'column', gap: '6px'
                                            }} {...props} key={`${randomUUID()}-drawee`}>
                                                <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                                                    {option.name}
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: "11px", display: 'flex', alignSelf: 'start',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {option.cpfcnpj}
                                                </Typography>
                                            </Box>
                                        )}
                                        fullWidth
                                        renderInput={(params) => <TextField color="success" {...params}


                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password',
                                            }}
                                            label="Sacado"
                                            sx={{
                                                color: "#237117", '& input': {
                                                    color: 'success.main',
                                                },
                                            }} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Autocomplete
                                        key="debtor-autocomplete"
                                        disablePortal
                                        id="combo-box-demo"
                                        options={presenter}
                                        autoHighlight
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, value) => {
                                            setData((prev) => ({ ...prev, debtor: value.cpfcnpj }))
                                        }}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{
                                                width: '100%',
                                                display: 'flex', flexDirection: 'column', gap: '6px'
                                            }} {...props} key={`${randomUUID()}-debtor`}>
                                                <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                                                    {option.name}
                                                </Typography>
                                                <Typography sx={{
                                                    fontSize: "11px", display: 'flex', alignSelf: 'start',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {option.cpfcnpj}
                                                </Typography>
                                            </Box>
                                        )}
                                        fullWidth
                                        renderInput={(params) => <TextField color="success" {...params}


                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password',
                                            }}
                                            label="Devedor"
                                            sx={{
                                                color: "#237117", '& input': {
                                                    color: 'success.main',
                                                },
                                            }} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <Autocomplete
                                        disablePortal
                                        key="situation-autocomplete"
                                        id="combo-box-demo"
                                        options={options}
                                        fullWidth
                                        isOptionEqualToValue={(option, value) => option.label === value.label}
                                        getOptionLabel={option => option.label}
                                        onChange={(e, value) => {
                                            setData((prev) => ({ ...prev, situation: value.label }))
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                color="success"
                                                {...params}
                                                label="Situação"
                                                placeholder="Escolha uma opção"
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
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <TextField
                                        fullWidth
                                        type="file"
                                        color='success'
                                        onChange={handleChangeFiles}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}

                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <Grid item xs={12} >
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}>
                                            <Button variant="contained" color="success" LinkComponent="a" href="/notas">
                                                Voltar
                                            </Button>
                                            <Button variant="contained" color="success" onClick={handleUpdateProtestByNotation}>
                                                Atualizar
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                    </CustomContainer>

                </Box>
                <SnackBar />
            </PrivateRoute>
        </AuthProvider>
    )
}
export default UpdateProtestByNotation