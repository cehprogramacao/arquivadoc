"use client"
import CustomContainer from "@/Components/CustomContainer"
import SnackBar from "@/Components/SnackBar"
import Loading from "@/Components/loading"
import Calling from "@/services/calling.service"
import RGI from "@/services/rgi.service"
import withAuth from "@/utils/withAuth"
import { Grid, Box, TextField, Container, Button, Autocomplete } from "@mui/material"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const EditCallingByNumber = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [alert, setAlert] = useState({
        open: false,
        text: "",
        type:"",
        severity:""
    })
    const [types, setTypes] = useState([])
    const [entity, setEntity] = useState([])
    const [entityOption, setEntityOption] = useState(null)
    const [typesOption, setTypesOption] = useState(null)
    const [dataCalling, setDataCalling] = useState({
        entity: "",
        calling_type: "",
        box: "",
        date: "",
        file_url: ""
    })

    const getTypes = async () => {
        const { getAllCallingTypes } = new Calling()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getAllCallingTypes(accessToken)
            console.log(data)
            setTypes(Object.values(data))
            return data
        } catch (error) {
            console.error("Erro ao buscar types!", error)
            throw error;
        }
    }
    const getEntity = async () => {
        const { getAllCallingEntities } = new Calling()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getAllCallingEntities(accessToken)
            console.log(data)
            setEntity(Object.values(data))
            return data
        } catch (error) {
            console.error("Erro ao buscar entidades!", error)
            throw error;
        }
    }
    const handleChangeFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")[1]
                setDataCalling({ ...dataCalling, file_url: fileResult })
            }
            fileReader.readAsDataURL(file)
        }
    }
    useEffect(() => {
        getTypes()
        getEntity()
    }, [])

    const handleToUpdateCalling = async () => {
        console.log(dataCalling)
        const { updateCallingByNumber } = new Calling()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await updateCallingByNumber(params.number, dataCalling, accessToken)
            setAlert({open: true, severity: "success", text: data.message,type: "file"})
            console.log(data)
            return data
        } catch (error) {
            setAlert({open: true, severity: "error", text: error.msg,type: "file"})
            console.error("Erro ao editar ofício!",error)
            throw error;
        }
        finally {
            setLoading(false)
            router.push("/oficio")
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
                                            <Autocomplete
                                                fullWidth
                                                value={entity.find(option => option.name === entityOption) || null}
                                                options={entity}
                                                getOptionLabel={(option) => option.name}
                                                onChange={(e, value) => {
                                                    setEntityOption(value ? value.name : null);
                                                    setDataCalling({ ...dataCalling, entity: value ? value.id : null });
                                                }}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Entidade" variant="outlined" color="success" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <TextField
                                                id=""
                                                name="box"
                                                type="number"
                                                label="Caixa"
                                                value={dataCalling.box}
                                                onChange={(e) => {
                                                    setDataCalling({ ...dataCalling, box: e.target.valueAsNumber })
                                                }}
                                                color="success"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={6} md={6} sm={6}>
                                            <Autocomplete
                                                fullWidth
                                                value={types.find(option => option.name === typesOption) || null}
                                                options={types}
                                                getOptionLabel={(option) => option.name}
                                                onChange={(e, value) => {
                                                    setTypesOption(value ? value.name : null);
                                                    setDataCalling({ ...dataCalling, calling_type: value ? value.id : null });
                                                }}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Serviço" variant="outlined" color="success" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <TextField
                                                id=""
                                                type="date"
                                                label="date"
                                                name="date"
                                                color="success"
                                                value={dataCalling.date}
                                                onChange={(e) => {
                                                    setDataCalling({ ...dataCalling, date: e.target.value })
                                                }}
                                                fullWidth

                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                            <TextField
                                                type="file"
                                                color="success"
                                                fullWidth
                                                onChange={handleChangeFile}
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
                                        <Button variant="contained" color="success" onClick={handleToUpdateCalling} >
                                            Atualizar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </CustomContainer>
                </Box>
            }
            <SnackBar data={alert} handleClose={() => setAlert({...alert, open: false})} />
        </>
    )
}

export default withAuth(EditCallingByNumber)