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
import { useEffect, useRef, useState } from "react";
import RenderNoOptions from "@/Components/ButtonOpenModalCadastro";
import { CadastroPartes } from "@/Components/ModalsRegistration/ModalCadastroPartes";
import { ModalNotesTag } from "@/Components/ModalsRegistration/ModalNotesTag";
import CloseIcon from '@mui/icons-material/Close';
import CadastroNotesType from "@/Components/ModalsRegistration/ModalNotesTypes";
import CadastroNotesCurtomers from "@/Components/ModalsRegistration/ModalNotesCustomers";
export const CadastroNotas = ({ onClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const BoxMain = styled("main")({
    width: isSmallScreen ? "100%" : "420px",
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
    padding: "5px 8px",
  });

  const [outorgantes, setOutorgantes] = useState([{ id: '', label: '' }]);
  const [outorgados, setOutorgados] = useState([{ id: '', label: '' }]);
  const [outorganteArray, setOutorganteArray] = useState([
    { id: 1, label: "Kauan" },
    { id: 2, label: "Ronaldo" },
  ]);
  const [outorgadoArray, setOutorgadoArray] = useState([
    { id: 1, label: "Kauan" },
    { id: 2, label: "Ronaldo" },
  ]);
  const boxInputsRef = useRef(null);



  const adicionarInput = (tipo, event) => {
    event.preventDefault();
    const currentScrollPosition = boxInputsRef.current.scrollTop;
    if (tipo === "outorgante") {
      setOutorgantes((prev) => [...prev, ""]);
    } else if (tipo === "outorgado") {
      setOutorgados((prev) => [...prev, ""]);
    }
    setTimeout(() => {
      boxInputsRef.current.scrollTop = currentScrollPosition;
    }, 0);
  };

  const removerInput = (tipo, index) => {
    const currentScrollPosition = boxInputsRef.current.scrollTop;
    if (tipo === "outorgante" && outorgantes.length >= 2) {
      setOutorgantes((prev) => prev.filter((_, i) => i !== index));
    } else if (tipo === "outorgado" && outorgados.length >= 2) {
      setOutorgados((prev) => prev.filter((_, i) => i !== index));
    }
    setTimeout(() => {
      boxInputsRef.current.scrollTop = currentScrollPosition;
    }, 0);
  };

  const handleChange = (tipo, index, valor) => {
    if (tipo === "outorgante") {
      const novosOutorgantes = [...outorgantes];
      novosOutorgantes[index] = valor;
      console.log(novosOutorgantes)
      setOutorgantes(novosOutorgantes);
    } else if (tipo === "outorgado") {
      const novosOutorgados = [...outorgados];
      novosOutorgados[index] = valor;
      console.log(novosOutorgados)
      setOutorgados(novosOutorgados);
    }
  };



  const [valueTag, setValueTag] = useState('')
  const [tag, setTag] = useState([
    {
      id: 1,
      label: 'Diego Corretor'
    },
    {
      id: 2,
      label: 'Juninho Capixaba'
    }
  ])
  const [valuePresenter, setValuePresenter] = useState('')
  const [presenter, setPresenter] = useState([
    {
      id: 1,
      label: 'Diego Corretor'
    },
    {
      id: 2,
      label: 'Juninho Capixaba'
    }
  ])

  const [valueNotesType, setValueNotesType] = useState('')
  const [option, setOption] = useState(null)
  const notesType = [
    {
      id: 1,
      label: 'Escrituras',
      opcoes: ['Compra e Venda', 'Revogação', 'Declaratória', 'Rerratificação']
    },
    {
      id: 2,
      label: 'Procurações'
    },
    {
      id: 3,
      label: 'Inventário',
      opcoes: ['Inventário e Partilha', 'Inventário e Sobrepartilha']
    },
    {
      id: 4,
      label: 'Divórcio'
    },
    {
      id: 5,
      label: 'Ata Notarial'
    },
    {
      id: 6,
      label: 'Substabelecimento'
    }
  ]

  const [openModalTag, setOpenModalTag] = useState(false)
  const [openModalPresenter, setOpenModalPresenter] = useState(false)
  const [openModalNotesType, setOpenModalNotesType] = useState(false)
  const [openModalNotesCustomers, setOpenModalNotesCustomers] = useState(false)
  const handleOpenModalTag = () => {
    setOpenModalTag(!openModalTag)
  }
  const handleCloseModalTag = () => {
    setOpenModalTag(!openModalTag)
  }
  const handleOpenModalPresenter = () => {
    setOpenModalPresenter(!openModalPresenter)
  }
  const handleCloseModalPresenter = () => {
    setOpenModalPresenter(!openModalPresenter)
  }
  const handleOpenNotesType = () => {
    setOpenModalNotesType(!openModalNotesType)
  }
  const handleCloseNotesType = () => {
    setOpenModalNotesType(!openModalNotesType)
  }
  const handleOpenNotesCustomers = () => {
    setOpenModalNotesCustomers(!openModalNotesCustomers)
  }
  const handleCloseNotesCustomers = () => {
    setOpenModalNotesCustomers(!openModalNotesCustomers)
  }
  return (
    <BoxMain >
      <BoxSearchTitle>
        <Typography sx={{ fontSize: "clamp(1.3rem, 1rem, 1.7rem)" }}>
          Cadastro - Notas Escrituras
        </Typography>
        <ButtonClose onClick={onClose} >
          <CloseIcon sx={{ fill: '#000000bc', width: '30px ', height: '30px' }} />
        </ButtonClose>
      </BoxSearchTitle>
      <BoxInputs ref={boxInputsRef}>
        <TextField
          color="success" label="Ordem"
        />
        <Autocomplete
          value={valueTag}
          options={tag}
          getOptionLabel={(option) => option.label || ''} // Garante que o label seja uma string
          onChange={(event, newValue) => {
            setValueTag(newValue);

          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalTag} title="Cadastrar Tag" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag"
              color="success"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
        />

        <Autocomplete
          value={valuePresenter}
          options={presenter}
          getOptionLabel={(option) => option.label || ''}
          onChange={(event, newValue) => {
            setValuePresenter(newValue);
          }}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalPresenter} title="Cadastrar Apresentante" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Apresentante"
              color="success"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
        />

        <Autocomplete
          value={valueNotesType}
          options={notesType}
          getOptionLabel={(option) => option.label || ''}
          onChange={(event, newValue) => {
            setValueNotesType(newValue);
            setOption(null); // Resetar a opção quando o tipo de nota muda
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo"
              color="success"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
        />

        {valueNotesType && valueNotesType.opcoes && (
          <Autocomplete
            value={option}
            onChange={(event, newValue) => setOption(newValue)}
            options={valueNotesType.opcoes} // Assegurar que as opções sejam baseadas na seleção de valueNotesType
            getOptionLabel={(opcao) => opcao || ''} // Como opcao é uma string, apenas a retornamos
            fullWidth
            noOptionsText={<RenderNoOptions onClick={handleOpenNotesType}
              title={`Cadastrar Tipo de ${valueNotesType.label}`}
            />}
            renderInput={(params) => (
              <TextField {...params} label={`Selecione o tipo de ${valueNotesType.label}`} color="success" variant="outlined" />
            )}
          />
        )}
        <TextField
          label="Livro"
          type="number"
          color="success"
        />
        <TextField
          label="Folha Inicial"
          type="number"
          color="success"
        />
        <TextField
          label="Folha Final"
          type="number"
          color="success"
        />
        {outorgantes.map((outorgante, index) => (
          <div key={`outorgante-${index}-${outorgantes.length}`} >
            <Autocomplete
              value={outorgante}
              options={outorganteArray}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgantep'} onClick={handleOpenNotesCustomers} />}
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
                type="button"
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  padding: "5px 13px",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={(e) => adicionarInput("outorgante", e)}
              >
                +
              </button>
              <button
                type="button"
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
          <div key={`outorgado-${index}-${outorgados.length}`}>
            <Autocomplete
              value={outorgado}
              options={outorgadoArray}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgado'} onClick={handleOpenNotesCustomers} />}
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
                type="button"
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  padding: "5px 13px",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={(e) => adicionarInput("outorgado", e)}
              >
                +
              </button>
              <button
                type="button"
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
        <TextField

          label="Caixa"
          color="success"
          type="number"
        />
        <TextField type="file" color="success" />
        <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <ButtonScanner>
            Scannear Arquivo
          </ButtonScanner>
          <ButtonCadastrar onClick={() => {
            alert('oii')
            console.log(valueTag)
            console.log(valuePresenter)
            console.table(presenter)
            console.table(tag)
          }}>
            Cadastrar
          </ButtonCadastrar>

        </Stack>

      </BoxInputs>
      <ModalNotesTag open={openModalTag} onClose={handleCloseModalTag} />
      <CadastroPartes onClose={handleCloseModalPresenter} open={openModalPresenter} />
      <CadastroNotesType open={openModalNotesType} onClose={handleCloseNotesType} />
      <CadastroNotesCurtomers open={openModalNotesCustomers} onClose={handleCloseNotesCustomers} />
    </BoxMain>
  );
};
