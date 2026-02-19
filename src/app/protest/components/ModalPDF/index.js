"use client";
import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
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
    Alert,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const ModalList = ({ 
    open, 
    data, 
    onClose, 
    notation, 
    deletePerm = 0, 
    editPerm = 0,
    handleDeleteByNotation 
}) => {
    const path = usePathname().split("/")[1];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [loading, setLoading] = useState(false);
    const [pdfError, setPdfError] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState('file');

    // Mapeamento dos documentos disponíveis
    const documentTypes = [
        {
            id: 'file',
            label: 'Documento Principal',
            icon: <ArticleIcon />,
            fileKey: 'file',
            color: '#1976d2'
        },
        {
            id: 'carta_anuencia',
            label: 'Carta de Anuência',
            icon: <AssignmentIcon />,
            fileKey: 'carta_anuencia',
            color: '#ed6c02'
        },
        {
            id: 'ar',
            label: 'AR',
            icon: <MailIcon />,
            fileKey: 'ar',
            color: '#2e7d32'
        }
    ];

    // Filtra apenas documentos disponíveis
    const availableDocuments = documentTypes.filter(doc => 
        data && typeof data === 'object' && !Array.isArray(data) && data[doc.fileKey]
    );

    // Define o primeiro documento disponível como padrão
    useEffect(() => {
        if (open && data && typeof data === 'object' && !Array.isArray(data)) {
            console.log('Modal opened with data:', data);
            console.log('Available documents:', {
                file: !!data.file,
                carta_anuencia: !!data.carta_anuencia,
                ar: !!data.ar
            });
            
            // Verifica qual documento está disponível e define como padrão
            if (data.file) {
                console.log('Setting selectedDocument to: file');
                setSelectedDocument('file');
            } else if (data.carta_anuencia) {
                console.log('Setting selectedDocument to: carta_anuencia');
                setSelectedDocument('carta_anuencia');
            } else if (data.ar) {
                console.log('Setting selectedDocument to: ar');
                setSelectedDocument('ar');
            }
            setPdfError(false);
        }
    }, [open, data]);

    const createBlobUrl = (base64Data) => {
        if (!base64Data) return null;
        
        try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erro ao criar blob URL:', error);
            setPdfError(true);
            return null;
        }
    };

    const getCurrentDocument = () => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return null;
        }
        
        const docType = documentTypes.find(doc => doc.id === selectedDocument);
        if (!docType) return null;
        
        return {
            ...docType,
            file: data[docType.fileKey]
        };
    };

    const getCurrentDocumentData = () => {
        const currentDoc = getCurrentDocument();
        return currentDoc?.file || null;
    };

    const getDocumentTitle = () => {
        const currentDoc = getCurrentDocument();
        return currentDoc?.label || 'Documento';
    };

    const handlePrintFile = () => {
        const currentDoc = getCurrentDocumentData();
        
        if (!currentDoc) {
            alert("Arquivo não disponível para impressão.");
            return;
        }

        try {
            const base64Data = currentDoc;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error('Erro ao imprimir:', error);
            alert("Não foi possível abrir o arquivo PDF.");
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja deletar este documento?')) return;
        
        try {
            setLoading(true);
            await handleDeleteByNotation();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert('Erro ao deletar documento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderPDFViewer = () => {
        const currentDoc = getCurrentDocumentData();
        
        console.log('Current Document:', selectedDocument);
        console.log('Current Doc Data:', currentDoc ? 'Exists' : 'Not found');
        console.log('Data object:', data);
        
        if (!currentDoc) {
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
                            {getDocumentTitle()} não disponível.
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        if (pdfError) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '400px'
                }}>
                    <Alert severity="error" sx={{ textAlign: 'center' }}>
                        <Typography>
                            Erro ao carregar o documento PDF.
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        // Limpar o base64 se necessário
        const cleanBase64 = currentDoc.replace(/^data:application\/pdf;base64,/, '');
        const src = `data:application/pdf;base64,${cleanBase64}`;

        return (
            <iframe
                title="PDF Viewer"
                src={src}
                width="100%"
                height="100%"
                style={{ 
                    border: 'none',
                    minHeight: isMobile ? '300px' : '500px'
                }}
                onError={(e) => {
                    console.error('Error loading PDF:', e);
                    setPdfError(true);
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
                        {notation && (
                            <Chip 
                                label={`Prenotação: ${notation}`} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                            />
                        )}
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
                                    {getDocumentTitle()}
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
                        {/* Edit Button - Only show if permission is granted */}
                        {editPerm === 1 && (
                            <Tooltip title="Editar documento">
                                <Link href={`/${path}/[notation]`} as={`/${path}/${notation}`}>
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
                                        Editar
                                    </Button>
                                </Link>
                            </Tooltip>
                        )}

                        {/* Print Button */}
                        <Tooltip title="Imprimir documento">
                            <Button 
                                variant="outlined" 
                                fullWidth={!isMobile}
                                onClick={handlePrintFile}
                                disabled={!getCurrentDocumentData()}
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
                                Imprimir
                            </Button>
                        </Tooltip>

                        {/* Delete Button - Only show if permission is granted */}
                        {deletePerm === 1 && (
                            <Tooltip title="Deletar documento">
                                <Button 
                                    variant="outlined" 
                                    color='error'
                                    fullWidth={!isMobile}
                                    onClick={handleDelete}
                                    disabled={loading}
                                    sx={{
                                        minWidth: isMobile ? '120px' : 'auto',
                                        ":hover": {
                                            backgroundColor: '#ffebee'
                                        }
                                    }}
                                    startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
                                >
                                    {loading ? 'Deletando...' : 'Deletar'}
                                </Button>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalList;