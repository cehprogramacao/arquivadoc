import Loading from "@/Components/loading";
import Customer from "@/services/customer.service";
import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete, FormControl, FormLabel, FormHelperText, OutlinedInput } from "@mui/material";
import { useRef, useState } from "react";
import ReactInputMask from 'react-input-mask';

const cpfMask = '999.999.999-99';
const cnpjMask = '99.999.999/9999-99';
export const CadastroPessoas = ({ onClose }) => {
    const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        cpfcnpj: "",
        type: "",
        name: ""
    });

    const opt = [
        {
            id: 1,
            label: 'Física'
        },
        {
            id: 2,
            label: 'Jurídica'
        }
    ]

    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setCpfCnpjMask(cpfMask)
            : setCpfCnpjMask(cnpjMask);
        setData({ ...data, cpfcnpj: e.target.value });
    };

    const handleInputBlur = () => {
        data.cpfcnpj?.replace(/\D/g, '').length === 11 && setCpfCnpjMask(cpfMask);
    };
    const handleCreateCustomers = async () => {
        console.log(data)
        try {
            setLoading(true)
            onClose()
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                console.error("Access token is missing.");
                throw new Error("Access token is missing.");
            }
            const customer = new Customer();
            const response = await customer.createCustomer(data, accessToken);
            console.log(response)
            return response;
        } catch (error) {
            console.error("Error creating customer:", error.message);
            throw error;
        }
        finally {
            setLoading(false)
        }
    };


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            {loading ?
                < Loading />
                :
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
                            Cadastro - Pessoas
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

                    <TextField
                        sx={{
                            '& input': { color: 'success.main' }
                        }}
                        value={data.name}
                        fullWidth
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        name="name"
                        label="Nome completo"
                        color='success'
                    />

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={opt}
                        fullWidth
                        getOptionLabel={(opt) => opt.label}
                        onChange={(e, value) => setData({ ...data, type: value.label })}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        renderInput={(params) => (
                            <TextField
                                color="success"
                                {...params}
                                name="type"
                                label="Tipo de pessoa"
                                sx={{
                                    color: "#237117",
                                    '& input': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        )}
                    />




                    <FormControl fullWidth error={Boolean(errors['cpfcnpj'])}>
                        <ReactInputMask
                            mask={cpfCnpjMask}
                            value={data.cpfcnpj}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            name="cpfcnpj"
                        >
                            {(inputProps) => (
                                <OutlinedInput
                                    {...inputProps}
                                    id={'id-documento'}
                                    label={'CPF/CNPJ'}
                                    sx={{
                                        borderRadius: '12.5px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderRadius: '4px',
                                        },
                                    }}
                                />
                            )}
                        </ReactInputMask>
                    </FormControl>

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
                    }} onClick={handleCreateCustomers}>
                        Realizar Cadastro
                    </Button>
                </Box >
            }
        </>
    );
}