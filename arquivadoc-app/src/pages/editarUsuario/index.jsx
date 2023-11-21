import Header from "@/Components/Header/Header";
import { Box, Button, TextField, Typography, useTheme, useMediaQuery } from '@mui/material'


export const PageEditUser = () => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px'

        }}>
            <Header />
            <Typography fontSize={40} fontWeight={'bold'} marginTop={11}>
                Editar Usuário
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '0 auto',
                gap: '20px'

            }}>
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '400px',
                    '& input': { color: 'success.main' },


                }}
                    label="Usuário"
                    placeholder='Digite o nome do usuário:'
                    color='success'
                />

                <TextField sx={{
                    width: isSmallScreen ? '100%' : '400px',
                    '& input': { color: 'success.main' },


                }}
                    label="Nome"
                    placeholder='Digite o seu nome:'
                    color='success'
                />

                <TextField sx={{
                    width: isSmallScreen ? '100%' : '400px',
                    '& input': { color: 'success.main' },


                }}
                    label="E-mail"
                    placeholder='exemple@email.com'
                    color='success'
                />

                <TextField sx={{
                    width: isSmallScreen ? '100%' : '400px',
                    '& input': { color: 'success.main' },


                }}
                    label="Usuário"
                    placeholder='Digite o nome do usuário:'
                    color='success'
                />
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

export default PageEditUser