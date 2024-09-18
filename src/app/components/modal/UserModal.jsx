'use client';
import React, { useState } from 'react';
import { SelectTagProgram } from '../../atoms/input/SelectTagProgram';
import SelectTagSede from '../../atoms/input/SelectTagSede';
import { Modal, Button, Form, TagPicker, InputPicker, Notification } from 'rsuite';

const rolData = ['Admin', 'Coordinador', 'Auxiliar', 'Profesor'].map(item => ({
    label: item,
    value: item
}));
const estado = ['Activo', 'Inactivo'].map(item => ({
    label: item,
    value: item
}));

export const UserModal = ({ open, handleClose, onConfirm }) => {
    const [formValue, setFormValue] = useState({
        codigo: '',
        cedula: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        celular: '',
        correo: '',
        password: '',
        rol: [],
        estado: '',
        programa_asignado: [],
        sede: []
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
                codigo: '',
                cedula: '',
                primerNombre: '',
                segundoNombre: '',
                primerApellido: '',
                segundoApellido: '',
                celular: '',
                correo: '',
                password: '',
                rol: [],
                estado: '',
                programa_asignado: [],
                sede: []
            });
            handleClose();
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Error al crear el usuario');
        }
    };

    const handleProgramChange = (value) => {
        setFormValue(prev => ({ ...prev, programa_asignado: value }));
    };
    
    const handleSedeChange = (value) => {
        setFormValue(prev => ({ ...prev, sede: value }));
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'flex', flexDirection: 'center', alignItems: 'center' }} >

            <Modal.Header >
                <Modal.Title>Añadir usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex-grow w-[600px]'>
                <Form fluid onChange={setFormValue} formValue={formValue}>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="codigo">
                            <Form.ControlLabel>Codigo *</Form.ControlLabel>
                            <Form.Control name="codigo" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="cedula">
                            <Form.ControlLabel>Cedula *</Form.ControlLabel>
                            <Form.Control name="cedula" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="primerNombre">
                            <Form.ControlLabel>Primer nombre *</Form.ControlLabel>
                            <Form.Control name="primerNombre" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="segundoNombre">
                            <Form.ControlLabel>Segundo nombre</Form.ControlLabel>
                            <Form.Control name="segundoNombre" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="primerApellido">
                            <Form.ControlLabel>Primer apellido *</Form.ControlLabel>
                            <Form.Control name="primerApellido" />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="segundoApellido">
                            <Form.ControlLabel>Segundo apellido</Form.ControlLabel>
                            <Form.Control name="segundoApellido" />
                        </Form.Group>
                    </div>
                    <div className='flex gap-2' >
                        <Form.Group className='w-2/3' controlId="correo">
                            <Form.ControlLabel>Correo *</Form.ControlLabel>
                            <Form.Control name="correo" type="email" />
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="celular">
                            <Form.ControlLabel>Celular *</Form.ControlLabel>
                            <Form.Control name="celular" />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="password">
                        <Form.ControlLabel>Contraseña *</Form.ControlLabel>
                        <Form.Control name="password" type="password" />
                    </Form.Group>
                    <div className='flex gap-2' >
                        <Form.Group className='w-2/3' controlId="rol">
                            <Form.ControlLabel>Rol *</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full' name="rol" accepter={TagPicker} data={rolData} />
                        </Form.Group>
                        <Form.Group className='w-1/3' controlId="estado">
                            <Form.ControlLabel>Estado: *</Form.ControlLabel>
                            <Form.Control placeholder='Seleccionar' className='min-w-full' name="estado" accepter={InputPicker} data={estado} />
                        </Form.Group>
                    </div>

                    <div className='flex gap-2'>
                        <Form.Group className='w-1/2' controlId="programa_asignado">
                            <Form.ControlLabel>Programa</Form.ControlLabel>
                            <SelectTagProgram onChange={handleProgramChange} rol='Profesor' />
                        </Form.Group>
                        <Form.Group className='w-1/2' controlId="sede">
                            <Form.ControlLabel>Sede</Form.ControlLabel>
                            <SelectTagSede onChange={handleSedeChange} />
                        </Form.Group>
                    </div>
                </Form>

                <Button className='w-full' onClick={handleSubmit} appearance="primary" loading={loading}>
                    Confirmar
                </Button>
            </Modal.Body>

        </Modal>
    );
};
