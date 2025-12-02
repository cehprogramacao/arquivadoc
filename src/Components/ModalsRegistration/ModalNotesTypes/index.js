
import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Button, Autocomplete, Modal, styled, IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import NoteService from "@/services/notes.service";
import { useDispatch } from "react-redux";


const noteSv = new NoteService()

const CadastroNotesType = ({ open, onClose, getData }) => {
    const [dataOptions, setDataOptions] = useState([])
    const [option, setOption] = useState([])
    const [dataTypes, setDataTypes] = useState({
        name: "",
        group_id: 0
    })

    const dispatch = useDispatch()


    const getAllNoteGroups = async () => {
        try {
            getData()
            const data = await noteSv.getAllNoteGroups()
            dispat
            setDataOptions(Object.values(data))
        } catch (error) {
            console.log('Erro ao buscar grupos de notas!', error)
            throw error;
        }
    }

    const handleRegisteNoteGroup = async () => {
        try {
            if (dataTypes.group_id === 0 && dataTypes.name === "") {
                throw new Error("Campos vazios")
            }
            const data = await noteSv.createNoteType(dataTypes, accessToken)

            console.log(data)
        } catch (error) {
            console.log(`Erro ao cadastrar tipo ao grupo de ${dataTypes.name}`, error)
            throw error;
        }
        finally {
            onClose()
            getData()
        }

    }



    useEffect(() => {
        getData()
        getAllNoteGroups()
    }, [])
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="cadastro-partes-modal"
            aria-describedby="cadastro-partes-modal-description"

        >
            <Box sx={{
                width: { lg: 440, md: 440, sm: 400, xs: "100%" },
                height: 'auto',
                padding: '20px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                backgroundColor: '#fff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '10px'
            }} >
                <Box sx={{
                    maxWidth: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography sx={{
                        fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
                    }} color={"black"}>
                        Cadastro - Tipos de Notas
                    </Typography>
                    <IconButton onClick={onClose} >
                        <CloseOutlined />
                    </IconButton>
                </Box>
                <Autocomplete
                    value={option}
                    options={dataOptions}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => {
                        setOption(newValue)
                        if (newValue)
                            setDataTypes((prev) => ({ ...prev, group_id: newValue.id }))
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tipo"
                            color="success"
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option && value ? option.id === value.id : option === value}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    )}
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    label="Nome"
                    value={dataTypes.name}
                    onChange={(e) => setDataTypes((prev) => ({ ...prev, name: e.target.value }))}
                    color='success'
                />
                <Button sx={{
                    display: 'flex',
                    background: "#237117",
                    padding: '10px 22px',
                    color: '#fff',
                    border: '1px solid #237117',
                    textTransform: 'capitalize',
                    fontSize: ".9rem",
                    borderRadius: '5px',
                    alignSelf: 'center',
                    cursor: 'pointer',
                    ":hover": {
                        background: 'transparent',
                        color: '#237117',
                    }
                }} onClick={handleRegisteNoteGroup}>
                    Realizar Cadastro
                </Button>
            </Box>
        </Modal>
    );
}

export default CadastroNotesType