"use client"
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const ServicoForm = () => {
    const [servico, setServico] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [opt, setOpt] = useState(['servicoExistente', 'outroServico']);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (servico && servico.trim() !== '' && !servicoExistente(servico)) {
                setServico('')
                setOpenModal(true);
            }
        }, 500);

        // Limpa o temporizador se a input mudar antes do tempo de espera expirar
        return () => clearTimeout(timer);
    }, [servico]);

    const servicoExistente = (servico) => {
        
        return opt.some((item) => item === servico);
    };

    return (
        <div style={{
            marginTop: "120px"
        }}>
            <Autocomplete
                options={opt}
                value={servico}
                onChange={(event, newValue) => setServico(newValue)}
                isOptionEqualToValue={() => false} // Ignora a comparação automática
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Digite o serviço"
                        fullWidth
                        onChange={(event) => setServico(event.target.value)}
                    />
                )}
            />

            <Modal open={openModal} onClose={handleCloseModal}>
                <div>
                    <h2>Cadastrar Novo Serviço</h2>
                    {/* Adicione seus campos de formulário e lógica aqui */}
                </div>
            </Modal>
        </div>
    );
};

export default ServicoForm;
