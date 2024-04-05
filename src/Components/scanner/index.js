import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, Grid, Paper } from '@mui/material';
import Image from 'next/image';
import { CloseOutlined } from '@mui/icons-material';
const ScannerModal = ({ open, close, getFileUrl }) => {
  const [scannedImages, setScannedImages] = useState([]);
  const [scannedPdf, setScannedPdf] = useState(''); // Estado para armazenar o PDF digitalizado
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Certifique-se de que o scanner.js esteja carregado e pronto para uso
    if (window.scanner) {
      window.scanner.scanDisplayImagesOnPage = (successful, mesg, response) => {
        if (!successful) {
          console.error('Failed: ' + mesg);
          setResponse(`Erro: ${mesg}`);
          return;
        }

        if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
          console.info('User cancelled');
          setResponse('Digitalização cancelada pelo usuário.');
          return;
        }

        const responseJson = JSON.parse(response);
        getFileUrl(responseJson.output[0].result[0])
        setScannedPdf(responseJson.output[0].result[0])
      };
    }
  }, []);

  const handleScan = () => {
    setScannedImages([]);
    setScannedPdf('');
    setResponse('Iniciando digitalização...');
    window.scanner.scan(window.scanner.scanDisplayImagesOnPage, {
      "output_settings": [
        {
          "type": "return-base64",
          "format": "pdf",
          "pdf_text_line": "By ${USERNAME} on ${DATETIME}"
        },
        {
          "type": "return-base64-thumbnail",
          "format": "jpg",
          "thumbnail_height": 200
        }
      ]
    });
  };

  return (
    <Modal open={open} onClose={close}>
      <Box sx={{ borderRadius: 3,position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
         Digitalizar para PDF
        </Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={handleScan}>Digitalizar</Button>
        {/* <Grid container spacing={2} sx={{ mt: 2 }}>
          {scannedImages.map((imgSrc, index) => (
            <Grid item xs={6} key={index}>
              <Paper elevation={3}>
                <Image src={imgSrc} alt={`Scanned ${index}`} width={200} height={200}/>
              </Paper>
            </Grid>
          ))}
        </Grid> */}
        {scannedPdf && (
          <Typography sx={{ mt: 2 }}>
            PDF Digitalizado: <a href={`data:application/pdf;base64,${scannedPdf}`} download="scanned_document.pdf">Baixar PDF</a>
          </Typography>
        )}
        <Typography sx={{ mt: 2 }}>{response}</Typography>
      </Box>
    </Modal>
  );
};

export default ScannerModal;
