"use client";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import { useState } from "react";
import { login } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SET_LOGIN_DATA, showAlert } from "@/store/actions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SnackBar from "@/Components/SnackBar";
const { Box } = require("@mui/system");

const LoginPage = () => {
  const router = useRouter()
  const [viewPassword, setViewPassword] = useState(false)
  const dispatch = useDispatch()
  const [dataUser, setDataUser] = useState({
    email: "",
    password: ""
  })



  const handleOnChange = (event) => {
    const { name, value } = event.target
    setDataUser({ ...dataUser, [name]: value })
  }

  const handleChangeViewPassword = () => {
    setViewPassword(!viewPassword)
  }

  const handleSubmit = async (event) => {
    try {
      const { data } = await login(dataUser);
      const { accessToken, refreshToken } = data;
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      dispatch(showAlert(data.message, "success", "user"))
      dispatch({ type: SET_LOGIN_DATA })
      if (data.auth) {
        router.push('/');
      }
    } catch (err) {
      dispatch(showAlert(err.message, "error", "key"))
      console.error("Erro ao fazer login")
      throw err
    }

  };
  return (
    <Box
      sx={{
        background: 'url("image/bg.jpg") no-repeat center fixed',
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        display: "flex",
        placeContent: "center",
        placeItems: "center",
        padding: "20px",
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          width: "400px",
          height: "420px",
          background: "#00000080",
          borderRadius: ".25rem",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          wordWrap: "break-word",
          backgroundClip: "border-box",
          border: "1px solid rgba(0,0,0,.125)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            border: "1px solid rgba(0,0,0,.125)",
            padding: "1rem",
          }}
        >
          <Avatar
            alt="Logo ArquivaDoc"
            src="image/logo.png"
            sx={{
              width: "150px",
              height: "auto",
              borderRadius: "0",
            }}
          />
          <Typography
            sx={{
              fontSize: "1.75rem",
              color: "#FFFFFF",
            }}
          >
            Login
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: ".75rem 1.25rem",
            gap: "20px",
          }}
        >
          <TextField
            placeholder="Usuario/E-mail"
            value={dataUser.email}
            name="email"
            id="outlined-start-adornment"
            sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px" }}
            color="success"
            InputProps={{
              endAdornment: (
                <PersonIcon sx={{ mr: 1, mb: 0.5, fill: "#237117" }} />
              ),
            }}
            onChange={handleOnChange}
          />
          <TextField
            placeholder="Senha"
            name="password"
            value={dataUser.password}
            id="outlined-start-adornment"
            sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px" }}
            color="success"
            type={viewPassword ? "text" : "password"}
            InputProps={{
              endAdornment: viewPassword ? <Visibility onClick={handleChangeViewPassword} sx={{ mr: 1, fill: "#237117", cursor: "pointer" }} /> : <VisibilityOff onClick={handleChangeViewPassword} sx={{ mr: 1, fill: "#237117", cursor: "pointer" }} />,
            }}
            onChange={handleOnChange}
          />
        </Box>
        <Button
          sx={{
            width: "auto",
            display: "flex",
            alignSelf: "end",
            padding: "9px 20px",
            background: "#237117",
            marginRight: "20px",
            marginTop: "27px",
            color: "#fff",
            ":hover": {
              background: "#237117",
            },
          }}
          onClick={handleSubmit}
        >
          Entrar
        </Button>
      </Box>
      <SnackBar />
    </Box>
  );
};
export default LoginPage;
