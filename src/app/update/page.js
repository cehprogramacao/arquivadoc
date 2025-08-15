"use client"
import CustomContainer from '@/Components/CustomContainer'
import SnackBar from '@/Components/SnackBar'
import Loading from '@/Components/loading'
import User from '@/services/user.service'
import { SET_ALERT, showAlert } from '@/store/actions'
import withAuth from '@/utils/withAuth'
import { Box, Button, TextField, Typography, useTheme, useMediaQuery, FormControl, OutlinedInput, Grid, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import ReactInputMask from 'react-input-mask'
import { useDispatch } from 'react-redux'


const numberMaskEstruct = '(99) 99999-9999'
const userSv = new User()
const UpdateProfile = () => {
    const [numberMask, setNumberMask] = useState(numberMaskEstruct)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({
        name: "",
        phone: ""
    })
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const handleInputChange = (e) => {
        e.target.value?.replace(/\D/g, '').length < 11
            ? setNumberMask(numberMask)
            : setNumberMask(numberMask);
        setUserData({ ...userData, phone: e.target.value });
    };
    const handleInputBlur = () => {
        userData.phone?.replace(/\D/g, '').length === 11 && setNumberMask(numberMask);
    };
    const getUser = async () => {
        try {
            setLoading(true)
            
            const response = await userSv.getUser()
            setUserData({ name: data.user[0]?.name, phone: data.user[0]?.phone })
            console.log(data)
        } catch (error) {
            console.error("Erro ao buscar usuários!", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    const handleUpdateUser = async () => {
        try {
            setLoading(true)
            
            const response = await userSv.updateUser(userData)
            dispatch({type: SET_ALERT, message: "Usuário atualizado com sucesso!", severity: "success", alertType: "user"})
            console.log(data)

        } catch (error) {
            console.log("Erro ao editar usuários!", error)
            dispatch({type: SET_ALERT, message: "Erro ao atualizar usuário!", severity: "error", alertType: "user"})
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return loading ? <Loading /> : (
        <Box sx={{
            width: "100%",
            height: "100vh",
            px: 2,
            display: "flex",
        }}>
            <Container maxWidth="sm" >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center"
                        }} >
                            <Typography sx={{
                                fontSize: "clamp(36px, 5vw, 48px)",
                                textAlign: 'center'
                            }} fontWeight='bold' marginTop={isSmallScreen ? 15 : 14} color={"black"}>
                                Editar Perfil
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: '20px'
                        }}>
                            <TextField sx={{
                                '& input': { color: 'success.main' },
                            }}
                                fullWidth
                                value={userData.name}
                                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                                label="Nome"
                                placeholder='Digite seu nome'
                                color='success'
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
                                            fullWidth
                                            {...inputProps}
                                            id={'id-documento'}
                                            color="success"
                                            placeholder={'Número de Telefone'}
                                            sx={{
                                                '& input': { color: 'success.main' },
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
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "center"
                        }}>
                            <Button sx={{
                                display: 'flex',
                                alignSelf: "center",
                                width: 'max-content',
                                background: "#237117",
                                color: '#fff',
                                border: '1px solid #237117',
                                padding: '7px 22px',
                                ":hover": {
                                    background: 'transparent',
                                    color: '#237117',

                                }
                            }} onClick={handleUpdateUser}>
                                Atualizar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
export default withAuth(UpdateProfile)