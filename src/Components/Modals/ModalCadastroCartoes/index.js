import RenderNoOptions from "@/Components/ButtonOpenModalCadastro"
import Customer from "@/services/customer.service"
import { CloseOutlined } from "@mui/icons-material"
import { Autocomplete, Box, Button, Stack, TextField, Typography, useMediaQuery, useTheme, IconButton } from "@mui/material"
import { useEffect, useState } from "react"


export const CadastrarCartoesModal = ({ onClose, onClickPartes }) => {
    const [data, setData] = useState({
        number: 0,
        customer_cpfcnpj: null,
        box: 0,
        card_file_url: '',
        doc_file_url: '',
        cpf_file_url: '',
        comp_resid_file_url: ''
    })



    const handleChangeFiles = (name, event) => {
        const files = event.target.files[0]
        if (files) {
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const fileResult = fileReader.result.split(',')[1]
                setData((prev) => ({ ...prev, [name]: fileResult }))
            }
            fileReader.readAsDataURL(files)
        }
    }


    const [presenter, setPresenter] = useState([])
    const getDataPresenter = async () => {
        const { customers } = new Customer()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await customers(accessToken)
            setPresenter(Object.values(data))

        } catch (error) {
            console.error("Erro ao buscar clientes", error)
            throw error;
        }
    }
    useEffect(() => {
        getDataPresenter()
    }, [])


    const handleChangeDataValues = (event) => {
        const { name, value } = event.target
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCreateAutographCard = async () => {
        const { createAutographCard } = new Customer()
        console.log(data)
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const response = await createAutographCard(data, accessToken)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.error('Erro ao criar cartão de autógrafo!', error)
            throw error;
        }
        finally {
            onClose()
        }
    }

    return (
        <Box sx={{
            width: { md: 410, xs: "100%" },
            height: '100vh',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflow: 'hidden'
        }} >
            <Box sx={{
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Typography sx={{
                    fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
                }}>
                    Cadastro - Cartões de Autógrafo
                </Typography>
                <IconButton onClick={onClose} >
                    <CloseOutlined />
                </IconButton>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '30px',
                height: "100vh",
                overflowY: 'auto',
                py: 1,
                px: .6
            }}>

                <TextField sx={{
                    '& input': { color: 'success.main' },
                }}
                    fullWidth
                    label="Número"
                    type="number"
                    value={data.number}
                    onChange={handleChangeDataValues}
                    name="number"
                    color='success'
                />
                <TextField sx={{
                    '& input': { color: 'success.main' }
                }}
                    value={data.box}
                    onChange={handleChangeDataValues}
                    fullWidth
                    label="N° da Caixa"
                    type="number"
                    name="box"
                    color='success'
                />
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={presenter}
                    fullWidth
                    autoHighlight
                    // value={data.customer_cpfcnpj}
                    noOptionsText={<RenderNoOptions onClick={onClickPartes} title={'Cadastrar Cliente'} />}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(e, newValue) => setData({ ...data, customer_cpfcnpj: newValue.cpfcnpj })}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    renderInput={(params) => <TextField color="success" {...params} label="Buscar Por"
                        sx={{
                            color: "#237117", '& input': {
                                color: 'success.main',
                            },
                        }} />}
                />
                <Stack sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: "20px"
                }}>
                    <TextField
                        fullWidth
                        type="file"
                        color='success'
                        label="Documento (RG / CNH)"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleChangeFiles('card_file_url', e)}

                    />

                    <Button sx={{
                        display: 'flex',
                        width: 'max-content',
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
                        Scannear Documentos
                    </Button>
                </Stack>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: "20px"
                }}>
                    <TextField
                        fullWidth
                        type="file"
                        color='success'
                        label="CPF"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleChangeFiles('cpf_file_url', e)}
                    />

                    <Button sx={{
                        display: 'flex',
                        width: 'max-content',
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
                        Scannear CPF
                    </Button>
                </Stack>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: "20px"
                }}>
                    <TextField
                        fullWidth
                        type="file"
                        color='success'
                        label="Comprovante de Residência"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleChangeFiles('comp_resid_file_url', e)}

                    />

                    <Button sx={{
                        display: 'flex',
                        width: 'max-content',
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
                        Scannear Comprovante
                    </Button>
                </Stack>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: "20px"
                }}>
                    <TextField
                        fullWidth
                        type="file"
                        color='success'
                        label="Envie o arquivo"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleChangeFiles("doc_file_url", e)}
                    />

                    <Button sx={{
                        display: 'flex',
                        width: 'max-content',
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
                        Scannear Arquivo
                    </Button>
                </Stack>
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
                }} onClick={handleCreateAutographCard}>
                    Realizar Cadastro
                </Button>

            </Box>
        </Box>
    )
}