"use client"
import CustomContainer from '@/Components/CustomContainer';
import Loading from '@/Components/loading';
import { AuthProvider } from '@/context';
import Customer from '@/services/customer.service';
import PrivateRoute from '@/utils/LayoutPerm';
import withAuth from '@/utils/withAuth';
import { Box, TextField, Typography, Button, Autocomplete, FormControl, FormLabel, FormHelperText, OutlinedInput, Grid } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import ReactInputMask from 'react-input-mask';
// const cpfMask = '999.999.999-99';
// const cnpjMask = '99.999.999/9999-99';



const PageEditarPessoas = ({ params }) => {
    // const [cpfCnpjMask, setCpfCnpjMask] = useState(cpfMask);
    // const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [data, setData] = useState({
        // cpfcnpj: "",
        // type: "",
        name: ""
    });
    // const handleInputChange = (e) => {
    //     e.target.value?.replace(/\D/g, '').length < 11
    //         ? setCpfCnpjMask(cpfMask)
    //         : setCpfCnpjMask(cnpjMask);
    //     setData({ ...data, cpfcnpj: e.target.value });
    // };
    // const handleInputBlur = () => {
    //     data.cpfcnpj?.replace(/\D/g, '').length === 11 && setCpfCnpjMask(cpfMask);
    // };

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

    const handleEditCustomer = async () => {
        const customers = new Customer()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            if (Object.values(data).some(value => !value)) {
                return false;
            }
            const customer = await customers.editCustomer(params.cpfcnpj, data, accessToken)
            return customer.data
        } catch (error) {
            console.error("Error when editing client", error)
        }
        finally {
            setLoading(false)
            router.push("/customers")
        }
    }
    return loading ? <Loading /> : (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']} >
                <Box sx={{
                    width: '100vw',
                    height: "100vh",
                    py: 14,
                    px: 4
                }}>
                    <CustomContainer >
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}>
                                    <Typography fontSize={40} fontWeight='bold' color={"black"}>
                                        Editar Pessoas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <Box sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <TextField
                                        sx={{
                                            '& input': { color: 'success.main' },
                                            width: { lg: 400, md: 400, sm: 300, xs: "100%" },
                                        }}
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        name="name"
                                        label="Nome completo"
                                        color='success'
                                    />
                                    {/* <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={opt}
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
                                                    width: { lg: 400, md: 400, sm: 300, xs: "100%" },
                                                    color: "#237117",
                                                    '& input': {
                                                        color: 'success.main',
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                    <FormControl error={Boolean(errors['cpfcnpj'])}>
                                        <ReactInputMask
                                            mask={cpfCnpjMask}
                                            value={data.cpfcnpj}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            name="cpfcnpj"
                                        >
                                            {(inputProps) => (
                                                <OutlinedInput
                                                    color='success'
                                                    {...inputProps}
                                                    id={'id-documento'}
                                                    placeholder='CPF/CNPJ'
                                                    sx={{
                                                        width: { lg: 400, md: 400, sm: 300, xs: "100%" },
                                                        borderRadius: '12.5px',

                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderRadius: '4px',
                                                        },
                                                        '& input': {
                                                            color: 'success.main',
                                                        },

                                                    }}
                                                />
                                            )}
                                        </ReactInputMask>
                                    </FormControl> */}
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
                                    }} onClick={handleEditCustomer}>
                                        Atualizar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}
export default withAuth(PageEditarPessoas)