'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, SelectPicker } from 'rsuite';

export const GroupModal = ({ open, handleClose, onConfirm, courseID}) => {
    const [formValue, setFormValue] = useState({
        Curso: courseID,
        Profesor: '',
        grupo: '',
        jornada: '',
        periodo: '',
        año: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Opciones para los campos de selección
    const jornadaOptions = [
        { label: 'Diurna', value: 'Diurna' },
        { label: 'Nocturna', value: 'Nocturna' },
    ];

    const periodoOptions = [
        { label: '01', value: '01' },
        { label: '02', value: '02' },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // Convertir el valor de grupo a entero
            const grupoValue = parseInt(formValue.grupo, 10);
            if (isNaN(grupoValue)) {
                throw new Error('El campo grupo debe ser un número entero');
            }

            await onConfirm({ ...formValue, grupo: grupoValue, Curso: courseID });
            setLoading(false);
            setFormValue({
                Curso: courseID,
                Profesor: '',
                grupo: '',
                jornada: '',
                periodo: '',
                año: '',
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Error al registrar el grupo');
        }
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Crear Grupo</Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex-grow w-[600px]">
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    {/* Campo: Curso
                    <Form.Group controlId="Curso">
                        <Form.ControlLabel>Curso *</Form.ControlLabel>
                        <Form.Control name="Curso" type="text" />
                    </Form.Group> */}

                    {/* Campo: Profesor */}
                    <Form.Group controlId="Profesor">
                        <Form.ControlLabel>Profesor *</Form.ControlLabel>
                        <Form.Control name="Profesor" type="text" />
                    </Form.Group>

                    {/* Campo: Grupo */}
                    <Form.Group controlId="grupo">
                        <Form.ControlLabel>Grupo *</Form.ControlLabel>
                        <Form.Control name="grupo" type="number" min="0" step="1" />
                    </Form.Group>

                    {/* Campo: Jornada */}
                    <Form.Group controlId="jornada">
                        <Form.ControlLabel>Jornada *</Form.ControlLabel>
                        <Form.Control
                            name="jornada"
                            accepter={SelectPicker}
                            data={jornadaOptions}
                            searchable={false}
                        />
                    </Form.Group>

                    {/* Campo: Periodo */}
                    <Form.Group controlId="periodo">
                        <Form.ControlLabel>Periodo *</Form.ControlLabel>
                        <Form.Control
                            name="periodo"
                            accepter={SelectPicker}
                            data={periodoOptions}
                            searchable={false}
                        />
                    </Form.Group>

                    {/* Campo: Año */}
                    <Form.Group controlId="año">
                        <Form.ControlLabel>Año *</Form.ControlLabel>
                        <Form.Control name="año" type="text" />
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

export default GroupModal;