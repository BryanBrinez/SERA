'use client';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'rsuite';

export const FacultyModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = useState({
        decano: '',
        email: '',
        nombre: '',
        telefono: '',
        web: '',
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
                decano: '',
                email: '',
                nombre: '',
                telefono: '',
                web: '',
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError('Error al registrar la facultad');
        }
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Añadir Facultad</Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex-grow w-[600px]">
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    
                    <Form.Group controlId="nombre">
                        <Form.ControlLabel>Nombre de la Facultad *</Form.ControlLabel>
                        <Form.Control name="nombre" />
                    </Form.Group>
                    <Form.Group controlId="decano">
                        <Form.ControlLabel>Decano *</Form.ControlLabel>
                        <Form.Control name="decano" />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.ControlLabel>Email *</Form.ControlLabel>
                        <Form.Control name="email" type="email" />
                    </Form.Group>
                    <Form.Group controlId="telefono">
                        <Form.ControlLabel>Teléfono *</Form.ControlLabel>
                        <Form.Control name="telefono" />
                    </Form.Group>
                    <Form.Group controlId="web">
                        <Form.ControlLabel>Sitio Web *</Form.ControlLabel>
                        <Form.Control name="web" type="url" />
                    </Form.Group>
                </Form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <br />
                <Button style={styles} className="w-full" onClick={handleSubmit} appearance="primary" loading={loading}>
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

export default FacultyModal;
