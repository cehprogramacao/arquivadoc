import React from "react";
const RenderNoOptions = ({ onClick, title }) => {
    return (
      <button onClick={onClick} style={{
        background: "#237117",
        border: 'none',
        padding: '7px',
        cursor: 'pointer',
        borderRadius: '5px',
        color: '#fff'
      }}>
        {title}
      </button>
    );
  };
  
  export default RenderNoOptions;