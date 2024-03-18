import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

export const TableList = ({ data, handleClick, setNumber }) => {
    return (
        <>
            <Grid
                container
                spacing={5}
                sx={{
                    width: "100%",
                    flexGrow: 1,
                    height: '450px',
                    position: 'relative',
                    overflowY: 'auto',
                }}
            >
                {data && data.map((item, index) => (
                    <Grid
                        item
                        key={index}
                        xs={6}
                        sm={3}
                        md={3}
                        lg={3}

                    >
                        <List sx={{ width: '100%' }} >
                            <ListItem sx={{ cursor: 'pointer' }} onClick={(e) => {
                                setNumber(item.order_num)
                                handleClick(e)
                            }}>
                                <ListItemAvatar>
                                    <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                </ListItemAvatar>
                                <ListItemText


                                    primaryTypographyProps={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}

                                    primary={item.presenterDocument}
                                    secondary={`por ${item.presenterName}`}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                ))}
            </Grid>

        </>

    );
};
