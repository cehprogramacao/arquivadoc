"use client"
import CustomContainer from '@/Components/CustomContainer';
import Loading from '@/Components/loading';
import Customer from '@/services/customer.service';
import { Box, TextField, Typography, Button, Autocomplete, FormControl, FormLabel, FormHelperText, OutlinedInput, Grid } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import ReactInputMask from 'react-input-mask';


const PageEditarPessoas = ({ params }) => {

    const [loading, setLoading] = useState(false)
    console.log(params, 'paraaaaaaaaaaaaaaaaaa')
    return (
        <>
            {loading ?
                <Loading />
                :
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
                                        // value={data.name}
                                        // onChange={(e) => setData({ ...data, name: e.target.value })}
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
                                    }} >
                                        Atualizar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
            }
        </>
    )
}
export default PageEditarPessoas