import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

export const DocList = ({ data, handleClick, setNotation }) => {
    return (
        <Grid
            container
            sx={{
                width: "100%",
                flexGrow: 1,
                height: '450px',
                margin: '0 auto',
                position: 'relative',
                overflowY: 'auto',
            }}
        >
            {data && data.map((item, index) => (
                <Grid
                    item
                    key={index}
                    xs={6}
                    sm={6}
                    md={3}
                    lg={3}
                    sx={{
                        display: 'flex',
                        padding: '0px',
                        justifyContent: 'center',
                        px: 2
                    }}
                >
                    <List sx={{ width: '100%' }}>
                        <ListItem sx={{ cursor: 'pointer' }}>
                            <ListItemAvatar>
                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                            </ListItemAvatar>
                            <ListItemText
                                onClick={(event) => {
                                    handleClick(event)
                                    setNotation(item.notation)
                                }}
                                primaryTypographyProps={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                }}
                                primary={item.notation}
                                secondary={`por ${item.presenterName}`}
                            />
                        </ListItem>
                    </List>
                </Grid>
            ))}
        </Grid>
    );
};
