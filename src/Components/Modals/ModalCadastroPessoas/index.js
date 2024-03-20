import Loading from "@/Components/loading";
import Customer from "@/services/customer.service";
import { CloseOutlined } from "@mui/icons-material";
import { useMediaQuery, useTheme, Box, TextField, Typography, Button, Autocomplete, FormControl, FormLabel, FormHelperText, OutlinedInput, IconButton } from "@mui/material";
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
        const onlyDigits = e.target.value?.replace(/\D/g, '');
        console.log(onlyDigits);
        onlyDigits.length < 11
            ? setCpfCnpjMask(cpfMask)
            : setCpfCnpjMask(cnpjMask);
        setData({ ...data, cpfcnpj: onlyDigits });
    };

    const handleInputBlur = () => {
        if (data.cpfcnpj?.replace(/\D/g, '').length === 11) {
            setCpfCnpjMask(cpfMask);
        }
    };

    const handleCreateCustomers = async () => {
        console.log(data)
        try {
            setLoading(true)
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
                    width: { g: 440, md: 440, sm: 400, xs: 320 },
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
                            fontSize: { lg: "1.4rem", md: "1.4rem", sm: "1.2rem", xs: '1rem' }
                        }}>
                            Cadastro - Pessoas
                        </Typography>
                        <IconButton onClick={onClose}>
                            <CloseOutlined />
                        </IconButton>
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