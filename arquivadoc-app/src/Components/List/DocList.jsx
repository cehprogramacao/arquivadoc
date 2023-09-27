import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';


export default function DocList() {
    const docs = [
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        {
            name: 'Ronaldo',
            text: 'Procuração'
        },
        
    ]

    return (
        <Grid container spacing={2} sx={
            { flexGrow: 1, maxWidth: '100%', height: '300px'}}>

        {docs.map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3} >
            <List >
                <ListItem style={{
                    cursor: 'pointer'
                }}>
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.text}
                        secondary={`por ${item.name}`}
                    />
                </ListItem>
                
            </List>
        </Grid>
        ))}

        </Grid>
    );
}
