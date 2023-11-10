import { Stack, TextField } from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete';

export const AutoComplete = ({ data }) => {
    return (
        <Stack>
            <Autocomplete
                    
                    disablePortal
                    id="combo-box-demo"
                    options={data}
                    sx={{ width: 400 }}
                    renderInput={(params) => <TextField {...params} label="Buscar Por" sx={{ borderColor: 'green' }} />}
                />
        </Stack>
    )
}