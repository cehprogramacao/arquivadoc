import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { useMediaQuery, useTheme } from '@mui/material';

export const DocList = ({ data, onClick }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const columns = isSmallScreen ? 1 : 4;

    return (
        <Grid
            container
            spacing={2}
            sx={{
                flexGrow: 1,
                maxWidth: isSmallScreen ? '100%' : '1300px',
                height: '450px',
                margin: '0 auto',
                position: 'relative',
                overflowY: 'auto',
            }}
        >
            {data.map((item, index) => (
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
                        padding: '10px',
                        justifyContent: 'center',
                    }}
                >
                    <List sx={{ width: '100%', padding: '0 10px' }}>
                        <ListItem onClick={() => onClick(index)} style={{ cursor: 'pointer' }}>
                            <ListItemAvatar>
                                {/* Uncomment the next line if you have PictureAsPdfIcon component */}
                                {/* <PictureAsPdfIcon sx={{ fill: 'red' }} /> */}
                                <img src="/image/pdf-icon.svg" alt="" />
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: 'black',
                                    fontWeight: 'bold',
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
};
