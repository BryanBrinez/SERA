'use client';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'rsuite';

export const IndicatorModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = useState({
        id_resultado_aprendizaje: '',
        descripcion: '',
        nombre_indicador: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await onConfirm(formValue);
            setLoading(false);
            setFormValue({
                id_resultado_aprendizaje: '',
                descripcion: '',
                nombre_indicador: ''
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError('Error al registrar el indicador');
        }
    };

    const handleResultChange = (value) => {
        setFormValue(prev => ({ ...prev, id_resultado_aprendizaje: value }));
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Añadir Indicador de Aprendizaje</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow w-[600px]'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <Form.Group controlId="nombre_indicador">
                        <Form.ControlLabel>Nombre del Indicador *</Form.ControlLabel>
                        <Form.Control name="nombre_indicador" />
                    </Form.Group>
                    {/* <Form.Group controlId="codigo">
                        <Form.ControlLabel>Código del Indicador *</Form.ControlLabel>
                        <Form.Control name="codigo" />
                    </Form.Group> */}
                    <Form.Group controlId="descripcion">
                        <Form.ControlLabel>Descripción *</Form.ControlLabel>
                        <Form.Control name="descripcion" />
                    </Form.Group>
                </Form>
                <br />
                <Button style={styles} className='w-full' onClick={handleSubmit} appearance="primary" loading={loading}>
                    Confirmar
                </Button>
            </Modal.Body>
        </Modal>
    );
};

const styles = {
    backgroundColor: '#c62120',
    color: 'white',
    transition: 'width 0.1s ease-in-out',
    fontWeight: 'bold',
};

export default IndicatorModal;
