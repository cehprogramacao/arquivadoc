import React from "react"
import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';



export const Search = ({onChange}) => {

    return (
        <div style={{
            width: '600px',
        }}>
            <TextField onChange={onChange} color="success" sx={{
                outline: 'none',
                width: '100%',
                border: '',
                flex: '1',
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
        </div>
    )
}