"use client";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  VpnKey
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ResetPassword } from "@/services/auth.service";
import Image from "next/image";

const ResetPasswordPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const validatePassword = (pass) => ({
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    lowercase: /[a-z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
  });

  const getPasswordStrength = (pass) => {
    const v = validatePassword(pass);
    const score = Object.values(v).filter(Boolean).length;
    if (score === 0) return { value: 0, label: "", color: "" };
    if (score <= 2) return { value: 40, label: "Fraca", color: "#e53e3e" };
    if (score === 3) return { value: 60, label: "Media", color: "#d69e2e" };
    if (score === 4) return { value: 80, label: "Boa", color: "#38a169" };
    return { value: 100, label: "Excelente", color: "#247117" };
  };

  const validations = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setError("A senha nao atende todos os requisitos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      await ResetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Token invalido ou expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <Box
      sx={{
        background: 'url("/image/bg.jpg") no-repeat center center fixed',
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
          width: { xs: "100%", sm: 520 },
          maxWidth: 520,
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
              Redefinir Senha
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Crie uma nova senha para sua conta
            </Typography>
          </Box>

          {success ? (
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
                Senha redefinida com sucesso! Redirecionando para o login...
              </Alert>
              <CircularProgress size={30} sx={{ color: "#237117" }} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Nova Senha */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Nova Senha"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#237117" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "rgba(255,255,255,0.5)" }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&.Mui-focused": { background: "rgba(255, 255, 255, 0.1)", border: "2px solid #237117" },
                      "& fieldset": { border: "none" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)", "&.Mui-focused": { color: "#237117" } },
                    "& .MuiOutlinedInput-input": { color: "white" },
                  }}
                />

                {/* Strength meter */}
                {password && (
                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                        Forca da senha
                      </Typography>
                      <Typography variant="caption" fontWeight={600} sx={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength.value}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "& .MuiLinearProgress-bar": { backgroundColor: passwordStrength.color, borderRadius: 3 }
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Confirmar Senha */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey sx={{ color: "#237117" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: "rgba(255,255,255,0.5)" }}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&.Mui-focused": { background: "rgba(255, 255, 255, 0.1)", border: "2px solid #237117" },
                      "& fieldset": { border: "none" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)", "&.Mui-focused": { color: "#237117" } },
                    "& .MuiOutlinedInput-input": { color: "white" },
                  }}
                />
              </Box>

              {/* Requisitos da senha */}
              <Box sx={{ mb: 3 }}>
                <List dense sx={{ p: 0 }}>
                  {[
                    { key: "length", label: "Minimo de 8 caracteres" },
                    { key: "uppercase", label: "Uma letra maiuscula" },
                    { key: "lowercase", label: "Uma letra minuscula" },
                    { key: "number", label: "Um numero" },
                    { key: "special", label: "Um caractere especial" },
                  ].map(({ key, label }) => (
                    <ListItem key={key} sx={{ px: 0, py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {validations[key] ? (
                          <CheckCircle sx={{ color: "#4caf50", fontSize: 18 }} />
                        ) : (
                          <Cancel sx={{ color: "rgba(255,255,255,0.2)", fontSize: 18 }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontSize: "0.8rem",
                          color: validations[key] ? "#4caf50" : "rgba(255,255,255,0.4)"
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
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
                disabled={isLoading || !password || !confirmPassword}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  textTransform: "none",
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #237117, #2e8b1e, #1e5f13)",
                  color: "white",
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
                      Redefinindo...
                    </Typography>
                  </Box>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPasswordPage;
