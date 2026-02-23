"use client"
import { Box, Container, Grid, Typography, Paper } from "@mui/material"
import { HistoryOutlined } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { LogsTable } from "./tableLogs";
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
                    minHeight: '100vh',
                    bgcolor: '#f5f7fa',
                    pt: 12,
                    pb: 6,
                    px: 2
                }}>
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 3,
                                    background: 'linear-gradient(135deg, #237117 0%, #1a5511 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(35,113,23,0.3)'
                                }}>
                                    <HistoryOutlined sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} color="#1a1a1a">
                                        Logs do Sistema
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {rows?.length || 0} {rows?.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Table */}
                        <Paper elevation={0} sx={{
                            borderRadius: 3,
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            bgcolor: '#fff'
                        }}>
                            <LogsTable data={rows} />
                        </Paper>
                    </Container>
                </Box>
            }
        </>
    )
}
export default withIsAdmin(PageLogs)
