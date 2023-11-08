import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { Search } from '@mui/icons-material';


export const Buttons = ({title, color}) => {
    return (
        <Stack>
            <Button color='inherit' sx={{
                display: 'flex',
                width: '110px',
                padding: '15px 0px',
                fontSize: '11px',
                gap: '5px',
                background: `${color}`,
                color: '#fff',
                ":hover": {
                    background: `${color}`
                }
            }} variant='contained'>
                <Search sx={{
                    width: '20px',
                    height: '20px'
                }} />
                {title}
            </Button>
        </Stack>
    )
}