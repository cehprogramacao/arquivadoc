"use client"
import { Box, Button, Typography, Container, Paper } from "@mui/material"
import { ArrowBack, DeleteOutline } from "@mui/icons-material"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LixeiraTable } from "./tableLixeira"
import { AuthProvider } from "@/context"
import PrivateRoute from "@/utils/LayoutPerm"

const LixeiraTermos = ({ data }) => {
    const router = useRouter()

    const docs = [
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
    ]

    const labels = [
        {
            label: 'Número'
        },
        {
            label: 'Caixa'
        },
    ];

    const [rows, setRows] = useState([
        {
            id: 1,
            numero: '8231',
            caixa: 2,
            parte: 'Alice Johnson',
            cartao: '123456'
        },
        {
            id: 2,
            numero: '1234',
            caixa: 1,
            parte: 'Bob Smith',
            cartao: '234567'
        },
        {
            id: 3,
            numero: '5678',
            caixa: 3,
            parte: 'Charlie Brown',
            cartao: '345678'
        },
        {
            id: 4,
            numero: '9876',
            caixa: 4,
            parte: 'David Lee',
            cartao: '456789'
        },
        {
            id: 5,
            numero: '5432',
            caixa: 2,
            parte: 'Eva Miller',
            cartao: '567890'
        },
        {
            id: 6,
            numero: '1122',
            caixa: 1,
            parte: 'Frank Wilson',
            cartao: '678901'
        },
        {
            id: 7,
            numero: '9988',
            caixa: 3,
            parte: 'Grace Davis',
            cartao: '789012'
        },
        {
            id: 8,
            numero: '6655',
            caixa: 4,
            parte: 'Henry Taylor',
            cartao: '890123'
        },
        {
            id: 9,
            numero: '4477',
            caixa: 2,
            parte: 'Ivy Thomas',
            cartao: '901234'
        },
        {
            id: 10,
            numero: '2255',
            caixa: 1,
            parte: 'Jack Robinson',
            cartao: '012345'
        },
    ]);

    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };

    const [select, setSelect] = useState(null);
    const [valueInput, setValueInput] = useState('')
    const handleBuscar = () => {

    };

    return (
        <AuthProvider>
            <PrivateRoute requiredPermissions={['Cadastros']}>
                <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f7fa', pt: 12, pb: 6, px: 2 }}>
                    <Container maxWidth="lg">
                        {/* Header */}
                        <Box sx={{ mb: 4 }}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => router.back()}
                                sx={{ mb: 2, color: '#666', textTransform: 'none', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                            >
                                Voltar
                            </Button>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 3,
                                    background: 'linear-gradient(135deg, #ef5350 0%, #c62828 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 14px rgba(239,83,80,0.3)'
                                }}>
                                    <DeleteOutline sx={{ color: '#fff', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight={700} color="#1a1a1a">
                                        Lixeira - Termos
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {rows?.length || 0} {rows?.length === 1 ? 'item encontrado' : 'itens encontrados'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Content */}
                        <Paper elevation={0} sx={{
                            borderRadius: 3, border: '1px solid #e5e7eb',
                            overflow: 'hidden', bgcolor: '#fff'
                        }}>
                            {rows && rows.length > 0 ? (
                                <LixeiraTable data={rows} onClick={handleExcluir} />
                            ) : (
                                <Box sx={{
                                    py: 10, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 2
                                }}>
                                    <DeleteOutline sx={{ fontSize: 64, color: '#e0e0e0' }} />
                                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                        A lixeira esta vazia
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        Itens excluidos aparecerao aqui
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Container>
                </Box>
            </PrivateRoute>
        </AuthProvider>
    )
}

export default LixeiraTermos
