import React, { useState } from 'react'
import { useMediaQuery, useTheme, TextField, Button, Typography, Autocomplete } from "@mui/material";
import { Box } from "@mui/system";
import { CadastroPartes } from '@/Components/ModalsRegistration/ModalCadastroPartes';
import ModalTypesRPJ from '@/Components/ModalsRegistration/ModalCadastroTypesRPJ';
import RenderNoOptions from '@/Components/ButtonOpenModalCadastro';


export const CadastroModalRPJ = ({ onClose, onClickPartes }) => {
    const [value, setValue] = useState('')
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const optipos = [
        {
            label: 'Protestado'
        },
        {
            label: 'Cancelamento'
        },
        {
            label: 'Em andamento  '
        },
    ]

    const opt = [
        {
            label: 'Por falta ou recusa de aceite'
        },
        {
            label: 'Por falta ou recusa de pagamento'
        },
        {
            label: 'Por falta de devolução'
        },
        {
            label: 'Por simples indicação do portador'
        },
    ]

    const optapresentante = [
        {
            numero: '3333', label: 'Guaiuba Construtora'
        }
    ]

    const [openModalPresenter, setOpenModalPresenter] = useState('')
    const handleOpenModalPresenter = () => setOpenModalPresenter(!openModalPresenter)
    const handleCloseModalPresenter = () => setOpenModalPresenter(!openModalPresenter)
    const [openModalCadastroTypes, setOpenModalCadastroTypes] = useState(false)
    const handleOpenModalTypes = () => setOpenModalCadastroTypes(!openModalCadastroTypes)
    const handleCloseModalTypes = () => setOpenModalCadastroTypes(!openModalCadastroTypes)


    return (
        <Box sx={{
            width: isSmallScreen ? '320px' : "409px",
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
                    Cadastro - RPJ
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
                padding: '5px 0'
            }}>

                <TextField sx={{
                    width: isSmallScreen ? '100%' : '360px',
                    '& input': { color: 'success.main' }
                }}
                    label="Prenotação"
                    type="text"
                    color='success'
                />
                <Autocomplete

                    disablePortal
                    id="combo-box-demo"
                    options={optapresentante}
                    noOptionsText={<RenderNoOptions onClick={handleOpenModalPresenter} title={'Cadastrar Apresentante'} />}
                    autoHighlight
                    getOptionLabel={(option) => option.numero}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{
                            width: '100%',
                            display: 'flex', flexDirection: 'column', gap: '6px'
                        }} {...props}>
                            <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                                {option.numero}
                            </Typography>
                            <Typography sx={{
                                fontSize: "11px", display: 'flex', alignSelf: 'start',
                                textTransform: 'uppercase'
                            }}>
                                {option.label}
                            </Typography>
                        </Box>
                    )}
                    sx={{ width: isSmallScreen ? '100%' : 360 }}
                    renderInput={(params) => <TextField color="success" {...params}


                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password',
                        }}
                        label="Apresentante"
                        sx={{
                            color: "#237117", '& input': {
                                color: 'success.main',
                            },
                        }} />}
                />
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '360px',
                    '& input': { color: 'success.main' },


                }}
                    label="Registro"
                    type="text"
                    color='success'
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={['Nada ainda']}
                    noOptionsText={<RenderNoOptions onClick={handleOpenModalTypes} title={'Cadastrar Tipo'} />}

                    sx={{ width: isSmallScreen ? "100%" : 360 }}
                    renderInput={(params) => (
                        <TextField
                            color="success"
                            InputProps={{
                                ...params.InputProps,
                                classes: {
                                    root: 'no-options-input',
                                },
                            }}
                            {...params}
                            value={value}
                            label="Tipo de serviço"
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
                    width: isSmallScreen ? '100%' : '360px',
                    '& input': { color: 'success.main' }
                }}
                    label="Livro"
                    type="number"
                    color='success'
                />

                <TextField sx={{
                    width: isSmallScreen ? '100%' : '360px',
                    '& input': { color: 'success.main' }
                }}
                    label="Folha inicial"
                    color='success'
                />
                <TextField sx={{
                    width: isSmallScreen ? '100%' : '360px',
                    '& input': { color: 'success.main' }
                }}
                    label="Folha final"
                    color='success'
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    fullWidth
                    label="Número da caixa"
                    type="number"
                    color='success'
                />
                <TextField
                    sx={{
                        width: isSmallScreen ? '100%' : '360px',
                    }}
                    type="file"
                    color='success'
                    InputLabelProps={{
                        shrink: true,
                    }}

                />
                <Button sx={{
                    display: 'flex',
                    width: '169px',
                    background: 'transparent',
                    color: '#FFC117',
                    border: '1px solid #FFC117',
                    padding: '6px 12px',
                    textTransform: 'capitalize',
                    fontSize: ".9rem",
                    borderRadius: '8px',
                    ":hover": {
                        background: "#FFC117",
                        color: '#FFF',

                    }
                }}>
                    Scannear Arquivos
                </Button>
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
                }}>
                    Realizar Cadastro
                </Button>

            </Box>
            <CadastroPartes open={openModalPresenter} onClose={handleOpenModalPresenter} />
            <ModalTypesRPJ open={openModalCadastroTypes} onClose={handleCloseModalTypes} />
        </Box >
    );
};
