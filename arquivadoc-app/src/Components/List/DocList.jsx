import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';

export const DocList = ({ data, onClick }) => {
    return (
        <Grid container spacing={2} sx={{
            flexGrow: 1,
            maxWidth: '1300px',
            height: '450px',
            margin: '0 auto',
            position: 'relative',
            overflowY: 'auto',
        }}>
            {data.map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} sx={{
                    width: '100%',
                    display: 'flex',
                    padding: '10px',
            placeContent:'center'

                }}>
                    <List sx={{ width: '100%', padding: '0 10px' }}>
                        <ListItem onClick={() => onClick(index)} style={{ cursor: 'pointer' }}>
                            <ListItemAvatar>
                                {/* <PictureAsPdfIcon sx={{fill: 'red'}}/> */}
                                <img src="/image/pdf-icon.svg" alt="" />
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: 'black',
                                    fontWeight: "bold"
                                }}
                                primary={item.NomeFile}
                                secondary={`por ${item.nameUser}`}
                            />
                        </ListItem>
                    </List>
                </Grid>
            ))}
        </Grid>
    );
}
