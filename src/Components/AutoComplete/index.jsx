import { Stack, TextField, useMediaQuery, useTheme } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';

export const AutoComplete = ({ data }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Stack>
            <Autocomplete
                
                disablePortal
                id="combo-box-demo"
                options={data}
                sx={{ width: isSmallScreen ? '100%' : 450 }}
                renderInput={(params) => <TextField color="success" {...params} label="Buscar Por" 
                sx={{ color: "#237117", '& input': {
                    color: 'success.main', 
                }, }} />}
            />
        </Stack>
    )
}