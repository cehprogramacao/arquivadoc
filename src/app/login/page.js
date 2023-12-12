"use client"
import { Avatar, Button, TextField, Typography } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import { useState } from "react";
const { Box } = require("@mui/system")


const LoginPage = () => {
    const [userAndEmail, setUserAndEmail] = useState('')
    const [senha, setSenha] = useState('')
    const handleEntrar = () => {
        if (userAndEmail === 'Kauan' && senha === 'kauansilva') {
            
        } else {
            setSenha('');
            setUserAndEmail('');
        }
    };

    const handleKeyUpEnter = (event) => {
        if (event.key.toLowerCase() === 'enter') {
            handleEntrar()
        }
    };


    return (
        <Box sx={{
            background: 'url("image/bg.jpg") no-repeat center fixed',
            backgroundSize: 'cover',
            width: '100%',
            height: '100vh',
            display: 'flex',
            placeContent: 'center',
            placeItems: 'center',
            padding: '20px',
            backgroundSize: "cover"
        }} onKeyUp={handleKeyUpEnter}>
            <Box sx={{
                width: '400px',
                height: '420px',
                background: '#00000080',
                borderRadius: ".25rem",
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                wordWrap: 'break-word',
                backgroundClip: 'border-box',
                border: '1px solid rgba(0,0,0,.125)',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    border: '1px solid rgba(0,0,0,.125)',
                    padding: '1rem'

                }}>
                    <Avatar alt="Logo ArquivaDoc" src="image/logo.png" sx={{
                        width: '150px',
                        height: 'auto',
                        borderRadius: '0',
                    }} />
                    <Typography sx={{
                        fontSize: '1.75rem',
                        color: "#FFFFFF"
                    }}>
                        Login
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '.75rem 1.25rem',
                    gap: "20px"
                }}>
                    <TextField
                        placeholder="Usuario/E-mail"
                        id="outlined-start-adornment"

                        sx={{ width: '100%', background: '#FFFFFF', borderRadius: '8px' }}
                        color="success"
                        InputProps={{
                            startAdornment: <PersonIcon sx={{ mr: 1, mb: 0.5, fill: '#237117' }} />
                        }}
                        onChange={(e) => setUserAndEmail(e.target.value)}
                    />
                    <TextField
                        placeholder="Senha"
                        id="outlined-start-adornment"
                        sx={{ width: '100%', background: '#FFFFFF', borderRadius: '8px' }}
                        color="success"
                        type="password"
                        InputProps={{
                            startAdornment: <KeyIcon sx={{ mr: 1, fill: '#237117' }} />
                        }}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </Box>
                <Button sx={{
                    width: 'auto',
                    display: 'flex',
                    alignSelf: "end",
                    padding: '9px 20px',
                    background: "#237117",
                    marginRight: '20px',
                    marginTop: '27px',
                    color: '#fff',
                    ":hover": {
                        background: '#237117'
                    }
                }} onClick={handleEntrar} >
                    Entrar
                </Button>
            </Box>
        </Box >
    )
}
export default LoginPage