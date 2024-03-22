"use client"
import CustomContainer from "@/Components/CustomContainer"
import Customer from "@/services/customer.service"
import NoteService from "@/services/notes.service"
import { Autocomplete, Box, Grid, TextField } from "@mui/material"
import { Container } from "@mui/system"
import { useEffect, useState } from "react"



const NoteUpdate = ({ params }) => {
    const [data, setData] = useState({
        tag: null,
        presenter: null,
        service_type: '',
        book: '',
        initial_sheet: '',
        final_sheet: '',
        box: '',
        file_url: ''
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




    return (
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
                                    setData((prev) => ({ ...prev, tag: value.name }))
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
                                    setData((prev) => ({ ...prev, tag: value.name }))
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
                                // value={formData.service_type}
                                options={notesType}
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
                                options={typesGroup.filter(item => item.id === valueNotesType?.id)} // Assegurar que as opções sejam baseadas na seleção de valueNotesType
                                getOptionLabel={(opcao) => opcao.name || ''} // Como opcao é uma string, apenas a retornamos
                                fullWidth
                                renderInput={(params) => (
                                    <TextField {...params} label={`Selecione o tipo de ${valueNotesType?.id ? valueNotesType?.name : ""}`} color="success" variant="outlined" />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </CustomContainer>

        </Box>
    )
}

export default NoteUpdate