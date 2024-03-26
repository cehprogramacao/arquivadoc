"use client"
import SnackBar from '@/Components/SnackBar';
import Loading from '@/Components/loading';
import User from '@/services/user.service';
import withAuth from '@/utils/withAuth';
import { Box, Button, TextField, Typography, useTheme, useMediaQuery } from '@mui/material'
import { useState } from 'react';

const ChangePassoword = () => {
    const theme = useTheme();
    const [password, setPassword] = useState({
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        open: false,
        text: "",
        severity: "",
        type: ""
    })
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChangePassword = async () => {
        const { changeUserPassword } = new User()
        try {
            setLoading(true)
            if (!password) {
                throw new Error('Campo vazio')
            }
            const accessToken = sessionStorage.getItem("accessToken")
            const { data } = await changeUserPassword(password, accessToken)
            setAlert({ open: true, type: "key", severity: "success", text: data.message })
        } catch (error) {
            console.error("Erro ao alterar senha!", error)
            setAlert({ open: true, type: "key", severity: "error", text: error.message })
            throw error;
        }
        finally {
            setLoading(false)
            setPassword({ password: "" })
        }
    }

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
                Mudar Senha
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: 'auto',
                gap: '20px'
            }}>
                <TextField
                    fullWidth
                    sx={{
                        '& input': { color: 'success.main' },
                    }}
                    value={password.password}
                    onChange={(e) => setPassword((prev) => ({ ...prev, password: e.target.value }))}
                    label="Senha"
                    placeholder='Digite sua senha'
                    color='success'
                />

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
                }} onClick={handleChangePassword}>
                    Atualizar
                </Button>
            </Box>
            <SnackBar data={alert} handleClose={(prev) => setAlert({ ...prev, open: false })} />
        </Box>
    )
        :
        <Loading />
}
export default withAuth(ChangePassoword)