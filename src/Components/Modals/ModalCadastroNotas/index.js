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
  const [outorgantes, setOutorgantes] = useState([{ id: '', label: '' }]);
  const [outorgados, setOutorgados] = useState([{ id: '', label: '' }]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const file = useRef(null)
  const [fileSelected, setFileSelected] = useState("")
  const [formData, setFormData] = useState({
    order_num: null,
    tag: null,
    presenter: '',
    service_type: null,
    book: null,
    initial_sheet: null,
    final_sheet: null,
    box: null,
    grantors: [],
    granteds: [],
    file_url: ""
  });
  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      file_url: fileReader.result
      fileReader.onloadend = () => {
        setFormData((prevFormData) => ({ ...prevFormData, file_url: file.name }));
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Função ajustada para tratar mudanças nos inputs
  const handleChangeFile = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Função para tratar a seleção nos Autocompletes
  const handleAutocompleteChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };


  const BoxMain = styled("main")({
    width: isSmallScreen ? "100%" : "420px",
    height: "100vh",
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    overflow: "hidden",
  });

  const BoxSearchTitle = styled("Box")({
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

  const BoxInputs = styled("Box")({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: isSmallScreen ? "20px" : "30px",
    height: "100vh",
    overflowY: "auto",
    padding: "5px 8px",
  });


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
      label: 'Boxórcio'
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
          name="order_num"
          value={formData.order_num}
          onChange={handleChangeFile}
        />
        <Autocomplete
          value={formData.tag}
          options={tag}
          getOptionLabel={(option) => option.label || ''}
          onChange={(event, newValue) => handleAutocompleteChange("tag", newValue)}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalTag} title="Cadastrar Tag" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tag"
              name="tag"
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
          value={formData.presenter}
          options={presenter}
          getOptionLabel={(option) => option.label || ''}
          onChange={(event, newValue) => handleAutocompleteChange("presenter", newValue)}
          noOptionsText={<RenderNoOptions onClick={handleOpenModalPresenter} title="Cadastrar Apresentante" />}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Apresentante"
              color="success"
              name="presenter"
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          )}
        />

        <Autocomplete
          value={formData.service_type}
          options={notesType}
          getOptionLabel={(option) => option.label || ''}
          onChange={(event, newValue) => handleAutocompleteChange("service_type", newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo"
              name="service_type"
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
          name="book"
          value={formData.book}
          onChange={handleChangeFile}
        />
        <TextField
          label="Folha Inicial"
          type="number"
          color="success"
          value={formData.initial_sheet}
          onChange={handleChangeFile}
          name="initial_sheet"

        />
        <TextField
          label="Folha Final"
          type="number"
          onChange={handleChangeFile}
          color="success"
          value={formData.final_sheet}
          name="final_sheet"
        />
        {outorgantes.map((outorgante, index) => (
          <Box key={`outorgante-${index}-${outorgantes.length}`} >
            <Autocomplete
              value={outorgante}
              options={outorganteArray}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgantep'} onClick={handleOpenNotesCustomers} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Outorgantes"
                  color="success"
                  name="grantors"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              )}
              onChange={(event, newValue) => handleAutocompleteChange("grantors", newValue)}
              onInputChange={(event, value) => {
                // Lógica de pesquisa, se necessário
              }}
            />
            <Box sx={{ display: "flex", gap: "9px", marginTop: '8px' }}>
              <Button
                type="button"
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={(e) => adicionarInput("outorgante", e)}
              >
                +
              </Button>
              <Button
                type="button"
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => removerInput("outorgante", index)}
              >
                -
              </Button>
            </Box>
          </Box>
        ))}

        {outorgados.map((outorgado, index) => (
          <Box key={`outorgado-${index}-${outorgados.length}`}>
            <Autocomplete
              value={outorgado}
              options={outorgadoArray}
              noOptionsText={<RenderNoOptions title={'Cadastrar Outorgado'} onClick={handleOpenNotesCustomers} />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Outorgados"
                  color="success"
                  name="granteds"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              )}
              onChange={(event, newValue) => handleAutocompleteChange("granteds", newValue)}
              onInputChange={(event, value) => {
                // Lógica de pesquisa, se necessário
              }}
            />
            <Box sx={{ display: "flex", gap: "9px", marginTop: '8px' }}>
              <Button
                type="button"
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={(e) => adicionarInput("outorgado", e)}
              >
                +
              </Button>
              <Button
                type="button"
                style={{
                  background: "#237117",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: 'pointer'
                }}
                onClick={() => removerInput("outorgado", index)}
              >
                -
              </Button>
            </Box>
          </Box>
        ))}
        <TextField

          label="Caixa"
          color="success"
          type="number"
        />
        <TextField type="file" ref={file} onChange={handleSelectedFile} color="success" />
        <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <ButtonScanner>
            Scannear Arquivo
          </ButtonScanner>
          <ButtonCadastrar onClick={() => console.log(formData)}>
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
