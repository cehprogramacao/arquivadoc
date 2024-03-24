"use client"
import CustomContainer from "@/Components/CustomContainer"
import Loading from "@/Components/loading"
import RGI from "@/services/rgi.service"
import withAuth from "@/utils/withAuth"
import { Grid, Box, TextField, Container, Button, Autocomplete } from "@mui/material"
import { useEffect, useState } from "react"

const Prenotation = ({ params }) => {
    const [grupo, setGrupo] = useState(null); // Estado para armazenar o grupo selecionado
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false)
    const [dataField, setDataField] = useState({
        prenotation: 0,
        box: 0,
        presenterDocument: "",
        service_type: "",
        registration: "",
        file_url: "",
    })
    const getDataByPrenotation = async () => {
        const { getByPrenotation } = new RGI()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getByPrenotation(params.prenotation, accessToken)
            console.log(data.prenotation, 'preeee')
            console.log(data, 'DATTTTTTA')
            setDataField({
                ...dataField,
                prenotation: data.prenotation,
                box: data.box,
                presenterDocument: data.presenterDocument,
                service_type: data.service_type,
                registration: data.registration,
            })
            return data
        } catch (error) {
            console.error("Error ao pegar dados!", error)
            throw error;
        }
    }
    const group = [
        {
            id: 1,
            label: "Registro"
        },
        {
            id: 2,
            label: "Averbação"
        }
    ]
    const tiposFiltrados = grupo ? types.filter(tipo => tipo.group === grupo) : [];
    // useEffect
    const getTypesRGI = async () => {
        const { getType } = new RGI()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken");
            const { data } = await getType(accessToken);
            const newData = Object.values(data);
            console.log(data);
            console.log(newData, '7777777777777')
            setTypes(newData)
            return data;
        } catch (error) {
            console.error("Error when listing types rgi", error);
            throw error;
        }
        finally {
            setLoading(false)
        }

    };
    // const handleFileChange = (event) => {
    //     const files = event.target.files[0]
    //     if (files) {
    //         const fileReader = new FileReader()
    //         fileReader.onloadend = () => {
    //             let fileResult = fileReader.result.split(",")[1]
    //             setDataField((prev) => ({ ...prev, file: fileResult }))
    //         }
    //         fileReader.readAsDataURL(files)
    //         console.log(fileReader)
    //     }
    // }
    const handleChangeFile = (e) => {
        const files = e.target.files[0];
        if (files) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                let base64String = fileReader.result.split(',')[1];
                setDataField((prevFormData) => ({ ...prevFormData, file_url: base64String }));
            };
            fileReader.readAsDataURL(files);
            console.log(fileReader, '888');
        }
    };

    useEffect(() => {
        getDataByPrenotation()
        getTypesRGI()

    }, [])

    const handleToUpdateByPrenotation = async () => {
        console.log(dataField)
        const { putByPrenotation } = new RGI()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await putByPrenotation(dataField.prenotation,dataField, accessToken)
            console.log(data)
            return data
        } catch (error) {
            console.error("Erro ao editar rgi!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? <Loading />
                :
                <Box sx={{
                    width: "100%",
                    height: "100vh",
                    py: { xs: 8, sm: 12 },
                    px: { xs: 0, sm: 2 }
                }}>
                    <CustomContainer >
                        <Container maxWidth={"sm"} sx={{ py: 5 }}>
                            <Grid container spacing={3} >
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <TextField
                                                id=""
                                                type="text"
                                                fullWidth
                                                value={dataField.prenotation}
                                                label="Prenotação"
                                                name="prenotation"
                                                disabled
                                                color="success"
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <TextField
                                                id=""
                                                value={dataField.box}
                                                name="box"
                                                type="number"
                                                label="Caixa"
                                                onChange={(e) => {
                                                    setDataField({ ...dataField, box: e.target.value })
                                                }}
                                                color="success"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <TextField
                                                id=""
                                                type="text"
                                                value={dataField.presenterDocument}
                                                name="presenterDocument"
                                                label="Apresentante"

                                                disabled
                                                color="success"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <Autocomplete
                                                value={grupo}
                                                onChange={(event, newValue) => setGrupo(newValue)}
                                                options={group.map(option => option.label)}
                                                getOptionLabel={(option) => option}
                                                fullWidth
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Serviço" variant="outlined" color="success" />
                                                )}
                                            />
                                        </Grid>


                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <Autocomplete
                                                fullWidth
                                                value={dataField.service_type}
                                                onChange={(event, newValue) => setDataField({ ...dataField, service_type: newValue })}
                                                options={tiposFiltrados.map(tipo => tipo.id)}
                                                getOptionLabel={(id) => {
                                                    const tipoSelecionado = tiposFiltrados.find(t => t.id === id);
                                                    return tipoSelecionado ? tipoSelecionado.name : '';
                                                }}
                                                // noOptionsText={<RenderNoOptions onClick={handleOpenModalRGITypes} title={'Cadastrar Tipo'} />}
                                                renderInput={(params) => (
                                                    <TextField {...params} label={`Selecione a opção`} color="success" variant="outlined" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <TextField
                                                id=""
                                                type="text"
                                                label="Matricula"
                                                value={dataField.registration}
                                                name="registration"
                                                color="success"
                                                onChange={(e) => {
                                                    setDataField({ ...dataField, registration: e.target.value })
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <TextField
                                                type="file"
                                                onChange={handleChangeFile}
                                                color="success"
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} >
                                    <Box sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "space-between",

                                    }}>
                                        <Button LinkComponent={"a"} href="/rgi" variant="contained" color="success">
                                            Voltar
                                        </Button>
                                        <Button variant="contained" color="success" onClick={handleToUpdateByPrenotation}>
                                            Atualizar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </CustomContainer>
                </Box>
            }
        </>
    )
}

export default withAuth(Prenotation)