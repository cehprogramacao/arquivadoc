import React from "react"
import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';



export const Search = () => {

    return (
        <div style={{ 
            width: '600px',
        }}>
            <TextField sx={{
                outline: 'none',
                width: '100%',
                border: '',
                flex: '1'
            }}

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