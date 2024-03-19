import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import Box from '@mui/material/Box'

export const DocCalling = ({ data, setNumber, handleClick }) => {
    return (
        <>
            <Grid
                container
                spacing={2}
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
                        columns={6}
                        sm={4}
                        md={3}
                        lg={3}
                        
                    >
                        <Box sx={{
                            display: 'flex',
                            width: "100%",
                            justifyContent: 'center',
                        }}>
                            <List sx={{ width: '100%' }}>
                                <ListItem sx={{ cursor: 'pointer' }}>
                                    <ListItemAvatar>
                                        <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        onClick={(event) => {
                                            handleClick(event)
                                            setNumber(item.number)
                                        }}
                                        primaryTypographyProps={{
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}
                                        primary={item.number}
                                        secondary={`por ${item.entityName}`}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>
                ))}
            </Grid>

        </>

    );
};
