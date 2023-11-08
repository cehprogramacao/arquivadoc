import { Box, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Buttons } from '@/Components/Button/Button';
import { ButtonLixeira } from '@/Components/ButtonLixeira';

const top100Films = [
    {
        label: 'teste1'
    },
    {
        label: 'teste2'
    }
];

export const PageRGI = () => {
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
            <Typography fontSize={30} fontWeight={'bold'} >
                RGI
            </Typography>
            <div style={{
                height: '40px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '70px',
                margin: '0 auto'
            }}>
                <TextField label="Buscar"  />
                <Autocomplete
                    
                    disablePortal
                    id="combo-box-demo"
                    options={top100Films}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Buscar Por" sx={{ borderColor: 'green' }} />}
                />
                <Buttons color={'green'} title={'Buscar'} />
                <ButtonLixeira />
            </div>
        </Box>
    );
};
