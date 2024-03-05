import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';

export const DocList = ({ data, onClick }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const columns = isSmallScreen ? 1 : 4;


    console.log(data, 90901)

    return (
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
                    columns={columns}
                    xs={12}
                    sm={6}
                    md={isSmallScreen ? 12 : 6}
                    lg={isSmallScreen ? 12 : 3}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        padding: '0px',
                        justifyContent: 'center',
                    }}
                >
                    <List sx={{ width: '100%', padding: '0' }}>
                        <ListItem onClick={() => onClick(index)} style={{ cursor: 'pointer' }}>
                            <ListItemAvatar>
                                <Image width={50} height={50} src="/image/pdf-icon.svg" alt="" />
                            </ListItemAvatar>
                            <ListItemText
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
    );
};
