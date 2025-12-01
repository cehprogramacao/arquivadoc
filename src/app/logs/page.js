"use client"
import { Box, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { LogsTable } from "./tableLogs";
import CustomContainer from "@/Components/CustomContainer";
import withIsAdmin from "@/utils/isAdmin";
import All from "@/services/all.service";
import Loading from "@/Components/loading";


const allSv = new All()
const PageLogs = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)


    const getAllLogs = async () => {
        try {
            setLoading(true)
            const data = await allSv.getLogs()
            console.log(data)
            setRows(Object.values(data))
            return data
        } catch (error) {
            console.error("Erro ao listar logs", error)
            throw error;
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllLogs()
    }, []);


    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <>
            {loading ? <Loading />
                :
                <Box sx={{
                    width: '100%',
                    height: '100vh',
                    position: 'relative',
                    display: 'flex',
                    px: 3,
                    py: 15
                }}>
                    <CustomContainer >
                        <Grid container alignItems={"center"} justifyContent={"center"}>
                            <Grid item xs={12} >
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Typography fontSize={30} fontWeight={'bold'} color={"black"}>
                                        Visualizar Logs
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} >
                                <LogsTable data={rows} />
                            </Grid>
                        </Grid>
                    </CustomContainer>
                </Box>
            }
        </>
    )
}
export default withIsAdmin(PageLogs)