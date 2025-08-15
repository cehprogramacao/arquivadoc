

import React, { useState } from "react";
import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete, Modal, styled, IconButton } from "@mui/material";
import RGI from "@/services/rgi.service";
import Loading from "@/Components/loading";

const ButtonClose = styled(IconButton)({
    boxSizing: 'content-box',
    color: '#000',
    border: 0,
    background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23000\'%3e%3cpath d=\'M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z\'/%3e%3c/svg%3e")',
    borderRadius: '0.375rem',
    opacity: '.5',
    cursor: 'pointer',
    '&:hover': {
        opacity: '1',
    },
})
const ButtonCadastrar = styled(Button)({
    display: 'flex',
    width: 'max-content',
    background: "#237117",
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

const rgiSv = new RGI()
const CadastroRGITypes = ({ open, onClose }) => {
    const [data, setData] = useState({
        group: "",
        name: ""
    })
    const [loading, setLoading] = useState(false)
    const notesType = ['Averbação', 'Registro']
    const handleCreateType = async () => {

        try {
            setLoading(true)
            const response = await rgiSv.createType(data)
        } catch (error) {
            console.log("Erro ao adicionar type de rgi!", error)
            throw error;
        }
        finally {
            setLoading(false)
            onClose()
        }
    }


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="cadastro-partes-modal"
            aria-describedby="cadastro-partes-modal-description"

        >
            {loading ? (<Loading />)
                :
                (
                    <Box sx={{
                        width: { lg: 500, md: "440px", sm: "450px", xs: "100%" },
                        height: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px',
                        backgroundColor: '#fff',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '10px',
                        px: 2,
                        py: 3
                    }}>
                        <Box sx={{
                            width: "100%",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Typography sx={{
                                fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
                            }} color={"black"}>
                                Cadastro - Tipos de RGI
                            </Typography>
                            <ButtonClose style={{

                            }} onClick={onClose} >
                            </ButtonClose>
                        </Box>
                        <Autocomplete
                            value={data.group}
                            options={notesType}
                            getOptionLabel={(option) => option || ''}
                            onChange={(event, newValue) => {
                                setData({ ...data, group: newValue })
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tipo"
                                    color="success"
                                />
                            )}
                            renderOption={(props, option, { index }) => (
                                <li {...props} key={index}>
                                    {option}
                                </li>
                            )}
                        />
                        <TextField sx={{
                            '& input': { color: 'success.main' }
                        }}
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            label="Nome"
                            color='success'
                        />
                        <ButtonCadastrar onClick={handleCreateType}>
                            Realizar Cadastro
                        </ButtonCadastrar>
                    </Box>
                )
            }
        </Modal>
    );
}

export default CadastroRGITypes