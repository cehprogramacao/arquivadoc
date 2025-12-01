"use client"
import React, { useEffect, useState } from 'react';
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
import { isLoggedIn } from '@/utils/auth';
import withAuth from '@/utils/withAuth';

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
const AddUser = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const [numberMask, setNumberMask] = useState(numberMaskEstruct)
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        permissions: Array(7).fill().map(() => ({
            public_name: '',
            view: 0,
            create_permission: 0,
            edit: 0,
            delete_permission: 0
        }))
    });

    const handleCheckedPermission = (permIndex, checkboxIndex) => {
        const newPermissions = userData.permissions.map((perm, index) => {
            if (index === permIndex) {
                return perm.map((value, cIndex) =>
                    cIndex === checkboxIndex ? (value === 0 ? 1 : 0) : value
                );
            }
            return perm;
        });

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
        if (section === 'Dados' && (!userData.name.trim() || !userData.phone.trim())) {
            return;
        }
        setSection('Permissoes');
    };
    const handleSend = async () => {
        console.log(userData)
        const { updateUserByAdmin } = new User()
        try {
            setLoading(true)
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await updateUserByAdmin(params.id, userData, accessToken)
            console.log(data)
            return data
        } catch (error) {
            console.log('Erro ao adicionar usuário!', error)
            throw error
        }
        finally {
            setLoading(false)
            setSection('Dados');
        }

    }

    const getDataByUser = async (params) => {
        const { getUserById } = new User();
        try {
            if (!isLoggedIn()) {
                throw new Error('Usuário não autenticado');
            }

            const accessToken = sessionStorage.getItem("accessToken");
            const { data } = await getUserById(params.id, accessToken);

            const initialPermissions = Array(7).fill().map(() => [0, 0, 0, 0]);
            // console.log(data.permissions, 'permiisonnnnnnnnnnn')
            // data.permissions.forEach((permission) => {
            //     const permIndex = parseInt(permission.public_name.charAt(1)) - 1; // Corrigido para subtrair 1 do índice
            //     initialPermissions[permIndex] = [
            //         permission.view,
            //         permission.create_permission,
            //         permission.edit,
            //         permission.delete_permission
            //     ];
            // });
            data.permissions.forEach((permission) => {
                const permIndex = ['Protesto', 'RGI', 'RTD', 'RPJ', 'Ofícios', 'Cadastros', 'Notas'].indexOf(permission.public_name);
                if (permIndex !== -1) {
                    initialPermissions[permIndex] = [
                        permission.view,
                        permission.create_permission,
                        permission.edit,
                        permission.delete_permission
                    ];
                }
            });
            // console.log(initialPermissions, 'initiallllllllllllllll')
            setUserData({
                name: data.user[0].name,
                phone: data.user[0].phone,
                permissions: initialPermissions
            });
        } catch (error) {
            console.error("Erro ao buscar dados do usuário!", error);
            throw error;
        }
    };




    const handleBack = () => {
        setUserData({
            name: '',
            email: '',
            phone: '',
            password: '',
        });
        setSection('Dados');
    };
    useEffect(() => {
        getDataByUser(params);

    }, [params]);

    // console.log(userData, '77777777777777')
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
                                        color="success"
                                        value={userData.name}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <FormControl fullWidth error={Boolean(errors['phone'])}>
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
                                                {['Protesto', 'RGI', 'RTD', 'RPJ', 'Ofício', 'Cadastros', 'Notas'].map((permission, permIndex) => (
                                                    <TableRow key={permission}>
                                                        <TableCell sx={{ fontSize: "1.2rem" }} align="center">{permission}</TableCell>
                                                        {userData.permissions[permIndex].map((value, checkboxIndex) => {
                                                            console.log(value, 'valor checkkkkkkkkkkkkkk'); // Coloque o console.log aqui para verificar o valor
                                                            return (
                                                                <TableCell key={checkboxIndex} align="center">
                                                                    <Checkbox
                                                                        color='success'
                                                                        checked={value === 1}
                                                                        onChange={() => handleCheckedPermission(permIndex, checkboxIndex)}
                                                                    />
                                                                </TableCell>
                                                            );
                                                        })}
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

export default withAuth(withIsAdmin(AddUser));
