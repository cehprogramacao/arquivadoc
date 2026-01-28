import React from 'react';
import {
    Box,
    Typography,
    alpha,
    IconButton,
    Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FileText, MoreVertical, User } from 'lucide-react';

export const DocList = ({ data, handleClick, setPresenter }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Grid
                container
                spacing={2}
                sx={{
                    width: "100%",
                    maxHeight: '500px',
                    overflowY: 'auto',
                }}
            >
                {data && data.map((item, index) => (
                    <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                    >
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: alpha('#d32f2f', 0.2),
                                backgroundColor: alpha('#d32f2f', 0.02),
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: alpha('#d32f2f', 0.4),
                                    backgroundColor: alpha('#d32f2f', 0.05),
                                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)'
                                }
                            }}
                            onClick={(event) => {
                                handleClick(event)
                                setPresenter(item.cpfcnpj)
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1.5,
                                        backgroundColor: alpha('#d32f2f', 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <FileText size={20} color="#d32f2f" />
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={600}
                                        color="text.primary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.presenterDocument || 'Sem documento'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                        <User size={12} color="#666" />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {item.presenterName || 'Sem nome'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Tooltip title="Opcoes">
                                    <IconButton
                                        size="small"
                                        sx={{
                                            color: '#666',
                                            '&:hover': {
                                                backgroundColor: alpha('#d32f2f', 0.1),
                                                color: '#d32f2f'
                                            }
                                        }}
                                    >
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
