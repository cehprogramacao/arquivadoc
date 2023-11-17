import React from "react"
import { InputAdornment, Stack, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';



export const Search = ({onChange}) => {

    return (
        <Stack>
            <TextField onChange={onChange}  color="success" sx={{
                outline: 'none',
                width: 500,
                border: '',
                flex: 1,
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