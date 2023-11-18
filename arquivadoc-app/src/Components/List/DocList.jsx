import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';


export const DocList = ({ data }) => {
    

    return (
        <Grid container spacing={2} sx={
            { flexGrow: 1,marginLeft: '70px',maxWidth: '1500px', height: '450px', margin: '0 auto', position: 'relative', overflowY: 'auto',}}>
            {data.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} sx={{
                    display: 'grid', justifyContent: 'center', padding: '10px 0',
                }}>
                    <List sx={{ width: 240, }}>
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
