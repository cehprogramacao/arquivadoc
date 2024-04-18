import { Button } from '@mui/material';
import { Search } from '@mui/icons-material';
export const Buttons = ({ title, color, onClick }) => {
    return (
        <>
            <Button color='inherit' sx={{
                display: 'flex',
                py: 2,
                px: 2,
                fontSize: '11px',
                gap: '5px',
                background: `${color}`,
                color: '#fff',
                ":hover": {
                    background: `${color}`
                }
            }} variant='contained' onClick={onClick}>
                <Search sx={{
                    width: '20px',
                    height: '20px'
                }} />
                {title}
            </Button>
        </>
    )
}