import { Box, TextField, Typography } from '@mui/material';

import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';
import { AutoComplete } from '@/Components/AutoComplete';
import Header from '@/Components/Header/Header';


const CartorioDocs = ({ data }) => {
    const top100Films = [
        {
            label: 'Ordem'
        },
        {
            label: 'Livro'
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
            gap: '10px'
        }}>
            <Header />
            <Typography fontSize={30} fontWeight={'bold'} >
                Notas
            </Typography>
            <div style={{
                width: '100%',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                marginTop: 20,
                placeContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    <TextField label="Buscar" sx={{ width: 400, '& input': { } }} inputProps={{
                        
                    }} />
                    <AutoComplete data={top100Films} />
                </div>
                <Buttons color={'green'} title={'Buscar'} />
                <ButtonLixeira />
            </div>
        </Box>
    )
}
export default CartorioDocs