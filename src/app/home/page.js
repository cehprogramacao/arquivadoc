"use client"
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search } from "@/Components/Search/Search";
import { DocList } from "@/Components/List/DocList";
import { Buttons } from "@/Components/Button/Button";
import { ButtonOpenModals } from "@/Components/ButtonOpenModals";
import ModalList from "@/Components/Modals/ModalList";

const Page = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreenWrap = useMediaQuery(theme.breakpoints.down("lg"));

  const [openModalListFilePDF, setOpenModalListFilePDF] = useState(false);
  const [list, setList] = useState([]);
  const [temp, setTemp] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3004/");
      if (response.ok) {
        const data = await response.json();
        setList(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModalListFilePDF = (index) => {
    setTemp(index);
    setOpenModalListFilePDF(true);
  };

  const handleCloseModalListFilePDF = () => {
    setOpenModalListFilePDF(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box
      className=""
      sx={{
        display: "flex",
        placeContent: "center",
        padding: "140px",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "40px",
            alignItems: "center",
            placeContent: "center",
            flexWrap: "wrap",
            flexDirection: isSmallScreenWrap ? "column" : "row",
            padding: "0 15px",
          }}
        >
          <TextField
            label="Buscar"
            sx={{
              width: isSmallScreen ? "100%" : 400,
              "& input": { color: "success.main" },
            }}
            color="success"
          />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={["CPF", "CNPJ"]}
            sx={{ width: isSmallScreen ? "100%" : 400 }}
            renderInput={(params) => (
              <TextField
                color="success"
                {...params}
                label="Buscar Por"
                sx={{
                  color: "#237117",
                  "& input": {
                    color: "success.main",
                  },
                }}
              />
            )}
          />
          <Stack>
            <Buttons
              color={"green"}
              title={"Buscar"}
              onClick={() => alert("Oiii")}
            />
          </Stack>
        </div>
      </Box>
      <Box
        sx={{
          maxWidth: "1200px",
          height: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            width: "max-content",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            color: "#C2C2C2",
            fontWeight: "500",
            padding: "0",
          }}
        >
          <span
            style={{
              fontSize: "1.3rem",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Recentes
          </span>
          More than {list.length} new members
        </Typography>
        <DocList data={list} onClick={handleOpenModalListFilePDF} />
      </Box>
      <ModalList
        data={list}
        link={list[temp]?.data}
        onClose={handleCloseModalListFilePDF}
        open={openModalListFilePDF}
      />
    </Box>
  );
};

export default Page;
