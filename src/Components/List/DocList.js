import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import MenuOptionsFile from '../MenuPopUp';
import RGI from '@/services/rgi.service';
import { constant } from 'lodash';

export const DocList = ({ data, onClick }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [prenotation, setPrenotation] = useState("")
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    

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
                        xs={12}
                        columns={4}
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
                        <List sx={{ width: '100%'}}>
                            <ListItem sx={{ cursor: 'pointer' }}>
                                <ListItemAvatar>
                                    <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                                </ListItemAvatar>
                                <ListItemText
                                onClick={(event) => {
                                    handleClick(event),
                                    setPrenotation(item.prenotation)
                                }}
                                    primaryTypographyProps={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                    }}
                                    primary={item.prenotation}
                                    secondary={`por ${item.presenterName}`}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                ))}
            </Grid>

            <MenuOptionsFile anchorEl={anchorEl} data={data} open={open} handleClose={handleClose} prenotation={prenotation}  />
        </>

    );
};
