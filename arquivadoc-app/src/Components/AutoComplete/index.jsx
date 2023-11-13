import { Stack, TextField } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';

export const AutoComplete = ({ data }) => {
    return (
        <Stack>
            <Autocomplete
                
                disablePortal
                id="combo-box-demo"
                options={data}
                sx={{ width: 450 }}
                renderInput={(params) => <TextField color="success" {...params} label="Buscar Por" 
                sx={{ color: "#237117", '& input': {
                    color: 'success.main', 
                }, }} />}
            />
        </Stack>
    )
}