"use client"
import { Box, Button, TextField, Typography, useTheme, useMediaQuery } from '@mui/material'

const PageEditarPessoas = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            placeItems:'center',
            padding: "5.1rem 0 ",
            gap: 3
        }}>
            <Typography fontSize={40} fontWeight='bold' marginTop={isSmallScreen ? 3 : 5} color={"black"}>
                Editar Pessoas
            </Typography>
            <Box sx={{
                maxWidth:'700px',   
                display: 'flex',
                flexDirection: 'column',
                width: 'auto',
                gap: 3,
            }}>
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' },


                    }}
                        label="CPF/CNPJ"
                        color='success'
                    />
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' }
                    }}
                        label="Tipo de pessoa"
                        color='success'
                    />
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' },

                        "::placeholder": {
                            color: 'success.main'
                        }
                    }}
                        label="Nome"
                        color='success'
                    />
                <Button sx={{
                    display: 'flex',
                    alignSelf: "center",
                    width: 'max-content',
                    background: "#237117",
                    color: '#fff',
                    border: '1px solid #237117',
                    padding: '7px 30px',
                    ":hover": {
                        background: 'transparent',
                        color: '#237117',
                        
                    }
                }}>
                    Atualizar
                </Button>
            </Box>
        </Box>
    )
}
export default PageEditarPessoas