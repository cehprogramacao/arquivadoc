"use client"
import { Box, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { LogsTable } from "./tableLogs";
import CustomContainer from "@/Components/CustomContainer";
import withIsAdmin from "@/utils/isAdmin";


const PageLogs = ({ data }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        setCurrentTime(new Date());
    }, []);
    const [rows, setRows] = useState([
        {
            id: 1,
            usuario: 'Kauan BrTech',
            categoria: 'admin',
            registro: '9991',
            acao: 'Criação',
            dataEhora: currentTime.toString()
        },
        {
            id: 2,
            usuario: 'Kauan BrTech',
            categoria: 'admin',
            registro: '123',
            acao: 'Exclusão',
            dataEhora: currentTime
        }
    ]);

    return (
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
                                width:"100%",
                                display:"flex",
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
    )
}
export default withIsAdmin(PageLogs)