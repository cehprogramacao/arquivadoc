import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';


export const Buttons = ({title, color}) => {
    return (
        <Stack>
            <Button color='inherit' sx={{
                background: `${color}`,
                color: '#fff',
                ":hover": {
                    background: `${color}`
                }
            }} variant='contained'>
                {title}
            </Button>
        </Stack>
    )
}