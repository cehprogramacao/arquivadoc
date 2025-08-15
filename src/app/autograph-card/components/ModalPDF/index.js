"use client";
import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Grid, 
    Modal, 
    Typography, 
    useMediaQuery, 
    useTheme,
    Tabs,
    Tab,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Customer from '@/services/customer.service';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const customerSv = new Customer();

const ModalListCards = ({ open, data, onClose, cpfcnpj }) => {
    console.log(data, 'Modal data');
    const path = usePathname().split("/")[1];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [selectedDocument, setSelectedDocument] = useState('doc');
    const [loading, setLoading] = useState(false);

    // Mapeamento dos documentos disponíveis
    const documentTypes = [
        {
            id: 'doc',
            label: 'Documento Principal',
            icon: <DescriptionIcon />,
            fileKey: 'doc_file',
            urlKey: 'doc_file_url',
            color: '#1976d2'
        },
        {
            id: 'card',
            label: 'Cartão',
            icon: <CreditCardIcon />,
            fileKey: 'card_file',
            urlKey: 'card_file_url',
            color: '#ed6c02'
        },
        {
            id: 'cpf',
            label: 'CPF',
            icon: <PersonIcon />,
            fileKey: 'cpf_file',
            urlKey: 'cpf_file_url',
            color: '#2e7d32'
        },
        {
            id: 'comp_resid',
            label: 'Comp. Residência',
            icon: <HomeIcon />,
            fileKey: 'comp_resid_file',
            urlKey: 'comp_resid_file_url',
            color: '#9c27b0'
        }
    ];

    // Filtra apenas documentos disponíveis
    const availableDocuments = documentTypes.filter(doc => 
        data?.[doc.fileKey] || data?.[doc.urlKey]
    );

    // Define o primeiro documento disponível como padrão
    useEffect(() => {
        if (availableDocuments.length > 0) {
            setSelectedDocument(availableDocuments[0].id);
        }
    }, [data]);

    const createBlobUrl = (base64Data) => {
        if (!base64Data) return null;
        try {
            const cleanedBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
            const byteCharacters = atob(cleanedBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erro ao criar blob URL:', error);
            return null;
        }
    };

    const getCurrentDocument = () => {
        const docType = documentTypes.find(doc => doc.id === selectedDocument);
        if (!docType) return null;
        
        return {
            ...docType,
            file: data?.[docType.fileKey],
            url: data?.[docType.urlKey]
        };
    };

    const handlePrintFile = () => {
        const currentDoc = getCurrentDocument();
        if (currentDoc?.file) {
            const blobUrl = createBlobUrl(currentDoc.file);
            if (blobUrl) {
                window.open(blobUrl, '_blank');
            } else {
                alert("Não foi possível abrir o arquivo PDF.");
            }
        } else {
            alert("Arquivo não disponível para impressão.");
        }
    };

    const handleDeleteByPrenotation = async () => {
        if (!confirm('Tem certeza que deseja deletar este registro?')) return;
        
        try {
            setLoading(true);
            const response = await customerSv.deleteTermLGDP(cpfcnpj);
            window.location.reload();
            return response;
        } catch (error) {
            console.error("Erro ao deletar arquivo!", error);
            alert('Erro ao deletar arquivo. Tente novamente.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const renderPDFViewer = () => {
        const currentDoc = getCurrentDocument();
        
        if (!currentDoc || (!currentDoc.file && !currentDoc.url)) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '400px'
                }}>
                    <Alert severity="warning" sx={{ textAlign: 'center' }}>
                        <Typography>
                            Documento não disponível ou arquivo inválido.
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        const src = currentDoc.file 
            ? `data:application/pdf;base64,${currentDoc.file}`
            : currentDoc.url;

        return (
            <iframe
                title={`${currentDoc.label} Viewer`}
                src={src}
                width="100%"
                height="100%"
                style={{ 
                    border: 'none',
                    minHeight: isMobile ? '300px' : '500px'
                }}
                onError={() => {
                    console.error('Erro ao carregar PDF');
                }}
            />
        );
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                width: isMobile ? '95%' : '90%',
                maxWidth: '1200px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '1px solid #e0e0e0',
                boxShadow: 24,
                borderRadius: "16px",
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Visualização de Documentos
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                            label={`Cliente: ${cpfcnpj}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                        />
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Document Tabs */}
                {availableDocuments.length > 1 && (
                    <Box sx={{ borderBottom: '1px solid #e0e0e0', px: 2 }}>
                        <Tabs
                            value={selectedDocument}
                            onChange={(e, newValue) => setSelectedDocument(newValue)}
                            variant={isMobile ? "scrollable" : "standard"}
                            scrollButtons="auto"
                        >
                            {availableDocuments.map((doc) => (
                                <Tab
                                    key={doc.id}
                                    value={doc.id}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {doc.icon}
                                            <Typography variant="body2">
                                                {isMobile ? doc.label.split(' ')[0] : doc.label}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{
                                        minHeight: '48px',
                                        textTransform: 'none',
                                        fontSize: '0.875rem'
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>
                )}

                {/* Content Area */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                    {/* PDF Viewer */}
                    <Box sx={{ 
                        flex: 1, 
                        p: 2,
                        minHeight: isMobile ? '300px' : '500px'
                    }}>
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                height: '100%',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{
                                p: 1,
                                borderBottom: '1px solid #e0e0e0',
                                bgcolor: '#fafafa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <VisibilityIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {getCurrentDocument()?.label || 'Documento'}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                {renderPDFViewer()}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Action Panel */}
                    <Box sx={{ 
                        width: isMobile ? '100%' : '200px',
                        p: 2,
                        display: 'flex',
                        flexDirection: isMobile ? 'row' : 'column',
                        gap: 2,
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        flexWrap: isMobile ? 'wrap' : 'nowrap'
                    }}>
                        <Tooltip title="Editar documento">
                            <Link href={`/${path}/[cpfcnpj]`} as={`/${path}/${cpfcnpj}`}>
                                <Button 
                                    variant="outlined" 
                                    fullWidth={!isMobile}
                                    sx={{
                                        color: '#ed6c02',
                                        borderColor: '#ed6c02',
                                        minWidth: isMobile ? '120px' : 'auto',
                                        ":hover": {
                                            backgroundColor: '#fff3e0',
                                            borderColor: '#ed6c02'
                                        }
                                    }}
                                    startIcon={<EditIcon />}
                                >
                                    {isMobile ? 'Editar' : 'Editar'}
                                </Button>
                            </Link>
                        </Tooltip>

                        <Tooltip title="Imprimir documento">
                            <Button 
                                variant="outlined" 
                                fullWidth={!isMobile}
                                onClick={handlePrintFile}
                                sx={{
                                    color: "#0dcaf0",
                                    borderColor: "#0dcaf0",
                                    minWidth: isMobile ? '120px' : 'auto',
                                    ":hover": {
                                        backgroundColor: '#e3f2fd',
                                        borderColor: "#0dcaf0"
                                    }
                                }}
                                startIcon={<PrintIcon />}
                            >
                                {isMobile ? 'Imprimir' : 'Imprimir'}
                            </Button>
                        </Tooltip>

                        <Tooltip title="Deletar registro">
                            <Button 
                                variant="outlined" 
                                color='error'
                                fullWidth={!isMobile}
                                onClick={handleDeleteByPrenotation}
                                disabled={loading}
                                sx={{
                                    minWidth: isMobile ? '120px' : 'auto',
                                    ":hover": {
                                        backgroundColor: '#ffebee'
                                    }
                                }}
                                startIcon={<DeleteIcon />}
                            >
                                {loading ? 'Deletando...' : (isMobile ? 'Deletar' : 'Deletar')}
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalListCards;