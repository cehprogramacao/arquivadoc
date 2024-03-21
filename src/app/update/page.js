"use client"
import SnackBar from '@/Components/SnackBar'
import Loading from '@/Components/loading'
import User from '@/services/user.service'
import { Box, Button, TextField, Typography, useTheme, useMediaQuery, FormControl, OutlinedInput } from '@mui/material'
import { useEffect, useState } from 'react'
import ReactInputMask from 'react-input-mask'


const numberMaskEstruct = '(99) 99999-9999'

const UpdateProfile = () => {
    const [numberMask, setNumberMask] = useState(numberMaskEstruct)
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        text: "",
        open: false,
        severity: "",
        type: ""

    })
    const [userData,setUserData] = useState({
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
        const { getUser } = new User()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await getUser(accessToken)
            setUserData({name: data.name, phone: data.phone})
            console.log(data)
        } catch (error) {
            console.error("Erro ao buscar usuários!", error)
            throw error;            
        }
    }
    const handleUpdateUser = async () => {
        const { updateUser } = new User()
        try {
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await updateUser(userData, accessToken)
            setAlert({open: true, severity: "success", type: "user", text: data.message})
            setLoading(true)
        } catch (error) {
            console.log("Erro ao editar usuários!", error)
            setAlert({open: true, severity: "error", type: 'user', text: error.message})
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    
    return !loading ? (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isSmallScreen ? '10px' : '10px',

        }}>
            <Typography sx={{
                fontSize: "clamp(36px, 5vw, 48px)",
                textAlign: 'center'
            }} fontWeight='bold' marginTop={isSmallScreen ? 15 : 14} color={"black"}>
                Editar Perfil
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: 'auto',
                gap: '20px'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',

                }}>
                    <TextField sx={{
                        width: isSmallScreen ? '100%' : '400px',
                        '& input': { color: 'success.main' },
                    }}
                        value={userData.name}
                        onChange={(e) => setUserData((prev) => ({...prev, name: e.target.value}))}
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
            <SnackBar data={alert} handleClose={() => setAlert((prev) => ({...prev, open: false}))} />
        </Box>
    )
    : 
    <Loading />
}
export default UpdateProfile