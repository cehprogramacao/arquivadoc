import NoteService from "@/services/notes.service";
import { CloseOutlined } from "@mui/icons-material";
import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete, IconButton } from "@mui/material";
import { useState } from "react";



export const CadastroSolicitantes = ({ onClose, getTag }) => {
    const [data, setData] = useState({
        name: ""
    })

    const handleCreateNotesTag = async () => {
        const { createNoteTag } = new NoteService()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const tag = await createNoteTag(data, accessToken)
            getTag()
            onClose()
            return tag.data
        } catch (error) {
            console.error("Erro ao criar tag!", error)
            throw error;
        }
    }
    return (
        <Box sx={{
            width: { lg: 440, md: 440, sm: 400, xs: 340 },
            height: '100vh',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            alignItems: "flex-start"
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Typography sx={{
                    fontSize: { lg: "1.3rem", md: "1.2rem", sm: "1.1rem", xl: "1rem" },
                }}>
                    Cadastro - Solicitantes
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseOutlined />
                </IconButton>
            </Box>

            <TextField 
            value={data.name}
            onChange={(e) => setData({name: e.target.value})}
            sx={{

                '& input': { color: 'success.main' }
            }}
                fullWidth
                label="Nome"
                color='success'
            />
            <Button sx={{
                display: 'flex',
                background: "#237117",
                color: '#fff',
                border: '1px solid #237117',
                textTransform: 'capitalize',
                fontSize: ".9rem",
                borderRadius: '5px',
                ":hover": {
                    background: 'transparent',
                    color: '#237117',

                }
            }} onClick={handleCreateNotesTag}>
                Realizar Cadastro
            </Button>
        </Box >
    );
}