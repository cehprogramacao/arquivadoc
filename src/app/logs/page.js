"use client"
import { Box,Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { LogsTable } from "./tableLogs";


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
            marginTop: 11,
            position: 'relative',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} color={"black"}>
                Visualizar Logs
            </Typography>
            <LogsTable data={rows} />
        </Box>
    )
}
export default PageLogs