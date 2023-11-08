import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';


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
            { flexGrow: 1, maxWidth: '100%', height: '300px', margin: '0 auto', position: 'relative', left: '50px' }}>
            {docs.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} >
                    <List >
                        <ListItem style={{
                            cursor: 'pointer'
                        }}>
                            <ListItemAvatar>
                                {/* <PictureAsPdfIcon sx={{fill: 'red'}}/> */}
                                <img src="/image/pdf-icon.svg" alt="" />
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: 'black',
                                    fontWeight: "bold"
                                }}
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
