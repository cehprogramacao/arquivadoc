import {
  Autocomplete,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
  styled,
} from "@mui/material";
import { useState } from "react";
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import { ModalNotesTag } from "@/Components/ModalsRegistration/ModalNotesTag";
import { border } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
export const CadastroNotas = ({ onClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const BoxMain = styled("main")({
    width: isSmallScreen ? "100%" : "450px",
    height: "100vh",
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    overflow: "hidden",
  });

  const BoxSearchTitle = styled("div")({
    maxWidth: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

  const ButtonClose = styled("button")({
    border: 'none',
    background: 'transparent',
    cursor: 'pointer'
  });

  const ButtonScanner = styled("button")({
    width: "max-content",
    background: 'transparent',
    padding: '10px 20px',
    color: '#FED70B',
    borderRadius: "7px",
    border: '1px solid #FED70B',
    cursor: 'pointer',
    ":hover": {
      background: '#FED70B',
      border: '1px solid #FED70B',
      color: '#fff'
    }
  });


  const ButtonCadastrar = styled("button")({
    width: "max-content",
    background: '#237117',
    padding: '10px 45px',
    color: '#fff',
    borderRadius: "7px",
    border: 'none',
    cursor: 'pointer',
    ":hover": {
      background: 'transparent',
      border: '1px solid #237171',
      color: '#237117'
    }
  });

  const BoxInputs = styled("div")({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: isSmallScreen ? "20px" : "30px",
    height: "100vh",
    overflowY: "auto",
    padding: "5px 0",
  });

  const [outorgantes, setOutorgantes] = useState([""]);
  const [outorgados, setOutorgados] = useState([""]);
  const [outorganteArray, setOutorganteArray] = useState([
    { id: 1, label: "Kauan" },
    { id: 2, label: "Ronaldo" },
  ]);
  const [outorgadoArray, setOutorgadoArray] = useState([
    { id: 1, label: "Kauan" },
    { id: 2, label: "Ronaldo" },
  ]);

  const adicionarInput = (tipo) => {
    if (tipo === "outorgante") {
      setOutorgantes((prev) => [...prev, ""]);
    } else if (tipo === "outorgado") {
      setOutorgados((prev) => [...prev, ""]);
    }
  };

  const removerInput = (tipo, index) => {
    if (tipo === "outorgante" && outorgantes.length >= 2) {
      setOutorgantes((prev) => prev.filter((_, i) => i !== index));
    } else if (tipo === "outorgado" && outorgados.length >= 2 ) {
      setOutorgados((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleChange = (tipo, index, valor) => {
    if (tipo === "outorgante") {
      const novosOutorgantes = [...outorgantes];
      novosOutorgantes[index] = valor;
      setOutorgantes(novosOutorgantes);
    } else if (tipo === "outorgado") {
      const novosOutorgados = [...outorgados];
      novosOutorgados[index] = valor;
      setOutorgados(novosOutorgados);
    }
  };

  return (
    <BoxMain>
      <BoxSearchTitle>
        <Typography sx={{ fontSize: "clamp(1.3rem, 1rem, 1.7rem)" }}>
          Cadastro - Notas Escrituras
        </Typography>
        <ButtonClose onClick={onClose} >
          <CloseIcon sx={{fill: '#000000bc', width: '30px ', height: '30px'}} />
        </ButtonClose>
      </BoxSearchTitle>
      <BoxInputs>

        {outorgantes.map((outorgante, index) => (
          <div key={`outorgante-${index}`}>
            <Autocomplete
              value={outorgante}
              options={outorganteArray}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText={<RenderNoOptions onClick={() => alert('oii')} title="Cadastrar Tag" />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Outorgantes"
                  color="success"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              )}
              onChange={(_, value) => handleChange("outorgante", index, value)}
              onInputChange={(event, value) => {
                // Lógica de pesquisa, se necessário
              }}
            />
            <div style={{ display: "flex", gap: "9px", marginTop: '8px' }}>
              <button
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  padding: "5px 13px",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => adicionarInput("outorgante")}
              >
                +
              </button>
              <button
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  padding: "5px 13px",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => removerInput("outorgante", index)}
              >
                -
              </button>
            </div>
          </div>
        ))}

        {outorgados.map((outorgado, index) => (
          <div key={`outorgado-${index}`}>
            <Autocomplete

              value={outorgado}
              options={outorgadoArray}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Outorgados"
                  color="success"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              )}
              onChange={(_, value) => handleChange("outorgado", index, value)}
              onInputChange={(event, value) => {
                // Lógica de pesquisa, se necessário
              }}
            />
            <div style={{ display: "flex", gap: "9px", marginTop: '8px' }}>
              <button
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  padding: "5px 13px",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => adicionarInput("outorgado")}
              >
                +
              </button>
              <button
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  padding: "5px 13px",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => removerInput("outorgado", index)}
              >
                -
              </button>
            </div>
          </div>
        ))}
        <TextField type="file" />
        <Stack sx={{display: 'flex',flexDirection: 'column', gap: '40px'}}>
          <ButtonScanner>
            Scannear Arquivo
          </ButtonScanner>
          <ButtonCadastrar>
            Cadastrar
          </ButtonCadastrar>

        </Stack>

      </BoxInputs>
      {/* <ModalNotesTag open={open} onClose={handleCloseModalTag} />
      <CadastroPartes onClose={handleCloseModalApresentante} open={openApresentante} /> */}
    </BoxMain>
  );
};
