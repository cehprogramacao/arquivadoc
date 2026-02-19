import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import Customer from "@/services/customer.service";
import ProtestService from "@/services/protest.service";
import { showAlert } from "@/store/actions";
import { CloseOutlined } from "@mui/icons-material";
import { DocumentScanner } from "@mui/icons-material";
import { 
  useMediaQuery, 
  useTheme, 
  TextField, 
  Button, 
  Typography, 
  Autocomplete, 
  IconButton,
  Paper,
  Tooltip,
  alpha
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as randomUUID } from "uuid";
import { ScanLine, Upload, Trash2 } from "lucide-react";

const customerSv = new Customer();
const protestSv = new ProtestService();

export const CadastroProtesto = ({ onClose, onClickPartes, getData }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    notation: 0,
    box: 0,
    presenter: null,
    drawee: null,
    debtor: null,
    file_url: "",
    carta_anuencia_file_url: "",
    ar_file_url: ""
  });
  const [fileNames, setFileNames] = useState({
    file_url: "",
    carta_anuencia_file_url: "",
    ar_file_url: ""
  });
  const [presenter, setPresenter] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleChangeValues = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const getDataPresenter = async () => {
    try {
      const data = await customerSv.customers();
      setPresenter(Object.values(data));
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
      throw new Error('Erro ao buscar clientes');
    }
  };

  const handleFileBase64 = (file, field) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setData(prev => ({ ...prev, [field]: base64 }));
      setFileNames(prev => ({ ...prev, [field]: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleChangeFile = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileBase64(file, field);
  };

  const handleScanFile = (field) => {
    if (!window.scanner) {
      console.error("Scanner não disponível");
      return;
    }

    window.scanner.scan(
      (successful, message, response) => {
        if (!successful || !response) return;

        const responseJson = JSON.parse(response);
        const base64Pdf = responseJson.output[0].result[0];

        setData(prev => ({ ...prev, [field]: base64Pdf }));
        setFileNames(prev => ({
          ...prev,
          [field]: "Documento escaneado"
        }));
      },
      {
        output_settings: [{ type: "return-base64", format: "pdf" }]
      }
    );
  };

  const clearFile = (field) => {
    setData(prev => ({ ...prev, [field]: "" }));
    setFileNames(prev => ({ ...prev, [field]: "" }));
  };

  const FileUploadCard = ({ label, field }) => {
    const hasFile = !!data[field];

    return (
      <Paper
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: hasFile ? alpha("#237117", 0.4) : "divider",
          borderRadius: 2
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <DocumentScanner color={hasFile ? "success" : "disabled"} />
          <Box flex={1}>
            <Typography fontWeight={600}>{label}</Typography>
            <Typography variant="caption">
              {hasFile ? fileNames[field] : "Nenhum arquivo"}
            </Typography>
          </Box>

          {hasFile && (
            <Tooltip title="Remover">
              <IconButton onClick={() => clearFile(field)}>
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ScanLine size={16} />}
            fullWidth
            onClick={() => handleScanFile(field)}
          >
            Escanear
          </Button>

          <Button
            variant="contained"
            component="label"
            startIcon={<Upload size={16} />}
            fullWidth
            sx={{ backgroundColor: "#237117" }}
          >
            Upload
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => handleChangeFile(e, field)}
            />
          </Button>
        </Box>
      </Paper>
    );
  };

  const handleCreateProtest = async () => {
    try {
      const response = await protestSv.createProtest(data);
      console.log(response);
      dispatch(showAlert(response.message, "success", "file"));
    } catch (error) {
      dispatch(showAlert(error.msg, "error", "file"));
      console.error("Erro ao criar protesto!", error);
      throw new Error("Erro ao criar protesto!");
    }
    finally {
      onClose();
      window.location.reload();
    }
  };

  useEffect(() => {
    getDataPresenter();
  }, []);

  useEffect(() => {
    if (window.scanner) {
      window.scanner.scanDisplayImagesOnPage = (successful, mesg, response) => {
        if (!successful) {
          console.error('Failed: ' + mesg);
          return;
        }
        if (successful && mesg != null && mesg.toLowerCase().indexOf('user cancel') >= 0) {
          console.info('User cancelled');
          return;
        }
      };
    }
  }, []);

  const onlyNumbers = (value) => value.replace(/\D/g, "");

  const applyCpfCnpjMask = (value) => {
    const numbers = onlyNumbers(value);

    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
    }

    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  return (
    <Box sx={{
      width: isSmallScreen ? '320px' : "409px",
      height: '100vh',
      padding: '8px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      overflow: 'hidden'
    }}>
      <Box sx={{
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography sx={{
          fontSize: 'clamp(1.3rem, 1rem, 1.7rem)',
        }}>
          Cadastro - Protestos
        </Typography>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '30px',
        height: "100vh",
        overflowY: 'auto',
        padding: '5px 0'
      }}>
        <TextField
          fullWidth
          sx={{
            '& input': { color: 'success.main' },
          }}
          value={data.notation}
          name="notation"
          onChange={handleChangeValues}
          label="Apontamento"
          type="number"
          color='success'
        />

        <TextField
          fullWidth
          sx={{
            '& input': { color: 'success.main' }
          }}
          value={data.box}
          name="box"
          onChange={handleChangeValues}
          label="N° da Caixa"
          type="number"
          color='success'
        />

        <Autocomplete
          disablePortal
          key="presenter-autocomplete"
          id="combo-box-demo"
          options={presenter}
          autoHighlight
          getOptionLabel={(option) => option.name}
          noOptionsText={<RenderNoOptions title={'Cadastrar Apresentante'} onClick={onClickPartes} />}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, presenter: value?.cpfcnpj || ""}))
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props} key={`${randomUUID()}-presenter`}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.name}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {applyCpfCnpjMask(option.cpfcnpj)}
              </Typography>
            </Box>
          )}
          fullWidth
          renderInput={(params) => <TextField color="success" {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
            label="Apresentante"
            sx={{
              color: theme.palette.primary.main, '& input': {
                color: 'success.main',
              },
            }} />}
        />

        <Autocomplete
          key="drawee-autocomplete"
          disablePortal
          id="combo-box-demo"
          options={presenter}
          autoHighlight
          noOptionsText={<RenderNoOptions title={'Cadastrar Sacado'} onClick={onClickPartes} />}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, drawee: value?.cpfcnpj || "" }))
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props} key={`${randomUUID()}-drawee`}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.name}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {applyCpfCnpjMask(option.cpfcnpj)}
              </Typography>
            </Box>
          )}
          fullWidth
          renderInput={(params) => <TextField color="success" {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
            label="Sacado"
            sx={{
              color: theme.palette.primary.main, '& input': {
                color: 'success.main',
              },
            }} />}
        />

        <Autocomplete
          key="debtor-autocomplete"
          disablePortal
          id="combo-box-demo"
          options={presenter}
          autoHighlight
          getOptionLabel={(option) => option.name}
          noOptionsText={<RenderNoOptions title={'Cadastrar Devedor'} onClick={onClickPartes} />}
          onChange={(e, value) => {
            setData((prev) => ({ ...prev, debtor: value?.cpfcnpj || "" }))
          }}
          renderOption={(props, option) => (
            <Box component="li" sx={{
              width: '100%',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }} {...props} key={`${randomUUID()}-debtor`}>
              <Typography sx={{ fontSize: "12px", display: 'flex', alignSelf: 'start' }}>
                {option.name}
              </Typography>
              <Typography sx={{
                fontSize: "11px", display: 'flex', alignSelf: 'start',
                textTransform: 'uppercase'
              }}>
                {applyCpfCnpjMask(option.cpfcnpj)}
              </Typography>
            </Box>
          )}
          fullWidth
          renderInput={(params) => <TextField color="success" {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
            label="Devedor"
            sx={{
              color: theme.palette.primary.main, '& input': {
                color: 'success.main',
              },
            }} />}
        />

        {/* File Upload Cards */}
        <FileUploadCard label="Documento Principal" field="file_url" />
        <FileUploadCard label="Carta de Anuência" field="carta_anuencia_file_url" />
        <FileUploadCard label="AR (Aviso de Recebimento)" field="ar_file_url" />

        <Button sx={{
          display: 'flex',
          width: '100%',
          background: theme.palette.primary.main,
          color: theme.palette.primary.white,
          border: `1px solid ${theme.palette.primary.main}`,
          textTransform: 'capitalize',
          fontSize: ".9rem",
          borderRadius: '8px',
          padding: '12px',
          ":hover": {
            background: 'transparent',
            color: theme.palette.primary.main,
          }
        }} onClick={handleCreateProtest}>
          Realizar Cadastro
        </Button>
      </Box>
    </Box>
  );
};