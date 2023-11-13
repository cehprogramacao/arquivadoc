import { AutoComplete } from "@/Components/AutoComplete"
import { Buttons } from "@/Components/Button/Button"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import Header from "@/Components/Header/Header"
import { DocList } from "@/Components/List/DocList"
import { Box, Button, TextField, Typography } from "@mui/material"
import { TermosTable } from "./tableTermos/table"
import { useState } from "react"



const PageTermos = ({ data }) => {
    const docs = [
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },


    ]
    const top100Films = [
        {
            label: 'Número '
        },
        {
            label: 'Caixa'
        },
    ];
    const [rows, setRows] = useState([
        { id: 1, numero: '8231', caixa: 2, parte: 'Alice Johnson', cartao: '123456' },
        { id: 2, numero: '1234', caixa: 1, parte: 'Bob Smith', cartao: '234567' },
        { id: 3, numero: '5678', caixa: 3, parte: 'Charlie Brown', cartao: '345678' },
        { id: 4, numero: '9876', caixa: 4, parte: 'David Lee', cartao: '456789' },
        { id: 5, numero: '5432', caixa: 2, parte: 'Eva Miller', cartao: '567890' },
        { id: 6, numero: '1122', caixa: 1, parte: 'Frank Wilson', cartao: '678901' },
        { id: 7, numero: '9988', caixa: 3, parte: 'Grace Davis', cartao: '789012' },
        { id: 8, numero: '6655', caixa: 4, parte: 'Henry Taylor', cartao: '890123' },
        { id: 9, numero: '4477', caixa: 2, parte: 'Ivy Thomas', cartao: '901234' },
        { id: 10, numero: '2255', caixa: 1, parte: 'Jack Robinson', cartao: '012345' },
    ]);
    const handleButtonLixeira = () => {
        setRows([])
    }
    const handleExcluir = (id) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
    };
    
    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            marginTop: 11,
            position: 'relative',
            padding: '30px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} sx={{ margin: '0 auto' }} >
                TERMOS
            </Typography>
            <div style={{
                maxWidth: '1200px',
                height: 'auto',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '70px',
                margin: '0 auto',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    <TextField label="Buscar"
                        sx={{
                            width: 400,
                            '& input': {
                                color: 'success.main',
                            },
                        }} color="success" />
                    <AutoComplete data={top100Films}/>
                </div>
                <Button variant="contained" sx={{
                    background: '#247117',
                    padding: '14px 10px',
                    ":hover": {
                        background: '#247117'
                    }
                }}>
                    BUSCAR
                </Button>
                <ButtonLixeira onClick={handleButtonLixeira} />
            </div>
            <TermosTable data={rows} onClick={handleExcluir} />
        </Box>
    )
}

export default PageTermos