import { AutoComplete } from "@/Components/AutoComplete"
import { Buttons } from "@/Components/Button/Button"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import Header from "@/Components/Header/Header"
import { DocList } from "@/Components/List/DocList"
import { Box, TextField, Typography } from "@mui/material"

const PageProtestos = ({data}) => {
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
            alignItems: 'center',
            gap: '10px',
            justifyContent: 'space-between'
        }}>
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} >
                PROTESTO
            </Typography>
            <div style={{
                height: '40px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                margin: '0 auto',
                justifyContent: 'space-between',

            }}>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 30}}>
                    <TextField label="Buscar" sx={{ width: 300 }} />
                    <AutoComplete data={top100Films} />
                </div>
                <Buttons color={'green'} title={'Buscar'} />
                <ButtonLixeira />
            </div>

            <DocList data={docs} />
        </Box>
    )
}
export default PageProtestos