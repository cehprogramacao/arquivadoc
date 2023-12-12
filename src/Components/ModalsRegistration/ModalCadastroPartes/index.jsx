import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete } from "@mui/material";



export const CadastroPartes = ({ onClose }) => {

    const opt = [
        {
            label: 'Física'
        },
        {
            label: 'Jurídica'
        }
    ]

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box sx={{
            width: isSmallScreen ? '400px' : "440px",
            height: '100vh',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
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
                    Cadastro - Partes
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

            <TextField sx={{

                '& input': { color: 'success.main' }
            }}
                label="Nome completo"
                color='success'
            />
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={opt}
                sx={{ width: isSmallScreen ? '100%' : 400 }}
                renderInput={(params) => (
                    <TextField
                        color="success"
                        {...params}
                        label="Tipo"
                        sx={{
                            color: "#237117",
                            '& input': {
                                color: 'success.main',
                            },
                        }}
                    />
                )}
            />
            <TextField sx={{
                '& input': { color: 'success.main' }
            }}
                label="CPF/CNPJ"
                color='success'
            />
            <Button sx={{
                display: 'flex',
                width: 'max-content',
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
            }}>
                Realizar Cadastro
            </Button>
        </Box >
    );
}