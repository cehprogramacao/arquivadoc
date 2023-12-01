"use client"
import { Box, Button, TextField, Typography, useTheme, useMediaQuery } from '@mui/material'

const PageEditarPerfil = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isSmallScreen ? '10px' : '10px',

        }}>
            <Typography fontSize={40} fontWeight='bold' marginTop={isSmallScreen ? 11 : 14} color={"black"}>
                Mudar senha
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: 'auto',
                gap: '20px'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    
                }}>
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' },


                    }}
                        label="Nome"
                        placeholder='Digite seu nome'
                        color='success'
                    />
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' }
                    }}
                        label="Email"
                        placeholder='exemple@gmail.com'
                        color='success'
                    />
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' }
                    }}
                        label="Senha"
                        placeholder='Senha: '
                        color='success'
                    />
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' }
                    }}
                        label="Repita a senha"
                        placeholder='Repita a senha: '
                        color='success'
                    />

                </Box>
                <Button sx={{
                    display: 'flex',
                    alignSelf: "center",
                    width: 'max-content',
                    background: "#237117",
                    color: '#fff',
                    border: '1px solid #237117',
                    padding: '7px 22px',
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
export default PageEditarPerfil