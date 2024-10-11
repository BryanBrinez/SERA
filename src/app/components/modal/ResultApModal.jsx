'use client';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'rsuite';
import SelectTagCourse from '@/app/atoms/input/SelectTagCourse.jsx';

export const ResultApModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = useState({
        nombre_resultado: '',
        descripcion: '',
        codigo_curso: ''
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
                nombre_resultado: '',
                descripcion: '',
                codigo_curso: ''
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError('Error al registrar el resultado');
        }
    };

    const handleCourseChange = (value) => {
        setFormValue(prev => ({ ...prev, codigo_curso: value }));
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Añadir Resultado de Aprendizaje</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow w-[600px]'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <Form.Group controlId="nombre_resultado">
                        <Form.ControlLabel>Nombre del Resultado *</Form.ControlLabel>
                        <Form.Control name="nombre_resultado" />
                    </Form.Group>
                    {/* <Form.Group controlId="codigo">
                        <Form.ControlLabel>Código del Resultado *</Form.ControlLabel>
                        <Form.Control name="codigo" />
                    </Form.Group> */}
                    <Form.Group controlId="descripcion">
                        <Form.ControlLabel>Descripción *</Form.ControlLabel>
                        <Form.Control name="descripcion" />
                    </Form.Group>
                    <Form.Group controlId="codigo_curso">
                        <Form.ControlLabel>Curso Asociado *</Form.ControlLabel>
                        <SelectTagCourse onChange={handleCourseChange}/>
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

export default ResultApModal;
