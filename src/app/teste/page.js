"use client"
import { TextField } from '@mui/material';
import React, { useState } from 'react';

const Formulario = () => {
    const [outorgantes, setOutorgantes] = useState(['']);
    const [outorgados, setOutorgados] = useState(['']);

    const adicionarInput = (tipo) => {
        if (tipo === 'outorgante') {
            setOutorgantes([...outorgantes, '']);
        } else if (tipo === 'outorgado') {
            setOutorgados([...outorgados, '']);
        }
    };

    const removerInput = (tipo, index) => {
        if (tipo === 'outorgante') {
            const novosOutorgantes = [...outorgantes];
            novosOutorgantes.splice(index, 1);
            setOutorgantes(novosOutorgantes);
        } else if (tipo === 'outorgado') {
            const novosOutorgados = [...outorgados];
            novosOutorgados.splice(index, 1);
            setOutorgados(novosOutorgados);
        }
    };

    const handleChange = (tipo, index, valor) => {
        if (tipo === 'outorgante') {
            const novosOutorgantes = [...outorgantes];
            novosOutorgantes[index] = valor;
            setOutorgantes(novosOutorgantes);
        } else if (tipo === 'outorgado') {
            const novosOutorgados = [...outorgados];
            novosOutorgados[index] = valor;
            setOutorgados(novosOutorgados);
        }
    };

    return (
        <div>
            <h2>Outorgantes</h2>
            {outorgantes.map((outorgante, index) => (
                <div key={index} style={{
                    display: "flex",
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'start'
                }}>
                    <TextField
                        type="text"
                        value={outorgante}

                        onChange={(e) => handleChange('outorgante', index, e.target.value)}
                    />
                    <div>
                        <button onClick={() => adicionarInput('outorgante')}>+</button>
                        {index > 0 && <button onClick={() => removerInput('outorgante', index)}>-</button>}
                    </div>
                </div>
            ))}

            <h2>Outorgados</h2>
            {outorgados.map((outorgado, index) => (
                <div key={index} style={{
                    display: "flex",
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'start'
                }}>
                    <TextField
                        type="text"
                        value={outorgado}
                        onChange={(e) => handleChange('outorgado', index, e.target.value)}
                    />
                    <div>
                        <button onClick={() => adicionarInput('outorgado')}>+</button>
                        {index > 0 && <button onClick={() => removerInput('outorgado', index)}>-</button>}
                    </div>
                </div>
            ))}
        </div>
    );
};  

export default Formulario;
