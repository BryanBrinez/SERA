'use client';
import React, { useState } from 'react';
import { Modal, Button, Form, Notification } from 'rsuite';
import SelectUser from '../../atoms/input/SelectUser.jsx'; 

export const ProgramModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = useState({
        nombre_programa: '',
        facultad: '',
        sede: '',
        jornada: '',
        modalidad: '',
        creditos: '',
        ID_coordinador: '',
        duracion: '',
        periodicidad_de_admisiones: '',
        registro_ICFES: '',
        registro_SNIES: '',
        resolucion_MEN: '',
        resolucion_del_PENSUM: '',
        fecha_dec_creacion: '',
        sede: '',
        email: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // Convertir `duracion` y `creditos` a números si no están vacíos
            const updatedFormValue = {
                ...formValue,
                duracion: formValue.duracion ? Number(formValue.duracion) : '',
                creditos: formValue.creditos ? Number(formValue.creditos) : ''
            };

            await onConfirm(updatedFormValue);
            setLoading(false);
            setFormValue({
                nombre_programa: '',
                facultad: '',
                sede: '',
                jornada: '',
                modalidad: '',
                creditos: '',
                ID_coordinador: '',
                duracion: '',
                periodicidad_de_admisiones: '',
                registro_ICFES: '',
                registro_SNIES: '',
                resolucion_MEN: '',
                resolucion_del_PENSUM: '',
                fecha_dec_creacion: '',
                sede: '',
                email: ''
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError('Error al crear el programa');
        }
    };

    const handleCoordinadorChange = (value) => {
        setFormValue(prev => ({ ...prev, ID_coordinador: value }));
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }}>
            <Modal.Header>
                <Modal.Title>Añadir programa</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow w-[600px]'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <div className='flex gap-2'>
                        <Form.Group className='w-2/3' controlId="nombre_programa">
                            <Form.ControlLabel>Nombre programa*</Form.ControlLabel>
                            <Form.Control name="nombre_programa"/>
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="codigo">
                            <Form.ControlLabel>Codigo*</Form.ControlLabel>
                            <Form.Control name="codigo" />
                        </Form.Group>
                        
                    </div>
                    <div className='flex gap-2'>
                    <Form.Group className='w-1/2' controlId="facultad">
                            <Form.ControlLabel>Facultad *</Form.ControlLabel>
                            <Form.Control name="facultad" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="sede">
                            <Form.ControlLabel>Sede *</Form.ControlLabel>
                            <Form.Control name="sede" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="jornada">
                            <Form.ControlLabel>Jornada</Form.ControlLabel>
                            <Form.Control name="jornada" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/3' controlId="modalidad">
                            <Form.ControlLabel>Modalidad *</Form.ControlLabel>
                            <Form.Control name="modalidad" />
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="creditos">
                            <Form.ControlLabel>Créditos</Form.ControlLabel>
                            <Form.Control name="creditos" type='number' />
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="duracion">
                            <Form.ControlLabel>Duración (Semestres) *</Form.ControlLabel>
                            <Form.Control name="duracion" type='number' />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="periodicidad_de_admisiones">
                            <Form.ControlLabel>Periodicidad de Admisiones *</Form.ControlLabel>
                            <Form.Control name="periodicidad_de_admisiones" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="fecha_dec_creacion">
                            <Form.ControlLabel>Fecha de Creación *</Form.ControlLabel>
                            <Form.Control name="fecha_dec_creacion" type="date" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/3' controlId="registro_ICFES">
                            <Form.ControlLabel>Registro ICFES *</Form.ControlLabel>
                            <Form.Control name="registro_ICFES" />
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="registro_SNIES">
                            <Form.ControlLabel>Registro SNIES *</Form.ControlLabel>
                            <Form.Control name="registro_SNIES" />
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="resolucion_MEN">
                            <Form.ControlLabel>Resolución MEN *</Form.ControlLabel>
                            <Form.Control name="resolucion_MEN" />
                        </Form.Group>
                    </div>
                    <Form.Group controlId="resolucion_del_PENSUM">
                        <Form.ControlLabel>Resolución del PENSUM *</Form.ControlLabel>
                        <Form.Control name="resolucion_del_PENSUM" />
                    </Form.Group>
                    
                    <Form.Group controlId="email">
                        <Form.ControlLabel>Correo *</Form.ControlLabel>
                        <Form.Control name="email" type="email" />
                    </Form.Group>
                    <Form.Group controlId="ID_coordinador">
                        <Form.ControlLabel>Coordinador *</Form.ControlLabel>
                        <SelectUser onChange={handleCoordinadorChange} rol='Coordinador' />
                    </Form.Group>
                </Form>
                <br />
                <Button className='w-full' onClick={handleSubmit} appearance="primary" loading={loading}>
                    Confirmar
                </Button>
            </Modal.Body>
        </Modal>
    );
};
