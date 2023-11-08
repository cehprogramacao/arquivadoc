import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
export const ButtonLixeira = () => {
    return (
        <Stack>
            <button style={{
                border: '1px solid #FF0000',
                width: '48px',
                height: '50px',
                borderRadius: '10px',
                background: "transparent",
                cursor: 'pointer'
            }}>
                <DeleteIcon sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    fill: '#FF0000',
                }} />
            </button>
        </Stack>
    )
}