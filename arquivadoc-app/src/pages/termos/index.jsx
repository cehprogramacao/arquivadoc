import { AutoComplete } from "@/Components/AutoComplete"
import { Buttons } from "@/Components/Button/Button"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import Header from "@/Components/Header/Header"
import { DocList } from "@/Components/List/DocList"
import { Box, Button, TextField, Typography } from "@mui/material"
import { TermosTable } from "./tableTermos/table"



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
            <Typography fontSize={30} fontWeight={'bold'} sx={{margin: '0 auto'}} >
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
                <div style={{ display: 'flex',alignItems: 'center', gap: 30 }}>
                    <TextField label="Buscar" sx={{ width: '100%' }} />
                    <AutoComplete data={top100Films} />
                </div>
                <Button variant="contained" sx={{
                    background: '#247117',
                    padding: '14px 10px'
                }}>
                    BUSCAR
                </Button>
                <ButtonLixeira />
            </div>
            <TermosTable />
        </Box>
    )
}

export default PageTermos