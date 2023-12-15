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
    FormControlLabel,
} from '@mui/material';
import { styled, width } from '@mui/system';

const StyledFormContainer = styled(Box)({
    width: '50%',
    maxWidth: '600px',
    height: '100vh',
    margin: 'auto',
    padding: '160px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px'
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
    width: '300px',
    position: 'fixed',
    bottom: '90px'
});

const AddUser = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [permissions, setPermissions] = useState({
        view: false,
        edit: false,
        add: false,
        delete: false,
    });
    const [section, setSection] = useState('Dados');

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (permission) => {
        setPermissions({
            ...permissions,
            [permission]: !permissions[permission],
        });
    };

    const handleNext = () => {
        if (!userData.firstName.trim() || !userData.lastName.trim() || !userData.email.trim()) {
            setUserData([...userData, {
                email: "",
                firstName: "",
                lastName: ""
            }])
            return;
        }

        setSection(section === 'Dados' ? 'Permissoes' : 'Dados');
    };

    const handleBack = () => {
        setSection(section === 'Permissoes' ? 'Dados' : 'Permissoes');
    };

    return (
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
                gap: '30px'
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
                    Permissoções
                </Typography>
            </Box>
            <StyledContentContainer>
                {section === 'Dados' && (
                    <Box
                        component="form"

                    >
                        <TextField
                            label="First Name"
                            name="firstName"
                            variant="outlined"
                            value={userData.firstName}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 5 }}
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            variant="outlined"
                            value={userData.lastName}
                            onChange={handleChange}
                            required
                            fullWidth
                            sx={{ mb: 5 }}
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
                                        <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} >Permissão</TableCell>
                                        <TableCell sx={{ color: '#fff', fontSize: "1.2rem" }} align="center">Selecionar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(permissions).map((permission) => (
                                        <TableRow key={permission}>
                                            <TableCell sx={{ fontSize: "1.2rem" }} >{permission}</TableCell>
                                            <TableCell align="center">
                                                <FormControlLabel
                                                    control={<Checkbox color='success' checked={permissions[permission]} onChange={() => handleCheckboxChange(permission)} />}
                                                />
                                            </TableCell>
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
                    <Button onClick={handleNext} variant="contained" color="primary" sx={{
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
    );
};

export default AddUser;
