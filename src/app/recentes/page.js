"use client"
import All from "@/services/all.service"
import withAuth from "@/utils/withAuth"
import { Box, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Snackbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Loading from "../loading"
import Image from "next/image"
import { AuthProvider, useAuth } from "@/context"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { showAlert } from "@/store/actions"


const fontParams = {
    fontSize: { lg: '2.125rem', md: '1.813rem', sm: "1.563rem", xs: "1.25rem" }
}
const fontParamsBody = {
    fontSize: { lg: '1.563rem', md: '1.25rem', sm: "1.125rem", xs: "0.938rem" }
}
const Recentes = () => {
    const { permissions } = useAuth()
    const [data, setData] = useState({});
    const [countRecentsFile, setCountRecentsFile] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    let newAlerts;

    const getAllRecents = async () => {
        const { getAllRecents } = new All();
        try {
            setLoading(true);
            const accessToken = sessionStorage.getItem("accessToken");
            const response = await getAllRecents(accessToken);
            setData(response.data);
            console.log(response.data)
            countRecentsFiles(response.data);
            checkEmptyDataWithPermissions(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados de recentes!", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const checkEmptyDataWithPermissions = (dataObject) => {
        permissions.forEach(permission => {
            const { public_name, view } = permission;
            if (view === 1) {
                const isEmpty = !(public_name in dataObject) || Object.keys(dataObject[public_name]).length === 0;
                if (isEmpty) {
                    dispatch(showAlert(`A seção ${public_name} não possui documentos recentes.`, "success", "file"));
                }
            }
        });

    };

    const countRecentsFiles = (dataObject) => {
        let totalCount = 0;

        for (const key in dataObject) {
            const value = dataObject[key];

            if (Array.isArray(value)) {
                totalCount += value.length;
            } else if (typeof value === 'object' && value !== null) {
                totalCount += Object.keys(value).length;
            }
        }

        setCountRecentsFile(totalCount);
    };

    useEffect(() => {
        getAllRecents();
    }, []);

    return loading ? <Loading /> : (
        <AuthProvider>
            <Box sx={{
                width: "100%",
                height: "100vh",
            }}
            >
                <Container fixed>
                    <Grid container sx={{ py: 17 }} spacing={3}>
                        <Grid item container direction="column"
                            xs={12} justifyContent={"flex-start"} alignItems={"flex-start"}>
                            <Grid item >
                                <Typography
                                    sx={{ ...fontParams }}
                                    variant="h4"
                                    fontWeight="500"
                                    color="#000"
                                >
                                    Recentes
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Typography variant="h6" color="#" fontWeight="400" sx={{ ...fontParamsBody }}>
                                    Total de Arquivos Recentes: {countRecentsFile}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={2}>
                            {permissions[6]?.view === 1 && "Notas" in data && typeof data["Notas"] === 'object' && Object.keys(data["Notas"]).length > 0 && (
                                <Grid item container spacing={0}>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-start"
                                        }}>
                                            <Typography
                                                color="#000"
                                                fontWeight={500}
                                                sx={{ fontSize: 20 }}
                                            >
                                                {permissions[6]?.public_name}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        {"Notas" in data && typeof data["Notas"] === 'object' && Object.values(data["Notas"]).map((item, index) => (
                                            <>
                                                <Grid item key={index} xs={6} sm={6} md={3} lg={2}>
                                                    <List sx={{ width: '100%' }} >
                                                        <ListItem sx={{ cursor: 'pointer' }} >
                                                            <ListItemAvatar>
                                                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primaryTypographyProps={{
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                }}

                                                                primary={item.presenterDocument}
                                                                secondary={`por ${item.presenterName}`}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        ))}
                                        <Grid item xs={12} sm={6} md={3} lg={2}>
                                            <Link href="/notes">
                                                <Button variant="container"
                                                    sx={{
                                                        bgcolor: "#247117",
                                                        border: "1px solid #247117",
                                                        color: "#fff",
                                                        mt: 5,
                                                        ml: 3,
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}>
                                                    Ver mais
                                                </Button>
                                            </Link>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                            {permissions[0]?.view === 1 && "Protesto" in data && typeof data["Protesto"] === 'object' && Object.keys(data["Protesto"]).length > 0 && (
                                <Grid item container spacing={0}>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-start"
                                        }}>
                                            <Typography
                                                color="#000"
                                                fontWeight={500}
                                                sx={{ fontSize: 20 }}
                                            >
                                                {permissions[0]?.public_name}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        {"Protesto" in data && typeof data["Protesto"] === 'object' && Object.values(data["Protesto"]).map((item, index) => (
                                            <>
                                                <Grid item key={index} xs={12} sm={6} md={3} lg={2}>
                                                    <List sx={{ width: '100%' }} >
                                                        <ListItem sx={{ cursor: 'pointer' }} >
                                                            <ListItemAvatar>
                                                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primaryTypographyProps={{
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                }}

                                                                primary={item.presenterDocument}
                                                                secondary={`por ${item.presenterName}`}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        ))}
                                        <Grid item xs={12} sm={6} md={3} lg={2}>
                                            <Link href="/protest">
                                                <Button variant="container"
                                                    sx={{
                                                        bgcolor: "#247117",
                                                        border: "1px solid #247117",
                                                        color: "#fff",
                                                        mt: 5,
                                                        ml: 3,
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}>
                                                    Ver mais
                                                </Button>
                                            </Link>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                            {permissions[4]?.view === 1 && "Ofícios" in data && typeof data["Ofícios"] === 'object' && Object.keys(data["Ofícios"]).length > 0 && (
                                <Grid item container spacing={0}>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-start"
                                        }}>
                                            <Typography
                                                color="#000"
                                                fontWeight={500}
                                                sx={{ fontSize: 20 }}
                                            >
                                                {permissions[4]?.public_name}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        {"Ofícios" in data && typeof data["Ofícios"] === 'object' && Object.values(data["Ofícios"]).map((item, index) => (
                                            <>
                                                <Grid item key={index} xs={6} sm={6} md={3} lg={2}>
                                                    <List sx={{ width: '100%' }} >
                                                        <ListItem sx={{ cursor: 'pointer' }} >
                                                            <ListItemAvatar>
                                                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primaryTypographyProps={{
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                }}

                                                                primary={item.entityName}
                                                                secondary={`por ${item.box}`}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        ))}
                                        <Grid item xs={12} sm={6} md={3} lg={2}>
                                            <Link href="/calling">
                                                <Button variant="container"
                                                    sx={{
                                                        bgcolor: "#247117",
                                                        border: "1px solid #247117",
                                                        color: "#fff",
                                                        mt: 3,
                                                        ml: 3,
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}>
                                                    Ver mais
                                                </Button>
                                            </Link>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                            {permissions[1]?.view === 1 && "RGI" in data && typeof data["RGI"] === 'object' && Object.keys(data["RGI"]).length > 0 && (
                                <Grid item container spacing={0}>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-start"
                                        }}>
                                            <Typography
                                                color="#000"
                                                fontWeight={500}
                                                sx={{ fontSize: 20 }}
                                            >
                                                {permissions[1]?.public_name}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        {"RGI" in data && typeof data["RGI"] === 'object' && Object.values(data["RGI"]).map((item, index) => (
                                            <>
                                                <Grid item key={index} xs={6} sm={6} md={3} lg={2}>
                                                    <List sx={{ width: '100%' }} >
                                                        <ListItem sx={{ cursor: 'pointer' }} >
                                                            <ListItemAvatar>
                                                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primaryTypographyProps={{
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                }}

                                                                primary={item.presenterDocument}
                                                                secondary={`por ${item.presenterName}`}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        ))}
                                        <Grid item xs={12} sm={6} md={3} lg={2}>
                                            <Link href="/calling">
                                                <Button variant="container"
                                                    sx={{
                                                        bgcolor: "#247117",
                                                        border: "1px solid #247117",
                                                        color: "#fff",
                                                        mt: 3,
                                                        ml: 3,
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}>
                                                    Ver mais
                                                </Button>
                                            </Link>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                            {permissions[2]?.view === 1 && "RTD" in data && typeof data["RTD"] === 'object' && Object.keys(data["RTD"]).length > 0 && (
                                <Grid item container spacing={0}>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-start"
                                        }}>
                                            <Typography
                                                color="#000"
                                                fontWeight={500}
                                                sx={{ fontSize: 20 }}
                                            >
                                                {permissions[2]?.public_name}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        {"RTD" in data && typeof data["RTD"] === 'object' && Object.values(data["RTD"]).map((item, index) => (
                                            <>
                                                <Grid item key={index} xs={6} sm={6} md={3} lg={2}>
                                                    <List sx={{ width: '100%' }} >
                                                        <ListItem sx={{ cursor: 'pointer' }} >
                                                            <ListItemAvatar>
                                                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primaryTypographyProps={{
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                }}

                                                                primary={item.presenterDocument}
                                                                secondary={`por ${item.presenterName}`}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        ))}
                                        <Grid item xs={12} sm={6} md={3} lg={2}>
                                            <Link href="/calling">
                                                <Button variant="container"
                                                    sx={{
                                                        bgcolor: "#247117",
                                                        border: "1px solid #247117",
                                                        color: "#fff",
                                                        mt: 3,
                                                        ml: 3,
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}>
                                                    Ver mais
                                                </Button>
                                            </Link>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                            {permissions[3]?.view === 1 && "RPJ" in data && typeof data["RPJ"] === 'object' && Object.keys(data["RPJ"]).length > 0 && (
                                <Grid item container spacing={0}>
                                    <Grid item xs={12}>
                                        <Box sx={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-start"
                                        }}>
                                            <Typography
                                                color="#000"
                                                fontWeight={500}
                                                sx={{ fontSize: 20 }}
                                            >
                                                {permissions[3]?.public_name}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} container>
                                        {"RPJ" in data && typeof data["RPJ"] === 'object' && Object.values(data["RPJ"]).map((item, index) => (
                                            <>
                                                <Grid item key={index} xs={6} sm={6} md={3} lg={2}>
                                                    <List sx={{ width: '100%' }} >
                                                        <ListItem sx={{ cursor: 'pointer' }} >
                                                            <ListItemAvatar>
                                                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primaryTypographyProps={{
                                                                    color: 'black',
                                                                    fontWeight: 'bold',
                                                                }}

                                                                primary={item.presenterDocument}
                                                                secondary={`por ${item.presenterName}`}
                                                            />
                                                        </ListItem>
                                                    </List>
                                                </Grid>
                                            </>
                                        ))}
                                        <Grid item xs={12} sm={6} md={3} lg={2}>
                                            <Link href="/calling">
                                                <Button variant="container"
                                                    sx={{
                                                        bgcolor: "#247117",
                                                        border: "1px solid #247117",
                                                        color: "#fff",
                                                        mt: 3,
                                                        ml: 3,
                                                        ":hover": {
                                                            bgcolor: "#fff",
                                                            color: "#247117",
                                                        }
                                                    }}>
                                                    Ver mais
                                                </Button>
                                            </Link>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Container>
                <Snackbar />
            </Box>
        </AuthProvider>
    )
}

export default withAuth(Recentes)