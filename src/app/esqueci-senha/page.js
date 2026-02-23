"use client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
  Alert
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { ForgotPassword } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EsqueciSenhaPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Informe seu e-mail.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await ForgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: 'url("image/bg.jpg") no-repeat center center fixed',
        backgroundSize: "cover",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, sm: 3 },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(45deg, rgba(35, 113, 23, 0.3), rgba(0, 0, 0, 0.4))",
          zIndex: 0,
        }
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: { xs: "100%", sm: 480 },
          maxWidth: 480,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(15px)",
          borderRadius: 4,
          overflow: "visible",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: "inherit",
            padding: "2px",
            background: "linear-gradient(45deg, #237117, transparent, #237117, transparent, #237117)",
            backgroundSize: "400% 400%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            animation: "borderGlow 3s ease-in-out infinite",
            zIndex: -1,
          },
          "@keyframes borderGlow": {
            "0%, 100%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
          },
        }}
      >
        <CardContent sx={{ p: 5, position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 4 }}>
            <Box sx={{ position: "relative", width: 220, height: 90, display: "block", mb: 3 }}>
              <Image
                alt="Logo ArquivaDoc"
                src="/image/logo.png"
                fill
                style={{ objectFit: "cover", zIndex: 1 }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "700",
                background: "linear-gradient(45deg, #ffffff, #e0e0e0, #ffffff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                mb: 1,
              }}
            >
              Esqueceu sua senha?
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Informe seu e-mail para receber um link de recuperacao
            </Typography>
          </Box>

          {sent ? (
            <Box sx={{ textAlign: "center" }}>
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "rgba(35, 113, 23, 0.15)",
                  color: "#4caf50",
                  "& .MuiAlert-icon": { color: "#4caf50" }
                }}
              >
                Se o e-mail estiver cadastrado, voce recebera um link de redefinicao.
              </Alert>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/")}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  color: "rgba(255,255,255,0.8)",
                  borderColor: "rgba(255,255,255,0.2)",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    borderColor: "#237117",
                    color: "#237117",
                  }
                }}
              >
                Voltar ao Login
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "#237117" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(35, 113, 23, 0.5)",
                      },
                      "&.Mui-focused": {
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "2px solid #237117",
                      },
                      "& fieldset": { border: "none" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": { color: "#237117" },
                    },
                    "& .MuiOutlinedInput-input": { color: "white" },
                  }}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || !email}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  textTransform: "none",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #237117, #2e8b1e, #1e5f13)",
                  color: "white",
                  mb: 2,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 20px 40px rgba(35, 113, 23, 0.4)",
                  },
                  "&:disabled": {
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={24} sx={{ color: "white" }} />
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: "700" }}>
                      Enviando...
                    </Typography>
                  </Box>
                ) : (
                  "Enviar Link"
                )}
              </Button>

              <Button
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/")}
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "none",
                  "&:hover": { color: "#237117" }
                }}
              >
                Voltar ao Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EsqueciSenhaPage;
