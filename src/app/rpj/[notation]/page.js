"use client"
import React, { useEffect, useState } from 'react'
import withAuth from '@/utils/withAuth'
import Box from '@mui/material/Box'
import { AuthProvider } from '@/context'
import PrivateRoute from '@/utils/LayoutPerm'
import CustomContainer from '@/Components/CustomContainer'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import RPJService from '@/services/rpj.service'
import { useDispatch } from 'react-redux'
import { showAlert } from '@/store/actions'
import Button from '@mui/material/Button'
import SnackBar from '@/Components/SnackBar'
import Loading from '@/Components/loading'



const UpdateRpj = ({ params }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [optionType, setOptionType] = useState(null)
    const [types, setTypes] = useState([])
    const [data, setData] = useState({
        register: 0,
        service_type: 0,
        book: 0,
        initial_sheet: 0,
        final_sheet: 0,
        box: 0,
        file_url: ""
    })
    const fetchData = async () => {
        const { getAllRPJTypes } = new RPJService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const responseTypes = await getAllRPJTypes(accessToken)
            setTypes(Object.values(responseTypes.data))

        } catch (error) {
            console.error('Erro ao buscar dados!', error)
            throw error
        }
    }

    const handleChangeFieldValues = (event) => {
        const { name, value } = event.target

        setData((state) => ({ ...state, [name]: value }))
    }
    const handleChangeFileUrl = (event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(',')[1]
                setData((state) => ({ ...state, file_url: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }

    const handleUpdateRpjByNotation = async () => {
        const { updateRPJByNotation } = new RPJService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await updateRPJByNotation(accessToken, params.notation, data)
            console.log(response.data)
            dispatch(showAlert(response.data.message, "success", "file"))
        } catch (error) {
            console.error('Erro ao editar arquivo!', error)
            dispatch(showAlert(error.message, "error", "file"))
            throw error
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchData()
    }, [])


    return loading ? <Loading /> : (
        <AuthProvider >
            <PrivateRoute requiredPermissions={['RPJ']}>
                <Box sx={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    px: 2,
                    py: 15,
                }}>
                    <CustomContainer >
                        <Container maxWidth="sm">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        type='number'
                                        id="register"
                                        name="register"
                                        label="Registro"
                                        fullWidth
                                        value={data.register}
                                        onChange={handleChangeFieldValues}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} >
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={types}
                                        fullWidth
                                        value={optionType}
                                        getOptionLabel={(option) => option.name}
                                        isOptionEqualToValue={(option, label) => option.name === label.name}
                                        onChange={(event, value) => {
                                            setOptionType(value);
                                            setData((state) => ({ ...state, service_type: value ? value.id : optionType }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Tipo"
                                                name="service_type"
                                                color="success"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        type='number'
                                        id="box"
                                        name="box"
                                        label="Caixa"
                                        fullWidth
                                        value={data.box}
                                        onChange={handleChangeFieldValues}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        type='number'
                                        id="book"
                                        name="book"
                                        label="book"
                                        fullWidth
                                        value={data.book}
                                        onChange={handleChangeFieldValues}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        type='number'
                                        id="initial_sheet"
                                        name="initial_sheet"
                                        label="Folha inicial"
                                        fullWidth
                                        value={data.initial_sheet}
                                        onChange={handleChangeFieldValues}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        type='number'
                                        id="final_sheet"
                                        name="final_sheet"
                                        label="Folha Final"
                                        fullWidth
                                        value={data.final_sheet}
                                        onChange={handleChangeFieldValues}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        id="file_url"
                                        name="file_url"
                                        type='file'
                                        fullWidth
                                        onChange={handleChangeFileUrl}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <Box sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    }}>
                                        <Button LinkComponent={"a"} href='/rpj' variant="contained" color="success">
                                            Voltar
                                        </Button>
                                        <Button onClick={handleUpdateRpjByNotation} variant="contained" color="success">
                                            Atualizar
                                        </Button>
                                    </Box>
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

export default withAuth(UpdateRpj)