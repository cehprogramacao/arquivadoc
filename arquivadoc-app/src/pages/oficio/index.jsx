import { AutoComplete } from "@/Components/AutoComplete"
import { Buttons } from "@/Components/Button/Button"
import { ButtonLixeira } from "@/Components/ButtonLixeira"
import { ButtonOpenModals } from "@/Components/ButtonOpenModals"
import Header from "@/Components/Header/Header"
import { DocList } from "@/Components/List/DocList"
import { Box, TextField, Typography } from "@mui/material"

const PageOficio = () => {
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
            marginTop: 8,
            position: 'relative',
            padding: '30px 0',
            display: 'flex',
            flexDirection: 'column',

            gap: '30px',
        }}>
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} align="center">
                Ofícios
            </Typography>
            <div style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '60px',
                placeContent: 'center'
            }}>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40}}>
                    <TextField label="Buscar" sx={{ width: 340, '& input': {color: 'success.main'}}} color="success"/>
                    <AutoComplete data={top100Films} />
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 30}}>
                <Buttons color={'green'} title={'Buscar'} />
                <ButtonOpenModals />
                <ButtonLixeira />
                </div>
            </div>

            <DocList data={docs} />
        </Box>
    )
}
export default PageOficio