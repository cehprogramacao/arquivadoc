import React, { useState } from "react";
import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete, Modal, styled } from "@mui/material";

const ButtonClose = styled('button')({
    boxSizing: 'content-box',
    width: '1em',
    height: '1em',
    padding: '0.25em 0.25em',
    color: '#000',
    border: 0,
    background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23000\'%3e%3cpath d=\'M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z\'/%3e%3c/svg%3e")',
    borderRadius: '0.375rem',
    opacity: '.5',
    alignSelf: 'end',
    cursor: 'pointer',
    '&:hover': {
        opacity: '1',
    },
})
const ButtonCadastrar = styled('button')({
    display: 'flex',
    width: 'max-content',
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
})
const CadastroNotesCurtomers = ({ open, onClose }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [valueNotesType, setValueNotesType] = useState('')
    const notesType = ['Outorgante', 'Outorgado']
    const BoxMain = styled('main')({
        width: isSmallScreen ? '100%' : "440px",
        height: 'auto',
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        placeItems: 'center',
        gap: '20px',
        backgroundColor: '#fff',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px'
    })

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="cadastro-partes-modal"
            aria-describedby="cadastro-partes-modal-description"

        >
            <BoxMain >
                <ButtonClose style={{

                }} onClick={onClose} >
                </ButtonClose>
                <Typography sx={{
                    fontSize: 'clamp(2rem, 1rem, 1.7rem)',
                }} color={"black"}>
                    Cadastro
                </Typography>
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    label="CPF"
                    required
                    color='success'
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    label="Ordem"
                    required
                    type="number"
                    color='success'
                />
                <Autocomplete
                    value={valueNotesType}
                    options={notesType}
                    fullWidth
                    getOptionLabel={(option) => option || ''}
                    onChange={(event, newValue) => {
                        setValueNotesType(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tipo"
                            required
                            color="success"
                        />
                    )}
                    renderOption={(props, option, { index }) => (
                        <li {...props} key={index}>
                            {option}
                        </li>
                    )}
                />

                <ButtonCadastrar>
                    Realizar Cadastro
                </ButtonCadastrar>
            </BoxMain>
        </Modal>
    );
}

export default CadastroNotesCurtomers