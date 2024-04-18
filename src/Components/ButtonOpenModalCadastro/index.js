import { Button } from "@mui/material";
import React from "react";
const RenderNoOptions = ({ onClick, title }) => {
    return (
      <Button onClick={onClick} sx={{
        background: "#237117",
        border: 'none',
        padding: '7px',
        cursor: 'pointer',
        borderRadius: '5px',
        color: '#fff'
      }}>
        {title}
      </Button>
    );
  };
  
  export default RenderNoOptions;