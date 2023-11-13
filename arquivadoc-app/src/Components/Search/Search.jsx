import React from "react"
import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';



export const Search = () => {

    return (
        <div style={{
            width: '600px',
        }}>
            <TextField color="success" sx={{
                outline: 'none',
                width: '100%',
                border: '',
                flex: '1',
                '& input': {
                    color: 'success.main', // Color when not focused
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
        </div>
    )
}