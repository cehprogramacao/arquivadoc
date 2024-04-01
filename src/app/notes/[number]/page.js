"use client"
import CustomContainer from "@/Components/CustomContainer"
import Loading from "@/Components/loading"
import SnackBar from "@/Components/SnackBar"
import { AuthProvider } from "@/context"
import Customer from "@/services/customer.service"
import NoteService from "@/services/notes.service"
import PrivateRoute from "@/utils/LayoutPerm"
import { Autocomplete, Box, Grid, TextField, Button } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useState } from "react"



const NoteUpdate = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        open: false,
        severity: "",
        text: "",
        type: ""
    })
    const [data, setData] = useState({
        tag: 0,
        presenter: 0,
        service_type: 0,
        book: 0,
        initial_sheet: 0,
        final_sheet: 0,
        box: 0,
        file_url: "",
    });

    const handleChangeFile = async (event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(",")[1]
                setData((prev) => ({ ...prev, file_url: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }
    const [optionTag, setOptionTag] = useState(null)
    const [optionPresenter, setOptionPresenter] = useState(null)
    const [notesType, setNotesType] = useState([]);
    const [valueNotesType, setValueNotesType] = useState(null);
    const [typesGroup, setTypesGroup] = useState([])
    const [option, setOption] = useState(null);
    const [tag, setTag] = useState([])
    const [presenter, setPresenter] = useState([])
    const getAllNotesTag = async () => {
        const { getAllNoteTags } = new NoteService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const allTags = await getAllNoteTags(accessToken)
            setTag(Object.values(allTags.data))
            console.log(allTags.data, '99999999999')
            return allTags.data
        } catch (error) {
            console.error("Error list of tags", error)
            throw error;
        }
    }

    const getCustomersPresenter = async () => {
        const customer = new Customer();
        try {
            const accessToken = sessionStorage.getItem("accessToken");
            const allPresenter = await customer.customers(accessToken);
            const newData = Object.values(allPresenter.data);
            setPresenter(newData);
            console.log(allPresenter.data);
            return allPresenter.data;
        } catch (error) {
            console.error("Error when listing presenters", error);
            throw error;
        }
    };

    const getTypeAndGroup = async () => {
        const { getAllNoteGroups, getAllNoteTypes } = new NoteService();
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const groups = await getAllNoteGroups(accessToken);
            const types = await getAllNoteTypes(accessToken);
            setNotesType(Object.values(groups.data))
            setTypesGroup(Object.values(types.data))
            console.log(groups.data, types.data, '88888')
            return groups.data && types.data
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getAllNotesTag()
        getCustomersPresenter()
        getTypeAndGroup()
    }, [])

    const handleUpdadeNote = async () => {
        const { updateNoteByNumber } = new NoteService()
        console.log(data)
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await updateNoteByNumber(params.number, data, accessToken)
            setAlert({ open: true, severity: "success", type: "file", text: response.data.message })
        } catch (error) {
            console.log('Erro ao editar arquivo!', error)
            setAlert({ open: true, severity: "error", type: "file", text: error.message })
            throw error
        }
        finally {
            setLoading(false)
            getDataNoteByNumber()
        }
    }
    const handleChangeInputValues = (event) => {
        const { name, value } = event.target
        setData((prev) => ({ ...prev, [name]: value }))
    }
    const getDataNoteByNumber = async () => {
        const { getNoteByNumber } = new NoteService()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await getNoteByNumber(params.number, accessToken)
            setData({
                ...data,
                book: response.data.book,
                initial_sheet: response.data.initial_sheet,
                final_sheet: response.data.final_sheet,
                box: response.data.box
            })
        } catch (error) {
            console.error("Erro ao buscar dados!", error)
            throw error;
        }
        finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        getDataNoteByNumber()
    }, [])

    return loading ? <Loading /> :
        (
            <AuthProvider>
                <PrivateRoute requiredPermissions={['Notas']}>
                    <Box sx={{
                        width: "100%",
                        height: "100vh",
                        py: 14,
                        px: 2,
                    }}>
                        <CustomContainer >
                            <Container maxWidth="sm" >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6} lg={6} >
                                        <Autocomplete
                                            value={optionTag}
                                            options={tag}
                                            getOptionLabel={(option) => option.name || ''}
                                            onChange={(e, value) => {
                                                setData((prev) => ({ ...prev, tag: value.id }))
                                                setOptionTag(value)
                                            }}
                                            isOptionEqualToValue={(option, label) => option.name === label.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tag"
                                                    name="tag"
                                                    color="success"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6} >
                                        <Autocomplete
                                            value={optionPresenter}
                                            options={presenter}
                                            getOptionLabel={(option) => option.name || ''}
                                            onChange={(e, value) => {
                                                setData((prev) => ({ ...prev, presenter: value.cpfcnpj }))
                                                setOptionPresenter(value)
                                            }}
                                            isOptionEqualToValue={(option, label) => option.name === label.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Apresentante"
                                                    name="apresentante"
                                                    color="success"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6} >
                                        <Autocomplete
                                            // value={data.service_type}
                                            options={notesType}
                                            isOptionEqualToValue={(option, label) => option.name === label.name}
                                            getOptionLabel={(option) => option.name || ''}
                                            onChange={(e, newValue) => setValueNotesType(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tipo"
                                                    name="service_type"
                                                    color="success"
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.name}
                                                </li>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6} >
                                        <Autocomplete
                                            value={option}
                                            onChange={(event, newValue) => {
                                                setOption(newValue)
                                                setData((prev) => ({ ...prev, service_type: newValue.id }))
                                            }}
                                            isOptionEqualToValue={(option, label) => option.name === label.name}
                                            options={typesGroup.filter(item => item.id === valueNotesType?.id)}
                                            getOptionLabel={(opcao) => opcao.name || ''}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField {...params} label={`Selecione o tipo de ${valueNotesType?.id ? valueNotesType?.name : ""}`} color="success" variant="outlined" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            value={data.book}
                                            name="book"
                                            onChange={handleChangeInputValues}
                                            fullWidth
                                            type="number"
                                            label="Livro"
                                            color="success"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            value={data.initial_sheet}
                                            label="Folha Inicial"
                                            type="number"
                                            name="initial_sheet"
                                            onChange={handleChangeInputValues}
                                            color="success"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            value={data.final_sheet}
                                            label="Folha Final"
                                            name="final_sheet"
                                            type="number"
                                            onChange={handleChangeInputValues}
                                            color="success"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            fullWidth
                                            value={data.box}
                                            label="Caixa"
                                            name="box"
                                            onChange={handleChangeInputValues}
                                            color="success"
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <TextField
                                            type="file"
                                            fullWidth
                                            color="success"
                                            onChange={handleChangeFile}
                                        />
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between"
                                        }}>
                                            <Button variant="contained" color="success" LinkComponent="a" href="/notas">
                                                Voltar
                                            </Button>
                                            <Button variant="contained" color="success" onClick={handleUpdadeNote}>
                                                Atualizar
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Container>
                        </CustomContainer>
                        <SnackBar data={alert} handleClose={() => setAlert({ ...alert, open: false })} />
                    </Box>
                </PrivateRoute>
            </AuthProvider>
        )
}

export default NoteUpdate