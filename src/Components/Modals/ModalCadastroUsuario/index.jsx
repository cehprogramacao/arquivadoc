

import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";


export const CadastroUsuarios = ({ onClose}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const tipos_users = ['Notas', 'Admin', 'RGI', 'Protesto','Admin Notas', 'Admin RGI', 'Admin Protesto', 'Estag Notas', 'Estag Protesto','Estag RGI']

    return (
        <Box sx={{
            width: isSmallScreen ? '300px' : "409px",
            height: '100vh',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            overflow: 'hidden'
        }}>
            <Box sx={{
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Typography sx={{
                    fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
                }}>
                    Cadastro - Usuário
                </Typography>
                <button style={{
                    boxSizing: 'content-box',
                    width: '1em',
                    height: '1em',
                    padding: '0.25em 0.25em',
                    color: '#000',
                    border: 0,
                    background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23000\'%3e%3cpath d=\'M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z\'/%3e%3c/svg%3e")',
                    borderRadius: '0.375rem',
                    opacity: '.5',
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: '1',
                    },
                }} onClick={onClose} >

                </button>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: isSmallScreen ? '20px' : '30px',
                height: "100vh",
                overflowY: 'auto',
                padding: '6px 0'
            }}>
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '389px',
                    '& input': { color: 'success.main' },


                }}
                    label="Usuário"
                    type="text"
                    color='success'
                />
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '389px',
                    '& input': { color: 'success.main' },


                }}
                    label="Nome"
                    type="text"
                    color='success'
                />
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '389px',
                    '& input': { color: 'success.main' },


                }}
                    label="E-mail"
                    type="email"
                    color='success'
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={tipos_users}
                    sx={{ width: isSmallScreen ? "100%" : 389 }}
                    renderInput={(params) => (
                        <TextField
                            color="success"

                            {...params}
                            label="Setor"
                            placeholder="Escolha uma opção"
                            sx={{
                                color: "#237117",
                                "& input": {
                                    color: "success.main",
                                },
                            }}
                        />
                    )}
                />
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '389px',
                    '& input': { color: 'success.main' },


                }}
                    label="Senha"
                    type="password"
                    color='success'
                />
                <Button sx={{
                    display: 'flex',
                    width: '169px',
                    background: "#237117",
                    color: '#fff',
                    border: '1px solid #237117',
                    textTransform: 'capitalize',
                    fontSize: ".9rem",
                    borderRadius: '8px',
                    ":hover": {
                        background: 'transparent',
                        color: '#237117',

                    }
                }} onClick={(e) => console.log(e)}>
                    Realizar Cadastro
                </Button>

            </Box>
        </Box >
    );
};
