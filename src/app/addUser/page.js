"use client"
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    FormControl, 
    OutlinedInput,
} from '@mui/material';
import { styled, width } from '@mui/system';
import CustomContainer from '@/Components/CustomContainer';
import withIsAdmin from '@/utils/isAdmin';
import User from '@/services/user.service';
import Loading from '@/Components/loading';
import ReactInputMask from 'react-input-mask';

const StyledFormContainer = styled(Box)({
    width: '70%',
    maxWidth: '700px',
    margin: 'auto',
    padding: '130px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px'
});

const StyledContentContainer = styled(Box)({
    width: '100%',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StyledButtonContainer = styled(Box)({
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    width: "100%",
});
const numberMaskEstruct = '(99) 99999-9999'
const AddUser = () => {
    const [numberMask, setNumberMask] = useState(numberMaskEstruct)
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        permissions: Array(6).fill().map(() => Array(4).fill(0)),
    });
    const [loading, setLoading] = useState(false)
    const handleCheckedPermission = (permIndex, checkboxIndex) => {
        const newPermissions = userData.permissions.map((perm, index) =>
            index === permIndex ? perm.map((value, cIndex) =>
                cIndex === checkboxIndex ? value === 0 ? 1 : 0 : value
            ) : perm
        );

        setUserData({ ...userData, permissions: newPermissions });
    }
    const [section, setSection] = useState('Dados');

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({
            ...userData,
            [name]: value,
        });
    };


    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setNumberMask(numberMask)
            : setNumberMask(numberMask);
        setUserData({ ...userData, phone: e.target.value });
    };

    const handleInputBlur = () => {
        userData.phone?.replace(/\D/g, '').length === 11 && setNumberMask(numberMask);
    };


    const handleNext = () => {
        if (section === 'Dados' && (!userData.name.trim() || !userData.email.trim() || !userData.phone.trim() || !userData.password.trim())) {
            return;
        }
        setSection('Permissoes');
    };
    const handleSend = async () => {
        console.log(userData)
        const user = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await user.addUserByAdmin(userData, accessToken)
            console.log(data)
            window.location.reload()
            return data
        } catch (error) {
            console.log('Erro ao adicionar usuário!', error)
            throw error
        }
        finally {
            setLoading(false)
            window.location.reload()
        }

    }

    const handleBack = () => {
        setUserData({
            name: '',
            email: '',
            phone: '',
            password: '',
        });
        setSection('Dados');
    };

    return (
        <>
            {!loading ?
                <CustomContainer >
                    <StyledFormContainer>
                        <Box sx={{
                            width: '100%',
                            margin: '0 auto',
                            height: 'auto',
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            placeContent: 'center',
                            placeItems: 'center',
                            border: '1px solid #237117',
                            borderRadius: '8px',
                            gap: '30px',
                            flexWrap: 'wrap'
                        }}>
                            <Typography variant="h5" sx={{
                                display: 'flex',
                                background: section === 'Dados' ? '#237117' : 'transparent',
                                border: '1px solid #237117',
                                padding: '5px 40px',
                                color: section === 'Dados' ? '#fff' : '#237117',
                                borderRadius: '8px'
                            }}>
                                Dados
                                {/* {section === 'Dados' ? 'Dados do Usuário' : 'Permissões'} */}
                            </Typography>
                            <Typography variant="h5" sx={{
                                display: 'flex',
                                border: '1px solid #237117',
                                padding: '5px 26px',
                                color: '#237171',
                                borderRadius: '8px',
                                background: section === 'Permissoes' ? '#237117' : 'transparent',
                                color: section === 'Permissoes' ? '#fff' : '#237117',
                            }}>
                                {/* {section === 'Dados' ? 'Dados do Usuário' : 'Permissões'} */}
                                Permissões
                            </Typography>
                        </Box>
                        <StyledContentContainer>
                            {section === 'Dados' && (
                                <Box component="form" sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 5,
                                    width: "100%"
                                }}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        variant="outlined"
                                        value={userData.username}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        variant="outlined"
                                        type="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                    <FormControl fullWidth error={Boolean(errors['cpfcnpj'])}>
                                        <ReactInputMask
                                            mask={numberMask}
                                            value={userData.phone}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            name="phone"
                                        >
                                            {(inputProps) => (
                                                <OutlinedInput
                                                    {...inputProps}
                                                    id={'id-documento'}
                                                    color="success"
                                                    placeholder={'Número de Telefone'}
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
                                    <TextField
                                        label="Password"
                                        name="password"
                                        variant="outlined"
                                        type="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Box>
                            )}
                            {section === 'Permissoes' && (
                                <Box
                                    component="form"

                                    sx={{
                                        width: '100%',
                                        '& .MuiFormControlLabel-root': { m: .8, },
                                    }}
                                >
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead sx={{ background: '#237117' }}>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} align="center">Permissão</TableCell>
                                                    <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} align="center">Visualizar</TableCell>
                                                    <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} align="center">Adicionar</TableCell>
                                                    <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} align="center">Editar</TableCell>
                                                    <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} align="center">Deletar</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {['Notas', 'RGI', 'RTD', 'RPJ', 'Protestos', 'Ofícios'].map((permission, permIndex) => (
                                                    <TableRow key={permission}>
                                                        <TableCell sx={{ fontSize: "1.2rem" }} align="center">{permission}</TableCell>
                                                        {userData.permissions[permIndex].map((value, checkboxIndex) => (
                                                            <TableCell key={checkboxIndex} align="center">
                                                                <Checkbox
                                                                    color='success'
                                                                    checked={value === 1}
                                                                    onChange={() => handleCheckedPermission(permIndex, checkboxIndex)}
                                                                />
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>

                                        </Table>
                                    </TableContainer>

                                </Box>
                            )}
                            <StyledButtonContainer>
                                <Button onClick={handleBack} variant="contained" disabled={section === 'Dados'} sx={{
                                    background: "#237117",
                                    color: '#fff',
                                    ":hover": {
                                        background: "#237117",

                                        color: "#fff"
                                    }
                                }}>
                                    Voltar
                                </Button>
                                <Button onClick={section === "Dados" || section === "Próximo" ? handleNext : handleSend} variant="contained" color="primary" sx={{
                                    background: "#237117",
                                    border: '1px solid #237117',
                                    ":hover": {
                                        background: "transparent",

                                        color: "#237117"
                                    }
                                }}>
                                    {section === 'Dados' ? 'Próximo' : 'Enviar'}
                                </Button>
                            </StyledButtonContainer>
                        </StyledContentContainer>
                    </StyledFormContainer>
                </CustomContainer>
                :
                <Loading />
            }
        </>
    );
};

export default withIsAdmin(AddUser);
