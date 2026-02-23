"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Header from "@/Components/Header/Header";
import { CLOSE_ALERT, SET_LOGIN_DATA } from "@/store/actions";
import theme from "@/theme/theme";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import store from "@/store";
import { AuthProvider } from "@/context";
import SnackBar from "@/Components/SnackBar";

// Componente separado para lidar com sessão e alertas
const Session = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);

  useEffect(() => {
    dispatch({ type: SET_LOGIN_DATA });
  }, [dispatch]);

  return (
    <SnackBar
      open={alert.open}
      onClose={() => dispatch({ type: CLOSE_ALERT })}
      message={alert.message}
      severity={alert.severity}
      alertType={alert.alertType}
    />
  );
};

const publicPages = ["/", "/esqueci-senha"];

const AppTemplate = ({ children }) => {
  const path = usePathname();
  const isPublic = publicPages.includes(path) || path.startsWith("/reset/");

  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isPublic && <Header />}
      <Session />
      <Box>{children}</Box>
    </ThemeProvider>
  );
};

export default function Template({ children }) {
  const path = usePathname();
  const isPublic = publicPages.includes(path) || path.startsWith("/reset/");

  const content = <AppTemplate>{children}</AppTemplate>;

  return (
    <Provider store={store}>
      {!isPublic ? <AuthProvider>{content}</AuthProvider> : content}
    </Provider>
  );
}
