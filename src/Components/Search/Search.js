import React from "react"
import { InputAdornment, Stack, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery, useTheme } from '@mui/material';


export const Search = ({onChange}) => {
    const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    

    return (
        <Stack>
            <TextField onChange={onChange}  color="success" sx={{
                outline: 'none',
                width: isSmallScreen ? '100%' : 500,
                border: '',
                '& input': {
                    color: 'success.main',
                },
            }}
            
            variant="outlined" placeholder="Pesquisar" InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{
                            marginRight: '6px'
                        }}/>
                    </InputAdornment>
                ), 
                
            }}/>
        </Stack>
    )
}