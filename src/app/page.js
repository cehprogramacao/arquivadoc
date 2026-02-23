"use client";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
  Alert
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { login } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SET_ALERT, SET_LOGIN_DATA } from "@/store/actions";
import SnackBar from "@/Components/SnackBar";
import Image from "next/image";

// Schema de validação
const validationSchema = Yup.object({
  email: Yup.string()
    .email("E-mail inválido")
    .required("E-mail é obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: ""
  };


  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const { data } = await login(values);
      const { accessToken, refreshToken, isAdmin } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      dispatch({
        type: SET_ALERT,
        message: "Login realizado com sucesso!",
        alertType: "success",
        severity: "success"
      });
      dispatch({ type: SET_LOGIN_DATA });
      setTimeout(() => {
        router.push('/bem-vindo');
      }, 1500);

    } catch (err) {
      dispatch({
        type: SET_ALERT,
        message: "Erro ao realizar login!",
        alertType: "success",
        severity: "success"
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // agora rodando no cliente
  }, []);

  if (!isClient) return null;

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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 35px 70px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          },
          // Efeito de borda animada
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
            "0%, 100%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
          },
        }}
      >
        <CardContent sx={{ p: 5, position: "relative" }}>
          {/* Elementos decorativos flutuantes */}
          <Box
            sx={{
              position: "absolute",
              top: -10,
              right: -10,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(45deg, rgba(35, 113, 23, 0.3), rgba(46, 139, 30, 0.2))",
              filter: "blur(20px)",
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": {
                  transform: "translateY(0px) rotate(0deg)",
                },
                "50%": {
                  transform: "translateY(-20px) rotate(180deg)",
                },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -5,
              left: -5,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(35, 113, 23, 0.4), rgba(30, 95, 19, 0.3))",
              filter: "blur(15px)",
              animation: "float2 4s ease-in-out infinite",
              animationDelay: "2s",
              "@keyframes float2": {
                "0%, 100%": {
                  transform: "translateX(0px) rotate(0deg)",
                },
                "50%": {
                  transform: "translateX(15px) rotate(-90deg)",
                },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              mb: 5,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 220,
                height: 90,
                display: "block",
                mb: 4
              }}
            >
              <Image
                alt="Logo ArquivaDoc"
                src="/image/logo.png"
                fill
                style={{
                  objectFit: "cover",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                }}
              />
            </Box>


            <Box
              sx={{
                textAlign: "center",
                animation: "fadeInUp 0.8s ease-out",
                "@keyframes fadeInUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0px)",
                  },
                },
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "700",
                  background: "linear-gradient(45deg, #ffffff, #e0e0e0, #ffffff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: "center",
                  mb: 1,
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  animation: "glow 2s ease-in-out infinite alternate",
                  "@keyframes glow": {
                    "0%": {
                      textShadow: "0 2px 10px rgba(255, 255, 255, 0.2)",
                    },
                    "100%": {
                      textShadow: "0 2px 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(35, 113, 23, 0.3)",
                    },
                  },
                }}
              >
                Bem-vindo
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  fontWeight: 300,
                }}
              >
                Entre na sua conta com estilo
              </Typography>
            </Box>
          </Box>

          {/* Formulário */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
              <Form>
                <Box sx={{ mb: 3 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="email"
                    name="email"
                    label="E-mail ou Usuário"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={isLoading || isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{
                              color: "#237117",
                              animation: values.email ? "pulse 2s ease-in-out infinite" : "none",
                              "@keyframes pulse": {
                                "0%, 100%": {
                                  opacity: 1,
                                },
                                "50%": {
                                  opacity: 0.7,
                                },
                              },
                            }}
                          />
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
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "2px solid #237117",
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(35, 113, 23, 0.3)",
                        },
                        "& fieldset": {
                          border: "none",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                        "&.Mui-focused": {
                          color: "#237117",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "white",
                        "&::placeholder": {
                          color: "rgba(255, 255, 255, 0.5)",
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#ff6b6b",
                        background: "rgba(255, 107, 107, 0.1)",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        margin: "4px 0 0 0",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="password"
                    name="password"
                    label="Senha"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={isLoading || isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon
                            sx={{
                              color: "#237117",
                              animation: values.password ? "shake 0.5s ease-in-out" : "none",
                              "@keyframes shake": {
                                "0%, 100%": {
                                  transform: "translateX(0)",
                                },
                                "25%": {
                                  transform: "translateX(-2px)",
                                },
                                "75%": {
                                  transform: "translateX(2px)",
                                },
                              },
                            }}
                          />
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
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                        },
                        "&.Mui-focused": {
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "2px solid #237117",
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(35, 113, 23, 0.3)",
                        },
                        "& fieldset": {
                          border: "none",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                        "&.Mui-focused": {
                          color: "#237117",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "white",
                        "&::placeholder": {
                          color: "rgba(255, 255, 255, 0.5)",
                        },
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#ff6b6b",
                        background: "rgba(255, 107, 107, 0.1)",
                        borderRadius: "4px",
                        padding: "2px 8px",
                        margin: "4px 0 0 0",
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading || isSubmitting || !isValid || !dirty}
                  sx={{
                    py: 2,
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    textTransform: "none",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(45deg, #237117, #2e8b1e, #1e5f13)",
                    backgroundSize: "200% 200%",
                    border: "2px solid transparent",
                    color: "white",
                    transition: "all 0.3s ease",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                      transition: "all 0.5s ease",
                    },
                    "&:hover": {
                      backgroundPosition: "100% 100%",
                      transform: "translateY(-3px)",
                      boxShadow: "0 20px 40px rgba(35, 113, 23, 0.4), 0 0 20px rgba(35, 113, 23, 0.3)",
                      "&:before": {
                        left: "100%",
                      },
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                    },
                    "&:disabled": {
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.5)",
                      boxShadow: "none",
                      transform: "none",
                    },
                    animation: isValid && dirty ? "pulse 2s ease-in-out infinite" : "none",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        boxShadow: "0 10px 25px rgba(35, 113, 23, 0.3)",
                      },
                      "50%": {
                        boxShadow: "0 15px 35px rgba(35, 113, 23, 0.5), 0 0 20px rgba(35, 113, 23, 0.2)",
                      },
                    },
                  }}
                >
                  {isLoading || isSubmitting ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "white",
                          animation: "spin 1s linear infinite",
                          "@keyframes spin": {
                            "0%": {
                              transform: "rotate(0deg)",
                            },
                            "100%": {
                              transform: "rotate(360deg)",
                            },
                          },
                        }}
                      />
                      <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                        Entrando...
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: "700" }}>
                      Entrar
                    </Typography>
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              onClick={() => router.push("/esqueci-senha")}
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                textDecoration: "none",
                position: "relative",
                padding: "8px 16px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#237117",
                  background: "rgba(35, 113, 23, 0.1)",
                  border: "1px solid rgba(35, 113, 23, 0.3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Esqueceu sua senha?
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: "0.8rem",
                animation: "fadeIn 2s ease-in-out",
                "@keyframes fadeIn": {
                  "0%": {
                    opacity: 0,
                  },
                  "100%": {
                    opacity: 1,
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4caf50",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 1,
                    },
                    "50%": {
                      opacity: 0.5,
                    },
                  },
                }}
              />
              Conexao Segura SSL
            </Box>
          </Box>
        </CardContent>
      </Card>

    </Box>
  );
};

export default LoginPage;