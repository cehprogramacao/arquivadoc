import React from "react"
import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';



export const Search = () => {

    return (
        <div>
            <TextField sx={{
                outline: 'none',
                width: '500px',
                border: '',
                
            }}
            margin="n"
            variant="outlined" placeholder="Pesquisar" InputProps={{
                startAdornment: (
                    <InputAdornment position="star">
                        <SearchIcon sx={{
                            marginRight: '6px'
                        }}/>
                    </InputAdornment>
                )
            }}/>
        </div>
    )
}